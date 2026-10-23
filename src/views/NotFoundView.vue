<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="notfound">
    <div class="nf-top">
      <span class="mono">ERROR 404</span>
      <span class="mono">ROOM NOT FOUND</span>
    </div>

    <div class="nf-body rise-in">
      <p class="eyebrow">
        Wrong door
      </p>
      <h1 aria-label="404">
        <span>4</span><span class="nf-zero">0</span><span>4</span>
      </h1>
      <h2>ไม่พบหน้าที่คุณต้องการ</h2>
      <p class="nf-desc">
        หน้านี้อาจถูกย้ายหรือไม่มีอยู่
      </p>
      <RouterLink to="/" class="nf-link">
        กลับสู่หน้าหลัก
        <ArrowRight :size="17" :stroke-width="1.8" aria-hidden="true" />
      </RouterLink>
    </div>

    <div class="nf-foot">
      <span class="mono">RX ROOM · SABOT</span>
      <span class="mono">TRY THE FRONT DOOR</span>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  display: flex;
  min-height: calc(100vh - 62px);
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3.6vw, 3.25rem) 2.2rem;
  background: radial-gradient(circle at 78% 18%, rgb(215 232 216 / 0.7), transparent 34%), var(--paper);
}

.nf-top,
.nf-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.12em;
}

.nf-body {
  width: min(100%, 760px);
  margin: auto;
  padding: 2rem 0;
}

.nf-body h1 {
  display: flex;
  align-items: baseline;
  gap: 0.02em;
  margin-top: 0.7rem;
  font-family: var(--font-mono);
  font-size: clamp(6rem, 19vw, 15rem);
  font-weight: 500;
  letter-spacing: -0.12em;
  line-height: 0.8;
}

.nf-body h1 span {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--ink);
}

.nf-body h1 .nf-zero {
  color: var(--signal);
  -webkit-text-stroke: 0;
}

.nf-body h2 {
  margin-top: 1.4rem;
  font-size: clamp(1.7rem, 3.2vw, 2.6rem);
}

.nf-desc {
  max-width: 46ch;
  margin-top: 0.7rem;
  color: var(--ink-2);
  font-size: 0.86rem;
  line-height: 1.75;
}

.nf-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.6rem;
  padding: 0.72rem 1.15rem;
  border-radius: var(--radius-pill);
  background: var(--bottle);
  color: var(--paper-raised);
  font-size: 0.8rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    gap 0.2s ease;
}

.nf-link:hover {
  gap: 0.7rem;
  background: var(--signal);
}

@media (max-width: 680px) {
  .notfound {
    min-height: calc(100vh - 62px);
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .nf-foot span:last-child {
    display: none;
  }
}
</style>
