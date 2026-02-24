# Deploy SISERA Business Club

You can deploy to **Cloudflare Pages** (recommended) by connecting **GitHub** or using the **Wrangler CLI**. Nothing extra is installed for the GitHub method.

---

## Option 1: Cloudflare Pages via GitHub (recommended)

No Wrangler install. Push code to GitHub, then connect the repo in Cloudflare.

### 1. Push your code to GitHub

```bash
git add .
git commit -m "Prepare for deploy"
git remote add origin https://github.com/YOUR_USERNAME/SiseraBusinessClub.git   # if not already added
git push -u origin main
```

(Use your real GitHub username and repo name; use `master` if your default branch is `master`.)

### 2. Create the site on Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choose **GitHub** and authorize Cloudflare, then select the **SiseraBusinessClub** repo.
3. Configure the build:
   - **Framework preset:** Vite (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** (leave empty)
4. Click **Save and Deploy**.

### 3. Add environment variables

In the same project: **Settings** → **Environment variables** (Production and Preview):

| Name                  | Value                    |
|-----------------------|--------------------------|
| `VITE_SUPABASE_URL`   | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key   |

Then trigger a new deploy (e.g. **Deployments** → **Retry deployment** or push a new commit).

Your site will be at `https://sisera-business-club.pages.dev` (or a custom domain you add).

---

## Option 2: Cloudflare Pages via Wrangler CLI

Uses `npx wrangler`, so you don’t need to install Wrangler globally.

### 1. Create the Pages project (once)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Create a project named **sisera-business-club** (or any name; use that name in the deploy command below).

### 2. Build and deploy

From the project root:

```bash
npm run deploy
```

Or step by step:

```bash
npm run build
npx wrangler pages deploy dist --project-name=sisera-business-club
```

First time you run `npx wrangler`, you’ll be prompted to log in to Cloudflare.

### 3. Set environment variables

In Cloudflare: **Workers & Pages** → your **sisera-business-club** project → **Settings** → **Environment variables**. Add for Production (and Preview if you use it):

- `VITE_SUPABASE_URL` = your Supabase URL  
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key  

Redeploy after changing env vars (e.g. run `npm run deploy` again).

---

## Summary

| Method              | Install        | Flow                                      |
|---------------------|----------------|-------------------------------------------|
| **GitHub + Pages**  | Nothing        | Push to GitHub → connect repo → deploy    |
| **Wrangler CLI**    | None (uses npx)| `npm run deploy` (build + upload `dist`)  |

Both deploy the same Vite build to Cloudflare Pages. Use **Option 1** if you want automatic deploys on every push.
