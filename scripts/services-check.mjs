// Screenshot the services section, including a hovered card, desktop + mobile.
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
  await page.evaluate(() => {
    document.querySelector('#services').scrollIntoView({ block: 'start' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `screenshots/services-${vp.name}.png` })
  if (!vp.isMobile) {
    await page.hover('#services h3') // hover the first card
    await page.waitForTimeout(600)
    await page.screenshot({ path: `screenshots/services-${vp.name}-hover.png` })
  }
  await page.close()
}
await browser.close()
console.log('done')
