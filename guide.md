# Portfolio Update Guide

This guide explains how to update the portfolio manually, add or remove write-ups and projects, and publish your changes.

The website is a Next.js application inside the `portfolio-app` folder. GitHub Pages deploys automatically whenever changes are pushed to the `main` branch.

## 1. Before you start

Install these tools:

- Git
- Node.js 20 or newer
- A code editor such as VS Code

Clone the repository if it is not already on your computer:

```bash
git clone https://github.com/mRn0b0dye/mrn0b0dye.github.io.git
cd mrn0b0dye.github.io
```

Install the project dependencies:

```bash
cd portfolio-app
npm install
```

The main files you will edit are:

| Purpose | File |
|---|---|
| Name, bio, status, and social links | `portfolio-app/src/config/siteConfig.ts` |
| Homepage layout and hero section | `portfolio-app/src/app/page.tsx` |
| Projects | `portfolio-app/src/data/projects.ts` |
| Write-ups/articles | `portfolio-app/src/data/writeups.ts` |
| Header branding and navigation | `portfolio-app/src/components/Header.tsx` |
| Footer | `portfolio-app/src/components/Footer.tsx` |

## 2. Update your personal information

Open:

```text
portfolio-app/src/config/siteConfig.ts
```

Update the values inside `siteConfig`:

```ts
export const siteConfig: SiteConfig = {
  name: "Muhammad Abdullah",
  title: "Muhammad Abdullah | Penetration Tester",
  isOpenToWork: true,
  openToWorkText: "Open to contribute",
  statusBadge: "",
  bio: "Your short biography goes here.",
  avatar: "/images/avatar.png",
  socials: {
    github: "https://github.com/your-username/",
    linkedin: "https://www.linkedin.com/in/your-profile/",
    email: "you@example.com",
  },
};
```

### What each value does

- `name`: The name shown as the main homepage headline.
- `title`: The browser tab title and footer title.
- `isOpenToWork`: Set to `true` to show the status line or `false` to hide it.
- `openToWorkText`: Text shown in the status line.
- `statusBadge`: Kept for compatibility with the existing configuration. The current homepage does not display this badge.
- `bio`: The site description used for metadata and future description areas.
- `socials.github`: URL opened by the GitHub icon.
- `socials.linkedin`: URL opened by the LinkedIn icon.
- `socials.email`: Email address used by mail links.

Keep URLs in quotes and keep the comma after each property. After changing an email address, update only the value, not the `mailto:` code in the components.

## 3. Change the profile picture

The current homepage shows a placeholder profile card. To use your own picture:

1. Create this folder if it does not exist:

   ```text
   portfolio-app/public/images/
   ```

2. Copy your image into that folder and name it:

   ```text
   avatar.png
   ```

   PNG, JPG, and WebP images are suitable. Keep the file size reasonably small, ideally below 1 MB.

3. Open:

   ```text
   portfolio-app/src/app/page.tsx
   ```

4. Add this import at the top of the file:

   ```tsx
   import Image from "next/image";
   ```

5. Find the placeholder `<svg>` and `<span>Your Photo</span>` inside the profile card and replace that inner content with:

   ```tsx
   <Image
     src={siteConfig.avatar}
     alt={`${siteConfig.name} profile picture`}
     fill
     className="object-cover"
     sizes="(max-width: 640px) 128px, 160px"
   />
   ```

   The parent profile-card element already has `relative`, so the image can use `fill`.

6. If you use a different filename or location, update the `avatar` value in `siteConfig.ts`:

   ```ts
   avatar: "/images/my-photo.jpg",
   ```

   The path starts at `portfolio-app/public`, so `/images/my-photo.jpg` means `portfolio-app/public/images/my-photo.jpg`.

Do not put the image inside `src` or `node_modules`. Files in `public` are served from the website root.

## 4. Change the homepage text or layout

Open:

```text
portfolio-app/src/app/page.tsx
```

The hero section contains:

- The profile placeholder/avatar.
- The “Open to contribute” status line.
- The main name.
- The “Penetration Tester” subtitle.
- GitHub, LinkedIn, and Gmail icons.

The name and status are loaded from `siteConfig`, so normally you should edit `siteConfig.ts` instead of hard-coding new values in `page.tsx`.

The current subtitle is written directly in the homepage:

```tsx
<p className="text-body text-sm font-mono">Penetration Tester</p>
```

To change it, replace only the text between the tags. To remove it, delete that entire `<p>` element.

## 5. Add a project

Open:

```text
portfolio-app/src/data/projects.ts
```

Add a new object inside the `projects` array. For example:

```ts
{
  title: "My Security Tool",
  category: "cybersecurity",
  description: "A short explanation of what this project does.",
  tech: ["python", "requests", "cli"],
  repoUrl: "https://github.com/your-username/my-security-tool",
  demoUrl: "https://example.com",
},
```

Use one of the supported categories:

- `cybersecurity`
- `blockchain`

The `demoUrl` property is optional. The homepage currently displays the repository link, project title, description, and technology list. The project page can use the same data for future additions.

### Project fields

- `title`: Project name.
- `category`: Determines which project section displays it.
- `description`: Short project summary.
- `tech`: Array of technology labels.
- `repoUrl`: Repository URL.
- `demoUrl`: Optional live demo URL.

Add the comma after the previous project object before inserting the new object.

## 6. Edit an existing project

In `portfolio-app/src/data/projects.ts`, find the project by its `title` and change only the fields you need:

```ts
{
  title: "Updated Project Name",
  category: "blockchain",
  description: "Updated project description.",
  tech: ["solidity", "foundry"],
  repoUrl: "https://github.com/your-username/updated-repository",
},
```

