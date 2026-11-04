<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = defineProps({glove: {type: Object, default: null}})

const reserved = ref(false)
const decided = ref(false) // Greep reserved, not the visitor
const shot = ref('')
const near = ref(false)
const figure = ref(null)
const form = ref(null)

let io, eye, timer
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    near.value = true
    io.disconnect()
  }, {rootMargin: '600px 0px'})
  io.observe(figure.value)

  // Testers asked for a demo that makes you do something you did not choose: linger here and Greep reserves for you.
  eye = new IntersectionObserver(([e]) => {
    clearTimeout(timer)
    if (e.isIntersecting && !reserved.value) timer = setTimeout(() => reserved.value = decided.value = true, 4000)
  }, {threshold: 0.6})
  eye.observe(form.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  eye?.disconnect()
  clearTimeout(timer)
})

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
      <form ref="form" class="buy-form" @submit.prevent="reserved = true">
        <h2 class="title">Greep H1</h2>
        <p class="price">€199</p>
        <button class="btn btn-lg" type="submit" :disabled="reserved">
          {{ reserved ? 'Gereserveerd' : 'Reserveer' }}
        </button>
        <p class="status" role="status">
          <template v-if="decided">Je twijfelde, dus Greep heeft alvast voor je gereserveerd. Annuleren gaat via je
            contactpersoon.
          </template>
          <template v-else-if="reserved">Je Greep H1 is gereserveerd.</template>
        </p>
      </form>
    </div>
  </section>
</template>
