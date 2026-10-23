<!-- src/layouts/BlankLayout.vue -->
<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<style scoped>
.blank-layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--paper);
  color: var(--ink);
}
</style>
