import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from '../components/Loader'
import SceneJourney from '../components/SceneJourney'
import ProgressDots from '../components/ProgressDots'
import Reveal from '../components/Reveal'

gsap.registerPlugin(ScrollTrigger)

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-7 w-7',
}

const services = [
  {
    title: 'Light Rail Transit',
    description:
      'End-to-end program management for LRT corridors, from alignment studies and stakeholder coordination to procurement, construction oversight, and revenue-service activation.',
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="2.5" width="14" height="14.5" rx="3.5" />
        <path d="M5 10h14" />
        <path d="M9.5 13.5h.01M14.5 13.5h.01" />
        <path d="M8.5 17l-2.5 4.5M15.5 17l2.5 4.5M7.5 21.5h9" />
      </svg>
    ),
  },
  {
    title: 'High-Speed Rail',
    description:
      'Advisory and program controls for HSR initiatives, including corridor planning, systems integration, environmental clearance support, and interagency delivery strategy.',
    icon: (
      <svg {...iconProps}>
        <path d="M5 16.5h11.5a5 5 0 0 0 5-5c0-2.2-1.8-4-4-4h-6.8L5 13v3.5z" />
        <path d="M12.5 10.5H15" />
        <path d="M1.5 9.5h3.5M2.5 13h2" />
        <path d="M7.5 19.5h11" />
      </svg>
    ),
  },
  {
    title: 'Public Transportation',
    description:
      'Bus rapid transit, commuter rail, and multimodal hub planning that connects communities and improves mobility outcomes for transit agencies and municipalities.',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="3" width="16" height="15" rx="3" />
        <path d="M4 11h16" />
        <path d="M8.5 14.5h.01M15.5 14.5h.01" />
        <path d="M7 18v2.5M17 18v2.5" />
      </svg>
    ),
  },
  {
    title: 'Program Management',
    description:
      'Owner’s representation, schedule and cost controls, risk management, and procurement strategy across multi-billion-dollar capital programs.',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.5 8.5h8M7.5 12h9M7.5 15.5h5" />
      </svg>
    ),
  },
  {
    title: 'Engineering Advisory',
    description:
      'Independent technical reviews, value engineering, constructability assessments, and design oversight by registered Professional Engineers.',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="4.5" r="2" />
        <path d="M10.9 6.3L6 20M13.1 6.3L18 20" />
        <path d="M8 14.5a8.5 8.5 0 0 0 8 0" />
      </svg>
    ),
  },
  {
    title: 'Stakeholder & Agency Coordination',
    description:
      'Trusted liaison between transit agencies, contractors, utilities, and the public, keeping complex programs aligned, transparent, and on track.',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="5.5" r="2.3" />
        <circle cx="5" cy="17.5" r="2.3" />
        <circle cx="19" cy="17.5" r="2.3" />
        <path d="M10.8 7.5l-4.4 7.9M13.2 7.5l4.4 7.9M7.4 17.5h9.2" />
      </svg>
    ),
  },
]

const stops = [
  { id: 'top', label: 'Start' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

function NavBar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const links = [
    { href: '#leadership', label: 'Leadership' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ]

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/70 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="rounded-lg bg-white p-1.5">
            <img src="/2ms-logo.png" alt="2MS Corporation" className="h-11 w-auto sm:h-12" />
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-gold after:transition-all after:duration-300 ${
                active === l.href
                  ? 'text-cream after:w-full'
                  : 'text-cream/60 hover:text-cream after:w-0 hover:after:w-full'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
          >
            Start a Conversation
          </a>
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-cream md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-cream/10 bg-ink md:hidden">
          <div className="flex flex-col gap-2 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-cream/70 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function Hero({ ready }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-fade]', { y: 44, autoAlpha: 0, duration: 1, stagger: 0.14 })
    }, sectionRef)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="text-glow-dark relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 58% 52% at 50% 48%, rgba(6,16,33,0.5), rgba(6,16,33,0) 75%)',
        }}
      />
      <span
        data-hero-fade
        className="relative text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold sm:text-sm"
      >
        Transportation Program Management &amp; Advisory
      </span>
      <h1
        data-hero-fade
        className="relative mt-8 max-w-5xl font-serif text-5xl leading-[1.05] text-cream sm:text-7xl lg:text-8xl"
      >
        Moving people <em className="text-brand-gold">forward.</em>
      </h1>
      <p data-hero-fade className="relative mt-8 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
        2MS Corporation partners with transit agencies, owners, and project sponsors to plan,
        manage, and deliver light rail, high-speed rail, and public transportation programs — on
        budget, on schedule, with the rigor of licensed engineering leadership.
      </p>
      <div data-hero-fade className="relative mt-12 flex flex-wrap justify-center gap-4">
        <a
          href="#leadership"
          className="inline-flex items-center rounded-full bg-brand-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
        >
          Begin the Journey
        </a>
        <a
          href="#contact"
          className="inline-flex items-center rounded-full border border-cream/30 px-7 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
        >
          Get in Touch
        </a>
      </div>

      <a
        data-hero-fade
        href="#leadership"
        aria-label="Scroll down"
        className="absolute bottom-8 animate-bounce-soft text-cream/40 transition-colors hover:text-cream"
      >
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}

