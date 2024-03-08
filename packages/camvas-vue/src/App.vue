<script setup lang="ts">
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

    <div
      :class="
        css(
          {
            bg: 'gray.800',
            color: 'white',
            padding: 2,
          },
          wFull,
        )
      "
    >
      <div
        :class="
          css({
            display: 'flex',
          })
        "
      ></div>

      <button>select</button>
    </div>
  </div>
</template>
