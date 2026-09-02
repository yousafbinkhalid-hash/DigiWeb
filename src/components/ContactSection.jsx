import { useCallback, useEffect, useRef, useState } from "react";
import "./ContactSection.css";

/* ---------------------------------------------------------------------- */
/*  Icons                                                                  */
/* ---------------------------------------------------------------------- */

const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 6.5 8 6.2 8-6.2" />
  </svg>
);

const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />
  </svg>
);

const IconPin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 21.5S5 15.4 5 10a7 7 0 1 1 14 0c0 5.4-7 11.5-7 11.5Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

const IconSend = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M4.5 12 20 4.5 15 20l-3.6-6.4L4.5 12Z" strokeLinejoin="round" />
    <path d="M11.4 13.6 20 4.5" />
  </svg>
);

const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
    <path d="m4 12.5 5.5 5.5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
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

const DEFAULT_INFO = [
  { id: "email", icon: IconMail, label: "Email us", value: "hello@digiweb.com", href: "mailto:hello@digiweb.com" },
  { id: "phone", icon: IconPhone, label: "Call us", value: "+1 (555) 010-2024", href: "tel:+15550102024" },
  { id: "location", icon: IconPin, label: "Visit us", value: "San Francisco, CA", href: "https://maps.google.com/?q=San+Francisco" },
];

const DEFAULT_SOCIALS = [
  { id: "linkedin", icon: IconLinkedIn, label: "LinkedIn", href: "#" },
  { id: "x", icon: IconX, label: "X (Twitter)", href: "#" },
  { id: "instagram", icon: IconInstagram, label: "Instagram", href: "#" },
  { id: "github", icon: IconGithub, label: "GitHub", href: "#" },
];

