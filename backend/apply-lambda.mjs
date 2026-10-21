// AWS Lambda (Node.js 20.x) that receives a job application from the careers
// page and emails it, with the resume attached, to the hiring team via SES.
// Deploy behind a Lambda Function URL (auth: NONE) and put that URL in
// VITE_APPLY_ENDPOINT. CORS is configured on the Function URL itself, so this
// code must NOT add CORS headers (the browser rejects duplicated values).
// See backend/README.md for console steps.
//
// Environment variables:
//   SENDER      verified SES identity the email is sent from, e.g. careers@2mscorporation.com
//   RECIPIENTS  comma-separated list, e.g. medhaj@2mscorporation.com,megha@2mscorporation.com,pranaya@2mscorporation.com

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const ses = new SESv2Client({})
const MAX_RESUME_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const respond = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const clean = (v, max = 500) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export const handler = async (event) => {
  if (event.requestContext?.http?.method !== 'POST') {
    return respond(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body)
  } catch {
    return respond(400, { error: 'Invalid JSON' })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const phone = clean(body.phone, 60)
  const linkedin = clean(body.linkedin, 300)
  const jobTitle = clean(body.jobTitle, 200) || 'General application'
  const message = String(body.message ?? '').trim().slice(0, 5000)

  if (!name || !isEmail(email)) return respond(400, { error: 'Name and a valid email are required.' })

  let resume = null
  if (body.resume?.data) {
    const buf = Buffer.from(String(body.resume.data), 'base64')
    const contentType = clean(body.resume.contentType, 100)
    if (!ALLOWED_TYPES.has(contentType)) return respond(400, { error: 'Resume must be a PDF or Word document.' })
    if (buf.length > MAX_RESUME_BYTES) return respond(400, { error: 'Resume must be 4 MB or smaller.' })
    const filename = clean(body.resume.filename, 150).replace(/[^\w. -]/g, '_') || 'resume'
    resume = { buf, contentType, filename }
  }

  const recipients = (process.env.RECIPIENTS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const sender = process.env.SENDER
  if (!sender || recipients.length === 0) return respond(500, { error: 'Mailer is not configured.' })

  const text = [
    `New application: ${jobTitle}`,
    '',
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${phone || '-'}`,
    `LinkedIn: ${linkedin || '-'}`,
    '',
    'Cover note:',
    message || '(none)',
    '',
    resume ? `Resume attached: ${resume.filename}` : 'No resume attached.',
  ].join('\r\n')

  const boundary = `----=_2ms_${Date.now()}`
  const headers = [
    `From: 2MS Careers <${sender}>`,
    `To: ${recipients.join(', ')}`,
    `Reply-To: ${name} <${email}>`,
    `Subject: Application: ${jobTitle} - ${name}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
  ]
  const parts = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
  ]
  if (resume) {
    parts.push(
      `--${boundary}`,
      `Content-Type: ${resume.contentType}; name="${resume.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${resume.filename}"`,
      '',
      resume.buf.toString('base64').replace(/(.{76})/g, '$1\r\n')
    )
  }
  parts.push(`--${boundary}--`, '')

  const raw = headers.join('\r\n') + '\r\n' + parts.join('\r\n')

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: sender,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: [email],
        Content: { Raw: { Data: Buffer.from(raw) } },
      })
    )
  } catch (err) {
    console.error('SES send failed', err)
    return respond(502, { error: 'Could not send the application. Please try again later.' })
  }

  return respond(200, { ok: true })
}
