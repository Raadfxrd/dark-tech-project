<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { windowOpacity } from '~/lib/timeline.js'

const emit = defineEmits(['ready'])

// Each caption's window in story progress (0–1). The camera holds still inside them; lib/glove.js moves it in the gaps.
const WINDOWS = [[-1, 0.11], [0.17, 0.39], [0.43, 0.6], [0.64, 0.89], [0.93, 2]]
const FADE = 0.035
const W = 2 * Math.PI / 0.3 // spring between scrollbar and story: critically damped, response 0.3 s

const modelUrl = `${useRuntimeConfig().app.baseURL}models/greep_A_handschoen.glb`
const story = ref(null)
const canvas = ref(null)
const ready = ref(false)
const failed = ref(false)
const readout = reactive({ mcp: 0, pip: 0, dip: 0, rope: 0 })

let raf = 0
let glove = null
let cleanup = () => {}

onMounted(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const frames = [...story.value.querySelectorAll('.frame')]
  const shown = frames.map(() => -1)
  let target = 0, p = 0, v = 0, prev = performance.now(), visible = true

  const measure = () => {
    const r = story.value.getBoundingClientRect()
    const range = r.height - innerHeight // 0 until the stylesheet has sized the story; NaN would stick in the spring
    target = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
  }
  measure()
  p = target
  addEventListener('scroll', measure, { passive: true })
  const sizer = new ResizeObserver(measure)
  sizer.observe(story.value)
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(story.value)
  cleanup = () => {
    removeEventListener('scroll', measure)
    sizer.disconnect()
    io.disconnect()
    glove?.dispose()
  }

  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.1, (now - prev) / 1000)
    prev = now
    if (!visible) return
    if (still) p = target
    else {
      // Small fixed steps keep the spring stable when a frame comes late.
      for (let left = dt; left > 0; left -= 1 / 240) {
        const h = Math.min(left, 1 / 240)
        v += (W * W * (target - p) - 2 * W * v) * h
        p += v * h
      }
    }
    frames.forEach((el, i) => {
      const o = windowOpacity(p, WINDOWS[i], FADE)
      if (o === shown[i]) return
      shown[i] = o
      el.style.opacity = o
      el.style.visibility = o ? 'visible' : 'hidden'
      // Captions arrive from below and leave upwards, the way the page scrolls.
      const [a, b] = WINDOWS[i]
      if (!still) el.style.translate = `0 ${(1 - o) * (p < (a + b) / 2 ? 18 : -18)}px`
    })
    if (glove) Object.assign(readout, glove.render(p, now))
  }
  raf = requestAnimationFrame(tick)

  import('~/lib/glove.js')
    .then(({ createGlove }) => createGlove(canvas.value, { modelUrl, still }))
    .then((g) => {
      glove = g
      ready.value = true
      emit('ready', g)
    })
    .catch((e) => {
      console.error(e)
      failed.value = true
    })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  cleanup()
})
</script>

<template>
  <section ref="story" class="story" aria-label="Greep H1 en hoe hij werkt">
    <span id="zo-werkt-het" class="anchor" />
    <div class="stage">
      <canvas ref="canvas" :class="{ ready }" role="img" aria-label="3D-model van de Greep H1: een handschoen met een touw naar de wijsvinger en een module op de onderarm" />
      <img v-if="failed" class="fallback" src="/logo.svg" alt="">
      <div class="copy">
        <div class="frame frame-hero">
          <p class="product">Greep H1</p>
          <h1>Jouw hand.<br>Onze zorg.</h1>
          <p class="lede">Een handschoen die je wijsvinger voor je beweegt. Alle techniek zit in een kleine module op je onderarm.</p>
          <div class="cta">
            <a class="btn" href="#kopen">Reserveer voor €199</a>
            <a class="link" href="#zo-werkt-het">Zo werkt het</a>
          </div>
        </div>
        <div class="frame">
          <p class="step"><span class="step-n">1</span>De module</p>
          <h2>Alle kracht zit op je onderarm.</h2>
          <p>Een servo wikkelt een touw op een spoel van 16 mm. Twee klittenbanden houden de module 52 mm achter je pols, zodat je pols vrij blijft bewegen.</p>
        </div>
        <div class="frame">
          <p class="step"><span class="step-n">2</span>Het touw</p>
          <h2>Een pees die je niet ziet.</h2>
          <p>Het touw loopt door een rietje in je handpalm en door twee ringen naar de top van je wijsvinger. Daar zit het vastgenaaid.</p>
        </div>
        <div class="frame">
          <p class="step"><span class="step-n">3</span>De beweging</p>
          <h2>Je vinger buigt. Jij hoeft niets te doen.</h2>
          <dl class="readout">
            <div><dt>Knokkel</dt><dd>{{ readout.mcp }}°</dd></div>
            <div><dt>Midden</dt><dd>{{ readout.pip }}°</dd></div>
            <div><dt>Top</dt><dd>{{ readout.dip }}°</dd></div>
            <div class="readout-rope"><dt>Touw</dt><dd>{{ readout.rope }} mm</dd></div>
          </dl>
        </div>
        <div class="frame frame-motto">
          <p class="motto">Beweging met vertrouwen.</p>
        </div>
      </div>
    </div>
  </section>
</template>
