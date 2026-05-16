import { useEffect, useRef, useState } from 'react'

const salonAddress = '423 Boulevard, Hasbrouck Heights, NJ 07604'
const salonMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonAddress)}`
const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Find salon', href: salonMapHref, external: true },
  { label: 'Contact', href: '#contact' },
]
const contactPhoneNumber = '201-393-0944'
const contactPhoneHref = 'tel:2013930944'
const contactEmail = 'info@wendyossersbeauty.com'
const footerMenuLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'FAQ', href: '#contact' },
  { label: 'Online Booking', href: contactPhoneHref },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Accessibility Notice', href: '#contact' },
]
const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', platform: 'facebook' },
  { label: 'Instagram', href: 'https://www.instagram.com/', platform: 'instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/', platform: 'youtube' },
  { label: 'TikTok', href: 'https://www.tiktok.com/', platform: 'tiktok' },
]

const heroBackgroundPath = '/imgs/HeroSectionBackground.jpg'

const services = [
  {
    code: 'HS',
    title: 'Haircutting & Styling',
    description:
      'Precision cuts, polished blowouts, and signature styling designed around your face shape and daily routine.',
  },
  {
    code: 'BA',
    title: 'Balayage',
    description:
      'Soft, dimensional balayage for luminous ribbons of color and effortless grow-out.',
  },
  {
    code: 'CC',
    title: 'Corrective Color',
    description:
      'Thoughtful color correction that restores tone, balance, and confidence without cutting corners.',
  },
  {
    code: 'HL',
    title: 'Highlighting',
    description:
      'Custom highlight placement for brightening, blending, and a refined multi-tonal finish.',
  },
  {
    code: 'KT',
    title: 'Keratin Treatments',
    description:
      'Smoothing treatments that reduce frizz, boost shine, and make styling more manageable.',
  },
  {
    code: 'BM',
    title: 'Bridal Services & Makeup',
    description:
      'Event-ready beauty for weddings, portraits, and special occasions with salon polish.',
  },
  {
    code: 'HR',
    title: 'Hair Relaxers',
    description:
      'Texture-smoothing services handled with care, consultation, and a healthy-hair mindset.',
  },
  {
    code: 'HE',
    title: 'Hair Extensions',
    description:
      'Length, fullness, and transformation services tailored for seamless movement and blend.',
  },
]

const galleryCards = [
  {
    eyebrow: 'Look 01',
    title: 'Dimensional color with a glossy, editorial finish.',
    description:
      'A gallery space ready for balayage reveals, lived-in blonde work, and polished transformations.',
    gradient: 'from-stone-200 via-white to-amber-100',
    layout: 'lg:col-span-2',
  },
  {
    eyebrow: 'Look 02',
    title: 'Bridal beauty with soft structure and modern elegance.',
    description:
      'Ideal for updos, makeup highlights, and close-up bridal preparation imagery.',
    gradient: 'from-[#efe3cf] via-white to-stone-100',
  },
  {
    eyebrow: 'Look 03',
    title: 'Texture-aware styling for every hair type and finish.',
    description:
      'A refined placeholder for curls, smoothing treatments, and silk-press style results.',
    gradient: 'from-stone-100 via-[#f8f4ed] to-[#ead5a6]',
  },
]

const features = [
  {
    title: 'Bilingual consultations',
    description:
      'Clear, welcoming communication in English and Spanish from first inquiry to final styling advice.',
  },
  {
    title: 'All textures welcome',
    description:
      'Services are tailored for straight, wavy, curly, coily, relaxed, and extension-enhanced hair.',
  },
  {
    title: 'Luxury with intention',
    description:
      'Every appointment is personalized around maintenance goals, lifestyle, and the finish you want.',
  },
  {
    title: 'Corrective expertise',
    description:
      'Thoughtful consultation and restorative color planning for guests ready to refine or reset their look.',
  },
]

const hours = [
  'Tuesday - Friday: 9:00 AM - 7:00 PM',
  'Saturday: 8:00 AM - 6:00 PM',
  'Sunday - Monday: By appointment',
]
const footerInfoColumns = [
  {
    title: 'HAUS OF BEAUTY LOCATION:',
    items: [
      { text: salonAddress, href: salonMapHref, external: true },
      { text: `+1 ${contactPhoneNumber}`, href: contactPhoneHref, underline: true },
      ...hours.map((slot) => ({ text: slot.replace('AM', 'am').replace('PM', 'pm') })),
    ],
  },
  {
    title: 'SALON HOURS & BOOKINGS:',
    items: [
      { text: 'Appointments, bridal trials, and consultations' },
      { text: `+1 ${contactPhoneNumber}`, href: contactPhoneHref, underline: true },
      { text: 'Walk-ins: Limited availability' },
      { text: 'Color corrections: Consultation required' },
      { text: 'Bilingual service: English / Spanish' },
    ],
  },
]

function App() {
  const heroRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeroExpanded, setIsHeroExpanded] = useState(true)

  const handleNavLinkClick = (event, link) => {
    if (link.external) {
      event.preventDefault()
      const newWindow = window.open(link.href, '_blank', 'noopener,noreferrer')

      if (newWindow) {
        newWindow.opener = null
      }
    }

    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    const heroElement = heroRef.current

    if (!heroElement || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroExpanded(entry.isIntersecting && entry.intersectionRatio >= 0.58)
      },
      {
        threshold: [0, 0.58, 1],
      }
    )

    observer.observe(heroElement)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl ${
          isHeroExpanded ? 'site-header--hero' : 'site-header--compact'
        }`}
      >
        <div className="site-header__inner mx-auto flex max-w-[1460px] items-center justify-between gap-4 px-5 lg:px-7 xl:px-8">
          <HeroWordmark />

          <nav className="site-header__nav hidden items-center gap-8 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavLinkClick(event, link)}
                className="whitespace-nowrap text-[16px] font-semibold tracking-[0.04em] text-slate-900 transition hover:text-brand-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions hidden items-center gap-3 xl:flex">
            <a
              href="tel:2013930944"
              className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.1em] text-slate-500 transition hover:text-slate-900"
            >
              201-393-0944
            </a>
           
            <a
              href="tel:2013930944"
              className="whitespace-nowrap rounded-full border border-slate-900 px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.12em] text-slate-900 transition duration-300 hover:bg-slate-900 hover:text-white"
            >
              Book Appointment
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="site-header__menu-button inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-slate-900 transition hover:border-slate-900 xl:hidden"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${
                  isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${
                  isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white xl:hidden">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-6 py-7 lg:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavLinkClick(event, link)}
                  className="text-base font-semibold uppercase tracking-[0.24em] text-slate-900 transition hover:text-brand-gold"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 border-t border-slate-200 pt-5">
                
                <a
                  href="tel:2013930944"
                  className="rounded-full bg-slate-900 px-6 py-4 text-center text-base font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-white text-slate-900">
        <div className="hero-backdrop-fade absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroBackgroundPath})`,
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.92)_34%,rgba(0,0,0,0.76)_56%,rgba(0,0,0,0.38)_80%,rgba(0,0,0,0.1)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(0,0,0,0.24),transparent_52%)]" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-end px-6 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-36">
          <div className="max-w-[560px]">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-gold">
              Luxury Hair Studio
            </p>
            <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Refined Hair, Elevated Beauty
            </h1>
            <p className="mt-6 text-xl leading-9 text-white/82">
              Wendy Ossers Haus of Beauty delivers personalized color, bridal glam,
              extensions, and styling with a polished editorial finish.
            </p>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Bilingual consultations, texture-aware care, and an appointment experience
              designed around your look and routine.
            </p>

            <a
              href="tel:2013930944"
              className="mt-9 inline-flex items-center justify-center rounded-[0.9rem] bg-white px-9 py-4 text-[15px] font-extrabold uppercase tracking-[0.24em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>

      <main>
        <section id="services" className="relative bg-white py-24 sm:py-28">
          <div className="absolute inset-x-0 top-0 h-20 bg-white" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionBadge light>Featured Services</SectionBadge>
              <h2 className="mt-6 max-w-2xl text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl">
                Boutique salon services with a modern, elevated finish.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                From custom cuts and luminous blonding to corrective color and bridal beauty,
                every service is structured for luxury, clarity, and results that last beyond
                the appointment.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group flex h-full flex-col rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
                >
                  <ServiceIcon code={service.code} />
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-slate-600">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    className="mt-auto pt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-charcoal transition duration-300 group-hover:translate-x-1 group-hover:text-brand-gold"
                  >
                    Learn More
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="bg-stone-100 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <SectionBadge light>Gallery Preview</SectionBadge>
                <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl">
                  Polished placeholders for color reveals, bridal prep, and finish work.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                A curated visual direction for luminous color, bridal softness, and texture-aware
                styling in an elevated editorial layout.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {galleryCards.map((card) => (
                <article
                  key={card.eyebrow}
                  className={`group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${card.layout ?? ''}`}
                >
                  <div
                    className={`relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${card.gradient} p-6`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),transparent_40%,rgba(15,23,42,0.08)_100%)]" />
                    <div className="absolute inset-y-0 left-[68%] hidden w-px bg-white/60 lg:block" />
                    <div className="absolute -top-10 right-6 h-36 w-36 rounded-full bg-white/50 blur-3xl" />
                    <div className="absolute bottom-10 left-8 h-28 w-28 rounded-full border border-white/70 bg-white/35 backdrop-blur-sm" />

                    <div className="relative">
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-600">
                        {card.eyebrow}
                      </p>
                    </div>

                    <div className="relative rounded-[1.6rem] border border-white/70 bg-white/70 p-5 backdrop-blur-md transition duration-300 group-hover:-translate-y-1">
                      <p className="font-display text-3xl leading-tight text-slate-900">
                        {card.title}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="relative overflow-hidden bg-brand-charcoal py-24 text-white sm:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(199,160,97,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_20%)]" />

          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div>
              <SectionBadge>About the Salon</SectionBadge>
              <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Personalized beauty for every texture, tone, and special moment.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Wendy Ossers Haus of Beauty is positioned as a high-end salon experience that
                stays warm and approachable. The space is designed to welcome a diverse clientele
                with bilingual guidance, attentive consultation, and styling that feels polished
                without losing individuality.
              </p>

              <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="font-script text-4xl text-brand-gold sm:text-5xl">Haus of Beauty</p>
                <p className="mt-3 font-display text-3xl leading-tight text-white">
                  Beautiful hair should feel intentional, effortless, and entirely your own.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-[1.6rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
                >
                  <div className="h-1 w-16 rounded-full bg-brand-gold" />
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-black py-[2.8rem] text-white sm:py-[3.2rem]">
        <div className="mx-auto max-w-[1540px] px-8 sm:px-12 lg:px-16">
          <div className="grid gap-x-16 gap-y-6 lg:items-center lg:grid-cols-[1fr_1fr_0.9fr] xl:gap-x-24">
            {footerInfoColumns.map((column) => (
              <div key={column.title} className="max-w-[360px]">
                <p className="text-[14px] font-medium uppercase tracking-[0.01em] text-white">
                  {column.title}
                </p>
                <div className="mt-3 space-y-1 text-[16px] leading-[1.65] text-white sm:text-[17px]">
                  {column.items.map((item) => (
                    <FooterInfoLine key={`${column.title}-${item.text}`} item={item} />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col justify-center lg:justify-self-end lg:pl-6">
              <nav className="space-y-2 text-[16px] leading-[1.65] sm:text-[17px]">
                {footerMenuLinks.map((link) => (
                  <p key={link.label}>
                    <a
                      href={link.href}
                      onClick={(event) => handleNavLinkClick(event, link)}
                      className="underline decoration-[1px] underline-offset-[4px] transition hover:text-brand-gold"
                    >
                      {link.label}
                    </a>
                  </p>
                ))}
              </nav>

              <div className="mt-6 sm:mt-9">
                <p className="text-[16px] leading-[1.7] text-white sm:text-[17px]">
                  Submit all inquiries to:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="underline decoration-[1px] underline-offset-[4px] transition hover:text-brand-gold"
                  >
                    {contactEmail}
                  </a>
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5 sm:gap-7">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="text-brand-gold transition hover:text-brand-gold-soft"
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroWordmark() {
  return (
    <a href="#" className="site-header__wordmark shrink-0">
      <p className="site-header__wordmark-title text-[1.95rem] font-black uppercase tracking-[0.22em] text-slate-950 sm:text-[2.45rem]">
        Wendy Ossers
      </p>
      <p className="site-header__wordmark-subtitle mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.52em] text-slate-500 sm:text-[0.8rem]">
        Haus of Beauty
      </p>
    </a>
  )
}

function FooterInfoLine({ item }) {
  if (item.href) {
    const linkProps = item.external
      ? { target: '_blank', rel: 'noreferrer' }
      : {}

    return (
      <p>
        <a
          href={item.href}
          {...linkProps}
          className={`transition hover:text-brand-gold ${
            item.underline ? 'underline decoration-[1px] underline-offset-[4px]' : ''
          }`}
        >
          {item.text}
        </a>
      </p>
    )
  }

  return (
    <p>{item.text}</p>
  )
}

function SectionBadge({ children, light = false }) {
  const classes = light
    ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-charcoal'
    : 'border-brand-gold/30 bg-white/5 text-brand-gold'

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] ${classes}`}
    >
      {children}
    </span>
  )
}

function ServiceIcon({ code }) {
  return (
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.1rem] border border-brand-gold/20 bg-brand-gold/10 text-lg font-semibold tracking-[0.18em] text-brand-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      {code}
    </div>
  )
}

function SocialIcon({ platform }) {
  const className = 'h-[2rem] w-[2rem] fill-current'

  switch (platform) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.9A3.6 3.6 0 0 0 3.9 7.5v9a3.6 3.6 0 0 0 3.6 3.6h9a3.6 3.6 0 0 0 3.6-3.6v-9a3.6 3.6 0 0 0-3.6-3.6h-9Zm9.68 1.43a1.14 1.14 0 1 1 0 2.28 1.14 1.14 0 0 1 0-2.28ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9A3.1 3.1 0 1 0 12 15.1 3.1 3.1 0 0 0 12 8.9Z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path d="M13.3 22v-8.2h2.78l.42-3.22H13.3V8.5c0-.93.26-1.57 1.6-1.57h1.71V4.04A23.8 23.8 0 0 0 14.12 4C11.66 4 10 5.5 10 8.24v2.32H7.2v3.22H10V22h3.3Z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.48.49a2.98 2.98 0 0 0-2.1 2.1A31.1 31.1 0 0 0 2 12a31.1 31.1 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.1c1.88.49 7.48.49 7.48.49s5.6 0 7.48-.49a2.98 2.98 0 0 0 2.1-2.1A31.1 31.1 0 0 0 22 12a31.1 31.1 0 0 0-.42-4.81ZM10.2 15.1V8.9L15.6 12l-5.4 3.1Z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path d="M14.78 3c.28 2.32 1.56 3.9 3.83 4.05v2.78a6.65 6.65 0 0 1-3.74-1.18v5.21a5.43 5.43 0 1 1-5.43-5.43c.34 0 .68.03 1 .1v2.92a2.5 2.5 0 0 0-1-.2 2.6 2.6 0 1 0 2.6 2.6V3h2.74Z" />
        </svg>
      )
    default:
      return null
  }
}

export default App
