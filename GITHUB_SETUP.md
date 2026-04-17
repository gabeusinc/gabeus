# Pushing to GitHub + Auto-Deploy via Netlify

This is a one-time setup. After this, **every `git push` auto-deploys to
gabeus.com** — no more drag-and-drop.

---

## Prerequisites (one-time per computer)

1. **Git for Windows installed**
   Check: open PowerShell and run `git --version`.
   If not installed, download from https://git-scm.com/download/win (use default
   options during install).

2. **GitHub account**
   Sign up free at https://github.com if you don't have one.

---

## Step 1 — Create an empty GitHub repo

1. Go to https://github.com/new
2. **Repository name:** `gabeus` (or `gabeus-site`, whatever you prefer)
3. **Visibility:**
   - **Private** is fine — only you and whoever you invite can see the code.
     Recommended unless you want the code to be open source.
   - **Public** is also fine — people seeing your HTML/CSS won't hurt anything
     (no secrets in this repo).
4. **Do NOT check** "Add a README", "Add .gitignore", or "Add a license" —
   we already have our own.
5. Click **Create repository**.
6. You'll land on a page showing a URL like:
   `https://github.com/YOUR_USERNAME/gabeus.git`
   Keep this tab open — you'll need that URL next.

---

## Step 2 — Connect your local repo + push

Open a terminal in the project folder:

```powershell
cd "C:\Users\Jason L\Desktop\Claude\gabeus"
```

Paste these 3 commands (replace `YOUR_USERNAME` with your real GitHub username):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/gabeus.git
git branch -M main
git push -u origin main
```

First push will prompt for GitHub credentials:
- **Username:** your GitHub username
- **Password:** a **personal access token**, NOT your GitHub password.
  Create one at: https://github.com/settings/tokens?type=beta
  Give it `Contents: Read and write` scope on just the `gabeus` repo.
  Copy the token, paste it as the password.

Git will cache this after the first push. You won't need to re-enter it.

After push succeeds, refresh the GitHub repo page — all your files should
appear.

---

## Step 3 — Connect GitHub to Netlify for auto-deploy

1. Open your Netlify site dashboard (the one deployed at gabeus.com).
2. **Site configuration** → **Build & deploy** → **Continuous deployment** →
   **Link repository**.
3. Choose **GitHub**, authorize Netlify to access your account.
4. Pick the `gabeus` repo.
5. Build settings:
   - **Branch to deploy:** `main`
   - **Build command:** *(leave blank — we don't build)*
   - **Publish directory:** *(leave blank or `/`)*
6. Click **Deploy site**.

Netlify will pull from GitHub and deploy. Every future `git push` to `main`
will trigger a new deploy automatically. Usually live in 30–60 seconds.

---

## Your daily workflow after this

When someone (you or Claude) changes a file:

```powershell
cd "C:\Users\Jason L\Desktop\Claude\gabeus"
git add .
git commit -m "Short description of what changed"
git push
```

Within a minute, gabeus.com reflects the change.

### To see history:

```powershell
git log --oneline
```

### To undo the last commit (if you broke something):

```powershell
git reset --hard HEAD~1
git push --force
```
(Only use `--force` on solo-owned repos — which this is.)

---

## When you start a new Claude session

Just say:

> "Open `C:\Users\Jason L\Desktop\Claude\gabeus\PROJECT.md` and read it.
> Then [your task]."

Claude will:
1. Read PROJECT.md to get oriented (fast, this file is small)
2. Read specific files it needs for the task
3. Make changes, commit, push

You don't need to re-explain the design, colors, or what's been decided.
Everything is in PROJECT.md.

---

## Files you should never edit (safe to ignore)

- `.git/` — internal git data, do not touch
- `.gitignore` — already configured, leave alone unless you add a new file type
  to ignore

## Files safe to edit by hand

All of these can be opened in any text editor (VS Code, Notepad++, even Notepad)
if you want to make a quick word change without Claude:

- Any `.html` page — edit the visible text between tags
- `css/main.css` — colors and spacing
- `sitemap.xml` — if you add new pages
- `PROJECT.md` — keep this updated when you make big decisions

---

## Troubleshooting

**"git: command not found"**
Git not installed. Install from https://git-scm.com/download/win .

**"Permission denied (publickey)" on push**
You're using SSH but haven't set up SSH keys. Easiest fix: use HTTPS URL instead
(the one ending in `.git` from Step 1).

**"Updates were rejected"**
Someone pushed to GitHub from another machine. Run:
```powershell
git pull --rebase
git push
```

**Netlify deploy failed**
Check Netlify Deploys tab → click the failed deploy → read the log. Usually a
typo in a filename or a missing image. Fix, commit, push — it retries.
