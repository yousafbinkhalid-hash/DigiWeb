import { useEffect, useState } from "react";
import "./Navbar.css";

// Ordered to match the actual page flow (Home -> About -> Services ->
// Contact) rather than an arbitrary order, and limited to links that
// resolve to a real section — a nav item that goes nowhere reads as
// broken rather than professional.
const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ brand = "DigiWeb" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(LINKS[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight whichever nav link matches the section currently
  // most visible in the viewport, so the nav reflects where you actually
  // are on the page instead of staying static.
  useEffect(() => {
    const targets = LINKS.map((link) => document.querySelector(link.href)).filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best
        );
        setActiveHref(`#${topMost.target.id}`);
      },
      { threshold: [0.35, 0.5, 0.65], rootMargin: "-20% 0px -20% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleNavClick = (e, href) => {
    const target = document.querySelector(href);
    // Always prevent the default anchor jump: when the target exists we
    // drive the scroll ourselves (below), and when it doesn't yet exist
    // (Work/Contact have no section built yet) letting the browser jump
    // the URL to a dead #hash leaves the address bar pointing at content
    // that was never scrolled to — confusing, and easy to mistake for a
    // layout bug. Just close the menu and leave the page where it is.
    e.preventDefault();
    if (target) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
    closeMenu();
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <div className="nav__inner">
        <a href="#home" className="nav__brand" onClick={(e) => handleNavClick(e, "#home")}>
          <span className="nav__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M6 5h4.6C15.7 5 19 8.4 19 12.5S15.7 20 10.6 20H6V5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="nav__brand-name">{brand}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav__link ${activeHref === link.href ? "is-active" : ""}`}
              aria-current={activeHref === link.href ? "true" : undefined}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href="#contact" className="nav__cta" onClick={(e) => handleNavClick(e, "#contact")}>
            Get a Quote
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav__mobile ${open ? "is-open" : ""}`}>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`nav__mobile-link ${activeHref === link.href ? "is-active" : ""}`}
            aria-current={activeHref === link.href ? "true" : undefined}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <a href="#contact" className="nav__mobile-cta" onClick={(e) => handleNavClick(e, "#contact")}>
          Get a Quote
        </a>
      </div>
    </header>
  );
}
