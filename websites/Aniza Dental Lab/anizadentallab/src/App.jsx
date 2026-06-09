import { useState } from 'react'
import './App.css'

const business = {
  name: 'Consultori Aniza M Dental Lab',
  shortName: 'Aniza M Dental Lab',
  address: '462 Hamilton Pl, Hackensack, NJ 07601',
  phone: '(201) 342-6466',
  phoneHref: '+12013426466',
  email: 'Email to be added',
  hours: [
    ['Monday', '8:00 AM - 5:00 PM'],
    ['Tuesday', '8:00 AM - 5:00 PM'],
    ['Wednesday', '8:00 AM - 5:00 PM'],
    ['Thursday', '8:00 AM - 5:00 PM'],
    ['Friday', '8:00 AM - 5:00 PM'],
    ['Saturday', 'Closed'],
    ['Sunday', 'Closed'],
  ],
}

const navLinks = [
  ['About Us', '#about'],
  ['For Patients', '#patients'],
  ['Gallery', '#gallery'],
  ['Contact Us', '#contact'],
]

const services = [
  {
    title: 'General Dentistry',
    text: 'Cleanings, checkups, fillings, and preventative care for confident everyday oral health.',
    icon: 'spark',
  },
  {
    title: 'In-House Prosthodontics',
    text: 'Custom crowns, bridges, and implant restorations coordinated directly with the lab.',
    icon: 'crown',
  },
  {
    title: 'Cosmetic Makeovers',
    text: 'Porcelain veneers, cosmetic bonding, and professional whitening planned around your natural smile.',
    icon: 'smile',
  },
  {
    title: 'Advanced Lab Services',
    text: 'Digital smile design, shade matching, and rapid restorations with technician-level precision.',
    icon: 'scan',
  },
]

const values = [
  {
    title: 'Lab-Direct Precision',
    text: 'Because we are an in-house dental lab, crowns, veneers, and prosthetics can be custom-crafted on-site for a refined fit and faster turnaround.',
    icon: 'measure',
  },
  {
    title: 'Patient-Centered Care',
    text: 'Your comfort is the priority. Visits are designed to feel welcoming, clear, and tailored to your oral health goals.',
    icon: 'heart',
  },
  {
    title: 'Advanced Cosmetic Artistry',
    text: 'Modern dental science and careful aesthetic technique work together to enhance your natural smile.',
    icon: 'palette',
  },
]

const galleryItems = [
  {
    label: 'Shade matching',
    title: 'Precision ceramic detailing',
    image: '/images/lab-crowns.jpg',
  },
  {
    label: 'Consultation',
    title: 'Clear treatment conversations',
    image: '/images/patient-consult.jpg',
  },
  {
    label: 'Restorations',
    title: 'Crowns crafted for fit and finish',
    image: '/images/lab-crowns.jpg',
  },
]

const reviewCards = [
  {
    title: 'Google review feed ready',
    text: 'Connect the verified Google Business Profile to display live patient reviews here.',
  },
  {
    title: 'Showcase trusted outcomes',
    text: 'Use this slider for real feedback about comfort, restoration quality, and appointment experience.',
  },
  {
    title: 'Keep proof current',
    text: 'The layout is prepared for a star rating, reviewer name, and short quote once reviews are available.',
  },
]

