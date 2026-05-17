import { useEffect, useRef, useState } from 'react'

const bookingSectionId = 'booking'
const bookingSectionHref = `#${bookingSectionId}`
const salonTimeZone = 'America/New_York'
const appointmentApiPath = import.meta.env.VITE_APPOINTMENTS_API_URL?.trim() || '/api/appointments'
const onlineBookingLeadTimeMinutes = 30
const onlineBookingSlotIntervalMinutes = 30

const salonDateTimePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: salonTimeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  hourCycle: 'h23',
})

const salonReadableDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: salonTimeZone,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
})

const utcReadableDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

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
  { label: 'Online Booking', href: bookingSectionHref },
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
    title: 'Haircutting & Styling',
    duration: 60,
    description: 'Precision cuts and styling tailored to your face shape and daily routine.',
  },
  {
    title: 'Balayage',
    duration: 180,
    description: 'Soft hand-painted color for a bright, dimensional, low-maintenance finish.',
  },
  {
    title: 'Corrective Color',
    duration: 240,
    description: 'Thoughtful color correction to restore tone, balance, and confidence.',
  },
  {
    title: 'Highlighting',
    duration: 150,
    description: 'Custom lightening placement for brightness, blend, and polished dimension.',
  },
  {
    title: 'Keratin Treatments',
    duration: 120,
    description: 'Smoothing treatment that helps reduce frizz and improve shine.',
  },
  {
    title: 'Bridal Services & Makeup',
    duration: 180,
    description: 'Complete event-ready hair and makeup for weddings and special occasions.',
  },
  {
    title: 'Hair Relaxers',
    duration: 120,
    description: 'Texture-smoothing service performed with care and a healthy-hair focus.',
  },
  {
    title: 'Hair Extensions',
    duration: 210,
    description: 'Length and fullness enhancements designed for a seamless natural blend.',
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
  const bookingSectionRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeroExpanded, setIsHeroExpanded] = useState(true)
  const [bookingForm, setBookingForm] = useState(() => createInitialBookingForm())
  const [bookingRequestState, setBookingRequestState] = useState({
    type: 'idle',
    message: '',
  })

  const selectedService =
    services.find((service) => service.title === bookingForm.serviceName) ?? services[0]
  const minimumBookingDate = getCurrentSalonDateString()
  const availability = buildOnlineBookingAvailability(
    bookingForm.appointmentDate,
    selectedService.duration
  )
  const hasActiveAppointmentTime = availability.slots.some(
    (slot) => slot.value === bookingForm.appointmentTime
  )
  const activeAppointmentTime = hasActiveAppointmentTime ? bookingForm.appointmentTime : ''
  const bookingPreview = buildBookingPreview(
    bookingForm.appointmentDate,
    activeAppointmentTime,
    selectedService.duration
  )
  const bookingInputClassName =
    'mt-2 w-full rounded-[5px] border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200/70'
  const bookingSelectClassName = `${bookingInputClassName} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`

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

  const handleBookingFieldChange = (event) => {
    const { name, value } = event.target

    setBookingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setBookingRequestState((currentState) =>
      currentState.type === 'error' ? { type: 'idle', message: '' } : currentState
    )
  }

  const handleServiceSelection = (serviceTitle, shouldScroll = false) => {
    setBookingForm((currentForm) => ({
      ...currentForm,
      serviceName: serviceTitle,
    }))

    setBookingRequestState((currentState) =>
      currentState.type === 'error' ? { type: 'idle', message: '' } : currentState
    )

    if (shouldScroll) {
      bookingSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()

    if (!bookingForm.customerName.trim()) {
      setBookingRequestState({
        type: 'error',
        message: 'Please enter the guest name before booking.',
      })
      return
    }

    if (!bookingForm.appointmentDate) {
      setBookingRequestState({
        type: 'error',
        message: 'Please choose an appointment date.',
      })
      return
    }

    if (bookingForm.appointmentDate < minimumBookingDate) {
      setBookingRequestState({
        type: 'error',
        message: 'Please choose a date that is today or later in Eastern Time.',
      })
      return
    }

    if (availability.isClosedDay) {
      setBookingRequestState({
        type: 'error',
        message:
          'Online booking is unavailable on Sunday and Monday. Please call the salon to request that visit.',
      })
      return
    }

    if (!activeAppointmentTime) {
      setBookingRequestState({
        type: 'error',
        message: 'Please select an available start time.',
      })
      return
    }

    if (!availability.slots.some((slot) => slot.value === activeAppointmentTime)) {
      setBookingRequestState({
        type: 'error',
        message: 'That start time is no longer available in the online booking window.',
      })
      return
    }

    let startTime

    try {
      startTime = buildSalonStartTimestamp(
        bookingForm.appointmentDate,
        activeAppointmentTime
      )
    } catch (error) {
      setBookingRequestState({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The selected appointment time could not be converted to salon time.',
      })
      return
    }

    setBookingRequestState({
      type: 'loading',
      message: 'Securing your appointment now.',
    })

    try {
      const response = await fetch(appointmentApiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: bookingForm.customerName.trim(),
          email: bookingForm.email.trim(),
          phone: bookingForm.phone.trim(),
          serviceName: selectedService.title,
          startTime,
          duration: selectedService.duration,
        }),
      })

      let payload = null

      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to create the appointment right now.')
      }

      if (!payload?.data) {
        throw new Error('The booking service returned an empty response.')
      }

      setBookingRequestState({
        type: 'success',
        message: 'Appointment confirmed. A conflict-safe booking has been created successfully.',
      })
      setBookingForm((currentForm) => ({
        ...currentForm,
        appointmentDate: '',
        appointmentTime: '',
      }))
    } catch (error) {
      const message =
        error instanceof TypeError
          ? 'The booking API is unreachable. Start the server or point VITE_APPOINTMENTS_API_URL to a live endpoint.'
          : error instanceof Error
            ? error.message
            : 'Unable to create the appointment right now.'

      setBookingRequestState({
        type: 'error',
        message,
      })
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
              href={contactPhoneHref}
              className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.1em] text-slate-500 transition hover:text-slate-900"
            >
              {contactPhoneNumber}
            </a>

            <a
              href={bookingSectionHref}
              className="whitespace-nowrap rounded-[5px] border border-slate-900 px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.12em] text-slate-900 transition duration-300 hover:bg-slate-900 hover:text-white"
            >
              Book Appointment
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="site-header__menu-button inline-flex h-12 w-12 items-center justify-center rounded-[5px] border border-slate-300 text-slate-900 transition hover:border-slate-900 xl:hidden"
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
                  href={bookingSectionHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-[5px] bg-slate-900 px-6 py-4 text-center text-base font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
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
              href={bookingSectionHref}
              className="mt-9 inline-flex items-center justify-center rounded-[5px] bg-white px-9 py-4 text-[15px] font-extrabold uppercase tracking-[0.24em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>

      <main>
        <section id="services" className="relative bg-white py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-slate-900 sm:text-5xl">
                Our Services
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const isSelected = selectedService.title === service.title

                return (
                  <article
                    key={service.title}
                    className={`flex h-full flex-col rounded-[5px] border p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition ${
                      isSelected
                        ? 'border-brand-gold/70 bg-brand-gold/5'
                        : 'border-white bg-white'
                    }`}
                  >
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-base text-slate-600">
                      {formatServiceDuration(service.duration)}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600">
                      {service.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleServiceSelection(service.title, true)}
                      className={`mt-6 inline-flex w-fit items-center justify-center rounded-[5px] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                        isSelected
                          ? 'bg-brand-gold text-brand-charcoal hover:bg-brand-gold-soft'
                          : 'bg-slate-900 text-white hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected for Booking' : 'Book This Service'}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section
          id={bookingSectionId}
          ref={bookingSectionRef}
          className="relative overflow-hidden bg-slate-100 py-24 sm:py-28"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />
          <div className="mx-auto w-full px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl xl:max-w-[75vw]">
              <div className="relative rounded-[5px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Online Form
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                      Create an appointment
                    </h3>
                  </div>
                  <p className="max-w-sm text-sm leading-6 text-slate-500">
                    Online slots follow salon hours only. Sunday and Monday requests should be
                    handled by phone.
                  </p>
                </div>

                <form
                  onSubmit={handleBookingSubmit}
                  className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.95fr)]"
                >
                  <div className="space-y-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <BookingField
                        label="Guest Name"
                        htmlFor="customerName"
                        input={
                          <input
                            id="customerName"
                            name="customerName"
                            type="text"
                            autoComplete="name"
                            value={bookingForm.customerName}
                            onChange={handleBookingFieldChange}
                            placeholder="Wendy Ossers Guest"
                            required
                            className={bookingInputClassName}
                          />
                        }
                      />
                      <BookingField
                        label="Phone"
                        htmlFor="phone"
                        input={
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={bookingForm.phone}
                            onChange={handleBookingFieldChange}
                            placeholder="+1 201 393 0944"
                            required
                            className={bookingInputClassName}
                          />
                        }
                      />
                    </div>

                    <BookingField
                      label="Email"
                      htmlFor="email"
                      input={
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={bookingForm.email}
                          onChange={handleBookingFieldChange}
                          placeholder="guest@example.com"
                          required
                          className={bookingInputClassName}
                        />
                      }
                    />

                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                          Service Selection
                        </p>
                        <span className="text-sm text-slate-500">
                          {formatServiceDuration(selectedService.duration)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {services.map((service) => {
                          const isActive = bookingForm.serviceName === service.title

                          return (
                            <button
                              key={service.title}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => handleServiceSelection(service.title)}
                              className={`rounded-[5px] border p-4 text-left transition ${
                                isActive
                                  ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.1)]'
                                  : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              <p
                                className={`text-base font-semibold tracking-[-0.02em] ${
                                  isActive ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {service.title}
                              </p>
                              <p
                                className={`mt-2 text-sm leading-6 ${
                                  isActive ? 'text-white/72' : 'text-slate-500'
                                }`}
                              >
                                {formatServiceDuration(service.duration)}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <BookingField
                        label="Appointment Date"
                        htmlFor="appointmentDate"
                        hint="Calendar is interpreted in Eastern Time."
                        input={
                          <input
                            id="appointmentDate"
                            name="appointmentDate"
                            type="date"
                            min={minimumBookingDate}
                            value={bookingForm.appointmentDate}
                            onChange={handleBookingFieldChange}
                            required
                            className={bookingInputClassName}
                          />
                        }
                      />
                      <BookingField
                        label="Start Time"
                        htmlFor="appointmentTime"
                        hint={availability.scheduleLabel || 'Choose a date first.'}
                        input={
                          <select
                            id="appointmentTime"
                            name="appointmentTime"
                            value={activeAppointmentTime}
                            onChange={handleBookingFieldChange}
                            required
                            disabled={!availability.slots.length}
                            className={bookingSelectClassName}
                          >
                            <option value="">
                              {availability.slots.length ? 'Select a start time' : 'No start times available'}
                            </option>
                            {availability.slots.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </select>
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 border-t border-slate-200 pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                    <div className="rounded-[5px] border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Availability Note
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{availability.notice}</p>
                    </div>

                    <div className="rounded-[5px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                            Appointment Summary
                          </p>
                          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                            {selectedService.title}
                          </p>
                        </div>
                        <span className="rounded-[5px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {formatServiceDuration(selectedService.duration)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <BookingStat label="Start" value={bookingPreview?.startLabel ?? 'Pending date and time'} />
                        <BookingStat label="End" value={bookingPreview?.endLabel ?? 'Calculated after selection'} />
                      </div>
                    </div>

                    {bookingRequestState.type !== 'idle' && (
                      <p
                        className={`rounded-[5px] border px-4 py-3 text-sm leading-6 ${
                          bookingRequestState.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : bookingRequestState.type === 'error'
                              ? 'border-rose-200 bg-rose-50 text-rose-700'
                              : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        {bookingRequestState.message}
                      </p>
                    )}

                    <div className="mt-auto rounded-[5px] border border-slate-200 bg-white p-5">
                      <p className="text-sm leading-6 text-slate-500">
                        By submitting, you are requesting a confirmed appointment tied to the
                        salon&apos;s exact Eastern Time schedule.
                      </p>
                      <button
                        type="submit"
                        disabled={bookingRequestState.type === 'loading'}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-[5px] bg-slate-950 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {bookingRequestState.type === 'loading'
                          ? 'Securing Appointment'
                          : 'Confirm Appointment'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
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

              <div className="mt-8 rounded-[5px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
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
                  className="rounded-[5px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
                >
                  <div className="h-1 w-16 rounded-[5px] bg-brand-gold" />
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

function createInitialBookingForm() {
  return {
    customerName: '',
    email: '',
    phone: '',
    serviceName: services[0].title,
    appointmentDate: '',
    appointmentTime: '',
  }
}

function buildOnlineBookingAvailability(dateString, serviceDurationMinutes) {
  if (!dateString) {
    return {
      isClosedDay: false,
      scheduleLabel: '',
      notice: 'Choose a date to reveal available online start times.',
      slots: [],
    }
  }

  const schedule = getOnlineBookingSchedule(dateString)

  if (!schedule) {
    return {
      isClosedDay: true,
      scheduleLabel: 'Sunday and Monday requests are handled by phone.',
      notice:
        'Online booking is unavailable on Sunday and Monday. Please call the salon for by-appointment scheduling.',
      slots: [],
    }
  }

  let earliestStartMinutes = schedule.openMinutes
  const latestStartMinutes = schedule.closeMinutes - serviceDurationMinutes

  if (dateString === getCurrentSalonDateString()) {
    const currentSalonClock = getCurrentSalonClockMinutes()
    earliestStartMinutes = Math.max(
      earliestStartMinutes,
      roundUpToInterval(
        currentSalonClock + onlineBookingLeadTimeMinutes,
        onlineBookingSlotIntervalMinutes
      )
    )
  }

  if (latestStartMinutes < earliestStartMinutes) {
    return {
      isClosedDay: false,
      scheduleLabel: schedule.label,
      notice:
        'No online start times remain for this day once the service duration is accounted for. Please choose another date or call the salon.',
      slots: [],
    }
  }

  const slots = []

  for (
    let slotMinutes = earliestStartMinutes;
    slotMinutes <= latestStartMinutes;
    slotMinutes += onlineBookingSlotIntervalMinutes
  ) {
    slots.push({
      value: formatMinutesAs24HourTime(slotMinutes),
      label: formatMinutesAsReadableTime(slotMinutes),
    })
  }

  return {
    isClosedDay: false,
    scheduleLabel: schedule.label,
    notice: `${slots.length} online start times are currently available for ${formatDateString(dateString)}. All times are shown in Eastern Time.`,
    slots,
  }
}

function buildBookingPreview(dateString, timeString, serviceDurationMinutes) {
  if (!dateString || !timeString) {
    return null
  }

  try {
    const startTimestamp = buildSalonStartTimestamp(dateString, timeString)
    const startDate = new Date(startTimestamp)
    const endDate = new Date(startDate.getTime() + serviceDurationMinutes * 60_000)

    return {
      startLabel: formatSalonReadableDateTime(startDate),
      endLabel: formatSalonReadableDateTime(endDate),
    }
  } catch {
    return null
  }
}

function getOnlineBookingSchedule(dateString) {
  const weekday = getUtcWeekdayFromDateString(dateString)

  if (weekday >= 2 && weekday <= 5) {
    return {
      openMinutes: 9 * 60,
      closeMinutes: 19 * 60,
      label: 'Tuesday to Friday, 9:00 am to 7:00 pm',
    }
  }

  if (weekday === 6) {
    return {
      openMinutes: 8 * 60,
      closeMinutes: 18 * 60,
      label: 'Saturday, 8:00 am to 6:00 pm',
    }
  }

  return null
}

function buildSalonStartTimestamp(dateString, timeString) {
  const { year, month, day } = parseDateString(dateString)
  const [hour, minute] = timeString.split(':').map(Number)

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error('Please choose a valid appointment time.')
  }

  let utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0)
  const targetWallClock = Date.UTC(year, month - 1, day, hour, minute, 0)

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const currentParts = getSalonDateTimeParts(new Date(utcGuess))
    const currentWallClock = Date.UTC(
      currentParts.year,
      currentParts.month - 1,
      currentParts.day,
      currentParts.hour,
      currentParts.minute,
      currentParts.second
    )

    utcGuess += targetWallClock - currentWallClock
  }

  const resolvedDate = new Date(utcGuess)
  const resolvedParts = getSalonDateTimeParts(resolvedDate)

  if (
    resolvedParts.year !== year ||
    resolvedParts.month !== month ||
    resolvedParts.day !== day ||
    resolvedParts.hour !== hour ||
    resolvedParts.minute !== minute
  ) {
    throw new Error(
      'The selected appointment time is not valid in the salon time zone. Please choose another slot.'
    )
  }

  const offsetMinutes = getSalonTimeOffsetMinutes(resolvedDate)

  return formatIsoTimestampWithOffset(resolvedDate, offsetMinutes)
}

