import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import ApplyModal from '../components/ApplyModal'
import { PageShell, MetaChip } from './Careers'
import { getJob } from '../data/jobs'

export default function JobDetail() {
  const { slug } = useParams()
  const job = getJob(slug)
  const [applyOpen, setApplyOpen] = useState(false)

  useEffect(() => {
    if (job) document.title = `${job.title} | Careers | 2MS Corporation`
    return () => {
      document.title = '2MS Corporation | Transportation Program Management & Advisory'
    }
  }, [job])

  if (!job) return <Navigate to="/careers" replace />

  const facts = [
    { k: 'Reports to', v: job.reportsTo },
    { k: 'Direct reports', v: job.directReports },
    { k: 'Classification', v: `${job.type}, executive leadership team` },
    { k: 'Location', v: job.location },
  ]

  return (
    <PageShell>
      <section className="px-4 pb-12 pt-32 sm:px-6 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm text-cream/60 transition-colors hover:text-brand-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All positions
            </Link>
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              {job.department}
            </div>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.08] text-cream sm:text-6xl">
              {job.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-2">
              <MetaChip>{job.type}</MetaChip>
              <MetaChip>{job.location}</MetaChip>
              <MetaChip>2MS Corporation</MetaChip>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setApplyOpen(true)}
                className="inline-flex items-center rounded-full bg-brand-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
              >
                Apply for this role
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="space-y-12 lg:col-span-2">
            <Reveal>
              <h2 className="font-serif text-3xl text-cream">Position summary</h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/75">{job.summary}</p>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-3xl text-cream">Essential duties and responsibilities</h2>
              <div className="mt-6 space-y-6">
                {job.duties.map((d, i) => (
                  <div key={d.title} className="rounded-2xl border border-cream/10 bg-ink/60 p-6 backdrop-blur-md sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-cream">
                        <span className="mr-3 font-serif italic text-cream/30">{String(i + 1).padStart(2, '0')}</span>
                        {d.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-bold text-brand-gold ring-1 ring-brand-gold/40">
                        {d.weight}%
                      </span>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {d.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-cream/70">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-3xl text-cream">Knowledge, skills and abilities</h2>
              <ul className="mt-6 space-y-3">
                {job.skills.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-cream/70">
                    <svg className="mt-0.5 h-6 w-6 shrink-0 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-3xl text-cream">Working conditions</h2>
              <ul className="mt-6 space-y-3">
                {job.conditions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-cream/70">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cream/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm italic text-cream/50">{job.disclaimer}</p>
            </Reveal>
          </div>

          <aside className="lg:col-span-1">
            <Reveal className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-cream/10 bg-gradient-to-br from-cream/10 to-cream/[0.03] p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  At a glance
                </div>
                <dl className="mt-5 space-y-5">
                  {facts.map((f) => (
                    <div key={f.k}>
                      <dt className="text-xs uppercase tracking-wide text-cream/50">{f.k}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-cream">{f.v}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-brand-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
                >
                  Apply now
                </button>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-28 sm:px-6 sm:pb-36 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="rounded-3xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/15 to-cream/[0.03] p-8 text-center sm:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                Ready to apply?
              </span>
              <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">{job.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-cream/70">
                Share a few details and your resume. Applications go directly to the firm's
                leadership.
              </p>
              <button
                type="button"
                onClick={() => setApplyOpen(true)}
                className="mt-8 inline-flex items-center rounded-full bg-brand-gold px-8 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
              >
                Apply for this role
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ApplyModal job={job} open={applyOpen} onClose={() => setApplyOpen(false)} />
    </PageShell>
  )
}
