import PortfolioShowcase, { PortfolioProject } from '@/components/PortfolioShowcase'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Portfolio Showcase | Agency Intake',
    description: 'A showcase of our premium web design projects.',
}

const mockProjects: PortfolioProject[] = [
    {
        id: 'nexus-verium',
        title: 'Nexus Verium – Restoration Systems & Environmental Engineering',
        description: 'Integrating AI and environmental engineering to heal ecosystems and improve human well‑being through the River Veins initiative.',
        videoUrl: '/portfolio/nexusverium.mp4',
        color: '#0ea5e9', // Sky blue/Cyan for water/tech
        features: [
            'River Veins monitoring and healing network (floating AI wetlands, sensors, drones, cleanup robots)',
            'Digital twin models of the Meadowlands for planning',
            'Continuous monitoring & AI‑driven analysis for water quality',
            'Active restoration prototypes (wetlands, sensors, drones, cleanup systems)'
        ],
        techStack: ['Next.js', 'Tailwind CSS', 'Turbopack/Next', 'JavaScript'],
        projectUrl: 'https://nexusverium.tech'
    },
    {
        id: 'freakin-empanadas',
        title: 'These Freakin’ Empanadas & More – Bold, Crispy, Freakin’ Delicious',
        description: 'The brand’s tagline and unique positioning as a Wood‑Ridge empanada hub offering hand‑held flavor bombs and sandwiches.',
        videoUrl: '/portfolio/freakinempanadas.mp4',
        color: '#f59e0b', // Golden/Orange for food/warmth
        features: [
            'Diverse menu of savory and dessert empanadas (Classic Beef, Cannoli, Spinach Artichoke, Oreo Cheesecake, General Tso’s Chicken)',
            'Combos and family packs (Munchie Pack, Family Pack of 12)',
            'Sandwiches and sides such as the Cuban Sandwich and Philly Cheesesteak',
            'Brick‑and‑mortar location with takeout, delivery, and Uber Eats ordering'
        ],
        techStack: ['React', 'Tailwind CSS', 'Vite/JavaScript', 'Uber Eats Integration'],
        projectUrl: 'https://freakinempanadas.com'
    },
    {
        id: 'bodega-project',
        title: 'Rutgers Newark Bodega Project – Sustainable Food Supply Chains',
        description: 'Builds a data‑informed, hyperlocal supply chain linking local farms and school gardens to Newark’s bodegas.',
        videoUrl: '/portfolio/BodegaProject.mp4',
        color: '#10b981', // Emerald green for sustainability
        features: [
            'Mission to empower students with real‑world skills to design and maintain sustainable food systems',
            'Developing a replicable supply‑chain prototype, fostering research, and strengthening community relationships',
            'Tools including a “Fast vs. Fresh Food” map, KPI Builder, and data‑visualization section',
            'Promotion of indoor vertical farming with year‑round production'
        ],
        techStack: ['Vite/JavaScript', 'ScrollReveal', 'Particles.js', 'Chart.js', 'Leaflet', 'Mapbox'],
        projectUrl: 'https://jjimenez723.github.io/Bodega-Project-2'
    }
]

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <PortfolioShowcase projects={mockProjects} />
        </main>
    )
}
