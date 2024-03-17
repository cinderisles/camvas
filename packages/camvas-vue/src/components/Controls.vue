<script setup lang="ts">
import { useStyles } from '../composables/styles';

defineOptions({
  name: 'CamvasControls',
});

const { css, wFull, hFull } = useStyles();
</script>

<template>
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
</template>
