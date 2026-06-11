import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AnimatedText from "./components/AnimatedText";
import Masonry from "./components/Masonry";
import { deliveryLinks, menuCategories } from "./menuData";

const instagramLink = "https://www.instagram.com/pupusalocanj/";
const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=197%20Market%20St%20Paterson%20NJ%2007505";
const mapEmbedUrl =
  "https://www.google.com/maps?q=197%20Market%20St%20Paterson%2C%20NJ%2007505&output=embed";
const restaurantAddress = "197 Market St, Paterson, NJ 07505";
const restaurantPhone = "+19737426711";
const restaurantPhoneDisplay = "973-742-6711";
const publicPath = (path = "") => `${import.meta.env.BASE_URL}${path}`;
const homeHref = publicPath();
const menuPageHref = publicPath("menu.html");

const navItems = [
  { label: "Home", href: homeHref },
  { label: "Order Online", href: `${homeHref}#order` },
  { label: "Gallery", href: `${homeHref}#gallery` },
  { label: "Our Menu", href: menuPageHref },
  { label: "Contact us", href: `${homeHref}#contact` },
];

const galleryImageHeights = [
  529, 507, 960, 960, 960, 960, 960, 960, 650, 713, 610, 529, 527, 598, 601,
  445, 453, 500, 535, 447, 960, 960, 960, 531,
];

const dishes = galleryImageHeights.map((height, index) => {
  const photoNumber = String(index + 1).padStart(2, "0");

  return {
    ariaLabel: `View menu for Pupusa Loca gallery dish ${index + 1}`,
    height,
    id: `gallery-dish-${photoNumber}`,
    img: publicPath(`images/gallery/dish-${photoNumber}.jpg`),
    url: menuPageHref,
  };
});

const businessHours = [
  { days: "Monday - Thursday", hours: "10:00 am - 9:00 pm" },
  { days: "Friday - Sunday", hours: "10:00 am - 10:00 pm" },
];

