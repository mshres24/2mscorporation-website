import { useEffect, useState } from 'react'

/** Left-edge journey dots: one stop per section, gold when you're there. */
export default function ProgressDots({ stops }) {
  const [active, setActive] = useState(stops[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    stops.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [stops])

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 lg:flex"
    >
      {stops.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center">
          {i > 0 && <span className="mb-1 h-6 w-px bg-cream/20" />}
          <a
            href={`#${s.id}`}
            aria-label={s.label}
            title={s.label}
            className="group relative flex h-4 w-4 items-center justify-center"
          >
            <span
              className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                active === s.id
                  ? 'scale-150 border-brand-gold bg-brand-gold'
                  : 'border-cream/50 bg-transparent group-hover:border-cream'
              }`}
            />
            <span className="pointer-events-none absolute left-6 whitespace-nowrap rounded bg-ink-light px-2 py-1 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        </div>
      ))}
    </nav>
  )
}
