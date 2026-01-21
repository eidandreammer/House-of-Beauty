# Agency Intake Site

A beautiful, performant marketing site for web design agencies with a sophisticated intake system that captures client preferences and generates custom websites.

## Features

- **Multi-step Intake Form**: Comprehensive client preference collection
- **Color Wheel & Harmony**: Interactive color picker with harmony generation
- **Template Selection**: Choose between Template A (one-pager) and Template B (multi-page)
- **Design Tokens**: Dynamic theming system that converts intake data to CSS variables
- **Modern Tech Stack**: Next.js 15, React, TypeScript, Tailwind CSS
- **Performance Optimized**: Lighthouse targets: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- **Mobile-First**: Responsive design with excellent mobile experience
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **Color System**: Custom canvas-based color wheel with harmony generation
- **Animations**: Framer Motion with reduced motion support
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel with CI/CD

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agency-intake-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Create a new Supabase project and run this SQL to create the intakes table:
   ```sql
   CREATE TABLE intakes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     
     -- Business info
     business JSONB NOT NULL,
     
     -- Goals and requirements
     goals JSONB NOT NULL,
     reference_urls TEXT[],
     
     -- Design preferences
     color JSONB NOT NULL,
     fonts JSONB NOT NULL,
     templates TEXT[] NOT NULL,
     
     -- Features and content
     features TEXT[],
     assets JSONB,
     content JSONB,
     
     -- Project details
     admin JSONB
   );
   
   -- Enable Row Level Security
   ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
   
   -- Create policies (adjust as needed)
   CREATE POLICY "Allow public insert" ON intakes FOR INSERT WITH CHECK (true);
   CREATE POLICY "Allow public select" ON intakes FOR SELECT USING (true);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── intake/        # Intake form API
│   ├── globals.css        # Global styles & design tokens
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ColorWheel.tsx     # Interactive color picker
│   ├── Features.tsx       # Services showcase
│   ├── Hero.tsx           # Hero section
│   ├── IntakeForm.tsx     # Multi-step form
│   ├── Pricing.tsx        # Pricing plans
│   ├── TemplatePicker.tsx # Template selection
│   └── Testimonials.tsx   # Client testimonials
└── lib/                    # Utility libraries
    ├── schema.ts          # Zod validation schemas
    ├── supabase.ts        # Supabase client & functions
    ├── tokens.ts          # Design token system
    └── seo.ts             # SEO utilities
```

## Customization Guide

### Design Tokens

The design token system automatically generates CSS variables from client intake data. Customize the default tokens in `src/lib/tokens.ts`:

```typescript
const defaultTokens: DesignTokens = {
  colors: {
    primary: '#3B82F6',    // Your brand color
    secondary: '#64748B',
    accent: '#F59E0B',
    // ... more colors
  },
  fonts: {
    headings: fontMap.modern,
    body: fontMap.modern
  }
  // ... spacing, radius, etc.
}
```

### Color Harmonies

The color wheel supports multiple harmony types:
- Complementary
- Analogous  
- Split
- Triad
- Tetrad
- Monochrome
- Monochrome Tints

Customize in `src/components/ColorWheel.tsx`.

### Templates

Two built-in templates are included:
- **Template A**: Conversion-focused one-pager
- **Template B**: Editorial multi-page layout

Add more templates by extending the `templateOptions` array in `src/components/TemplatePicker.tsx`.

### Styling

The site uses Tailwind CSS with custom design tokens. Key classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style  
- `.input-field` - Form input styling
- `.card` - Card component styling

### Content

Update content in the component files:
- `src/components/Hero.tsx` - Main headline and CTA
- `src/components/Features.tsx` - Services and features
- `src/components/Pricing.tsx` - Pricing plans
- `src/components/Testimonials.tsx` - Client reviews

## API Endpoints

### POST /api/intake

Submit a new client intake:

```typescript
POST /api/intake
Content-Type: application/json

{
  "business": {
    "name": "Business Name",
    "industry": "Industry",
    "address": "Address",
    "phone": "Phone"
  },
  "goals": {
    "conversions": ["calls", "bookings"],
    "pages": ["Home", "About", "Services"]
  },
  "color": {
    "brand": "#3B82F6",
    "mode": "auto",
    "palette": ["#3B82F6", "#1E40AF"]
  },
  // ... more fields
}
```

### GET /api/intake

Get intake form information (for reference).

## Performance Optimization

The site is optimized for performance:

- **Images**: Next.js Image component with automatic optimization
- **Fonts**: Google Fonts with `display: swap`
- **CSS**: Tailwind CSS with PurgeCSS in production
- **JavaScript**: Code splitting and lazy loading
- **Animations**: GPU-accelerated with reduced motion support

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Reduced motion preferences

## SEO Features

- Meta tags and Open Graph
- Twitter Card support
- Structured data (Schema.org)
- Sitemap generation
- Robots.txt
- Canonical URLs

## Deployment

### Vercel (Recommended)

1. **Connect your repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `WEBHOOK_URL` | Webhook for intake notifications | No |

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Lighthouse

```bash
npm run lighthouse
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Contact: your-email@domain.com

## Roadmap

- [ ] Client dashboard for project tracking
- [ ] Integration with project management tools
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Advanced form validation
- [ ] File upload support for assets
- [ ] Email notifications
- [ ] Payment integration

## Discount Banner (Pricing Page)

Enable a themed discount banner on the Pricing page using environment variables:

- `NEXT_PUBLIC_DISCOUNT_ENABLED` (true|false): Toggle the banner. Default: false
- `NEXT_PUBLIC_DISCOUNT_PERCENT`: Percentage shown. Default: 15%
- `NEXT_PUBLIC_DISCOUNT_HEADLINE`: Main line. Default: "Limited‑time offer: Save {percent}"
- `NEXT_PUBLIC_DISCOUNT_SUBTEXT`: Supporting line. Default: "Get {percent} off any plan. New clients only."
- `NEXT_PUBLIC_DISCOUNT_CTA_LABEL`: CTA text. Default: "Claim Discount"
- `NEXT_PUBLIC_DISCOUNT_CTA_HREF`: CTA link. Default: `/start`
- `NEXT_PUBLIC_DISCOUNT_EXPIRES_AT`: ISO datetime for countdown (e.g., `2025-12-31T23:59:59Z`). Optional.
- `NEXT_PUBLIC_DISCOUNT_DISMISSIBLE` (true|false): Allow users to dismiss. Default: true

The banner automatically matches the selected background/theme and supports light/dark modes.