/** Full-bleed typographic moment between sections — the railway crosses here. */
function Chapter({ eyebrow, lines, caption }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-line]',
        { autoAlpha: 0, y: 70, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
            end: 'center 45%',
            scrub: 0.6,
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="text-glow-dark relative z-10 px-4 py-36 text-center sm:py-52"
    >
      {/* scrim: dims the scene right behind the headline so it stays readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 58% at 50% 50%, rgba(6,16,33,0.6), rgba(6,16,33,0) 74%)',
        }}
      />
      <div className="relative">
        {eyebrow && (
          <div
            data-line
            className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold"
          >
            {eyebrow}
          </div>
        )}
        {lines.map((l) => (
          <div
            key={l}
            data-line
            className="font-serif text-5xl leading-tight text-cream sm:text-7xl lg:text-8xl"
          >
            {l}
          </div>
        ))}
        {caption && (
          <p data-line className="mx-auto mt-8 max-w-xl text-sm text-cream/90 sm:text-base">
            {caption}
          </p>
        )}
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cream/10 bg-ink/60 p-6 backdrop-blur-md sm:p-10 lg:p-14">
        <Reveal className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Leadership
          </span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-6xl">
            The engineer at the helm
          </h2>
          <p className="mt-5 text-lg text-cream/80">
            2MS Corporation is led personally by its founder, a hands-on Professional Engineer who
            works directly with clients on every engagement.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal className="lg:col-span-2">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-brand-gold/30 to-brand-navy/40 opacity-60 blur-xl" />
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-cream/20">
                <img
                  src="/pranaya-shrestha.png"
                  alt="Pranaya Shrestha, PE, Founder of 2MS Corporation"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 right-3 rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold tracking-wide text-ink shadow-lg sm:-right-5">
                PE LICENSED
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={150}>
            <div className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Founder &amp; Principal
            </div>
            <h3 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
              Pranaya Shrestha, <span className="text-brand-gold">PE</span>
            </h3>
            <div className="mt-4 h-px w-24 bg-brand-gold/60" />

            <p className="mt-6 text-lg leading-relaxed text-cream/70">
              Pranaya is the founder of 2MS Corporation and a licensed Professional Engineer. He
              built the firm to give owners and transit agencies a focused, senior-level advisory
              partner for rail and public transportation programs.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-cream/70">
              He works directly with clients on the technical and program-management challenges
              that matter most, from light rail and high-speed rail initiatives to broader public
              transit modernization.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { k: 'Role', v: 'Founder & Principal' },
                { k: 'Credential', v: 'Professional Engineer (PE)' },
                { k: 'Practice', v: 'Rail & Public Transportation' },
                { k: 'Firm', v: '2MS Corporation' },
              ].map((c) => (
                <div key={c.k} className="rounded-lg border border-cream/10 bg-cream/5 p-4">
                  <div className="text-xs uppercase tracking-wide text-cream/50">{c.k}</div>
                  <div className="mt-1 font-semibold text-cream">{c.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/pranaya-shrestha-pe-88b56121a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
                Connect on LinkedIn
              </a>
              <a
                href="mailto:pranaya@2mscorp.com"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                pranaya@2mscorp.com
              </a>
            </div>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 rounded-3xl border border-cream/10 bg-ink/60 p-6 backdrop-blur-md sm:p-10 lg:grid-cols-2 lg:p-14">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            The Firm
          </span>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">
            Built around modern transit delivery
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream/70">
            2MS Corporation provides transportation program management and engineering advisory
            services for agencies and owners delivering complex rail and transit projects. We embed
            with our clients as trusted advisors, bringing the discipline of a Professional
            Engineer, the perspective of a program owner, and a relentless focus on getting
            projects built.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            Whether you are launching a new light rail corridor, advancing a high-speed rail
            program, or modernizing a regional bus network, our team helps you navigate technical,
            regulatory, and stakeholder complexity with confidence.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Independent, owner-aligned advisory',
              'Licensed Professional Engineer leadership',
              'Focused on rail and public transportation',
              'Practical, delivery-focused recommendations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-gold"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-cream/70">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="relative" delay={150}>
          <div className="rounded-2xl border border-cream/10 bg-gradient-to-br from-cream/10 to-cream/[0.03] p-10 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Our Mission
            </div>
            <p className="mt-4 font-serif text-2xl leading-snug text-cream sm:text-3xl">
              To help transit owners deliver rail and public transportation programs that move
              communities forward — safely, sustainably, and successfully.
            </p>
            <div className="mt-8 border-t border-cream/10 pt-8">
              <div className="flex items-center gap-3">
                <img src="/2ms-logo.png" alt="" className="h-14 w-auto rounded-lg bg-white p-2" />
                <div>
                  <div className="font-semibold text-cream">2MS Corporation</div>
                  <div className="text-sm text-cream/50">
                    Transportation Program Management &amp; Advisory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl rounded-3xl border border-cream/15 bg-[#0b1e3c]/85 p-6 backdrop-blur-md sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Services
          </span>
          <h2 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">What we do</h2>
          <p className="mt-4 text-lg text-cream/80">
            We bring decades of rail and transit experience to every phase of a capital program,
            from early planning through revenue service.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-cream/15 bg-[#0b1e3c]/90 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold hover:shadow-[0_14px_50px_rgba(245,166,35,0.25)]">
                <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand-gold to-brand-gold/30 transition-transform duration-300 group-hover:scale-x-100" />
                <span className="absolute right-6 top-5 font-serif text-2xl italic text-cream/20 transition-colors duration-300 group-hover:text-brand-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/40 transition-all duration-300 group-hover:bg-brand-gold group-hover:text-ink group-hover:ring-brand-gold">
                  {s.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-cream transition-colors duration-300 group-hover:text-brand-gold">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-cream/70 transition-colors duration-300 group-hover:text-cream/90">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="text-glow-dark relative z-10 px-4 py-28 text-center sm:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(6,16,33,0.55), rgba(6,16,33,0) 75%)',
        }}
      />
      <Reveal className="relative">
        {/* diamond emblem, EverSwap-outro style */}
        <div className="mx-auto h-36 w-36 rotate-45 overflow-hidden rounded-3xl border border-brand-gold/40 bg-white p-3 shadow-[0_0_60px_rgba(245,166,35,0.25)]">
          <div className="flex h-full w-full -rotate-45 scale-125 items-center justify-center">
            <img src="/2ms-logo.png" alt="2MS Corporation" className="w-28" />
          </div>
        </div>
        <div className="mt-14 text-sm uppercase tracking-[0.35em] text-cream/80">
          Stay on schedule
        </div>
        <h2 className="mt-4 font-serif text-5xl text-cream sm:text-7xl">
          Move with <span className="text-brand-gold">2MS</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-cream/90">
          Whether you&rsquo;re scoping a new transit study, looking for independent program
          oversight, or planning the next phase of a rail initiative, we&rsquo;d like to hear
          about it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:pranaya@2mscorp.com"
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
          >
            pranaya@2mscorp.com
          </a>
          <a
            href="mailto:megha@2mscorp.com"
            className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3 font-semibold text-ink transition-colors hover:bg-white"
          >
            megha@2mscorp.com
          </a>
          <a
            href="https://www.linkedin.com/in/pranaya-shrestha-pe-88b56121a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
          >
            Connect on LinkedIn
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-cream/10 bg-ink/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-cream/40 sm:px-6 lg:px-8">
        <span>&copy; {new Date().getFullYear()} 2MS Corporation. All rights reserved.</span>
        <div className="flex flex-wrap gap-6">
          <a className="transition-colors hover:text-brand-gold" href="mailto:pranaya@2mscorp.com">
            pranaya@2mscorp.com
          </a>
          <a className="transition-colors hover:text-brand-gold" href="mailto:megha@2mscorp.com">
            megha@2mscorp.com
          </a>
        </div>
        <span>Transportation Program Management &amp; Advisory</span>
      </div>
    </footer>
  )
}

function Home() {
  const [ready, setReady] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-light via-ink to-[#050d1d] font-sans text-cream">
      <Loader onDone={() => setReady(true)} />
      <SceneJourney />
      {/* vignette: keeps cream text legible over the bright parts of the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(8,24,48,0) 35%, rgba(8,24,48,0.5) 100%), linear-gradient(to bottom, rgba(8,24,48,0.45), rgba(8,24,48,0) 22%, rgba(8,24,48,0) 75%, rgba(8,24,48,0.5))',
        }}
      />
      <NavBar />
      <ProgressDots stops={stops} />
      <main className="relative">
        <Hero ready={ready} />
        <Chapter
          eyebrow="The Journey"
          lines={['One corridor.', 'Every connection.']}
          caption="From first alignment study to first revenue ride, every successful program follows a single, well-engineered line."
        />
        <Leadership />
        <About />
        <Chapter
          lines={['Plan. Build.', 'Deliver.']}
          caption="Program management that keeps multi-billion-dollar capital programs on budget and on schedule."
        />
        <Services />
        <Chapter
          lines={['On time.', 'On track.']}
          caption="The destination: transit that moves communities forward."
        />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}

export default Home
