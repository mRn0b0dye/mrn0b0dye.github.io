export interface Project {
  title: string;
  category: "cybersecurity" | "blockchain";
  description: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  // Cybersecurity Projects
  {
    title: "PyScanner",
    category: "cybersecurity",
    description: "Lightweight multi-threaded TCP port scanner and service banner grabber for rapid reconnaissance.",
    tech: ["python", "socket", "threading"],
    repoUrl: "https://github.com",
  },
  {
    title: "SubEnum-Automation",
    category: "cybersecurity",
    description: "Passive reconnaissance pipeline combining assetfinder, subfinder, and httpx to discover live subdomains.",
    tech: ["bash", "recon", "httpx"],
    repoUrl: "https://github.com",
  },
  {
    title: "Vulnerability-Triage-Toolkit",
    category: "cybersecurity",
    description: "Helper scripts to automate preliminary checks for CORS, security headers, and open redirects.",
    tech: ["python", "requests", "pentest"],
    repoUrl: "https://github.com",
  },

  // Blockchain Projects
  {
    title: "EVM-Audit-Kit",
    category: "blockchain",
    description: "Foundry unit testing suite and fuzzing test harnesses for verifying access control, arithmetic, and logic flaws.",
    tech: ["solidity", "foundry", "evm"],
    repoUrl: "https://github.com",
  },
  {
    title: "Token-Vesting-Vault",
    category: "blockchain",
    description: "Linear token release smart contract with emergency timelock execution and multi-signature authorization.",
    tech: ["solidity", "erc20", "openzeppelin"],
    repoUrl: "https://github.com",
  },
  {
    title: "DeFi-Lending-Pool-Sim",
    category: "blockchain",
    description: "Minimalist collateralized debt protocol built for studying flash loan attack vectors and reentrancy protections.",
    tech: ["solidity", "hardhat", "defi"],
    repoUrl: "https://github.com",
  },
];
