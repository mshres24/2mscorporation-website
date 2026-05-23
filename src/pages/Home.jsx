import { useState } from 'react'

const services = [
  {
    title: 'Light Rail Transit',
    description:
      'End-to-end program management for LRT corridors, from alignment studies and stakeholder coordination to procurement, construction oversight, and revenue-service activation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <rect x="4" y="3" width="16" height="14" rx="2" />
        <path d="M4 11h16M9 17l-2 4M15 17l2 4M9 7h.01M15 7h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'High-Speed Rail',
    description:
      'Advisory and program controls for HSR initiatives, including corridor planning, systems integration, environmental clearance support, and interagency delivery strategy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <path d="M3 16h15a3 3 0 003-3V9a3 3 0 00-3-3H8L3 12v4z" />
        <path d="M3 16l-1 3M18 16l1 3M8 6v6M13 9h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Public Transportation',
    description:
      'Bus rapid transit, commuter rail, and multimodal hub planning that connects communities and improves mobility outcomes for transit agencies and municipalities.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 17v3M17 17v3M8 7h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Program Management',
    description:
      'Owner’s representation, schedule and cost controls, risk management, and procurement strategy across multi-billion-dollar capital programs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <path d="M3 12l4-4 4 4 4-6 6 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Engineering Advisory',
    description:
      'Independent technical reviews, value engineering, constructability assessments, and design oversight by registered Professional Engineers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Stakeholder & Agency Coordination',
    description:
      'Trusted liaison between transit agencies, contractors, utilities, and the public, keeping complex programs aligned, transparent, and on track.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M14 20c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

function NavBar() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#leadership', label: 'Leadership' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ]
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <a href="#top" className="flex items-center gap-3">
          <img src="/2ms-logo.png" alt="2MS Corporation" className="h-14 sm:h-16 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-slate hover:text-brand-navy transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center px-4 py-2 rounded-md bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navy-dark transition-colors"
          >
            Start a Conversation
          </a>
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-brand-navy"
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
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-brand-slate hover:text-brand-navy"
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

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-dark to-[#0c2a52] text-white">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <path d="M0 320 Q200 240 400 280 T800 220" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0 340 Q200 260 400 300 T800 240" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0 360 Q200 280 400 320 T800 260" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold tracking-wide uppercase">
              Transportation Program Management &amp; Advisory
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Moving people forward with rail and transit programs that deliver.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              2MS Corporation partners with transit agencies, owners, and project sponsors to plan,
              manage, and deliver light rail, high-speed rail, and public transportation programs.
              On budget, on schedule, and with the technical rigor of licensed engineering leadership.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#leadership"
                className="inline-flex items-center px-6 py-3 rounded-md bg-brand-gold text-brand-navy-dark font-semibold hover:bg-brand-gold-dark transition-colors"
              >
                Meet the Founder
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-gold/30 to-white/10 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
                <img
                  src="/2ms-logo.png"
                  alt="2MS Corporation logo"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">What we do</h2>
          <p className="mt-4 text-lg text-brand-slate">
            We bring decades of rail and transit experience to every phase of a capital program, from
            early planning through revenue service.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-white p-7 rounded-xl border border-gray-200 hover:border-brand-navy hover:shadow-lg transition-all"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors">
                {s.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-brand-navy">{s.title}</h3>
              <p className="mt-2 text-brand-slate leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
            A consulting firm built around modern transit delivery
          </h2>
          <p className="mt-5 text-lg text-brand-slate leading-relaxed">
            2MS Corporation provides transportation program management and engineering advisory
            services for agencies and owners delivering complex rail and transit projects. We embed
            with our clients as trusted advisors, bringing the discipline of a Professional Engineer,
            the perspective of a program owner, and a relentless focus on getting projects built.
          </p>
          <p className="mt-4 text-lg text-brand-slate leading-relaxed">
            Whether you are launching a new light rail corridor, advancing a high-speed rail program,
            or modernizing a regional bus network, our team helps you navigate technical, regulatory,
            and stakeholder complexity with confidence.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Independent, owner-aligned advisory',
              'Licensed Professional Engineer leadership',
              'Focused on rail and public transportation',
              'Practical, delivery-focused recommendations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg className="h-6 w-6 text-brand-gold flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-brand-slate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark rounded-2xl p-10 text-white shadow-xl">
            <div className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Our Mission</div>
            <p className="mt-4 text-2xl font-semibold leading-snug">
              To help transit owners deliver rail and public transportation programs that move
              communities forward, safely, sustainably, and successfully.
            </p>
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3">
                <img src="/2ms-logo.png" alt="" className="h-14 w-auto bg-white rounded-lg p-2" />
                <div>
                  <div className="font-semibold">2MS Corporation</div>
                  <div className="text-sm text-blue-100">Transportation Program Management &amp; Advisory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-navy/5" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-gold/10" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold-dark text-xs font-semibold tracking-wide uppercase">
            Leadership
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold text-brand-navy leading-tight">
            Meet the engineer behind 2MS Corporation
          </h2>
          <p className="mt-5 text-lg text-brand-slate">
            2MS Corporation is led personally by its founder, a hands-on Professional Engineer
            who works directly with clients on every engagement.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-2">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-navy to-brand-gold rounded-2xl opacity-20 blur-lg" />
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-gray-200">
                <img
                  src="/pranaya-shrestha.png"
                  alt="Pranaya Shrestha, PE, Founder of 2MS Corporation"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-brand-gold text-brand-navy-dark px-5 py-3 rounded-xl shadow-lg font-bold text-sm tracking-wide">
                PE LICENSED
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-sm uppercase tracking-widest text-brand-gold-dark font-semibold">
              Founder &amp; Principal
            </div>
            <h3 className="mt-2 text-4xl sm:text-5xl font-bold text-brand-navy">
              Pranaya Shrestha, <span className="text-brand-gold-dark">PE</span>
            </h3>
            <div className="mt-4 h-1 w-20 bg-brand-gold rounded" />

            <p className="mt-6 text-lg text-brand-slate leading-relaxed">
              Pranaya is the founder of 2MS Corporation and a licensed Professional Engineer. He
              built the firm to give owners and transit agencies a focused, senior-level advisory
              partner for rail and public transportation programs.
            </p>
            <p className="mt-4 text-lg text-brand-slate leading-relaxed">
              He works directly with clients on the technical and program-management challenges
              that matter most, from light rail and high-speed rail initiatives to broader public
              transit modernization.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { k: 'Role', v: 'Founder &amp; Principal' },
                { k: 'Credential', v: 'Professional Engineer (PE)' },
                { k: 'Practice', v: 'Rail &amp; Public Transportation' },
                { k: 'Firm', v: '2MS Corporation' },
              ].map((c) => (
                <div key={c.k} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs uppercase tracking-wide text-brand-slate">{c.k}</div>
                  <div className="mt-1 font-semibold text-brand-navy" dangerouslySetInnerHTML={{ __html: c.v }} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/pranaya-shrestha-pe-88b56121a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-brand-navy text-white font-semibold hover:bg-brand-navy-dark transition-colors shadow"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
                Connect on LinkedIn
              </a>
              <a
                href="mailto:pranaya@2mscorp.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border-2 border-brand-navy text-brand-navy font-semibold hover:bg-brand-navy hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                pranaya@2mscorp.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-brand-navy text-white py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">Let&rsquo;s build the next program together</h2>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
          Whether you&rsquo;re scoping a new transit study, looking for independent program
          oversight, or planning the next phase of a rail initiative, we&rsquo;d like to hear about
          it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:pranaya@2mscorp.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand-gold text-brand-navy-dark font-semibold hover:bg-brand-gold-dark transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16v12H4z" />
              <path d="M4 6l8 7 8-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            pranaya@2mscorp.com
          </a>
          <a
            href="mailto:megha@2mscorp.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-brand-navy-dark font-semibold hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16v12H4z" />
              <path d="M4 6l8 7 8-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            megha@2mscorp.com
          </a>
          <a
            href="https://www.linkedin.com/in/pranaya-shrestha-pe-88b56121a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <img src="/2ms-logo.png" alt="2MS Corporation" className="h-20 w-auto bg-white rounded-lg p-2" />
          <p className="mt-4 text-sm text-gray-400 max-w-sm">
            Transportation program management and engineering advisory for light rail, high-speed
            rail, and public transportation programs.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Practice Areas</h4>
          <ul className="space-y-2 text-sm">
            <li>Light Rail Transit</li>
            <li>High-Speed Rail</li>
            <li>Public Transportation</li>
            <li>Program Management</li>
            <li>Engineering Advisory</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-brand-gold" href="mailto:pranaya@2mscorp.com">
                pranaya@2mscorp.com
              </a>
            </li>
            <li>
              <a className="hover:text-brand-gold" href="mailto:megha@2mscorp.com">
                megha@2mscorp.com
              </a>
            </li>
            <li>
              <a
                className="hover:text-brand-gold"
                href="https://www.linkedin.com/in/pranaya-shrestha-pe-88b56121a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pranaya Shrestha, PE on LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-500 flex flex-wrap justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} 2MS Corporation. All rights reserved.</span>
          <span>Transportation Program Management &amp; Advisory</span>
        </div>
      </div>
    </footer>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <NavBar />
      <Hero />
      <Leadership />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
