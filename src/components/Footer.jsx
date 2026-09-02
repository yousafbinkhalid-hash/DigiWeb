import { usePager } from "../PagerContext";
import "./Footer.css";

/* ---------------------------------------------------------------------- */
/*  Icons                                                                  */
/* ---------------------------------------------------------------------- */

const IconArrowUp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrowRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    <path d="M8 10.5v6M8 7.8v.01M12.3 16.5v-3.6c0-1.3.9-2.2 2-2.2s2 .8 2 2.3v3.5" strokeLinecap="round" />
  </svg>
);

const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M5 5 19 19M19 5 5 19" strokeLinecap="round" />
  </svg>
);

const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconGithub = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.61-.2.61-.43v-1.68c-2.5.55-3.03-1.2-3.03-1.2-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.7-1.16 2.45-.92 2.45-.92.5 1.25.19 2.17.1 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.1 4.43.33.29.62.85.62 1.72v2.55c0 .24.16.52.62.43A9 9 0 0 0 12 3Z" />
  </svg>
);

/* ---------------------------------------------------------------------- */
/*  Content — override via props                                          */
/* ---------------------------------------------------------------------- */

const DEFAULT_COMPANY_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SERVICE_LINKS = [
  { label: "Web Design", href: "#services" },
  { label: "Development", href: "#services" },
  { label: "SEO & Marketing", href: "#services" },
  { label: "UI/UX Design", href: "#services" },
  { label: "Hosting & Support", href: "#services" },
];

const DEFAULT_SOCIALS = [
  { id: "linkedin", icon: IconLinkedIn, label: "LinkedIn", href: "#" },
  { id: "x", icon: IconX, label: "X (Twitter)", href: "#" },
  { id: "instagram", icon: IconInstagram, label: "Instagram", href: "#" },
  { id: "github", icon: IconGithub, label: "GitHub", href: "#" },
];

/**
 * Footer
 *
 * Props:
 *  - brand, tagline    {string}
 *  - email, phone      {string}
 *  - companyLinks      {Array}  [{label, href}]
 *  - serviceLinks      {Array}  [{label, href}]
 *  - socials           {Array}  [{id, icon, label, href}]
 */
export default function Footer({
  brand = "DigiWeb",
  tagline = "A senior team of designers and engineers building high-performing digital products.",
  email = "hello@digiweb.com",
  phone = "+1 (555) 010-2024",
  companyLinks = DEFAULT_COMPANY_LINKS,
  serviceLinks = DEFAULT_SERVICE_LINKS,
  socials = DEFAULT_SOCIALS,
}) {
  const year = new Date().getFullYear();
  const { goToId } = usePager();

  const navigate = (e, href) => {
    e.preventDefault();
    goToId(href.replace("#", ""));
  };

  return (
    <footer className="footer">
      <span className="footer__watermark" aria-hidden="true">
        {brand}
      </span>

      <div className="footer__inner">
        {/* Bold CTA banner ------------------------------------------------ */}
        <div className="footer__cta">
          <h2 className="footer__cta-heading">
            Have a project <span>in mind?</span>
          </h2>
          <a
            className="footer__cta-link"
            href="#contact"
            onClick={(e) => navigate(e, "#contact")}
          >
            {email}
            <IconArrowRight />
          </a>
        </div>

        <div className="footer__divider" />

        {/* Columns ---------------------------------------------------- */}
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <a href="#home" className="footer__brand" onClick={(e) => navigate(e, "#home")}>
              <span className="footer__brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 5h4.6C15.7 5 19 8.4 19 12.5S15.7 20 10.6 20H6V5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {brand}
            </a>
            <p className="footer__tagline">{tagline}</p>
            <div className="footer__socials">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.id} className="footer__social" href={s.href} aria-label={s.label} title={s.label}>
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Company</h3>
            <ul className="footer__links">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={(e) => navigate(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Services</h3>
            <ul className="footer__links">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={(e) => navigate(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Get in touch</h3>
            <ul className="footer__links">
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
              </li>
              <li className="footer__links-static">San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar --------------------------------------------------- */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {year} {brand}. All rights reserved.
          </p>

          <ul className="footer__legal">
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Service</a>
            </li>
          </ul>

          <button type="button" className="footer__top" onClick={() => goToId("home")} aria-label="Back to top">
            <IconArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
