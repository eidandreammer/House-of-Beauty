# House of Beauty

Marketing site for Wendy Ossers Haus of Beauty, built with React and Vite.

## Local development

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

To run the booking API locally as well:

```bash
npm run server:start
```

The frontend expects these environment variables:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
APP_ORIGIN=http://localhost:5173
VITE_APPOINTMENTS_API_URL=/api/appointments
PORT=8787
```

## GitHub Pages deployment

This repo is configured to deploy the static frontend to GitHub Pages at:

`https://eidandreammer.github.io/House-of-Beauty/`

Deployment is handled by [`../.github/workflows/deploy-house-of-beauty-pages.yml`](../.github/workflows/deploy-house-of-beauty-pages.yml).

Important:

- GitHub Pages only hosts the frontend.
- The Express booking API in [`server/`](./server/) does not run on GitHub Pages.
- To keep online booking active in production, add a repository secret named `VITE_APPOINTMENTS_API_URL` that points to a live API endpoint.
- If that secret is not set, the site still deploys, but booking falls back to phone/email messaging instead of a broken form submission.
