import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { submitApplication, hasEndpoint, MAX_RESUME_BYTES, RESUME_TYPES } from '../lib/apply'

const inputClass =
  'mt-2 w-full rounded-lg border border-cream/15 bg-ink px-4 py-3 text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold'

function Field({ label, required, children }) {
  return (
    <label className="block text-sm font-medium text-cream/80">
      {label}
      {required && <span className="text-brand-gold"> *</span>}
      {children}
    </label>
  )
}

const emptyForm = { name: '', email: '', phone: '', linkedin: '', message: '', resume: null }

/** Application dialog: collects details + resume and posts them to the Lambda mailer. */
export default function ApplyModal({ job, open, onClose, eyebrow = 'Apply' }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)

  // lock page scroll, close on Escape, focus the first field
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  // reset when reopened after a successful send
  useEffect(() => {
    if (open && status === 'sent') {
      setForm(emptyForm)
      setStatus('idle')
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onFile = (e) => {
    const file = e.target.files?.[0] ?? null
    setError('')
    if (file && !RESUME_TYPES.includes(file.type)) {
      setError('Please upload your resume as a PDF or Word document.')
      e.target.value = ''
      return
    }
    if (file && file.size > MAX_RESUME_BYTES) {
      setError('Resume must be 4 MB or smaller.')
      e.target.value = ''
      return
    }
    setForm((f) => ({ ...f, resume: file }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.resume) {
      setError('Please attach your resume.')
      return
    }
    setStatus('submitting')
    try {
      await submitApplication(job, form)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  const canSubmit = status !== 'submitting' && form.name && form.email && form.resume

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
    >
      <div
        className="absolute inset-0 bg-[#030a18]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-cream/15 bg-ink-light shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 px-6 py-5 sm:px-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              {eyebrow}
            </div>
            <h2 id="apply-title" className="mt-1 font-serif text-2xl text-cream sm:text-3xl">
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-full p-2 text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {status === 'sent' ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-ink">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-5 font-serif text-3xl text-cream">Application sent</h3>
              <p className="mx-auto mt-3 max-w-md text-cream/70">
                Thank you, {form.name.split(' ')[0]}. Your application has been delivered to our
                hiring team. We will be in touch.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 inline-flex items-center rounded-full bg-brand-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5" noValidate>
              {!hasEndpoint && (
                <div className="rounded-lg border border-brand-gold/40 bg-brand-gold/10 p-3 text-sm text-cream/90">
                  Online applications are not live yet. Please email your resume to{' '}
                  <a className="text-brand-gold underline" href="mailto:pranaya@2mscorp.com">
                    pranaya@2mscorp.com
                  </a>
                  .
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input ref={firstFieldRef} className={inputClass} required value={form.name} onChange={set('name')} autoComplete="name" />
                </Field>
                <Field label="Email" required>
                  <input className={inputClass} type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
                </Field>
                <Field label="Phone">
                  <input className={inputClass} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                </Field>
                <Field label="LinkedIn profile">
                  <input className={inputClass} type="url" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={set('linkedin')} />
                </Field>
              </div>
              <Field label="Resume (PDF or Word, up to 4 MB)" required>
                <input
                  className="mt-2 block w-full text-sm text-cream/70 file:mr-4 file:rounded-full file:border-0 file:bg-cream/10 file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-cream hover:file:bg-cream/20"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFile}
                />
              </Field>
              <Field label="Cover note">
                <textarea
                  className={inputClass}
                  rows={4}
                  placeholder="Tell us briefly about your background and why this role."
                  value={form.message}
                  onChange={set('message')}
                />
              </Field>

              {error && (
                <div role="alert" className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="text-xs text-cream/50">Sent directly to the 2MS Corporation hiring team.</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center rounded-full bg-brand-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Submit application'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
