<script setup lang="ts">
import type { ResourceItem } from '@/types/resource';

import { ArrowUpRight } from 'lucide-vue-next';
import { computed } from 'vue';

import ResourceIcon from './ResourceIcon.vue';

const props = withDefaults(defineProps<{
  item: ResourceItem;
  index?: number;
}>(), {
  index: 0,
});

const typeLabel: Record<ResourceItem['type'], string> = {
  tool: 'TOOL',
  report: 'REPORT',
  external: 'EXTERNAL',
};

const typeName: Record<ResourceItem['type'], string> = {
  tool: 'เครื่องมือ',
  report: 'รายงาน',
  external: 'ภายนอก',
};

const code = computed(() => `${typeLabel[props.item.type]}-${String(props.index).padStart(2, '0')}`);
</script>

<template>
  <article
    class="card"
    :class="[`card--${item.type}`, { 'card--off': !item.isActive }]"
  >
    <div class="card-top">
      <span class="card-index mono">{{ String(index).padStart(2, '0') }}</span>
      <span class="card-status">
        <span
          class="status-dot"
          :class="item.isActive ? 'status-dot--live' : 'status-dot--pulse'"
        />
        {{ item.isActive ? 'พร้อมใช้' : 'ปิดปรับปรุง' }}
      </span>
    </div>

    <div class="card-body">
      <div class="card-icon">
        <ResourceIcon :name="item.iconName" :size="26" :stroke-width="1.5" />
      </div>
      <span class="card-type mono">{{ typeName[item.type] }}</span>
      <h3 class="card-title">
        {{ item.title }}
      </h3>
      <p class="card-desc">
        {{ item.description }}
      </p>
    </div>

    <footer class="card-foot">
      <span class="card-code mono">{{ code }}</span>
      <a
        v-if="item.isActive"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="card-link"
      >
        เปิดใช้งาน
        <ArrowUpRight :size="16" :stroke-width="1.9" aria-hidden="true" />
      </a>
      <span v-else class="card-link card-link--off">
        เร็ว ๆ นี้
      </span>
    </footer>
  </article>
</template>

<style scoped>
.card {
  --accent: var(--bottle);

  position: relative;
  display: flex;
  min-height: 280px;
  flex-direction: column;
  padding: 1rem 1.05rem 0.95rem;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  transition:
    transform 0.24s var(--ease-out),
    border-color 0.24s ease,
    box-shadow 0.24s ease;
}

.card--report {
  --accent: #b8411c;
}

.card--external {
  --accent: var(--gold);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--ink);
  box-shadow: 5px 5px 0 0 var(--accent);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.card-index {
  color: var(--ink-3);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  color: var(--ink-3);
  font-size: 0.6rem;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.1rem 0 1.2rem;
}

.card-icon {
  display: grid;
  place-items: center;
  width: 3.15rem;
  height: 3.15rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--accent);
  transition:
    background-color 0.24s ease,
    color 0.24s ease,
    border-color 0.24s ease;
}

.card:hover .card-icon {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--paper-raised);
}

.card-type {
  margin-top: 0.9rem;
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.card-title {
  margin-top: 0.32rem;
  font-size: clamp(1rem, 1.25vw, 1.16rem);
  font-weight: 600;
  line-height: 1.35;
}

.card-desc {
  display: -webkit-box;
  max-width: 32ch;
  margin-top: 0.45rem;
  overflow: hidden;
  color: var(--ink-3);
  font-size: 0.76rem;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--line-strong);
}

.card-code {
  color: var(--ink-3);
  font-size: 0.52rem;
  letter-spacing: 0.08em;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 500;
  transition:
    gap 0.2s ease,
    color 0.2s ease;
}

.card-link:hover {
  gap: 0.5rem;
  color: var(--accent);
}

.card-link--off {
  color: var(--ink-3);
  cursor: default;
}

.card-link--off:hover {
  gap: 0.35rem;
  color: var(--ink-3);
}

.card--off {
  background: repeating-linear-gradient(-45deg, transparent 0 7px, rgb(20 32 27 / 0.022) 7px 8px), var(--paper-raised);
}

.card--off:hover {
  transform: translateY(-2px);
  border-color: var(--line-strong);
  box-shadow: 4px 4px 0 0 var(--line);
}

.card--off .card-title {
  color: var(--ink-2);
}

.card--off .card-icon {
  color: var(--ink-3);
}

@media (max-width: 640px) {
  .card {
    min-height: 250px;
  }
}
</style>
