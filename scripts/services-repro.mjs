// Reproduce "services not shown": realistic gradual scroll + nav click,
// at a large desktop viewport and mobile.
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
const errors = []

// -- 1) desktop 1920x1080, scroll down gradually like a user ----------------
let page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('console', (m) => m.type() === 'error' && errors.push('desktop console: ' + m.text()))
page.on('pageerror', (e) => errors.push('desktop pageerror: ' + e.message))
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

const servicesTop = await page.evaluate(() => document.querySelector('#services').offsetTop)
for (let y = 0; y < servicesTop + 200; y += 400) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(1500)
await page.screenshot({ path: 'screenshots/repro-desktop-gradual.png' })

// visibility probe: are the cards actually visible?
const probe = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('#services .reveal')]
  return cards.map((c) => {
    const cs = getComputedStyle(c)
    const r = c.getBoundingClientRect()
    return { opacity: cs.opacity, visible: cs.visibility, w: Math.round(r.width), h: Math.round(r.height), isVisible: c.classList.contains('is-visible') }
  })
})
console.log('desktop card probe:', JSON.stringify(probe))
await page.close()

// -- 2) desktop, click the Services nav link --------------------------------
page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('pageerror', (e) => errors.push('navclick pageerror: ' + e.message))
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)
await page.click('header a[href="#services"]')
await page.waitForTimeout(2500) // smooth scroll + reveal
await page.screenshot({ path: 'screenshots/repro-desktop-navclick.png' })
await page.close()

// -- 3) mobile gradual scroll ------------------------------------------------
page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
page.on('pageerror', (e) => errors.push('mobile pageerror: ' + e.message))
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)
const mTop = await page.evaluate(() => document.querySelector('#services').offsetTop)
for (let y = 0; y < mTop + 200; y += 350) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(1500)
await page.screenshot({ path: 'screenshots/repro-mobile-gradual.png' })
await page.close()

await browser.close()
if (errors.length) {
  console.log('ERRORS:')
  errors.forEach((e) => console.log(' - ' + e))
  process.exit(1)
}
console.log('OK')
