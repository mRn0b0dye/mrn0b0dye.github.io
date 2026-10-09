export interface SiteConfig {
  name: string;
  title: string;
  isOpenToWork: boolean;
  openToWorkText: string;
  statusBadge: string;
  bio: string;
  avatar: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Penetration Tester",
  title: "Penetration Tester | Cybersecurity | Blockchain Developer",
  isOpenToWork: true,
  openToWorkText: "Open to Work / Available for Opportunities",
  statusBadge: "TryHackMe Penetration Tester Path (eJPTv1 prep)",
  bio: "Documenting offensive security write-ups, vulnerability analysis, and smart contract development in a clean, lightweight log format.",
  avatar: "/images/avatar.png",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "your.email@gmail.com",
  },
};
