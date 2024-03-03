<script setup lang="ts">
import Worker from './worker?worker'

const worker = new Worker()

worker.addEventListener('message', (e) => {
  console.log('the thing', e.data)
})
</script>

<template>
  <div></div>
</template>