const DEFAULT_HIGHLIGHTS = [
  { value: "24h", label: "Avg. response time" },
  { value: "98%", label: "Client satisfaction" },
  { value: "Free", label: "First consultation" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 600;

/* ---------------------------------------------------------------------- */
/*  Scroll-driven reveal — same pattern used across the other sections    */
/* ---------------------------------------------------------------------- */

function useReveal(threshold = 0.25) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/**
 * ContactSection
 *
 * Props:
 *  - eyebrow, heading, subheading  {string}
 *  - info      {Array}  Override the 3 default contact rows — [{id, icon, label, value, href}]
 *  - socials   {Array}  Override the 4 default social links — [{id, icon, label, href}]
 *  - onSubmit  {(values) => Promise|void}  Called with form values instead of the built-in
 *              simulated send when provided — wire this up to your real backend/email API.
 */
export default function ContactSection({
  eyebrow = "Get In Touch",
  heading = "Let's Build Something\nGreat Together",
  subheading =
    "Tell us about your project and we'll get back to you within one business day with next steps.",
  info = DEFAULT_INFO,
  socials = DEFAULT_SOCIALS,
  highlights = DEFAULT_HIGHLIGHTS,
  onSubmit,
}) {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const resetTimerRef = useRef(null);

  const [infoRef, infoVisible] = useReveal(0.25);
  const [formRef, formVisible] = useReveal(0.2);

  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handlePointerMove = useCallback((e) => {
    const node = sectionRef.current;
    const glow = glowRef.current;
    if (!node || !glow) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      glow.style.setProperty("--glow-x", `${x}px`);
      glow.style.setProperty("--glow-y", `${y}px`);
      glow.style.opacity = "1";
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const errors = {
    name: values.name.trim().length < 2 ? "Please enter your name." : "",
    email: !EMAIL_RE.test(values.email.trim()) ? "Enter a valid email address." : "",
    message: values.message.trim().length < 10 ? "Tell us a little more (10+ characters)." : "",
  };
  const isValid = !errors.name && !errors.email && !errors.message;

  const handleChange = (field) => (e) => {
    const val = field === "message" ? e.target.value.slice(0, MESSAGE_MAX) : e.target.value;
    setValues((v) => ({ ...v, [field]: val }));
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid || status === "sending") return;

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // No backend wired up yet — this simulates the request so the form
        // reads as a real, working flow. Pass an `onSubmit` prop to send
        // these values to your actual API/email service.
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setStatus("sent");
      resetTimerRef.current = setTimeout(() => {
        setValues({ name: "", email: "", subject: "", message: "" });
        setTouched({});
        setStatus("idle");
      }, 3600);
    } catch {
      setStatus("idle");
    }
  };

  const messageLeft = MESSAGE_MAX - values.message.length;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <div className="contact__grid" aria-hidden="true" />
      <div className="contact__blob contact__blob--a" aria-hidden="true" />
      <div className="contact__blob contact__blob--b" aria-hidden="true" />
      <div ref={glowRef} className="contact__glow" aria-hidden="true" />

      <div className="contact__inner">
        <div ref={infoRef} className={`contact__info ${infoVisible ? "is-visible" : ""}`}>
          <span className="contact__eyebrow">
            <span className="contact__eyebrow-dot" />
            {eyebrow}
          </span>

          <h2 className="contact__heading">
            {heading.split("\n").map((line, i) => (
              <span className="contact__heading-line" key={i}>
                {line}
              </span>
            ))}
          </h2>

          <p className="contact__subheading">{subheading}</p>

          <span className="contact__status">
            <span className="contact__status-dot" />
            Currently available for new projects
          </span>

          <ul className="contact__list">
            {info.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.id} className="contact__row">
                  <a
                    className="contact__row-link"
                    href={row.href}
                    target={row.id === "location" ? "_blank" : undefined}
                    rel={row.id === "location" ? "noreferrer" : undefined}
                  >
                    <span className="contact__row-icon">
                      <Icon />
                    </span>
                    <span className="contact__row-text">
                      <span className="contact__row-label">{row.label}</span>
                      <span className="contact__row-value">{row.value}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="contact__highlights">
            {highlights.map((h) => (
              <div className="contact__highlight" key={h.label}>
                <strong>{h.value}</strong>
                <span>{h.label}</span>
              </div>
            ))}
          </div>

          <div className="contact__socials">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.id} className="contact__social" href={s.href} aria-label={s.label} title={s.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div ref={formRef} className={`contact__form-wrap ${formVisible ? "is-visible" : ""}`}>
          <form className="contact__form" noValidate onSubmit={handleSubmit}>
            <div className={`contact__panel ${status === "sent" ? "is-hidden" : ""}`} aria-hidden={status === "sent"}>
              <div className="contact__field-row">
                <div className={`contact__field ${touched.name && errors.name ? "has-error" : ""}`}>
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jordan Lee"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && <span className="contact__error">{errors.name}</span>}
                </div>

                <div className={`contact__field ${touched.email && errors.email ? "has-error" : ""}`}>
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="jordan@company.com"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {touched.email && errors.email && <span className="contact__error">{errors.email}</span>}
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="New website project"
                  value={values.subject}
                  onChange={handleChange("subject")}
                  onBlur={handleBlur("subject")}
                />
              </div>

              <div className={`contact__field ${touched.message && errors.message ? "has-error" : ""}`}>
                <div className="contact__field-head">
                  <label htmlFor="contact-message">Project details</label>
                  <span className={`contact__counter ${messageLeft < 40 ? "is-low" : ""}`}>
                    {messageLeft}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="What are you looking to build?"
                  value={values.message}
                  onChange={handleChange("message")}
                  onBlur={handleBlur("message")}
                />
                {touched.message && errors.message && <span className="contact__error">{errors.message}</span>}
              </div>

              <button type="submit" className="contact__submit" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="contact__spinner" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <IconSend />
                  </>
                )}
              </button>

              <p className="contact__form-note">
                By sending this you agree to be contacted about your project. No spam, ever.
              </p>
            </div>

            <div className={`contact__success ${status === "sent" ? "is-visible" : ""}`} aria-live="polite">
              <span className="contact__success-icon">
                <IconCheck />
              </span>
              <h3>Message sent</h3>
              <p>Thanks for reaching out — we'll get back to you within one business day.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