Do not change the TypeScript property names such as `title`, `category`, `description`, `tech`, or `repoUrl`.

## 7. Delete a project

Remove the complete object, including its opening and closing braces, from the `projects` array.

For example, delete this entire block:

```ts
{
  title: "My Security Tool",
  category: "cybersecurity",
  description: "A short explanation of what this project does.",
  tech: ["python"],
  repoUrl: "https://github.com/your-username/my-security-tool",
},
```

Make sure the remaining objects are still separated by commas and that the array still ends with:

```ts
];
```

## 8. Add a write-up/article

Open:

```text
portfolio-app/src/data/writeups.ts
```

Add a new object inside the `writeups` array:

```ts
{
  slug: "my-new-security-writeup",
  title: "My New Security Write-up",
  excerpt: "A short summary shown in the write-up list.",
  date: "Oct 2026",
  readTime: "7 min",
  platformTag: "Bug Bounty",
  tags: ["Web", "API", "Security"],
  contentHtml: `
    <h2>1. Overview</h2>
    <p>Write the introduction here.</p>

    <h2>2. Technical Details</h2>
    <p>Explain the technical details here.</p>

    <pre><code>example command --option value</code></pre>

    <h2>3. Remediation</h2>
    <p>Explain how the issue can be fixed.</p>
  `,
},
```

### Write-up fields

- `slug`: URL-safe unique identifier. Use lowercase letters, numbers, and hyphens only. The article URL will be `/writeups/my-new-security-writeup`.
- `title`: Article title.
- `excerpt`: Short text shown on the write-ups list.
- `date`: Display date, for example `Oct 2026`.
- `readTime`: Display reading time, for example `7 min`.
- `platformTag`: Platform or category label.
- `tags`: Array of related tags.
- `contentHtml`: Article body written as HTML inside a template string.

### Safe article formatting

Supported examples include:

```html
<h2>Section heading</h2>
<p>Paragraph text.</p>
<ul>
  <li>List item</li>
</ul>
<pre><code>code example</code></pre>
<code>inline code</code>
```

Because `contentHtml` is rendered as HTML, only add content you trust. If you display a literal backtick inside the article, escape it or change the outer string format so the TypeScript file remains valid.

## 9. Edit an existing write-up

Find the object by its `slug` or `title` in `portfolio-app/src/data/writeups.ts` and update the needed fields:

```ts
{
  slug: "my-new-security-writeup",
  title: "Updated Article Title",
  excerpt: "Updated summary.",
  date: "Nov 2026",
  readTime: "9 min",
  platformTag: "BlockSec",
  tags: ["Solidity", "EVM", "Audit"],
  contentHtml: `
    <h2>Updated section</h2>
    <p>Updated article content.</p>
  `,
},
```

Avoid changing the `slug` after publishing if other people may have bookmarked the article. If you must change it, update links or redirects that reference the old URL.

## 10. Delete a write-up/article

Remove the complete object for that article from the `writeups` array. Delete everything from its opening `{` through its closing `},`.

Do not remove the `generateStaticParams` function in:

```text
portfolio-app/src/app/writeups/[slug]/page.tsx
```

That function automatically creates pages for every write-up that remains in the data file.

## 11. Preview changes locally

From the repository root:

```bash
cd portfolio-app
npm run dev
```

Open http://localhost:3000 in your browser. The development server updates the page when you save a file. Press `Ctrl+C` in the terminal to stop it.

## 12. Compile and make the site live on port 3000

Install dependencies once, then compile the site:

```bash
cd portfolio-app
npm install
npm run build
```

This project uses a static export, so `npm run build` writes the compiled site to `portfolio-app/out`.

To make the site available locally on port 3000, start the development server:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Open http://localhost:3000 in a browser. Keep the terminal running while the site is live, and press `Ctrl+C` to stop the server.

Before publishing, run the production build:

```bash
npm run build
```

This checks TypeScript, lint rules, and static page generation. Fix every error before pushing.

## 13. Commit and push changes

From the repository root, check what changed:

```bash
git status
git diff
```

Stage the files you intentionally changed:

```bash
git add guide.md portfolio-app/src/config/siteConfig.ts
```

If you changed other files, include them in the same command. You can stage all changed files with:

```bash
git add .
```

Create a commit:

```bash
git commit -m "Update portfolio information"
```

Push to GitHub:

```bash
git push origin main
```

GitHub Actions will build and deploy the site automatically. The live site is:

```text
https://mrn0b0dye.github.io/
```

Deployment usually takes less than a few minutes. Check the **Actions** tab on GitHub if the site does not update.

## 14. Recommended commit messages

Use a short message that explains the change:

```text
Update contact links
Add blockchain audit write-up
Add PyScanner project
Remove outdated project
Update homepage bio
```

## 14. Troubleshooting

### The build fails with a syntax error

Check the file you most recently edited for:

- Missing commas between array objects.
- Missing closing `}` or `]`.
- Unclosed quotes or backticks.
- HTML template content that contains an unescaped backtick.

### The new article does not have its own page

Confirm that:

- The article object is inside the `writeups` array.
- Its `slug` is unique.
- The slug contains only lowercase letters, numbers, and hyphens.
- `npm run build` completes successfully.

### The site still shows old content

Confirm that:

1. Your commit was created.
2. `git push origin main` completed successfully.
3. The GitHub Actions workflow succeeded.
4. You refreshed the browser without using a cached page.

### A social icon goes to the wrong place

Update the corresponding value in `siteConfig.socials`:

```ts
socials: {
  github: "https://github.com/your-username/",
  linkedin: "https://www.linkedin.com/in/your-profile/",
  email: "you@example.com",
},
```

The email value should contain only the email address, not `mailto:`.
