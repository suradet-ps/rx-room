<script setup lang="ts">
import type { Component } from 'vue';
import type { ResourceItem } from '@/types/resource';

import {
  BarChart3,
  CornerDownLeft,
  ExternalLink,
  House,
  Search,
  Wrench,
  X,
} from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useResources } from '@/composables/use-resources';
import ResourceIcon from './ResourceIcon.vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

type PaletteItem = {
  id: string;
  label: string;
  meta: string;
  kind: 'page' | 'resource';
  icon?: Component;
  iconName?: ResourceItem['iconName'];
  keywords?: string;
  path?: string;
  url?: string;
};

const router = useRouter();
const { resources } = useResources();

const query = ref('');
const activeIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

const pages: PaletteItem[] = [
  { id: 'page-home', label: 'ภาพรวมห้องยา', meta: 'หน้า', kind: 'page', icon: House, path: '/', keywords: 'home overview' },
  { id: 'page-tools', label: 'เครื่องมือทั้งหมด', meta: 'หน้า', kind: 'page', icon: Wrench, path: '/tools', keywords: 'tools' },
  { id: 'page-reports', label: 'รายงานและสถิติ', meta: 'หน้า', kind: 'page', icon: BarChart3, path: '/reports', keywords: 'reports dashboard' },
  { id: 'page-external', label: 'ระบบงานภายนอก', meta: 'หน้า', kind: 'page', icon: ExternalLink, path: '/external', keywords: 'external' },
];

const typeLabel: Record<ResourceItem['type'], string> = {
  tool: 'TOOL',
  report: 'REPORT',
  external: 'EXTERNAL',
};

const items = computed<PaletteItem[]>(() => {
  const needle = query.value.trim().toLowerCase();

  const pageMatches = pages.filter(page =>
    !needle || `${page.label} ${page.keywords ?? ''}`.toLowerCase().includes(needle),
  );

  const resourceMatches = resources.value
    .filter(resource =>
      !needle
      || resource.title.toLowerCase().includes(needle)
      || resource.description.toLowerCase().includes(needle),
    )
    .slice(0, 9)
    .map(resource => ({
      id: resource.id,
      label: resource.title,
      meta: resource.isActive ? typeLabel[resource.type] : `${typeLabel[resource.type]} · ปิดปรับปรุง`,
      kind: 'resource' as const,
      iconName: resource.iconName,
      url: resource.url,
    }));

  return [...pageMatches, ...resourceMatches];
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined')
    document.body.style.overflow = '';
});

watch(() => props.open, async (isOpen) => {
  if (typeof document === 'undefined')
    return;

  document.body.style.overflow = isOpen ? 'hidden' : '';

  if (isOpen) {
    query.value = '';
    activeIndex.value = 0;
    await nextTick();
    searchInput.value?.focus();
  }
});

watch(query, () => {
  activeIndex.value = 0;
});

function close() {
  emit('close');
}

function move(step: number) {
  if (!items.value.length)
    return;
  activeIndex.value = (activeIndex.value + step + items.value.length) % items.value.length;
}

