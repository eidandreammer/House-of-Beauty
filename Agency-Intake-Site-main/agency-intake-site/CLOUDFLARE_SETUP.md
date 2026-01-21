# Cloudflare Pages Deployment Setup

This guide will help you deploy your Agency Intake Site to Cloudflare Pages and resolve the environment variable issues.

## 🚀 Quick Fix for Current Error

The build is failing because:
1. Environment variables are missing
2. API routes need Edge Runtime configuration

Here's how to fix both issues:

### 1. Set Environment Variables in Cloudflare Pages

1. Go to your [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)
2. Select your project
3. Go to **Settings** → **Environment variables**
4. Add the following variables:

**For Production:**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
```

**For Preview (optional):**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
```

### 2. Get Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. API Routes Edge Runtime (Already Fixed)

The API routes have been configured to use the Edge Runtime, which is required for Cloudflare Pages:

```typescript
// Required for Cloudflare Pages deployment
export const runtime = 'edge'
```

### 4. Optional: Turnstile Captcha (if using)

If you want to use Cloudflare Turnstile for captcha:

1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Create a new site
3. Add these environment variables:
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY = your_site_key
TURNSTILE_SECRET_KEY = your_secret_key
```

## 🔧 Build Configuration

Your `wrangler.toml` is already configured correctly:

```toml
name = "agency-intake-site"
compatibility_date = "2025-08-20"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

## 🚀 Deploy

1. **Connect your repository** to Cloudflare Pages
2. **Set build settings:**
   - Build command: `npm run build`
   - Build output directory: `.vercel/output/static`
   - Node.js version: 18 (or higher)
3. **Add environment variables** (see step 1)
4. **Deploy!**

## 🐛 Troubleshooting

### Build Still Failing?

1. **Check environment variables** are set correctly
2. **Verify Supabase project** is active and accessible
3. **Ensure API routes use Edge Runtime** (`export const runtime = 'edge'`)
4. **Check build logs** for specific error messages

### Database Connection Issues?

1. **Verify Supabase URL** doesn't have trailing slashes
2. **Check API keys** are correct
3. **Ensure Supabase project** is not paused

### Local Development

Create a `.env.local` file in the `agency-intake-site` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

## 📝 Next Steps

After successful deployment:

1. **Test the lead form** on your live site
2. **Check Supabase dashboard** for new leads
3. **Set up notifications** if needed
4. **Configure custom domain** in Cloudflare Pages

## 🔗 Useful Links

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
