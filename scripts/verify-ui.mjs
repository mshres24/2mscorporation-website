// Drives the dev server in headless Chromium (via CDP) to verify the UI:
// captures console errors and screenshots at several scroll depths for
// desktop and mobile viewports. Run: node scripts/verify-ui.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = 'http://localhost:5173/'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
]

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel })
    } catch {
      /* try next channel */
    }
  }
  return chromium.launch()
}

const browser = await launch()
const errors = []

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.hasTouch ?? false,
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${vp.name}] console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000) // let the loader finish and entrance animations settle

  const total = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  )
  for (const frac of [0, 0.18, 0.4, 0.62, 0.82, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac))
    await page.waitForTimeout(900) // let scrubbed/eased animations catch up
    await page.screenshot({ path: `${OUT}/${vp.name}-${Math.round(frac * 100)}.png` })
  }

  // horizontal overflow check (common mobile-friendliness bug)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  if (overflow > 0) errors.push(`[${vp.name}] horizontal overflow: ${overflow}px`)

  await context.close()
}

await browser.close()

if (errors.length) {
  console.log('ISSUES FOUND:')
  errors.forEach((e) => console.log(' - ' + e))
  process.exit(1)
}
console.log('OK: no console errors, no horizontal overflow. Screenshots in ./' + OUT)
