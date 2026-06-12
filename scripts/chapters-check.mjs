// Screenshot each chapter centered in the viewport, desktop + mobile.
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
for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
]) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.hasTouch ?? false,
  })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  const count = await page.evaluate(() => document.querySelectorAll('section[aria-hidden]').length)
  for (let i = 0; i < count; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('section[aria-hidden]')[idx].scrollIntoView({ block: 'center' })
    }, i)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `screenshots/chapter-${i}-${vp.name}.png` })
  }
  await page.close()
}
await browser.close()
console.log('done')
