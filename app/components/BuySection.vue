<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = defineProps({glove: {type: Object, default: null}})

const reserved = ref(false)
const shot = ref('')
const near = ref(false)
const figure = ref(null)

let io
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    near.value = true
    io.disconnect()
  }, {rootMargin: '600px 0px'})
  io.observe(figure.value)
})
onBeforeUnmount(() => io?.disconnect())

// The still costs one large frame, so it is rendered only once the model has loaded and this section is close.
watch([near, () => props.glove], ([isNear, glove]) => {
  if (isNear && glove && !shot.value) shot.value = glove.shot(1200)
})
</script>

<template>
  <section id="kopen" class="buy">
    <div class="wrap buy-grid">
      <figure ref="figure" class="shot">
        <img v-if="shot" :src="shot" alt="Greep H1: handschoen, vingerringen en module op de onderarm">
      </figure>
      <form class="buy-form" @submit.prevent="reserved = true">
        <h2 class="title">Greep H1</h2>
        <p class="price">€199</p>
        <button class="btn btn-lg" type="submit" :disabled="reserved">
          {{ reserved ? 'Gereserveerd' : 'Reserveer' }}
        </button>
        <p class="status" role="status">{{ reserved ? 'Je Greep H1 is gereserveerd.' : '' }}</p>
      </form>
    </div>
  </section>
</template>
