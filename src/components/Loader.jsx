import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** Brief entry veil: covers the first paint, then lifts to reveal the scene. */
export default function Loader({ onDone }) {
  const veilRef = useRef(null)
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

    const tl = gsap.timeline()
    tl.to(veilRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.35,
      onComplete: release,
    })

    return () => {
      document.body.style.overflow = ''
      tl.kill()
    }
  }, [])

  return <div ref={veilRef} className="fixed inset-0 z-[100] bg-ink" />
}
