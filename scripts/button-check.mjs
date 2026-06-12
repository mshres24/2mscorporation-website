// Close-up of the hero CTA buttons to check label rendering.
import { chromium } from 'playwright'

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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)
const btn = await page.locator('a', { hasText: 'Begin the Journey' }).first().boundingBox()
await page.screenshot({
  path: 'screenshots/hero-buttons.png',
  clip: { x: btn.x - 60, y: btn.y - 40, width: 600, height: 140 },
})
await browser.close()
console.log('done')
