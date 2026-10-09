# Admin Guide – Portfolio Site

## Overview
This repository contains a **static portfolio website** (`live-portfolio-website.html`) that is served via GitHub Pages. The site is built with plain HTML, Tailwind CSS (via CDN), and a small JavaScript block for theme toggling and dynamic content.

---

## 1. Repository Structure
```
scratch/
├─ live-portfolio-website.html   # Main static page (served at https://mRn0b0dye.github.io/portfolio/)
├─ ADMIN_GUIDE.md               # *You are reading this file*
├─ .gitignore (optional)        # Add if you want to ignore node_modules, etc.
└─ other design drafts (html)   # Safe to keep; they are ignored unless added.
```

---

## 2. Editing the Hero Section (Name & Headline)
The hero section is located roughly between lines **45‑85** of `live-portfolio-website.html`.
- **Name** – `<h1 class="text-4xl ...">Your Name</h1>`
- **Sub‑headline** – the `<p>` element just below the name.
- **Badge** – the `<span>` with the text `Open to Work`.  To remove or edit any badge, delete or modify the corresponding `<span>`.

**How to change later:**
1. Open the file in any editor (VS Code, Notepad++, etc.).
2. Locate the block and replace the text.
3. Save the file and **commit** the change (see section *5*).

---

## 3. Adding / Updating Write‑ups
Write‑ups are stored in a JavaScript object called `articles` near the bottom of the file.
```js
const articles = [
  {
    title: "Write‑up title",
    date: "2023‑01‑01",
    link: "#",
    summary: "Short description…"
  },
  // Add more objects here
];
```
- Duplicate an existing object, update the fields, and save.
- The page will automatically render the new entry.

---

## 4. Adding / Updating Projects
Projects are defined in the `projects` array, also in the same script section.
```js
const projects = [
  {
    name: "Project Name",
    description: "One‑line description",
    link: "#"
  },
  // Add more projects here
];
```
Edit or append entries as needed.

---

## 5. Theme Toggle (Light / Dark)
The toggle button calls `toggleTheme()` which swaps the `data-theme` attribute on `<html>`.
- To change default theme, edit the `<html data-theme="light">` attribute near the top of the file.
- Custom colours can be overridden by editing the `<style>` block that defines `:root { … }`.

---

## 6. Deploying Changes
All changes are deployed automatically by **GitHub Pages** whenever the `main` branch is updated.
```bash
# From the repository root (scratch folder)
git add .
git commit -m "Describe what you changed"
git push origin main   # pushes to https://github.com/mRn0b0dye/portfolio
```
GitHub Pages will rebuild within a minute. Visit:
```
https://mRn0b0dye.github.io/portfolio/
```
to see the live site.

---

## 7. Enabling GitHub Pages (once only)
1. Go to **Settings → Pages** of the repository on GitHub.
2. Set **Source** to `main` branch and **Folder** to `/ (root)`.
3. Save. GitHub will provide the URL shown above.

---

## 8. Common Tasks Checklist
- [ ] Edit hero name / headline.
- [ ] Add a new write‑up.
- [ ] Add a new project.
- [ ] Change theme colours.
- [ ] Commit & push.
- [ ] Verify the live URL.

---

### Need more help?
Open an issue in this repository or edit this `ADMIN_GUIDE.md` directly and commit the update.
