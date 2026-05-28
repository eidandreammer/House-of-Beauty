import { useEffect } from 'react'
import './App.css'

const PHONE_DISPLAY = '(973) 246-5597'
const PHONE_LINK = 'tel:+19732465597'
const EMAIL = 'info@mtr-autoservices.com'
const BOOKING_TARGET = '#contact'

const asset = (fileName) => `/images/${fileName}`

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

const merchItems = [
  {
    name: 'Technical Work Shirt',
    note: 'Structured cotton blend',
    image: asset('shirt.jpg'),
    alt: 'Minimal black technical shirt displayed on a white background',
  },
  {
    name: 'Shop Cap',
    note: 'Low-profile daily driver fit',
    image: asset('cap.jpg'),
    alt: 'Minimal cap photographed against a clean background',
  },
  {
    name: 'Detail Kit',
    note: 'Microfiber and finish-care essentials',
    image: asset('detail-kit.jpg'),
    alt: 'Detailing tool polishing a glossy vehicle surface',
  },
]

function App() {
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

  const handleServiceRequest = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const name = data.get('fullName') || 'Website visitor'
    const subject = `Service request from ${name}`
    const body = [
      `Full name: ${data.get('fullName') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Preferred service: ${data.get('service') || ''}`,
      '',
      'Message / vehicle info:',
      data.get('message') || '',
    ].join('\n')

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    form.reset()
  }

  return (
    <div className="site-shell">
      <header className="site-header" aria-label="Primary navigation">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="MTR Auto Services home">
            <span className="brand-mark">MTR</span>
            <span className="brand-copy">
              Auto Detail
              <span>Auto Care Services</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Site sections">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#visit">Visit Us</a>
            <a href="#contact">Contact</a>
          </nav>

          
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <img
            className="hero-bg"
            src={asset('hero-bay.jpg')}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <div className="hero-content">
            <p className="eyebrow" data-reveal>
              Garfield, NJ precision auto care
            </p>
            <h1 className="hero-title" data-reveal>
              <span>DIAGNOSE</span>
              <span className="hero-separator" aria-hidden="true">
                •
              </span>
              <span>REPAIR</span>
              <span className="hero-separator" aria-hidden="true">
                •
              </span>
              <span>PERFORMANCE</span>
            </h1>
            <p className="hero-copy" data-reveal>
              Disciplined diagnostics, transparent recommendations, and
              meticulous auto care for drivers who expect the work to be
              explained clearly and completed correctly.
            </p>
            <div className="hero-actions" data-reveal>
             
              <a className="button button-secondary button-large" href={PHONE_LINK}>
                Call {PHONE_DISPLAY}
              </a>
            </div>

            <div className="hero-proof" data-reveal aria-label="Shop highlights">
              <div>
                <span>Address</span>
                <strong>133 River Dr, Garfield</strong>
              </div>
              <div>
                <span>Hours</span>
                <strong>Mon-Fri 8am-6pm</strong>
              </div>
              <div>
                <span>Service Scope</span>
                <strong>Detailing, diagnostics, brakes</strong>
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
              full detailing, headlight restoration, hand wax, decal removal,
              scratch removal, and finish correction. Every visit is built
              around clear findings, practical options, and work that respects
              the vehicle.
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
            <p className="section-kicker">MTR Goods</p>
            <h2>Limited shop identity pieces, coming soon.</h2>
          </div>

          <div className="merch-grid" data-reveal>
            {merchItems.map((item) => (
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
          <p>133 River Dr, Garfield, NJ 07026</p>
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
