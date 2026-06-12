import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------------ *
 * A procedural, painterly rail journey rendered behind the whole page.
 * Scroll scrubs the camera along a winding light-rail line that climbs
 * through alpine mountains, crosses into red-rock desert (rising to a
 * bird's-eye view over the canyons), and descends into a sunset finale.
 * Everything is generated — terrain, track, train — no assets to load.
 * ------------------------------------------------------------------------ */

const L = 1560 // journey length (world units)

const trackX = (s) => 24 * Math.sin(s * 0.011) + 11 * Math.sin(s * 0.0265 + 1.6)
const trackY = (s) => 2.2 + 1.6 * Math.sin(s * 0.0085)
const pointAt = (s) => new THREE.Vector3(trackX(s), trackY(s), -s)

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t

function makeNoise(seed) {
  const rand = (x, z) => {
    const s = Math.sin(x * 127.1 + z * 311.7 + seed * 74.7) * 43758.5453
    return s - Math.floor(s)
  }
  const fade = (t) => t * t * (3 - 2 * t)
  const noise2 = (x, z) => {
    const xi = Math.floor(x)
    const zi = Math.floor(z)
    const xf = x - xi
    const zf = z - zi
    const a = rand(xi, zi)
    const b = rand(xi + 1, zi)
    const c = rand(xi, zi + 1)
    const d = rand(xi + 1, zi + 1)
    const u = fade(xf)
    const v = fade(zf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  return (x, z, oct = 4) => {
    let f = 0
    let amp = 0.5
    let fr = 1
    for (let i = 0; i < oct; i++) {
      f += amp * noise2(x * fr, z * fr)
      amp *= 0.5
      fr *= 2
    }
    return f
  }
}

/* Camera + atmosphere keyframes over scroll progress.
 * h: camera height, back: distance behind train, side: lateral offset,
 * look: how far ahead the camera aims, sunH: sun elevation. */
const KEYS = [
  { p: 0.0,  h: 8,  back: 15, side: 3.5, look: 24, sunH: 95, sunI: 1.15, hemi: 1.0,  sky: '#7fb2d6', fog: '#9cc4dd', sun: '#fff3df', fogN: 45, fogF: 320 },
  { p: 0.16, h: 12, back: 17, side: 4.5, look: 24, sunH: 88, sunI: 1.1,  hemi: 0.95, sky: '#6ea7cf', fog: '#8fb8d3', sun: '#ffeccd', fogN: 45, fogF: 320 },
  { p: 0.34, h: 24, back: 16, side: 5,   look: 18, sunH: 80, sunI: 1.05, hemi: 0.9,  sky: '#9fae9d', fog: '#b3ae90', sun: '#ffe2b0', fogN: 60, fogF: 360 },
  { p: 0.52, h: 44, back: 7,  side: 2,   look: 16, sunH: 72, sunI: 0.95, hemi: 0.68, sky: '#dfae74', fog: '#e6bc8d', sun: '#ffd9a0', fogN: 130, fogF: 560 },
  { p: 0.68, h: 52, back: 5,  side: 0,   look: 15, sunH: 60, sunI: 0.95, hemi: 0.62, sky: '#d9a263', fog: '#deab74', sun: '#ffce8a', fogN: 130, fogF: 560 },
  { p: 0.84, h: 17, back: 15, side: 5,   look: 17, sunH: 32, sunI: 1.25, hemi: 0.6,  sky: '#a96a44', fog: '#a86c46', sun: '#ffb46a', fogN: 55, fogF: 300 },
  { p: 1.0,  h: 7,  back: 14, side: 3,   look: 19, sunH: 13, sunI: 1.3,  hemi: 0.5,  sky: '#54364e', fog: '#6e4a56', sun: '#ff9a4d', fogN: 45, fogF: 260 },
]

function sampleKeys(p, out) {
  let i = 0
  while (i < KEYS.length - 2 && KEYS[i + 1].p < p) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = clamp01((p - a.p) / (b.p - a.p))
  for (const k of ['h', 'back', 'side', 'look', 'sunH', 'sunI', 'hemi', 'fogN', 'fogF']) {
    out[k] = lerp(a[k], b[k], t)
  }
  out.sky.set(a.sky).lerp(new THREE.Color(b.sky), t)
  out.fog.set(a.fog).lerp(new THREE.Color(b.fog), t)
  out.sun.set(a.sun).lerp(new THREE.Color(b.sun), t)
  return out
}

function buildTerrain(isMobile) {
  const noise = makeNoise(7)
  const W = 340
  const DEPTH = L + 140
  const nx = isMobile ? 84 : 124
  const nz = isMobile ? 430 : 640

  const mountainLow = new THREE.Color('#587c4e')
  const mountainMid = new THREE.Color('#6e7263')
  const mountainHigh = new THREE.Color('#8a8d94')
  const snow = new THREE.Color('#edf2f6')
  const sandLow = new THREE.Color('#d9a35f')
  const redRock = new THREE.Color('#bd6a3e')
  const mesaCap = new THREE.Color('#8f4f33')
  const canyonFloor = new THREE.Color('#9c6b3f')
  const ballastCol = new THREE.Color('#55514b')

  const positions = []
  const colors = []
  const indices = []
  const c = new THREE.Color()
  const c2 = new THREE.Color()

  for (let iz = 0; iz <= nz; iz++) {
    const s = (iz / nz) * DEPTH - 60
    const tx = trackX(Math.max(0, Math.min(L, s)))
    const ty = trackY(Math.max(0, Math.min(L, s)))
    const biome = smoothstep(580, 950, s)
    for (let ix = 0; ix <= nx; ix++) {
      const x = (ix / nx) * W - W / 2
      const d = Math.abs(x - tx)

      // ridged mountains rise away from the track; desert forms stepped mesas
      const ridge = 1 - Math.abs(2 * noise(x * 0.016, s * 0.016, 4) - 1)
      const mountainH = Math.pow(ridge, 1.5) * 34 * smoothstep(9, 78, d)
      const dn = noise(x * 0.011, s * 0.011, 3)
      // canyon walls hug the line in the desert so the aerial views read
      const desertH = (Math.round(dn * 4) / 4) * 26 * smoothstep(13, 42, d) + dn * 2.5
      let h = lerp(mountainH, desertH, biome)
      h += noise(x * 0.06, s * 0.06, 2) * 2.2

      // carve the rail bed
      const bed = ty - 0.42
      h = lerp(bed, Math.max(h, bed - 1.5), smoothstep(4.5, 26, d))

      positions.push(x, h, -s)

      // color by biome + relative height, ballast near the track
      const hn = h - ty
      if (hn < 4) c.copy(mountainLow)
      else if (hn < 15) c.copy(mountainLow).lerp(mountainMid, smoothstep(4, 15, hn))
      else if (hn < 26) c.copy(mountainMid).lerp(mountainHigh, smoothstep(15, 26, hn))
      else c.copy(mountainHigh).lerp(snow, smoothstep(26, 34, hn))

      if (hn < 5) c2.copy(canyonFloor).lerp(sandLow, smoothstep(0.5, 4.5, hn))
      else if (hn < 16) c2.copy(sandLow).lerp(redRock, smoothstep(5, 16, hn))
      else c2.copy(redRock).lerp(mesaCap, smoothstep(16, 26, hn))

      c.lerp(c2, biome)
      c.lerp(ballastCol, 1 - smoothstep(2.5, 7, d))

      // stratified rock bands + scrub speckle give the desert a topo-like
      // read from the bird's-eye chapters
      const strata = 1 - 0.16 * biome * (0.5 + 0.5 * Math.sin(hn * 2.1 + dn * 4))
      let tint = (0.9 + 0.2 * noise(x * 0.15, s * 0.15, 2)) * strata
      if (biome > 0.5 && hn < 10 && noise(x * 0.5, s * 0.5, 2) > 0.6) tint *= 0.78
      // braided dry washes vein the desert floor for the aerial chapters
      if (biome > 0.4 && hn < 5) {
        const wash = noise(x * 0.045 + 31, s * 0.045, 3)
        if (wash > 0.46 && wash < 0.54) tint *= 0.78
      }
      colors.push(c.r * tint, c.g * tint, c.b * tint)
    }
  }
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const a = iz * (nx + 1) + ix
      const b = a + 1
      const d = a + (nx + 1)
      const e = d + 1
      indices.push(a, d, b, b, d, e)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })
  return new THREE.Mesh(geo, mat)
}

function buildTrack(isMobile) {
  const group = new THREE.Group()
  const up = new THREE.Vector3(0, 1, 0)

  const railPts = { left: [], right: [] }
  const step = 2
  for (let s = 0; s <= L; s += step) {
    const p = pointAt(s)
    const t = pointAt(s + 1).sub(p).normalize()
    const n = new THREE.Vector3().crossVectors(up, t).normalize()
    railPts.left.push(p.clone().addScaledVector(n, 0.55))
    railPts.right.push(p.clone().addScaledVector(n, -0.55))
  }
  const railMat = new THREE.MeshStandardMaterial({ color: '#3c4654', roughness: 0.45, metalness: 0.6 })
  const seg = isMobile ? 500 : 900
  for (const side of ['left', 'right']) {
    const curve = new THREE.CatmullRomCurve3(railPts[side])
    const tube = new THREE.TubeGeometry(curve, seg, 0.07, 5)
    group.add(new THREE.Mesh(tube, railMat))
  }

  // the golden line — the journey's glowing thread
  const centerPts = []
  for (let s = 0; s <= L; s += step) {
    const p = pointAt(s)
    p.y += 0.04
    centerPts.push(p)
  }
  const glowCurve = new THREE.CatmullRomCurve3(centerPts)
  const glowMat = new THREE.MeshBasicMaterial({ color: '#f5a623' })
  group.add(new THREE.Mesh(new THREE.TubeGeometry(glowCurve, seg, 0.05, 4), glowMat))

  // crossties
  const tieSpacing = isMobile ? 2.4 : 1.6
  const count = Math.floor(L / tieSpacing)
  const tieGeo = new THREE.BoxGeometry(1.7, 0.09, 0.4)
  const tieMat = new THREE.MeshStandardMaterial({ color: '#3a342c', roughness: 1 })
  const ties = new THREE.InstancedMesh(tieGeo, tieMat, count)
  const dummy = new THREE.Object3D()
  for (let i = 0; i < count; i++) {
    const s = i * tieSpacing
    const p = pointAt(s)
    dummy.position.set(p.x, p.y - 0.1, p.z)
    dummy.lookAt(pointAt(s + 1).setY(p.y - 0.1))
    dummy.updateMatrix()
    ties.setMatrixAt(i, dummy.matrix)
  }
  group.add(ties)
  return group
}

function buildCar(isFront) {
  const car = new THREE.Group()
  const navy = new THREE.MeshStandardMaterial({ color: '#1d4f91', roughness: 0.55 })
  const navyDark = new THREE.MeshStandardMaterial({ color: '#143a6b', roughness: 0.6 })
  const gold = new THREE.MeshStandardMaterial({ color: '#f5a623', roughness: 0.5 })
  const glass = new THREE.MeshStandardMaterial({
    color: '#bcd7f5',
    roughness: 0.2,
    emissive: '#7fa8d9',
    emissiveIntensity: 0.35,
  })

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.15, 3.6), navy)
  body.position.y = 0.85
  car.add(body)

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 3.3), navyDark)
  roof.position.y = 1.5
  car.add(roof)

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.16, 3.6), gold)
  stripe.position.y = 0.5
  car.add(stripe)

  for (const sx of [-0.78, 0.78]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 2.9), glass)
    win.position.set(sx, 1.05, 0)
    car.add(win)
  }

  const bogie = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 2.6), navyDark)
  bogie.position.y = 0.18
  car.add(bogie)

  if (isFront) {
    // sloped nose + windshield + headlight on the leading car
    const nose = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 0.7), navy)
    nose.position.set(0, 0.75, 2.05)
    nose.rotation.x = -0.22
    car.add(nose)
    const shield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.06), glass)
    shield.position.set(0, 1.18, 1.95)
    shield.rotation.x = -0.25
    car.add(shield)
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 10, 10),
      new THREE.MeshBasicMaterial({ color: '#ffe9b8' })
    )
    light.position.set(0, 0.55, 2.42)
    car.add(light)
  }
  return car
}

