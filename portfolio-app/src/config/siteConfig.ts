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
  name: "Muhammad Abdullah",
  title: "Cyber Security | Penetration Tester | Blockchain Developer",
  isOpenToWork: true,
  openToWorkText: "Open to contribute",
  statusBadge: "",
  bio: "Documenting offensive security write-ups, vulnerability analysis, and smart contract development in a clean, lightweight log format.",
  avatar: "/images/avatar.png",
  socials: {
    github: "https://github.com/mRn0b0dye/",
    linkedin: "https://www.linkedin.com/in/mabdullah102004/",
    email: "abdullahahiir@gmail.com",
  },
};