const pickupOptions = ["ASAP", "30 minutes", "45 minutes", "1 hour"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

function formatPrice(value) {
  return currencyFormatter.format(value);
}

function buildOrderText(cartLines, subtotal, customer) {
  const itemLines = cartLines.map(
    (line) =>
      `${line.quantity} x ${line.name} - ${formatPrice(line.price * line.quantity)}`,
  );

  return [
    "Pupusa Loca pickup order",
    customer.name ? `Name: ${customer.name}` : null,
    customer.phone ? `Phone: ${customer.phone}` : null,
    `Pickup time: ${customer.pickupTime}`,
    "",
    "Items:",
    ...itemLines,
    "",
    `Estimated subtotal: ${formatPrice(subtotal)}`,
    customer.notes ? `Notes: ${customer.notes}` : null,
    "Please confirm availability, final total, and pickup time.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function App() {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const shellStyle = {
    "--hero-background-image": `url("${publicPath("images/breakfast-hero.png")}")`,
    "--happy-hour-background-image": `url("${publicPath("images/flow.png")}")`,
    "--paper-background-image": `url("${publicPath("images/paper-background.jpg")}")`,
    "--wood-background-image": `url("${publicPath("images/Dark wood.png")}")`,
  };
  const happyHourStyle = {
    backgroundImage: `url("${publicPath("images/flow.png")}")`,
  };
  const normalizedPath = window.location.pathname
    .toLowerCase()
    .replace(/\/$/, "");
  const isMenuPage =
    normalizedPath.endsWith("/menu") || normalizedPath.endsWith("/menu.html");

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = 0;
    const footerVisibilityThreshold = 0.3;
    const scrollThreshold = 6;

    function getVisibleRatio(element) {
      if (!element) {
        return 0;
      }

      const rect = element.getBoundingClientRect();
      if (rect.height <= 0) {
        return 0;
      }

      const visibleHeight = Math.min(rect.bottom, window.innerHeight) -
        Math.max(rect.top, 0);

      return Math.max(0, visibleHeight) / rect.height;
    }

    function updateNavVisibility() {
      frameId = 0;

      const currentScrollY = window.scrollY;
      const hero = document.querySelector(".hero-photo");
      const footer = document.querySelector(".site-footer");
      const footerIsBlocking =
        getVisibleRatio(footer) >= footerVisibilityThreshold;
      const isPastHero = hero
        ? hero.getBoundingClientRect().bottom <= 0
        : currentScrollY > 0;
      const scrollDelta = currentScrollY - lastScrollY;

      setIsNavHidden((currentlyHidden) => {
        if (footerIsBlocking) {
          return true;
        }

        if (!isPastHero) {
          return false;
        }

        if (scrollDelta > scrollThreshold) {
          return true;
        }

        if (scrollDelta < -scrollThreshold) {
          return false;
        }

        return currentlyHidden;
      });

      if (
        Math.abs(scrollDelta) > scrollThreshold ||
        footerIsBlocking ||
        !isPastHero
      ) {
        lastScrollY = currentScrollY;
      }
    }

    function requestNavUpdate() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateNavVisibility);
    }

    updateNavVisibility();
    window.addEventListener("scroll", requestNavUpdate, { passive: true });
    window.addEventListener("resize", requestNavUpdate);

    return () => {
      window.removeEventListener("scroll", requestNavUpdate);
      window.removeEventListener("resize", requestNavUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, [isMenuPage]);

  return (
    <div className="site-shell" style={shellStyle}>
      <header className="site-header" id="top">
        <section
          className={`hero-photo${isMenuPage ? " page-hero" : ""}`}
          id="home"
          aria-label="Pupusa Loca restaurant hero"
        >
          <div className="hero-content">
            <p className="topline">
              <AnimatedText text="Authentic Salvadorean Food" />
            </p>

            <nav
              className={`main-nav${isNavHidden ? " is-hidden" : ""}`}
              aria-hidden={isNavHidden}
              aria-label="Primary navigation"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  tabIndex={isNavHidden ? -1 : undefined}
                  aria-current={
                    isMenuPage && item.href === menuPageHref
                      ? "page"
                      : undefined
                  }
                >
                  <AnimatedText text={item.label} />
                </a>
              ))}
            </nav>

            <div className="brand-banner">
              <a href={homeHref} className="logo-link" aria-label="Pupusa Loca home">
                <img src={publicPath("images/Pupusa loca logo white.png")} alt="Pupusa Loca" />
              </a>
            </div>
          </div>
        </section>
      </header>

      <main>
        {isMenuPage ? (
          <section
            className="paper-section menu-section menu-page-section"
            id="menu"
            aria-labelledby="menu-title"
          >
            <OnlineMenu />
          </section>
        ) : (
          <>
            <section
              className="paper-section story-section"
              aria-labelledby="story-title"
            >
              <div className="story-grid">
                <div className="story-copy">
                  <AnimatedText
                    as="p"
                    className="script-title"
                    id="story-title"
                    text="Our Story"
                  />
                  <AnimatedText
                    as="p"
                    className="lead"
                    text="Welcome to Pupusa Loca!"
                  />
                  <AnimatedText
                    as="p"
                    text="Pupusa Loca was born from a deep love for the rich and diverse flavors of El Salvador."
                  />
                  <AnimatedText
                    as="p"
                    text="At Pupusa Loca, we take immense pride in crafting each dish with the freshest ingredients and time-honored recipes passed down through generations. Our signature pupusas, made from scratch and filled with a variety of delicious ingredients, are a testament to our commitment to authenticity and quality."
                  />
                  <AnimatedText
                    as="p"
                    text="Explore our menu and you will discover a wide array of Salvadoran delights. From hearty breakfasts that start your day off right to flavorful soups that warm your soul, our menu is designed to satisfy every craving. We also offer a delightful selection of cocktails, perfect for unwinding after a long day or celebrating with friends and family."
                  />
                  <AnimatedText
                    as="p"
                    text="Thank you for choosing Pupusa Loca. We look forward to sharing our love for cuisine with you and creating many delicious memories together."
                  />
                </div>

                <div className="story-art" aria-hidden="true">
                  <img src={publicPath("images/story-stack.png")} alt="" />
                </div>
              </div>
            </section>

            <section
              className="happy-hour"
              style={happyHourStyle}
              aria-labelledby="happy-hour-title"
            >
              <h2 className="happy-hour-title" id="happy-hour-title">
                <span>
                </span>
              </h2>
            </section>

            <section
              className="paper-section order-section"
              id="order"
              aria-labelledby="order-title"
            >
              <div className="section-center order-hub">
                <h2 className="block-title" id="order-title">
                  <AnimatedText text="Order Online" />
                </h2>
                <AnimatedText
                  as="p"
                  className="script-title"
                  text="Fresh pickup and delivery"
                />
                <div className="order-platforms" aria-label="Order options">
                  <a className="platform-link native" href={menuPageHref}>
                    <AnimatedText text="Order Here" />
                  </a>
                  <a
                    className="platform-link"
                    href={deliveryLinks.uberEats}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AnimatedText text="Uber Eats" />
                  </a>
                  <a
                    className="platform-link"
                    href={deliveryLinks.doorDash}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AnimatedText text="DoorDash" />
                  </a>
                  <a
                    className="platform-link"
                    href={deliveryLinks.grubhub}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AnimatedText text="Grubhub" />
                  </a>
                </div>
                <div className="order-showcase">
                  <img
                    src={publicPath("images/1.png")}
                    alt="Pupusa Loca grilled steak and cocktail"
                  />
                  <img
                    src={publicPath("images/2.png")}
                    alt="Pupusa Loca seafood cocktail, shrimp rice, and pork chops"
                  />
                  <img
                    src={publicPath("images/3.png")}
                    alt="Pupusa Loca breakfast plate and grilled steak"
                  />
                  <img
                    src={publicPath("images/4.png")}
                    alt="Pupusa Loca specialty dishes"
                  />
                </div>
              </div>
            </section>

            <section
              className="paper-section gallery-section"
              id="gallery"
              aria-labelledby="gallery-title"
            >
              <div className="gallery-wrap">
                <AnimatedText
                  as="p"
                  className="script-title"
                  id="gallery-title"
                  text="Our Dishes"
                />
                <div
                  className="dish-masonry"
                  aria-label="Featured dish categories"
                >
                  <Masonry
                    animateFrom="bottom"
                    blurToFocus
                    colorShiftOnHover={false}
                    duration={0.6}
                    ease="power3.out"
                    hoverScale={0.95}
                    items={dishes}
                    scaleOnHover
                    stagger={0.05}
                  />
                </div>
                <a className="pill-link" href={menuPageHref}>
                  <AnimatedText text="View Menu" />
                </a>
              </div>
            </section>

            <LocationSchedule />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function OnlineMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    notes: "",
    phone: "",
    pickupTime: "ASAP",
  });

  const allItems = useMemo(
    () =>
      menuCategories.flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          categoryId: category.id,
          categoryTitle: category.title,
        })),
      ),
    [],
  );

  const itemLookup = useMemo(
    () => new Map(allItems.map((item) => [item.id, item])),
    [allItems],
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(
    () =>
      menuCategories
        .filter(
          (category) =>
            activeCategory === "all" || category.id === activeCategory,
        )
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => {
            if (!normalizedSearch) {
              return true;
            }

            return `${item.name} ${item.description}`
              .toLowerCase()
              .includes(normalizedSearch);
          }),
        }))
        .filter((category) => category.items.length > 0),
    [activeCategory, normalizedSearch],
  );

  const cartLines = useMemo(
    () =>
      cart
        .map((line) => {
          const item = itemLookup.get(line.id);

          if (!item) {
            return null;
          }

          return {
            ...item,
            quantity: line.quantity,
          };
        })
        .filter(Boolean),
    [cart, itemLookup],
  );

  const subtotal = useMemo(
    () =>
      cartLines.reduce((total, line) => total + line.price * line.quantity, 0),
    [cartLines],
  );

  const menuCount = filteredCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0);
  const orderText = useMemo(
    () => buildOrderText(cartLines, subtotal, customer),
    [cartLines, customer, subtotal],
  );
  const smsLink = `sms:${restaurantPhone}?body=${encodeURIComponent(orderText)}`;
  const canPlaceOrder = cartLines.length > 0;

  function getQuantity(itemId) {
    return cart.find((line) => line.id === itemId)?.quantity || 0;
  }

  function addItem(item) {
    setOrderStatus("");
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id);

      if (existing) {
        return current.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }

      return [...current, { id: item.id, quantity: 1 }];
    });
  }

  function updateQuantity(itemId, amount) {
    setOrderStatus("");
    setCart((current) =>
      current
        .map((line) =>
          line.id === itemId
            ? { ...line, quantity: line.quantity + amount }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function removeItem(itemId) {
    setOrderStatus("");
    setCart((current) => current.filter((line) => line.id !== itemId));
  }

  function handleCustomerChange(event) {
    const { name, value } = event.target;
    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function copyOrder() {
    if (!canPlaceOrder) {
      return;
    }

    try {
      await navigator.clipboard.writeText(orderText);
      setOrderStatus("Order copied.");
    } catch {
      setOrderStatus(
        `Copy unavailable. Call ${restaurantPhoneDisplay} to place this order.`,
      );
    }
  }

  return (
    <div className="online-menu">
      <div className="online-menu-header">
        <AnimatedText as="p" className="script-title" text="Our Menu" />
        <h2 className="block-title" id="menu-title">
          <AnimatedText text="Build your Pupusa Loca order" />
        </h2>
        <AnimatedText
          as="p"
          className="menu-subtitle"
          text="Pickup orders are sent by call or text. Delivery opens in your preferred app."
        />
      </div>

      <div className="delivery-strip" aria-label="Delivery app links">
        <a href={deliveryLinks.uberEats} target="_blank" rel="noreferrer">
          <AnimatedText text="Uber Eats" />
        </a>
        <a href={deliveryLinks.doorDash} target="_blank" rel="noreferrer">
          <AnimatedText text="DoorDash" />
        </a>
        <a href={deliveryLinks.grubhub} target="_blank" rel="noreferrer">
          <AnimatedText text="Grubhub" />
        </a>
      </div>

      <div className="menu-toolbar">
        <label className="menu-search">
          <AnimatedText text="Search menu" />
          {!searchQuery ? (
            <span className="search-placeholder" aria-hidden="true">
              <AnimatedText text="Search pupusas, soups, drinks..." />
            </span>
          ) : null}
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="category-tabs" aria-label="Menu categories">
          <button
            type="button"
            className={activeCategory === "all" ? "active" : ""}
            aria-pressed={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          >
            <AnimatedText text="All" />
          </button>
          {menuCategories.map((category) => (
            <button
              type="button"
              className={activeCategory === category.id ? "active" : ""}
              aria-pressed={activeCategory === category.id}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              <AnimatedText text={category.title} />
            </button>
          ))}
        </div>
      </div>

      <div className="online-menu-layout">
        <div className="menu-results" aria-live="polite">
          <AnimatedText
            as="p"
            className="menu-result-count"
            text={`${menuCount} item${menuCount === 1 ? "" : "s"}`}
          />

          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <section
                className="menu-category"
                key={category.id}
                aria-labelledby={`${category.id}-title`}
              >
                <div className="menu-category-heading">
                  <div>
                    <h3 id={`${category.id}-title`}>
                      <AnimatedText text={category.title} />
                    </h3>
                    <AnimatedText as="p" text={category.note} />
                  </div>
                </div>

                <div className="menu-items-grid">
                  {category.items.map((item) => {
                    const quantity = getQuantity(item.id);

                    return (
                      <article className="menu-item-card" key={item.id}>
                        <div className="menu-item-copy">
                          <div className="menu-item-title">
                            <h4>
                              <AnimatedText text={item.name} />
                            </h4>
                            <strong>
                              <AnimatedText text={formatPrice(item.price)} />
                            </strong>
                          </div>
                          <AnimatedText as="p" text={item.description} />
                        </div>

                        <div className="menu-item-actions">
                          {quantity > 0 ? (
                            <div
                              className="quantity-control"
                              aria-label={`${item.name} quantity`}
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <AnimatedText text="-" />
                              </button>
                              <span>
                                <AnimatedText text={quantity} />
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <AnimatedText text="+" />
                              </button>
                            </div>
                          ) : null}
                          <button
                            className="menu-add-button"
                            type="button"
                            onClick={() => addItem(item)}
                          >
                            <AnimatedText text="Add" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-menu-state">
              <AnimatedText as="p" text="No menu items match that search." />
              <button type="button" onClick={() => setSearchQuery("")}>
                <AnimatedText text="Clear Search" />
              </button>
            </div>
          )}
        </div>

        <aside className="cart-panel" aria-labelledby="cart-title">
          <div className="cart-heading">
            <div>
              <AnimatedText
                as="p"
                className="cart-kicker"
                text="Native Pickup"
              />
              <h3 id="cart-title">
                <AnimatedText text="Your Order" />
              </h3>
            </div>
            <span>
              <AnimatedText text={itemCount} />
            </span>
          </div>

          {cartLines.length > 0 ? (
            <div className="cart-lines">
              {cartLines.map((line) => (
                <div className="cart-line" key={line.id}>
                  <div>
                    <strong>
                      <AnimatedText text={line.name} />
                    </strong>
                    <span>
                      <AnimatedText
                        text={`${line.quantity} x ${formatPrice(line.price)}`}
                      />
                    </span>
                  </div>
                  <div className="cart-line-actions">
                    <div
                      className="quantity-control small"
                      aria-label={`${line.name} quantity in cart`}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, -1)}
                      >
                        <AnimatedText text="-" />
                      </button>
                      <span>
                        <AnimatedText text={line.quantity} />
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, 1)}
                      >
                        <AnimatedText text="+" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(line.id)}>
                      <AnimatedText text="Remove" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatedText
              as="p"
              className="empty-cart"
              text="Add items from the menu to start a pickup order."
            />
          )}

          <div className="cart-total">
            <span>
              <AnimatedText text="Estimated Subtotal" />
            </span>
            <strong>
              <AnimatedText text={formatPrice(subtotal)} />
            </strong>
          </div>

          <form
            className="native-order-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              <AnimatedText text="Name" />
              <input
                name="name"
                type="text"
                value={customer.name}
                onChange={handleCustomerChange}
              />
            </label>
            <label>
              <AnimatedText text="Phone" />
              <input
                name="phone"
                type="tel"
                value={customer.phone}
                onChange={handleCustomerChange}
              />
            </label>
            <label>
              <AnimatedText text="Pickup" />
              <div
                className="pickup-options"
                role="group"
                aria-label="Pickup time"
              >
                {pickupOptions.map((option) => (
                  <button
                    type="button"
                    className={customer.pickupTime === option ? "active" : ""}
                    aria-pressed={customer.pickupTime === option}
                    key={option}
                    onClick={() =>
                      setCustomer((current) => ({
                        ...current,
                        pickupTime: option,
                      }))
                    }
                  >
                    <AnimatedText text={option} />
                  </button>
                ))}
              </div>
            </label>
            <label>
              <AnimatedText text="Notes" />
              <textarea
                name="notes"
                rows="3"
                value={customer.notes}
                onChange={handleCustomerChange}
              />
            </label>
          </form>

          <div className="order-actions">
            <a
              className={!canPlaceOrder ? "is-disabled" : ""}
              href={canPlaceOrder ? smsLink : undefined}
              aria-disabled={!canPlaceOrder}
            >
              <AnimatedText text="Text Order" />
            </a>
            <a href={`tel:${restaurantPhone}`}>
              <AnimatedText text="Call" />
            </a>
            <button type="button" disabled={!canPlaceOrder} onClick={copyOrder}>
              <AnimatedText text="Copy" />
            </button>
          </div>

          <AnimatedText
            as="p"
            className="cart-note"
            text="No online payment is collected. The restaurant confirms final pricing and pickup."
          />
          {orderStatus ? (
            <AnimatedText
              as="p"
              className="order-status"
              aria-live="polite"
              text={orderStatus}
            />
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function LocationSchedule() {
  return (
    <section
      className="location-section"
      id="contact"
      aria-labelledby="location-title"
    >
      <div className="location-headline">
        <h2 id="location-title">
          <AnimatedText text="Fresh pupusas on Market Street" />
        </h2>
      </div>
      <div className="location-wrap">
        <div className="schedule-panel">
          <div className="social-callout">
            <AnimatedText as="p" text="Follow us on Instagram!" />
            <a href={instagramLink} target="_blank" rel="noreferrer">
              <AnimatedText text="@pupusalocanj" />
            </a>
          </div>

          <div>
            <AnimatedText as="p" className="section-kicker" text="Visit Us" />
          </div>

          <address>
            <span>
              <AnimatedText text="Location" />
            </span>
            <a href={mapsLink} target="_blank" rel="noreferrer">
              <AnimatedText text={restaurantAddress} />
            </a>
          </address>

          <div className="schedule-card" aria-label="Business hours">
            {businessHours.map((item) => (
              <div className="schedule-row" key={item.days}>
                <span>
                  <AnimatedText text={item.days} />
                </span>
                <strong>
                  <AnimatedText text={item.hours} />
                </strong>
              </div>
            ))}
          </div>

          <div className="location-actions">
            <a
              className="pill-link dark"
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
            >
              <AnimatedText text="Get Directions" />
            </a>
            <a className="pill-link light" href="tel:+19737426711">
              <AnimatedText text="Call Now" />
            </a>
          </div>
        </div>

        <div className="map-panel">
          <iframe
            title="Google map showing Pupusa Loca at 197 Market St, Paterson, New Jersey"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#top" className="footer-logo" aria-label="Back to top">
              <img src={publicPath("images/Pupusa loca logo white.png")} alt="Pupusa Loca" />
            </a>
            <AnimatedText
              as="p"
              text="Authentic Salvadorean food in Paterson, NJ"
            />
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <h2 className="footer-title">
              <AnimatedText text="Navigation" />
            </h2>
            <div>
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  <AnimatedText text={item.label} />
                </a>
              ))}
            </div>
          </nav>

          <div className="footer-contact">
            <h2 className="footer-title">
              <AnimatedText text="Contact" />
            </h2>
            <div className="footer-contact-group">
              <span>
                <AnimatedText text="Address" />
              </span>
              <a href={mapsLink} target="_blank" rel="noreferrer">
                <AnimatedText text={restaurantAddress} />
              </a>
            </div>
            <div className="footer-contact-group">
              <span>
                <AnimatedText text="Phone" />
              </span>
              <a className="footer-phone" href={`tel:${restaurantPhone}`}>
                <AnimatedText text={restaurantPhoneDisplay} />
              </a>
            </div>
            <div className="footer-contact-group">
              <span>
                <AnimatedText text="Hours" />
              </span>
              <AnimatedText as="p" text="Mon-Thu 10am-9pm; Fri-Sun 10am-10pm" />
            </div>
          </div>

          <div className="footer-actions">
            <h2 className="footer-title">
              <AnimatedText text="Quick Actions" />
            </h2>
            <a
              className="footer-action primary"
              href={`tel:${restaurantPhone}`}
            >
              <AnimatedText text="Call Now" />
            </a>
            <a
              className="footer-action secondary"
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
            >
              <AnimatedText text="Get Directions" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <AnimatedText
            as="p"
            className="footer-privacy"
            text="No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties."
          />

          <div className="footer-social-wrap">
            <a
              className="footer-social"
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.6 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            </a>
            <p>
              <AnimatedText text="Powered by" />{" "}
              <a
                href="https://www.skymarketing.us/"
                target="_blank"
                rel="noreferrer"
              >
                <AnimatedText text="Sky Marketing US" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