function getSalonDateTimeParts(date) {
  const parts = salonDateTimePartsFormatter.formatToParts(date)

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
    hour: Number(parts.find((part) => part.type === 'hour')?.value),
    minute: Number(parts.find((part) => part.type === 'minute')?.value),
    second: Number(parts.find((part) => part.type === 'second')?.value),
  }
}

function getSalonTimeOffsetMinutes(date) {
  const parts = getSalonDateTimeParts(date)
  const equivalentUtcTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  )

  return Math.round((equivalentUtcTimestamp - date.getTime()) / 60_000)
}

function formatIsoTimestampWithOffset(date, offsetMinutes) {
  const parts = getSalonDateTimeParts(date)

  return `${parts.year}-${padNumber(parts.month)}-${padNumber(parts.day)}T${padNumber(
    parts.hour
  )}:${padNumber(parts.minute)}:${padNumber(parts.second)}${formatOffset(offsetMinutes)}`
}

function getCurrentSalonDateString() {
  const parts = getSalonDateTimeParts(new Date())

  return `${parts.year}-${padNumber(parts.month)}-${padNumber(parts.day)}`
}

function getCurrentSalonClockMinutes() {
  const parts = getSalonDateTimeParts(new Date())
  return parts.hour * 60 + parts.minute
}

