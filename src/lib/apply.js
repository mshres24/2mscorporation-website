export const MAX_RESUME_BYTES = 4 * 1024 * 1024
export const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const endpoint = import.meta.env.VITE_APPLY_ENDPOINT

/** True once VITE_APPLY_ENDPOINT points at the deployed Lambda Function URL. */
export const hasEndpoint = Boolean(endpoint)

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

/** POSTs the application (resume base64-encoded) to the Lambda, which emails the hiring team. */
export async function submitApplication(job, form) {
  if (!hasEndpoint) {
    throw new Error('Applications are not configured yet (VITE_APPLY_ENDPOINT is unset).')
  }

  const payload = {
    jobSlug: job.slug,
    jobTitle: job.title,
    name: form.name,
    email: form.email,
    phone: form.phone,
    linkedin: form.linkedin,
    message: form.message,
    resume: {
      filename: form.resume.name,
      contentType: form.resume.type || 'application/octet-stream',
      data: await readAsBase64(form.resume),
    },
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).error || ''
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }
}
