<script setup lang="ts">
import CamvasControls from './components/Controls.vue';
import { useStyles } from './composables/styles';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

worker.addEventListener('message', (e) => {
  console.log('the thing', e.data);
});

const { css, wFull, hFull } = useStyles();
</script>

<template>
  <div
    :class="
      css(
        {
          display: 'flex',
          flexDirection: 'column',
          placeItems: 'center',
        },
        hFull,
      )
    "
  >
    <div
      :class="
        css(
          {
            paddingX: 10,
            flexGrow: 1,
          },
          wFull,
        )
      "
    >
      <canvas :class="css(wFull)"></canvas>
    </div>

    <CamvasControls />
  </div>
</template>