function choose(item: PaletteItem | undefined) {
  if (!item)
    return;

  if (item.kind === 'page' && item.path) {
    void router.push(item.path);
  }
  else if (item.url && item.url !== '#') {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }

  close();
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
  }
  else if (event.key === 'Enter') {
    event.preventDefault();
    choose(items.value[activeIndex.value]);
  }
  else if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="open"
        class="palette"
        role="dialog"
        aria-modal="true"
        aria-label="ค้นหาทั้งหมดใน Rx Room"
        @click.self="close"
      >
        <div class="palette-panel" @keydown="onInputKeydown">
          <div class="palette-head">
            <Search :size="19" :stroke-width="1.8" aria-hidden="true" />
            <input
              ref="searchInput"
              v-model="query"
              class="palette-input"
              type="search"
              placeholder="ค้นหาเครื่องมือ รายงาน หรือหน้าที่ต้องการ"
              aria-label="ค้นหาทั้งหมดใน Rx Room"
              autocomplete="off"
              spellcheck="false"
            >
            <button class="palette-close" type="button" aria-label="ปิดการค้นหา" @click="close">
              <X :size="18" :stroke-width="1.8" />
            </button>
          </div>

          <div class="palette-body">
            <p class="palette-label">
              {{ query ? 'ผลการค้นหา' : 'ทางลัด' }}
              <span>{{ items.length }}</span>
            </p>

            <ul v-if="items.length" class="palette-list">
              <li v-for="(item, index) in items" :key="item.id">
                <button
                  type="button"
                  class="palette-item"
                  :class="{ 'is-active': index === activeIndex }"
                  :aria-selected="index === activeIndex"
                  @mouseenter="activeIndex = index"
                  @click="choose(item)"
                >
                  <span class="palette-icon">
                    <ResourceIcon
                      v-if="item.kind === 'resource' && item.iconName"
                      :name="item.iconName"
                      :size="18"
                    />
                    <component :is="item.icon" v-else :size="18" :stroke-width="1.8" />
                  </span>
                  <span class="palette-copy">
                    <strong>{{ item.label }}</strong>
                    <small>{{ item.meta }}</small>
                  </span>
                  <CornerDownLeft class="palette-enter" :size="16" :stroke-width="1.8" aria-hidden="true" />
                </button>
              </li>
            </ul>

            <p v-else class="palette-empty">
              ไม่พบสิ่งที่ค้นหา ลองใช้คำอื่นหรือเปิดหน้ารวมเครื่องมือ
            </p>
          </div>

          <footer class="palette-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> เลื่อน</span>
            <span><kbd>↵</kbd> เปิด</span>
            <span><kbd>ESC</kbd> ปิด</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 1.25rem 2rem;
  background: rgb(13 59 49 / 0.38);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.palette-panel {
  width: min(100%, 640px);
  max-height: min(72vh, 640px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  box-shadow: 10px 10px 0 0 rgb(13 59 49 / 0.18);
}

.palette-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid var(--line);
  color: var(--ink-3);
}

.palette-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 1rem;
  outline: none;
}

.palette-input::placeholder {
  color: var(--ink-3);
}

.palette-input::-webkit-search-cancel-button {
  display: none;
}

.palette-close {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  background: transparent;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.palette-close:hover {
  border-color: var(--ink);
  background: var(--paper);
}

.palette-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.6rem;
}

.palette-label {
  display: flex;
  justify-content: space-between;
  padding: 0.55rem 0.65rem 0.4rem;
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.palette-list {
  display: grid;
  gap: 2px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.6rem 0.65rem;
  border: 0;
  border-radius: var(--radius-xs);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.palette-item.is-active {
  background: var(--bottle);
  color: var(--paper-raised);
}

.palette-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.15rem;
  height: 2.15rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper);
  color: var(--ink-2);
}

.palette-item.is-active .palette-icon {
  border-color: rgb(251 250 245 / 0.24);
  background: rgb(251 250 245 / 0.1);
  color: var(--paper-raised);
}

.palette-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0.08rem;
}

.palette-copy strong {
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-copy small {
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
}

.palette-item.is-active .palette-copy small {
  color: rgb(251 250 245 / 0.76);
}

.palette-enter {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.palette-item.is-active .palette-enter {
  opacity: 1;
}

.palette-empty {
  padding: 2.5rem 1rem;
  color: var(--ink-3);
  font-size: 0.88rem;
  text-align: center;
}

.palette-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  padding: 0.7rem 1.1rem;
  border-top: 1px solid var(--line);
  color: var(--ink-3);
  font-size: 0.66rem;
}

.palette-foot span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.palette-foot kbd {
  padding: 0.1rem 0.35rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper);
  font-family: var(--font-mono);
  font-size: 0.6rem;
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.22s ease;
}

.palette-enter-active .palette-panel,
.palette-leave-active .palette-panel {
  transition:
    transform 0.28s var(--ease-out),
    opacity 0.22s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-from .palette-panel,
.palette-leave-to .palette-panel {
  opacity: 0;
  transform: translateY(-12px) scale(0.985);
}

@media (max-width: 640px) {
  .palette {
    padding: 1rem;
    align-items: flex-end;
  }

  .palette-panel {
    max-height: 82vh;
  }

  .palette-input {
    font-size: 0.86rem;
  }
}
</style>
