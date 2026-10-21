import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import ApplyModal from '../components/ApplyModal'
import { jobs } from '../data/jobs'

export function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-light via-ink to-[#050d1d] font-sans text-cream">
      {/* faint rail-line motif so the page echoes the journey on the home page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,166,35,0.12), rgba(245,166,35,0) 70%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(29,79,145,0.25), rgba(29,79,145,0) 70%)',
        }}
      />
      <NavBar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  )
}

export function MetaChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs font-medium text-cream/80">
      {children}
    </span>
  )
}

const generalInterest = { slug: 'general-interest', title: 'General Interest' }

export default function Careers() {
  const [introOpen, setIntroOpen] = useState(false)

  useEffect(() => {
    document.title = 'Careers | 2MS Corporation'
    return () => {
      document.title = '2MS Corporation | Transportation Program Management & Advisory'
    }
  }, [])

  return (
    <PageShell>
      <section className="px-4 pb-16 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Careers
            </span>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-cream sm:text-7xl">
              Join the <em className="text-brand-gold">journey.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">
              2MS Corporation is a growing transportation consulting firm led by a licensed
              Professional Engineer. We are building a senior team to deliver rail and public
              transportation programs for agencies and owners across California.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-end justify-between border-b border-cream/10 pb-4">
              <h2 className="font-serif text-3xl text-cream sm:text-4xl">Open positions</h2>
              <span className="text-sm text-cream/50">
                {jobs.length} {jobs.length === 1 ? 'role' : 'roles'}
              </span>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6">
            {jobs.map((job, i) => (
              <Reveal key={job.slug} delay={i * 100}>
                <Link
                  to={`/careers/${job.slug}`}
                  className="group block rounded-2xl border border-cream/10 bg-ink/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-[0_14px_50px_rgba(245,166,35,0.2)] sm:p-8"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                        {job.department}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl text-cream transition-colors group-hover:text-brand-gold sm:text-3xl">
                        {job.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <MetaChip>{job.type}</MetaChip>
                        <MetaChip>{job.location}</MetaChip>
                        <MetaChip>Reports to {job.reportsTo.split(' / ')[0]}</MetaChip>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-gold px-6 py-3 font-semibold text-ink transition-colors group-hover:bg-brand-gold-dark">
                      View role
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16" delay={150}>
            <div className="rounded-2xl border border-cream/10 bg-gradient-to-br from-cream/10 to-cream/[0.03] p-8 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                Not the right fit?
              </div>
              <p className="mt-3 max-w-2xl font-serif text-2xl leading-snug text-cream">
                We are always glad to hear from experienced rail and transit professionals.
              </p>
              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                className="mt-6 inline-flex items-center rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
              >
                Introduce yourself
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ApplyModal
        job={generalInterest}
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        eyebrow="Introduce yourself"
      />
    </PageShell>
  )
}
