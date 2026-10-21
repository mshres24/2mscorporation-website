import { Link } from 'react-router-dom'

export default function Footer() {
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
          <Link className="transition-colors hover:text-brand-gold" to="/careers">
            Careers
          </Link>
        </div>
        <span>Transportation Program Management &amp; Advisory</span>
      </div>
    </footer>
  )
}
