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
    title: "",
    category: "cybersecurity",
    description: "Lightweight multi-threaded TCP port scanner and service banner grabber for rapid reconnaissance.",
    tech: ["python", "socket", "threading"],
    repoUrl: "https://github.com",
  },

  // Blockchain Projects
  {
    title: "EstateX",
    category: "blockchain",
    description: "EstateX is a decentralized Web3 real estate platform where property deeds are tokenized as ERC-721 NFTs.",
    tech: ["solidity", "foundry", "hardhat", "EVM", "NFT", "ERC-721", "IPFS"],
    repoUrl: "https://github.com/mRn0b0dye/EstateX",
  },
  {
    title: "FerrumWallet | ERC-20 Token Engine & Value Transfer",
    category: "blockchain",
    description: "ERC-20 Token Wallet & Value Transfer implements a complete, production-grade token engine and interactive Web3 dApp.",
    tech: ["solidity", "ERC-20", "defi", "EVM"],
    repoUrl: "https://github.com/mRn0b0dye/erc20-token-wallet",
  },
  {
    title: "FerrumLedger",
    category: "blockchain",
    description: "FerrumLedger is a standalone, high-performance local blockchain node engine written in Rust.",
    tech: ["rust", "dlt", "POW"],
    repoUrl: "https://github.com/mRn0b0dye/FerrumLedger.git",
  },
  {
    title: "Decentralized Voting Dapp",
    category: "blockchain",
    description: "A secure, private, and decentralized voting application built with React, Solidity, and Hardhat.",
    tech: ["solidity", "hardhat", "EVM"],
    repoUrl: "",
  }
];