export default function SceneJourney() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      return undefined // no WebGL: the ink gradient background stays
    }

    const isMobile = window.innerWidth < 768
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#7fb2d6')
    scene.fog = new THREE.Fog('#9cc4dd', 55, 320)

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 700)

    scene.add(new THREE.AmbientLight('#b6c6dd', 0.5))
    const hemi = new THREE.HemisphereLight('#cfe6f5', '#5a4a3a', 0.85)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#fff3df', 1.15)
    scene.add(sun)
    scene.add(sun.target)

    scene.add(buildTerrain(isMobile))
    scene.add(buildTrack(isMobile))

    const cars = [buildCar(true), buildCar(false), buildCar(false)]
    cars.forEach((c) => scene.add(c))

    // --- scroll-driven camera ---------------------------------------------
    const atmo = { sky: new THREE.Color(), fog: new THREE.Color(), sun: new THREE.Color() }
    let target = 0
    let current = 0
    let dirty = true
    let raf

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        target = self.progress
        dirty = true
      },
    })

    const ahead = new THREE.Vector3()
    const apply = (p) => {
      sampleKeys(p, atmo)
      const dTrain = 30 + p * (L - 115)

      cars.forEach((car, i) => {
        const s = dTrain - i * 4.5
        const pos = pointAt(s)
        car.position.copy(pos)
        ahead.copy(pointAt(s + 2))
        car.lookAt(ahead)
      })

      const dCam = dTrain - atmo.back
      const camPos = pointAt(dCam)
      camera.position.set(camPos.x + atmo.side, camPos.y + atmo.h, camPos.z)
      const look = pointAt(dCam + atmo.look)
      camera.lookAt(look.x, look.y + 1.5, look.z)

      scene.background.copy(atmo.sky)
      scene.fog.color.copy(atmo.fog)
      scene.fog.near = atmo.fogN
      scene.fog.far = atmo.fogF
      sun.color.copy(atmo.sun)
      sun.intensity = atmo.sunI
      hemi.intensity = atmo.hemi
      sun.position.set(camera.position.x + 60, atmo.sunH + camera.position.y, camera.position.z - 50)
      sun.target.position.copy(cars[0].position)
    }

    const tick = () => {
      if (reduceMotion) current = target
      else current += (target - current) * 0.075
      if (Math.abs(target - current) < 0.0004) current = target
      else dirty = true
      if (dirty) {
        apply(current)
        renderer.render(scene, camera)
        dirty = Math.abs(target - current) > 0.0004
      }
      raf = requestAnimationFrame(tick)
    }
    apply(0)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      dirty = true
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      trigger.kill()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" className="fixed inset-0 z-0" />
}
