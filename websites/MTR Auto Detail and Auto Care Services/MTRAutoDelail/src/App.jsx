import { useEffect, useState } from 'react'
import './App.css'
import BlurText from './components/BlurText.jsx'
import StaggeredMenu from './components/StaggeredMenu.jsx'

const PHONE_DISPLAY = '(973) 277-0374'
const PHONE_LINK = 'tel:+19732770374'
const ADDRESS = '133 River Dr, Garfield, NJ 07026'
const HOURS_DISPLAY = 'Mon-Fri 8:30am-6pm; Sat 9am-4pm'
const BUSINESS_HOURS = [
  { days: 'Mon-Fri', hours: '8:30am-6pm' },
  { days: 'Saturday', hours: '9am-4pm' },
  { days: 'Sunday', hours: 'Closed' },
]
const MAPS_URL =
  'https://www.google.com/maps/place/MTR+Auto+Detail+and+Auto+Care+Services/@40.8640673,-74.107533,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2f91d34b7b6bb:0x27692c57dba7643c!8m2!3d40.8640673!4d-74.107533!16s%2Fg%2F11qnlxn9qt?entry=ttu'
const MOBILE_MENU_QUERY = '(max-width: 760px)'
const LOGO_URL = `${import.meta.env.BASE_URL}favicon.ico`

const asset = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to the home section', link: '#home' },
  { label: 'Services', ariaLabel: 'View our services', link: '#services' },
  { label: 'About', ariaLabel: 'Learn about MTR', link: '#about' },
  { label: 'Visit Us', ariaLabel: 'View shop information', link: '#visit' },
  { label: 'Contact', ariaLabel: 'View contact options', link: '#contact' },
]

const services = [
  {
    title: 'Computer Diagnostics',
    meta: 'Fault tracing, scan data, test verification',
    image: asset('diagnostics.jpg'),
    alt: 'Technician inspecting a vehicle engine during diagnostics',
  },
  {
    title: 'Brake Systems',
    meta: 'Pads, rotors, hydraulics, safety inspection',
    image: asset('brakes.jpg'),
    alt: 'Mechanic repairing a vehicle brake assembly in a garage',
  },
  {
    title: 'Factory Maintenance',
    meta: 'Oil service, fluids, filters, scheduled care',
    image: asset('maintenance.jpg'),
    alt: 'Vehicle lifted for maintenance in a modern auto service bay',
  },
  {
    title: 'General Mechanic',
    meta: 'Suspension, drivability, electrical, repair work',
    image: asset('mechanic.jpg'),
    alt: 'Mechanic working inside a vehicle engine bay',
  },
  {
    title: 'Detailing & Finish',
    meta: 'Full detail, headlight restoration, scratch removal',
    image: asset('detailing.jpg'),
    alt: 'Detail technician buffing paint on a vehicle panel',
  },
]

const shopHighlights = [
  {
    name: 'Repair Estimates',
    note: 'Clear findings, practical options, and no-pressure recommendations',
    image: asset('mechanic.jpg'),
    alt: 'Mechanic working inside a vehicle engine bay',
  },

  {
    name: 'Preventive Maintenance',
    note: 'Oil service, filters, fluids, brakes, and scheduled inspections',
    image: asset('maintenance.jpg'),
    alt: 'Vehicle lifted for maintenance in a modern auto service bay',
  },
]

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()
    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

