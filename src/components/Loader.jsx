import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** EverSwap-style entry: a serif percentage counts up, then the veil lifts. */
export default function Loader({ onDone }) {
  const veilRef = useRef(null)
  const numRef = useRef(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const release = () => {
      document.body.style.overflow = ''
      doneRef.current?.()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(veilRef.current, { autoAlpha: 0 })
      release()
      return () => {
        document.body.style.overflow = ''
      }
    }

    const counter = { v: 0 }
    const tl = gsap.timeline()
    tl.to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = `${Math.round(counter.v)}%`
      },
    })
      .to(numRef.current, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' }, '+=0.1')
      .to(veilRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: release,
      })

    return () => {
      document.body.style.overflow = ''
      tl.kill()
    }
  }, [])

  return (
    <div ref={veilRef} className="fixed inset-0 z-[100] flex items-end justify-center bg-ink pb-20">
      <span ref={numRef} className="font-serif text-5xl sm:text-6xl text-cream tabular-nums">
        0%
      </span>
    </div>
  )
}
