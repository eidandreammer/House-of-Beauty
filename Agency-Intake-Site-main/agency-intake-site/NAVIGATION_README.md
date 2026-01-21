# Navigation System

This project includes a comprehensive navigation system with three different styles that can be switched dynamically.

## Features

- **Sticky Navigation**: All navigation styles are fixed at the top of the page
- **Three Navigation Styles**:
  - **Traditional**: Simple, clean navigation with hover effects
  - **Pill Nav**: Modern pill-style navigation with smooth animations
  - **Card Nav**: Card-based navigation with expandable menu
- **Style Selector**: A floating button menu to switch between navigation styles
- **Responsive Design**: All navigation styles work on mobile and desktop
- **Next.js Compatible**: Uses Next.js Link components for client-side navigation

## Navigation Pages

The navigation includes the following pages:
- **Home** (`/`) - Main landing page
- **About Us** (`/about`) - Company information
- **Pricing** (`/pricing`) - Service pricing details
- **Get Started** (`/start`) - Project intake form

## Components

### Main Navigation Component
- **File**: `src/components/Navigation.tsx`
- **CSS**: `src/components/Navigation.css`
- **Features**: 
  - Manages state for navigation style switching
  - Renders appropriate navigation component based on selected style
  - Includes style selector UI

### Navigation Styles

#### Traditional Navigation
- **Type**: Custom built
- **Features**: 
  - Simple horizontal navigation
  - Active state indicators
  - Mobile hamburger menu
  - Smooth transitions

#### Pill Navigation
- **Source**: React Bits library (modified for Next.js)
- **File**: `src/components/PillNav/PillNavNext.jsx`
- **Features**:
  - Pill-shaped navigation items
  - Hover animations with circular effects
  - GSAP-powered animations
  - Mobile-responsive

#### Card Navigation
- **Source**: React Bits library (modified for Next.js)
- **File**: `src/components/CardNav/CardNavNext.jsx`
- **Features**:
  - Expandable card-based menu
  - Animated hamburger menu
  - GSAP-powered transitions
  - Mobile-responsive

## Usage

The navigation is automatically included in the main layout (`src/app/layout.tsx`) and appears on all pages.

### Style Switching

Users can switch between navigation styles using the style selector in the top-right corner:
1. **Traditional**: Default simple navigation
2. **Pill Nav**: Modern pill-style with animations
3. **Card Nav**: Card-based expandable navigation

### Customization

#### Colors and Styling
Each navigation style can be customized by modifying the props passed to the components in `Navigation.tsx`:

```tsx
// Pill Nav customization
<PillNav
  logo="Agency Name"
  items={navItems}
  activeHref={pathname}
  baseColor="#ffffff"
  pillColor="#1f2937"
  pillTextColor="#ffffff"
  hoveredPillTextColor="#1f2937"
  className={className}
  onMobileMenuClick={() => {}}
/>

// Card Nav customization
<CardNav
  logo="Agency Name"
  items={navItems}
  baseColor="#ffffff"
  menuColor="#1f2937"
  buttonBgColor="#3b82f6"
  buttonTextColor="#ffffff"
  className={className}
/>
```

#### CSS Customization
- Main navigation styles: `src/components/Navigation.css`
- Pill Nav styles: `src/components/PillNav/PillNav.css`
- Card Nav styles: `src/components/CardNav/CardNav.css`

## Technical Details

### Dependencies
- **GSAP**: Used for animations in Pill Nav and Card Nav
- **Next.js**: For routing and Link components
- **React**: For component state management

### Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Mobile-responsive design
- Touch-friendly interactions

### Performance
- Lazy loading of navigation components
- Optimized animations with GSAP
- Minimal re-renders with proper state management

## Development

### Adding New Navigation Items
To add new navigation items, modify the `navItems` array in `Navigation.tsx`:

```tsx
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/start', label: 'Get Started' },
  { href: '/new-page', label: 'New Page' }, // Add new items here
]
```

### Adding New Navigation Styles
To add a new navigation style:
1. Create the new navigation component
2. Add the style type to the `NavStyle` type in `Navigation.tsx`
3. Add the case in the `renderNavigation` function
4. Add the style button to the `StyleSelector` component

## Troubleshooting

### Common Issues
1. **Navigation not appearing**: Check that `Navigation` component is imported in `layout.tsx`
2. **Style switching not working**: Ensure all navigation components are properly imported
3. **Mobile menu issues**: Check CSS media queries and z-index values
4. **Animation glitches**: Verify GSAP is properly installed and imported

### Build Issues
- Run `npm run build` to check for TypeScript errors
- Ensure all required props are provided to navigation components
- Check for missing CSS imports