function App() {
  const showMobileMenu = useMediaQuery(MOBILE_MENU_QUERY)

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight

    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect()

      if (rect.top <= viewportHeight * 0.96) {
        item.classList.add('is-visible')
        return
      }

      observer.observe(item)
    })

    document.documentElement.classList.add('reveal-enabled')

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-enabled')
    }
  }, [])

  return (
    <div className="site-shell">
      <div className="static-background" aria-hidden="true">
        <img
          src={asset('background static.png')}
          alt=""
          fetchPriority="high"
        />
      </div>

      {showMobileMenu && (
        <StaggeredMenu
          position="right"
          items={menuItems}
          displaySocials={false}
          displayItemNumbering
          menuButtonColor="#1a1a1a"
          openMenuButtonColor="#1a1a1a"
          changeMenuColorOnOpen
          colors={['#1a1a1a', '#d5001c']}
          logoUrl={LOGO_URL}
          accentColor="#d5001c"
          isFixed
        />
      )}

      <main>
        <section className="hero-section" id="home">
          <header className="site-header" aria-label="Primary navigation">
            <div className="header-inner">
              <nav className="nav-links" aria-label="Site sections">
                <a href="#home">
                  <BlurText as="span" text="Home" delay={70} />
                </a>
                <a href="#services">
                  <BlurText as="span" text="Services" delay={70} />
                </a>
                <a href="#about">
                  <BlurText as="span" text="About" delay={70} />
                </a>
                <a href="#visit">
                  <BlurText as="span" text="Visit Us" delay={70} />
                </a>
                <a href="#contact">
                  <BlurText as="span" text="Contact" delay={70} />
                </a>
              </nav>
            </div>
          </header>

          <div className="hero-content">
            <BlurText
              className="eyebrow"
              text="Garfield, NJ precision auto care"
              delay={80}
            />
            <BlurText
              as="h1"
              className="hero-title"
              text={'DIAGNOSE \u2022 REPAIR \u2022 PERFORMANCE'}
              delay={140}
              animateBy="words"
              direction="top"
              aria-label="Diagnose, repair, performance"
            />
            <BlurText
              className="hero-copy"
              text="Disciplined diagnostics, transparent recommendations, and meticulous auto care for drivers who expect the work to be explained clearly and completed correctly."
              delay={45}
            />
            <div className="hero-actions">
             
              <a className="button button-secondary button-large" href={PHONE_LINK}>
                <BlurText as="span" text={`Call ${PHONE_DISPLAY}`} delay={80} />
              </a>
            </div>

            <div className="hero-proof" aria-label="Shop highlights">
              <div>
                <BlurText
                  as="span"
                  className="hero-proof-label"
                  text="Address"
                  delay={60}
                />
                <BlurText
                  as="strong"
                  className="hero-proof-value"
                  text={ADDRESS}
                  delay={45}
                />
              </div>
              <div>
                <BlurText
                  as="span"
                  className="hero-proof-label"
                  text="Hours"
                  delay={60}
                />
                <BlurText
                  as="strong"
                  className="hero-proof-value"
                  text={HOURS_DISPLAY}
                  delay={45}
                />
              </div>
              <div>
                <BlurText
                  as="span"
                  className="hero-proof-label"
                  text="Service Scope"
                  delay={60}
                />
                <BlurText
                  as="strong"
                  className="hero-proof-value"
                  text="Detailing, diagnostics, brakes, oil changes"
                  delay={45}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-header" data-reveal>
            <p className="section-kicker">Our Services</p>
            <h2>Clinical process. Mechanical confidence.</h2>
          </div>

          <div className="services-grid" data-reveal>
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-media">
                  <img src={service.image} alt={service.alt} loading="lazy" />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.meta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="service-copy" data-reveal>
            <p>
              MTR handles the complete care cycle: routine factory maintenance,
              computer diagnostics, brake service, general mechanical repair,
              oil changes, full auto detail, interior and exterior care,
              headlight restoration, hand wax, window tint removal, decal
              removal, scratch removal, and finish correction. Every visit is
              built around clear findings, practical options, and work that
              respects the vehicle.
            </p>
          
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-layout">
            <div className="about-copy" data-reveal>
              <p className="section-kicker">About the Company</p>
              <h2>Hands-on auto care with a builder's attention to detail.</h2>
              <p>
                MTR Auto Detail and Auto Care Services was shaped around a
                simple standard: inspect thoroughly, explain the work plainly,
                and treat each vehicle like a project worth doing right. The
                shop blends mechanical repair and finish care, so daily drivers
                and enthusiast cars can leave sharper, safer, and better sorted.
              </p>
              <p>
                That labor-of-love philosophy shows up in the small decisions:
                checking the cause before replacing parts, protecting clean
                surfaces during service, and giving customers a direct path
                from first concern to confirmed repair.
              </p>
             
            </div>

            <div className="about-image" data-reveal>
              <img
                src={asset('about-mechanic.jpg')}
                alt="Mechanic using a socket wrench on an engine assembly"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section merch-section" id="store">
          <div className="section-header" data-reveal>
            <p className="section-kicker">Shop Support</p>
            <h2>Helpful service guidance before the repair begins.</h2>
          </div>

          <div className="merch-grid" data-reveal>
            {shopHighlights.map((item) => (
              <article className="merch-card" key={item.name}>
                <div className="merch-media">
                  <img src={item.image} alt={item.alt} loading="lazy" />
                </div>
                <div className="merch-content">
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="visit">
          <div className="contact-layout" data-reveal>
            <div className="visit-panel">
              <p className="section-kicker">Visit Us</p>
              <h2>MTR Auto Detail and Auto Care Services.</h2>
              <dl className="visit-details">
                <div>
                  <dt>Address</dt>
                  <dd>{ADDRESS}</dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>
                    <div className="hours-list" aria-label="Business hours">
                      {BUSINESS_HOURS.map((item) => (
                        <div className="hours-row" key={item.days}>
                          <span>{item.days}</span>
                          <strong>{item.hours}</strong>
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={PHONE_LINK}>{PHONE_DISPLAY}</a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="form-panel" id="contact">
              <p className="section-kicker">Contact</p>
              <h2>Call or open the local listing before you come in.</h2>
              <p className="contact-copy">
                The shop is listed as an auto detailing service, auto repair
                shop, and repair service at 133 River Dr in Garfield.
              </p>
              <div className="contact-actions">
                <a className="button button-primary" href={PHONE_LINK}>
                  Call {PHONE_DISPLAY}
                </a>
                <a
                  className="button button-secondary"
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Maps
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span>MTR</span>
          <p>Auto Detail & Auto Care Services</p>
        </div>
        <div className="footer-grid">
          <nav aria-label="Footer links">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#visit">Visit Us</a>
            <a href="#contact">Contact</a>
          </nav>
          <p>{ADDRESS}</p>
          <p>
            <a href={PHONE_LINK}>{PHONE_DISPLAY}</a> | {HOURS_DISPLAY}
          </p>
          <p>
            No mobile information will be shared with third parties or
            affiliates for marketing or promotional purposes. Text messaging
            originator opt-in data and consent will not be shared with any third
            parties.
          </p>
        </div>
      </footer>

     
    </div>
  )
}

export default App
