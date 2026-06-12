// Extract reference frames from public/everswap.mp4 using a headless browser.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots/everswap', { recursive: true })

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
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

await page.setContent(`
  <body style="margin:0;background:#000">
    <video id="v" src="http://localhost:5173/everswap.mp4" muted playsinline
           style="width:100vw;height:100vh;object-fit:contain"></video>
  </body>`)

const duration = await page.evaluate(
  () =>
    new Promise((res, rej) => {
      const v = document.getElementById('v')
      if (v.readyState >= 1) return res(v.duration)
      v.onloadedmetadata = () => res(v.duration)
      v.onerror = () => rej(new Error('video failed to load'))
      setTimeout(() => rej(new Error('timeout waiting for metadata, readyState=' + v.readyState)), 20000)
    })
)
console.log('duration:', duration.toFixed(1), 's')

const N = 12
for (let i = 0; i < N; i++) {
  const t = (duration * i) / (N - 1)
  await page.evaluate(
    (time) =>
      new Promise((res) => {
        const v = document.getElementById('v')
        v.onseeked = () => res()
        v.currentTime = time
      }),
    Math.min(t, duration - 0.1)
  )
  await page.waitForTimeout(200)
  await page.screenshot({ path: `screenshots/everswap/frame-${String(i).padStart(2, '0')}.png` })
}
await browser.close()
console.log('done')
