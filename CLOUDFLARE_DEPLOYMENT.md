# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Sisera Business Club application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier available)
2. Your code repository hosted on GitHub, GitLab, or Bitbucket
3. Node.js 18+ installed locally (for testing builds)

## Step 1: Connect Your Repository to Cloudflare Pages

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **Pages**

2. **Create a New Project**
   - Click **Create a project**
   - Click **Connect to Git**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select the `SiseraBusinessClub` repository

3. **Configure Build Settings**
   - **Framework preset**: Select "Vite" (or "None" if Vite is not listed)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave as default)

## Step 2: Set Environment Variables

1. **In the Cloudflare Pages project settings:**
   - Go to **Settings** → **Environment variables**
   - Click **Add variable**

2. **Add the following variables:**

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `VITE_SUPABASE_URL` | `https://mnpzmgoxcmldbhnktvtw.supabase.co` | Production, Preview, Branch |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucHptZ294Y21sZGJobmt0dnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDQ5MTgsImV4cCI6MjA2NDE4MDkxOH0.WUt1hOfh7lvefIh8aFGCU7bm6A-zzZPM0GzcNc81EEk` | Production, Preview, Branch |

### ⚠️ BELANGRIJK:

- **De variabelen MOETEN de `VITE_` prefix hebben**
- Dit is nodig omdat Vite alleen variabelen met deze prefix beschikbaar maakt aan client-side code
- Zonder deze prefix worden de variabelen NIET ingebouwd tijdens de build
- Set these for **all environments** (Production, Preview, and Branch) unless you have different values

## Step 3: Deploy

1. **After connecting the repository:**
   - Cloudflare Pages will automatically trigger a build
   - You can monitor the build progress in the **Deployments** tab

2. **Manual Deployment:**
   - Go to **Deployments** tab
   - Click **Retry deployment** if needed
   - Or push a new commit to trigger a new deployment

## Step 4: Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to **Custom domains** in your project settings
   - Click **Set up a custom domain**
   - Enter your domain (e.g., `sisera.be`)
   - Follow the DNS configuration instructions

2. **DNS Configuration:**
   - Add a CNAME record pointing to your Cloudflare Pages URL
   - Or use Cloudflare's nameservers if your domain is managed by Cloudflare

## Step 5: Verify Deployment

1. **Check Build Logs:**
   - Go to **Deployments** → Select the latest deployment
   - Review the build logs for any errors
   - Ensure the build completed successfully

2. **Test the Application:**
   - Visit your Cloudflare Pages URL
   - Test all functionality, especially:
     - Authentication
     - Database connections
     - API calls to Supabase

## Configuration Files

The project includes the following Cloudflare-specific files:

- **`public/_headers`**: Custom HTTP headers for caching and security
- **`public/_redirects`**: SPA routing configuration (redirects all routes to index.html)
- **`wrangler.toml`**: Cloudflare Pages configuration (optional, mainly for local development)

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18 (automatically detected by Cloudflare Pages)

## Caching Strategy

The application uses the following caching strategy (configured in `public/_headers`):

- **HTML files**: No cache (always fresh)
- **Static assets** (JS, CSS): 1 year cache (they have hashes in filenames)
- **Images**: 1 year cache

## Troubleshooting

### Build Fails

1. **Check Build Logs:**
   - Go to **Deployments** → Select failed deployment → **View build log**
   - Look for error messages

2. **Common Issues:**
   - **Missing environment variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - **Build command errors**: Verify `npm run build` works locally
   - **Node version**: Cloudflare Pages uses Node 18 by default, which should work fine

### Environment Variables Not Working

1. **Verify Variable Names:**
   - Must be exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - No extra spaces or case differences

2. **Redeploy After Changes:**
   - Environment variables are only used during build
   - You must trigger a new deployment after adding/changing variables

3. **Check All Environments:**
   - Make sure variables are set for the environment you're deploying to
   - Production, Preview, and Branch deployments can have different variables

### SPA Routing Not Working

- Ensure `public/_redirects` file exists with: `/*    /index.html   200`
- This file should be in the `public` directory and will be copied to `dist` during build

### Headers Not Applied

- Verify `public/_headers` file exists
- Check that headers are correctly formatted (no extra spaces)
- Headers file should be in `public` directory

## Local Testing

Before deploying, test your build locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

## Migration from Netlify

If you're migrating from Netlify:

1. **Environment Variables**: Copy your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Netlify to Cloudflare Pages
2. **Custom Domain**: Update your DNS to point to Cloudflare Pages instead of Netlify
3. **Remove Netlify Configuration**: You can safely remove `netlify.toml` (it's no longer needed)

## Security Note

The Supabase ANON_KEY is safe to make public - it's specifically designed for client-side use. The URL is also public. These variables are built into your JavaScript bundle and are visible in the browser, which is normal for Supabase client-side configuration.

## Support

For issues specific to Cloudflare Pages:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