function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)

  return {
    year,
    month,
    day,
  }
}

function getUtcWeekdayFromDateString(dateString) {
  const { year, month, day } = parseDateString(dateString)

  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

function formatDateString(dateString) {
  const { year, month, day } = parseDateString(dateString)

  return utcReadableDateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
}

function roundUpToInterval(value, interval) {
  return Math.ceil(value / interval) * interval
}

function formatMinutesAs24HourTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${padNumber(hours)}:${padNumber(minutes)}`
}

function formatMinutesAsReadableTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const normalizedHours = hours % 12 || 12
  const meridiem = hours >= 12 ? 'PM' : 'AM'

  return `${normalizedHours}:${padNumber(minutes)} ${meridiem}`
}

function formatSalonReadableDateTime(date) {
  return salonReadableDateTimeFormatter.format(date)
}

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60

  return `${sign}${padNumber(hours)}:${padNumber(minutes)}`
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function formatServiceDuration(minutes) {
  if (minutes <= 59) {
    return `Approx. ${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const hourLabel = hours === 1 ? 'hour' : 'hours'

  if (remainingMinutes === 0) {
    return `Approx. ${hours} ${hourLabel}`
  }

  return `Approx. ${hours} ${hourLabel} ${remainingMinutes} min`
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

function BookingField({ label, htmlFor, hint, input, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </span>
      {input}
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-400">{hint}</span> : null}
    </label>
  )
}

function BookingStat({ label, value }) {
  return (
    <div className="rounded-[5px] border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
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

  return <p>{item.text}</p>
}

function SectionBadge({ children, light = false }) {
  const classes = light
    ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-charcoal'
    : 'border-brand-gold/30 bg-white/5 text-brand-gold'

  return (
    <span
      className={`inline-flex w-fit items-center rounded-[5px] border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] ${classes}`}
    >
      {children}
    </span>
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