function Icon({ name }) {
  const icons = {
    spark: (
      <>
        <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
        <path d="M19 15l.9 2.6L22 18.5l-2.1.9L19 22l-.9-2.6-2.1-.9 2.1-.9L19 15Z" />
      </>
    ),
    crown: (
      <>
        <path d="M4 8l4 4 4-7 4 7 4-4-1.5 10h-13L4 8Z" />
        <path d="M6.5 21h11" />
      </>
    ),
    smile: (
      <>
        <path d="M8 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 15c1.1 1.3 2.4 2 4 2s2.9-.7 4-2" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </>
    ),
    scan: (
      <>
        <path d="M7 3H5a2 2 0 0 0-2 2v2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 12h10" />
      </>
    ),
    measure: (
      <>
        <path d="M4 20 20 4" />
        <path d="m14 4 6 6" />
        <path d="m4 14 6 6" />
        <path d="m9 15 2 2" />
        <path d="m13 11 2 2" />
      </>
    ),
    heart: (
      <path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 8.8 1.4Z" />
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.3-3.5 1.4 1.4 0 0 1 .9-2.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" />
        <path d="M7.5 11h.01" />
        <path d="M9.5 7.5h.01" />
        <path d="M14 7.5h.01" />
      </>
    ),
    phone: <path d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.5 0 .9.4.9.9V20c0 .5-.4 1-.9 1C10.8 21 3 13.2 3 3.4c0-.5.5-.9 1-.9h3.6c.5 0 .9.4.9.9 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2Z" />,
    map: (
      <>
        <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
        <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    mail: (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormStatus('Request captured in this prototype. Connect the form to email or CRM before launch.')
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="top-bar">
          <div className="top-bar__inner">
            <a href={`tel:${business.phoneHref}`} className="top-link">
              <Icon name="phone" />
              {business.phone}
            </a>
            <a href="#appointment" className="top-link top-link--accent">
              Schedule Appointment
            </a>
          </div>
        </div>

        <nav className="navbar" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label={`${business.name} home`}>
            <span className="brand-mark">AM</span>
            <span>
              <strong>Aniza M</strong>
              <small>Dental Lab</small>
            </span>
          </a>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name="menu" />
            <span className="sr-only">Toggle menu</span>
          </button>

          <div className={`nav-menu ${menuOpen ? 'is-open' : ''}`} id="primary-menu">
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About Us
            </a>
            <a className="mobile-services-link" href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <div className="dropdown">
              <button type="button" className="dropdown-trigger">
                Services
                <span aria-hidden="true">v</span>
              </button>
              <div className="dropdown-menu" aria-label="Services submenu">
                {services.map((service) => (
                  <a key={service.title} href="#services" onClick={() => setMenuOpen(false)}>
                    {service.title}
                  </a>
                ))}
              </div>
            </div>
            {navLinks.slice(1).map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a className="button button--nav" href="#appointment" onClick={() => setMenuOpen(false)}>
              Book Appointment
            </a>
          </div>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-media" aria-hidden="true">
            <img src="/images/lab-crowns.jpg" alt="" />
            <img src="/images/patient-consult.jpg" alt="" />
          </div>
          <div className="hero-content">
            <p className="eyebrow">Lab precision. Patient-first dentistry.</p>
            <h1>
              <span>Crafting Perfect</span>
              <span>Smiles from the</span>
              <span>Inside Out.</span>
            </h1>
            <p className="hero-copy">
              Where state-of-the-art laboratory precision meets compassionate,
              personalized dental care.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#appointment">
                Schedule Your Consultation
              </a>
              <a className="button button--ghost" href={`tel:${business.phoneHref}`}>
                Call {business.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="section intro-section" id="about">
          <div className="section-heading">
            <p className="eyebrow">A modern consultorio with lab craft at its core</p>
            <h2>High-touch dental care backed by hands-on restoration expertise.</h2>
          </div>
          <div className="intro-copy">
            <p>
              {business.name} brings together the detail-oriented discipline of a dental
              laboratory with the approachable experience patients expect from a trusted
              clinic. From routine visits to custom restorations, the focus is fit,
              comfort, and a smile that feels naturally yours.
            </p>
            <div className="quick-facts" aria-label="Practice highlights">
              <span>Custom crowns</span>
              <span>Cosmetic dentistry</span>
              <span>Digital planning</span>
            </div>
          </div>
        </section>

        <section className="section value-section" aria-labelledby="value-title">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">Why choose us</p>
            <h2 id="value-title">A more connected path from consultation to final smile.</h2>
          </div>
          <div className="value-grid">
            {values.map((value) => (
              <article className="feature-card" key={value.title}>
                <div className="icon-wrap">
                  <Icon name={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow">Core services</p>
            <h2 id="services-title">Comprehensive care for healthier, more confident smiles.</h2>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="icon-wrap">
                  <Icon name={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#appointment">Learn More</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section patient-section" id="patients">
          <div className="patient-panel">
            <div>
              <p className="eyebrow">For patients</p>
              <h2>What to expect at your visit.</h2>
              <p>
                Your consultation starts with a clear conversation about your goals, oral
                health, timeline, and comfort. When restorative work is needed, lab and
                clinical planning stay closely coordinated so the final result feels
                personal, not generic.
              </p>
            </div>
            <ul className="patient-list">
              <li>Comfort-first appointments with plain-language guidance.</li>
              <li>Cosmetic planning that respects your natural tooth shape and shade.</li>
              <li>Direct restoration coordination for crowns, bridges, and prosthetics.</li>
            </ul>
          </div>
        </section>

        <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">Gallery</p>
            <h2 id="gallery-title">A closer look at the craft behind the smile.</h2>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <figure className="gallery-item" key={`${item.label}-${item.title}`}>
                <img src={item.image} alt={item.title} />
                <figcaption>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section proof-section" aria-labelledby="proof-title">
          <div className="proof-copy">
            <p className="eyebrow">Social proof & location</p>
            <h2 id="proof-title">Easy to find in Hackensack, ready for verified reviews.</h2>
            <p>
              Public listings show Aniza M Dental Lab at {business.address}. A live Google
              rating was not available from reliable public sources, so this section is
              prepared for verified Google review content once the profile is connected.
            </p>
            <div className="rating-box">
              <span>Google rating</span>
              <strong>Pending</strong>
              <small>Use verified profile data before launch</small>
            </div>
          </div>
          <div className="review-track" aria-label="Review display placeholders">
            {reviewCards.map((card) => (
              <article className="review-card" key={card.title}>
                <div className="stars" aria-hidden="true">
                  *****
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
          <div className="map-frame">
            <iframe
              title={`Map to ${business.name}`}
              src="https://www.google.com/maps?q=462%20Hamilton%20Pl%2C%20Hackensack%2C%20NJ%2007601&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="section appointment-section" id="appointment">
          <div className="appointment-copy">
            <p className="eyebrow">Schedule appointment</p>
            <h2>Take the First Step Toward Your Perfect Smile</h2>
            <p>
              Tell us what type of care you need. The team can follow up with next steps,
              availability, and any information to bring to your first visit.
            </p>
          </div>
          <form className="appointment-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                First Name
                <input name="firstName" type="text" autoComplete="given-name" required />
              </label>
              <label>
                Last Name
                <input name="lastName" type="text" autoComplete="family-name" required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone Number
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Email Address
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <label>
              Type of Care Needed
              <select name="careType" defaultValue="" required>
                <option value="" disabled>
                  Select a service
                </option>
                <option>General Dentistry</option>
                <option>Cosmetic Dentistry</option>
                <option>Lab/Prosthetic Consultation</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="5"
                placeholder="Share symptoms, goals, timing, or restoration needs."
              />
            </label>
            <button className="button button--primary" type="submit">
              Request Appointment
            </button>
            <p className="form-status" aria-live="polite">
              {formStatus}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#top">
            <span className="brand-mark">AM</span>
            <span>
              <strong>Aniza M</strong>
              <small>Dental Lab</small>
            </span>
          </a>
          <p>
            Precision-crafted restorations and compassionate dental consultations for
            patients who want clarity, comfort, and lasting confidence.
          </p>
          <div className="social-links" aria-label="Social media links">
            <a href="#top" aria-label="Instagram">
              Ig
            </a>
            <a href="#top" aria-label="Facebook">
              Fb
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h2>Quick Links</h2>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#patients">Patient Info</a>
          <a href="#appointment">Book Appointment</a>
        </div>

        <div className="footer-contact">
          <h2>Contact Details</h2>
          <a href={`tel:${business.phoneHref}`}>
            <Icon name="phone" />
            {business.phone}
          </a>
          <span>
            <Icon name="mail" />
            {business.email}
          </span>
          <span>
            <Icon name="map" />
            {business.address}
          </span>
          <table>
            <caption>Business Hours</caption>
            <tbody>
              {business.hours.map(([day, hours]) => (
                <tr key={day}>
                  <th scope="row">{day}</th>
                  <td>{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </footer>
    </div>
  )
}

export default App
