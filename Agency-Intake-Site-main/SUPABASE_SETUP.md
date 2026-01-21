# Supabase Backend Setup Guide

This guide covers the implementation of a secure, production-ready intake storage and authentication system using Supabase with Edge Functions, JSONB schema, RLS, and captcha protection.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js zod undici
```

### 2. Environment Variables
Create a `.env.local` file with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudflare Turnstile (Captcha)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

**Get your Supabase keys from:** https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/settings/api

**Get your Turnstile keys from:** https://dash.cloudflare.com/?to=/:account/turnstile

## 🗄️ Database Setup

### Run Migrations
1. **Local Development:**
   ```bash
   npx supabase start
   npx supabase db reset
   ```

2. **Production:**
   ```bash
   npx supabase db push
   ```

### Schema Overview
- **`organizations`**: Client organizations (one-to-many with intakes)
- **`profiles`**: User profile information (linked to auth.users)
- **`org_members`**: Organization membership and roles
- **`intakes`**: Form submissions with JSONB for flexible design data
- **`intake_assets`**: File storage for logos, brand guides, etc.

### Row Level Security (RLS)
- **Staff users**: Full access to all data
- **Client users**: Access only to their organization's data
- **Unauthenticated**: No access (except through Edge Functions)

## ⚡ Edge Functions

### Deploy Functions
```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy intake-submit
npx supabase functions deploy auth-gate
```

### Function Details

#### `intake-submit`
- **Purpose**: Secure form submission with captcha verification
- **Features**: Zod validation, Turnstile captcha, database insertion
- **Access**: Public (with captcha protection)

#### `auth-gate`
- **Purpose**: Captcha-gated authentication flow
- **Features**: Turnstile verification, user creation (signup)
- **Access**: Public (with captcha protection)

## 🔐 Authentication Flow

### Sign In with Captcha
```typescript
import { signInWithCaptcha } from '@/lib/supabase';

const result = await signInWithCaptcha(email, password, turnstileToken);
if (result.success) {
  // User is signed in
} else {
  // Handle error
  console.error(result.error);
}
```

### Sign Up with Captcha
```typescript
import { authGate } from '@/lib/supabase';

const result = await authGate(email, password, 'signup', turnstileToken);
if (result.success) {
  // User created, proceed to sign in
} else {
  // Handle error
  console.error(result.error);
}
```

## 📝 Intake Form Submission

### Submit Intake with Captcha
```typescript
import { submitIntake } from '@/lib/supabase';

const result = await submitIntake(intakeData, turnstileToken);
if (result.success) {
  // Intake submitted successfully
  console.log('Intake ID:', result.id);
} else {
  // Handle error
  console.error(result.error);
}
```

## 🎨 Data Structure

### Intake Form Fields
- **Business Info**: Name, industry, address, phone, domain
- **Goals & Pages**: Arrays of selected options
- **Color & Typography**: JSONB objects for design flexibility
- **Templates & Features**: Arrays of selected options
- **Organization**: Wrapper for business details

### JSONB Benefits
- **Flexible**: Easy to add new design fields without schema changes
- **Queryable**: GIN indexes for efficient JSONB queries
- **Type-safe**: Zod validation ensures data integrity

## 🚀 Deployment

### 1. Supabase Project
1. Create a new project at https://supabase.com
2. Get your project URL and API keys
3. Update environment variables

### 2. Edge Functions
```bash
# Link to your Supabase project
npx supabase link --project-ref your_project_ref

# Deploy functions
npx supabase functions deploy
```

### 3. Database
```bash
# Push schema to production
npx supabase db push
```

### 4. Environment Variables
Set the same environment variables in your production environment (Vercel, Netlify, etc.)

## 🔧 Local Development

### Start Supabase
```bash
npx supabase start
```

### Reset Database
```bash
npx supabase db reset
```

### View Logs
```bash
npx supabase logs
```

### Stop Services
```bash
npx supabase stop
```

## 🧪 Testing

### Test Edge Functions Locally
```bash
# Test intake-submit
curl -X POST http://localhost:54321/functions/v1/intake-submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_anon_key" \
  -d '{"business_name":"Test","industry":"Tech",...}'

# Test auth-gate
curl -X POST http://localhost:54321/functions/v1/auth-gate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_anon_key" \
  -d '{"email":"test@example.com","password":"password","mode":"signin","turnstileToken":"token"}'
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

## 🆘 Troubleshooting

### Common Issues

1. **Function deployment fails**
   - Check your Supabase project link
   - Verify environment variables in Supabase dashboard

2. **Database connection errors**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Check if your project is active

3. **Captcha verification fails**
   - Verify Turnstile keys
   - Check if the site key matches the secret key

4. **RLS policies blocking access**
   - Check user authentication status
   - Verify organization membership
   - Review RLS policy definitions

### Support
- Check Supabase logs: `npx supabase logs`
- Review Edge Function logs in Supabase dashboard
- Verify database policies and permissions
