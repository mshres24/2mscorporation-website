import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const sectionLinks = [
  { href: '/#leadership', id: 'leadership', label: 'Leadership' },
  { href: '/#about', id: 'about', label: 'About' },
  { href: '/#services', id: 'services', label: 'Services' },
  { href: '/#contact', id: 'contact', label: 'Contact' },
]

const linkClass = (isActive) =>
  `relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-gold after:transition-all after:duration-300 ${
    isActive ? 'text-cream after:w-full' : 'text-cream/60 hover:text-cream after:w-0 hover:after:w-full'
  }`

/** Shared site header: section links scroll-spy on the home page; Careers is its own route. */
export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const onCareers = pathname.startsWith('/careers')

  useEffect(() => {
    if (!onHome) return undefined
    const sections = sectionLinks.map((l) => document.getElementById(l.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [onHome])

  const links = [...sectionLinks, { href: '/careers', id: 'careers', label: 'Careers' }]
  const isActive = (l) => (l.id === 'careers' ? onCareers : onHome && active === l.id)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/70 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/#top" className="flex items-center gap-3">
          <span className="rounded-lg bg-white p-1.5">
            <img src="/2ms-logo.png" alt="2MS Corporation" className="h-11 w-auto sm:h-12" />
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className={linkClass(isActive(l))}>
              {l.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            className="inline-flex items-center rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
          >
            Start a Conversation
          </Link>
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
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className={`py-2 ${isActive(l) ? 'text-brand-gold' : 'text-cream/70 hover:text-cream'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
