import { useEffect, useState } from "react";
import { usePager } from "../PagerContext";
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
  const [open, setOpen] = useState(false);
  const { activeId, goToId } = usePager();

  // The page no longer scrolls natively (SectionPager pages between
  // sections instead), so "has the user moved past Hero" is read straight
  // from which slide is active rather than a window.scrollY listener.
  const scrolled = activeId !== "home";

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    goToId(href.replace("#", ""));
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
          {LINKS.map((link) => {
            const isActive = `#${activeId}` === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav__link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            );
          })}
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
        {LINKS.map((link) => {
          const isActive = `#${activeId}` === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`nav__mobile-link ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          );
        })}
        <a href="#contact" className="nav__mobile-cta" onClick={(e) => handleNavClick(e, "#contact")}>
          Get a Quote
        </a>
      </div>
    </header>
  );
}
