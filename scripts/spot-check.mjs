// Targeted spot-checks: PE badge fix on mobile + divider train mid-viewport.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots', { recursive: true })

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel })
    } catch {
      /* try next */
    }
  }
  return chromium.launch()
}

const browser = await launch()
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
})
const page = await context.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(e.message))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

// 1) contact outro centered in viewport (diamond emblem)
await page.evaluate(() => {
  document.querySelector('#contact').scrollIntoView({ block: 'center' })
})
await page.waitForTimeout(1200)
await page.screenshot({ path: 'screenshots/mobile-contact.png' })

// 2) a chapter moment mid-viewport
await page.evaluate(() => {
  document.querySelectorAll('section[aria-hidden]')[1].scrollIntoView({ block: 'center' })
})
await page.waitForTimeout(1200)
await page.screenshot({ path: 'screenshots/mobile-chapter.png' })

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
)
await browser.close()

if (errors.length || overflow > 0) {
  console.log('ISSUES:', JSON.stringify({ errors, overflow }))
  process.exit(1)
}
console.log('OK')
