import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** After client-side navigation, jump to the top of the new page, or to the URL hash if there is one. */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
