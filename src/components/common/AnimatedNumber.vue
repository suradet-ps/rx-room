<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  value: number;
  duration?: number;
  pad?: number;
}>(), {
  duration: 900,
  pad: 2,
});

const shown = ref(0);
let frame: number | undefined;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animate() {
  if (typeof window === 'undefined') {
    shown.value = props.value;
    return;
  }

  if (frame)
    cancelAnimationFrame(frame);

  if (prefersReducedMotion()) {
    shown.value = props.value;
    return;
  }

  const from = shown.value;
  const to = props.value;
  const startedAt = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / props.duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    shown.value = Math.round(from + (to - from) * eased);

    if (progress < 1)
      frame = requestAnimationFrame(tick);
    else
      shown.value = to;
  };

  frame = requestAnimationFrame(tick);
}

watch(() => props.value, animate);

onMounted(() => {
  shown.value = prefersReducedMotion() ? props.value : 0;
  animate();
});

onBeforeUnmount(() => {
  if (frame)
    cancelAnimationFrame(frame);
});

const label = computed(() => String(shown.value).padStart(props.pad, '0'));
</script>

<template>
  <span class="animated-number">{{ label }}</span>
</template>

<style scoped>
.animated-number {
  font-variant-numeric: tabular-nums;
}
</style>
