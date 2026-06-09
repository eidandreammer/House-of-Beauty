import './App.css'

const instagramLink = 'https://www.instagram.com/pupusalocanj/'
const mapsLink =
  'https://www.google.com/maps/search/?api=1&query=197%20Market%20St%20Paterson%20NJ%2007505'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Order Online', href: '#order' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Our Menu', href: '#menu' },
  { label: 'Contact us', href: '#contact' },
]

const dishes = [
  {
    title: 'Desayunos',
    image: '/images/breakfast-hero.jpg',
    size: 'wide',
  },
  {
    title: 'Pupusas',
    image: '/images/pupusas-hero.jpg',
    size: 'tall',
  },
  {
    title: 'Mariscos',
    image: '/images/story-stack.png',
    size: 'tall',
  },
  {
    title: 'Tamales',
    image: '/images/tamales.jpg',
  },
  {
    title: 'Platillos',
    image: '/images/platillo.jpg',
    size: 'wide',
  },
  {
    title: 'Pollo Frito',
    image: '/images/gallery-feature.jpg',
  },
  {
    title: 'Platanos y Horchata',
    image: '/images/plantains-horchata.jpg',
  },
  {
    title: 'Especialidades',
    image: '/images/story-stack.png',
    size: 'tall',
  },
]

const menuHighlights = [
  'Pupusas revueltas',
  'Queso con loroco',
  'Tamal de gallina',
  'Yuca con chicharron',
  'Desayuno Salvadoreno',
  'Carne asada',
  'Sopa de mariscos',
  'Horchata Salvadorena',
]

function App() {
  return (
    <div className="site-shell">
      <header className="site-header" id="top">
        <p className="topline">Authentic Salvadorean Food</p>
        <div className="brand-banner">
          <a href="#home" className="logo-link" aria-label="Pupusa Loca home">
            <img src="/images/pupusa-loca-logo.png" alt="Pupusa Loca" />
          </a>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-photo" id="home" aria-label="Pupusa Loca breakfast dishes">
          <img src="/images/breakfast-hero.jpg" alt="Salvadoran breakfast plates" />
        </section>

        <section className="paper-section story-section" aria-labelledby="story-title">
          <div className="story-grid">
            <div className="story-copy">
              <p className="script-title" id="story-title">
                Our Story
              </p>
              <p className="lead">Welcome to Pupusa Loca!</p>
              <p>
                Pupusa Loca was born from a deep love for the rich and diverse
                flavors of El Salvador.
              </p>
              <p>
                At Pupusa Loca, we take immense pride in crafting each dish with
                the freshest ingredients and time-honored recipes passed down
                through generations. Our signature pupusas, made from scratch and
                filled with a variety of delicious ingredients, are a testament
                to our commitment to authenticity and quality.
              </p>
              <p>
                Explore our menu and you will discover a wide array of
                Salvadoran delights. From hearty breakfasts that start your day
                off right to flavorful soups that warm your soul, our menu is
                designed to satisfy every craving. We also offer a delightful
                selection of cocktails, perfect for unwinding after a long day or
                celebrating with friends and family.
              </p>
              <p>
                Thank you for choosing Pupusa Loca. We look forward to sharing
                our love for cuisine with you and creating many delicious
                memories together.
              </p>
            </div>

            <div className="story-art" aria-hidden="true">
              <img src="/images/story-stack.png" alt="" />
            </div>
          </div>
        </section>

        <section className="happy-hour" aria-labelledby="happy-hour-title">
          <h2 id="happy-hour-title">
            Happy <span>Hour</span>
          </h2>
          <p>50% Off</p>
        </section>

        <section className="visit-band" aria-labelledby="visit-title">
          <div className="social-callout">
            <p>Follow us on Instagram!</p>
            <a href={instagramLink} target="_blank" rel="noreferrer">
              @pupusalocanj
            </a>
          </div>

          <h2 id="visit-title">Visit Us!</h2>

          <div className="hours">
            <div>
              <span>Mon - Thu</span>
              <strong>10:00 am - 9:00 pm</strong>
            </div>
            <div>
              <span>Fri - Sun</span>
              <strong>10:00 am - 10:00 pm</strong>
            </div>
          </div>
        </section>

        <section className="paper-section order-section" id="order" aria-labelledby="order-title">
          <div className="section-center">
            <h2 className="block-title" id="order-title">
              Order Online
            </h2>
            <p className="script-title">Coming soon</p>
            <img src="/images/story-stack.png" alt="Pupusa Loca specialty dishes" />
          </div>
        </section>

        <section className="paper-section gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="gallery-wrap">
            <p className="script-title" id="gallery-title">
              Our Dishes
            </p>
            <div className="masonry-gallery">
              {dishes.map((dish) => (
                <figure className={dish.size || ''} key={dish.title}>
                  <img src={dish.image} alt={dish.title} loading="lazy" />
                  <figcaption>{dish.title}</figcaption>
                </figure>
              ))}
            </div>
            <a className="pill-link" href="#menu">
              View Menu
            </a>
          </div>
        </section>

        <section className="paper-section menu-section" id="menu" aria-labelledby="menu-title">
          <div className="menu-panel">
            <p className="script-title">Our Menu</p>
            <h2 className="block-title" id="menu-title">
              Quieres saborear nuestras especialidades?
            </h2>
            <div className="menu-list">
              {menuHighlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a className="pill-link" href="tel:+19737426711">
              Call to Order
            </a>
          </div>
        </section>

        <section className="paper-section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-wrap">
            <p className="script-title" id="contact-title">
              Contact Us
            </p>
            <p className="reservation-note">We do not accept reservation via this form.</p>
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" />
              </label>
              <label>
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="4" />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a href="#top" className="footer-logo" aria-label="Back to top">
          <img src="/images/pupusa-loca-logo.png" alt="Pupusa Loca" />
        </a>

        <div className="app-links" aria-label="App availability">
          <p>
            <span aria-hidden="true">android</span>
            Android App Coming Soon
          </p>
          <p>
            <span aria-hidden="true">ios</span>
            iOS App Coming Soon
          </p>
          <a href={instagramLink} target="_blank" rel="noreferrer" aria-label="Instagram">
            Instagram
          </a>
        </div>

        <address>
          <a href="tel:+19737426711">973-742-6711</a>
          <a href={mapsLink} target="_blank" rel="noreferrer">
            197 Market St
            <br />
            Paterson, NJ 07505
          </a>
        </address>
      </div>
      <div className="footer-credit">
        Powered by <a href="https://www.skymarketing.us/" target="_blank" rel="noreferrer">Sky Marketing US</a>
      </div>
    </footer>
  )
}

export default App
