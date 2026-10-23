<script setup lang="ts">
import type { TabType } from '@/stores/ui';

import { Search, X } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ResourceCard from '@/components/common/ResourceCard.vue';
import { useResources } from '@/composables/use-resources';
import { useUIStore } from '@/stores/ui';

const route = useRoute();
const router = useRouter();
const store = useUIStore();
const { resources, loading, error } = useResources();

const searchQuery = computed({
  get: () => store.searchQuery,
  set: value => store.setSearch(value),
});

type ViewTab = Exclude<TabType, 'all'>;

const tabItems: Array<{ key: ViewTab; label: string; path: string }> = [
  { key: 'tool', label: 'เครื่องมือ', path: '/tools' },
  { key: 'report', label: 'รายงาน', path: '/reports' },
  { key: 'external', label: 'ภายนอก', path: '/external' },
];

const viewMeta: Record<ViewTab, { title: string; description: string; index: string }> = {
  tool: {
    title: 'เครื่องมือปฏิบัติงาน',
    description: 'เครื่องมือที่ใช้ทุกวันในห้องยา',
    index: '02.1',
  },
  report: {
    title: 'รายงานและสถิติ',
    description: 'รายงานและแดชบอร์ดสำหรับติดตามผล',
    index: '02.2',
  },
  external: {
    title: 'ระบบงานภายนอก',
    description: 'ระบบภายนอกที่ต้องใช้งานต่อ',
    index: '02.3',
  },
};

const currentTab = computed<ViewTab>(() => {
  const tab = route.meta.tab;
  return tab === 'report' || tab === 'external' ? tab : 'tool';
});

const currentMeta = computed(() => viewMeta[currentTab.value]);

const counts = computed<Record<ViewTab, number>>(() => ({
  tool: resources.value.filter(item => item.type === 'tool').length,
  report: resources.value.filter(item => item.type === 'report').length,
  external: resources.value.filter(item => item.type === 'external').length,
}));

const filteredResources = computed(() => {
  if (loading.value || error.value)
    return [];

  let items = resources.value.filter(resource => resource.type === currentTab.value);
  const query = searchQuery.value.trim().toLowerCase();

  if (query) {
    items = items.filter(resource =>
      resource.title.toLowerCase().includes(query)
      || resource.description.toLowerCase().includes(query),
    );
  }

  return items;
});

const availableCount = computed(() => filteredResources.value.filter(item => item.isActive).length);

function navigateToTab(path: string) {
  void router.push(path);
}

function clearSearch() {
  store.setSearch('');
}
</script>

<template>
  <div class="catalog">
    <header class="catalog-head rise-in" style="--delay: 30ms">
      <div class="head-main">
        <p class="eyebrow">
          Room 02 · Catalog
        </p>
        <h1>{{ currentMeta.title }}</h1>
        <p class="head-desc">
          {{ currentMeta.description }}
        </p>
      </div>
      <div class="head-stat">
        <span class="head-stat-value mono">{{ String(filteredResources.length).padStart(2, '0') }}</span>
        <span class="head-stat-label">รายการในหมวดนี้</span>
        <span class="head-stat-note mono">{{ availableCount }} พร้อมใช้</span>
      </div>
    </header>

    <div class="catalog-bar rise-in" style="--delay: 110ms">
      <nav class="tabs" aria-label="เลือกประเภทข้อมูล">
        <button
          v-for="tab in tabItems"
          :key="tab.key"
          type="button"
          class="tab"
          :class="{ 'is-active': currentTab === tab.key }"
          :aria-current="currentTab === tab.key ? 'page' : undefined"
          @click="navigateToTab(tab.path)"
        >
          <span>{{ tab.label }}</span>
          <span class="tab-count mono">{{ loading ? '...' : String(counts[tab.key]).padStart(2, '0') }}</span>
        </button>
      </nav>

      <label class="search-field">
        <Search :size="17" :stroke-width="1.8" aria-hidden="true" />
        <span class="sr-only">ค้นหาในหมวดนี้</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="ค้นหาในหมวดนี้"
          autocomplete="off"
        >
        <button
          v-if="searchQuery"
          type="button"
          class="search-clear"
          aria-label="ล้างคำค้น"
          @click="clearSearch"
        >
          <X :size="14" :stroke-width="2" />
        </button>
      </label>
    </div>

    <div class="result-line rise-in" style="--delay: 180ms">
      <p class="mono">
        <span>{{ currentMeta.index }}</span>
        <span class="result-sep" aria-hidden="true">/</span>
        <span v-if="searchQuery">ผลการค้นหา "{{ searchQuery }}"</span>
        <span v-else>รายการทั้งหมด</span>
      </p>
      <p v-if="!loading" class="result-count">
        {{ filteredResources.length }} รายการ
      </p>
    </div>

    <section v-if="loading" class="catalog-grid" aria-label="กำลังโหลดข้อมูล">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <span class="skeleton-line skeleton-line--short" />
        <span class="skeleton-icon" />
        <span class="skeleton-line" />
        <span class="skeleton-line skeleton-line--mid" />
        <span class="skeleton-line skeleton-line--short" />
      </div>
    </section>

    <section v-else-if="error" class="state-panel state-panel--error">
      <p class="eyebrow">
        Connection error
      </p>
      <h2>โหลดรายการไม่สำเร็จ</h2>
      <p>ลองใหม่อีกครั้ง</p>
      <p class="mono state-detail">
        {{ error }}
      </p>
    </section>

    <section v-else-if="filteredResources.length" class="catalog-grid">
      <ResourceCard
        v-for="(item, index) in filteredResources"
        :key="item.id"
        :item="item"
        :index="index + 1"
        class="rise-in"
        :style="{ '--delay': `${Math.min(index, 8) * 40 + 200}ms` }"
      />
    </section>

    <section v-else class="state-panel">
      <p class="eyebrow">
        No results
      </p>
      <h2>ไม่พบข้อมูล</h2>
      <p>ลองใช้คำอื่น หรือเลือกหมวดอื่น</p>
      <button v-if="searchQuery" type="button" class="btn btn--ghost" @click="clearSearch">
        ล้างคำค้น
      </button>
    </section>
  </div>
</template>

<style scoped>
.catalog {
  width: min(100%, 1460px);
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3.6vw, 3.25rem) 4.5rem;
}

.catalog-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: clamp(1.2rem, 2.4vw, 2rem);
  border-bottom: 1px solid var(--ink);
}

.head-main {
  max-width: 46rem;
}

.head-main h1 {
  margin-top: 0.65rem;
  font-size: clamp(2.3rem, 4.6vw, 4.2rem);
  letter-spacing: -0.04em;
  line-height: 1;
}

.head-desc {
  max-width: 52ch;
  margin-top: 0.9rem;
  color: var(--ink-2);
  font-size: clamp(0.84rem, 1vw, 0.94rem);
  line-height: 1.7;
}

.head-stat {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 2rem;
  border-left: 1px solid var(--line);
}

.head-stat-value {
  font-size: clamp(3rem, 5vw, 4.6rem);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.85;
}

.head-stat-label {
  margin-top: 0.5rem;
  color: var(--ink-2);
  font-size: 0.72rem;
}

.head-stat-note {
  margin-top: 0.15rem;
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.06em;
}

.catalog-bar {
  position: sticky;
  top: 62px;
  z-index: 20;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.2rem;
  padding: 0.75rem 0;
  background: rgb(244 241 233 / 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.tabs {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.62rem 1rem;
  border: 0;
  border-right: 1px solid var(--line);
  background: transparent;
  color: var(--ink-2);
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.tab:last-child {
  border-right: 0;
}

.tab:hover {
  background: var(--mint-soft);
}

.tab.is-active {
  background: var(--bottle);
  color: var(--paper-raised);
}

.tab-count {
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.04em;
}

.tab.is-active .tab-count {
  color: var(--signal-light);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: min(100%, 310px);
  padding: 0 0.8rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  color: var(--ink-3);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-field:focus-within {
  border-color: var(--ink);
  box-shadow: 3px 3px 0 0 var(--signal);
}

.search-field input {
  flex: 1;
  min-width: 0;
  padding: 0.62rem 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 0.8rem;
  outline: none;
}

.search-field input::placeholder {
  color: var(--ink-3);
}

.search-field input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border: 0;
  border-radius: 50%;
  background: var(--paper-deep);
  color: var(--ink-2);
  cursor: pointer;
}

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 1.1rem;
  color: var(--ink-3);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-line p {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.result-sep {
  color: var(--line-strong);
}

.result-count {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  letter-spacing: 0;
  text-transform: none;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.8rem, 1.4vw, 1.15rem);
}

.state-panel {
  padding: clamp(2rem, 5vw, 4rem) 1.5rem;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: rgb(251 250 245 / 0.6);
  text-align: center;
}

.state-panel h2 {
  margin-top: 0.8rem;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
}

.state-panel p:not(.eyebrow) {
  max-width: 42ch;
  margin: 0.65rem auto 0;
  color: var(--ink-3);
  font-size: 0.82rem;
}

.state-panel .eyebrow {
  justify-content: center;
}

.state-panel .btn {
  margin-top: 1.2rem;
}

.state-panel--error {
  border-color: var(--signal);
  background: var(--signal-soft);
}

.state-detail {
  margin-top: 0.8rem !important;
  color: var(--signal-deep) !important;
  font-size: 0.62rem !important;
}

.skeleton-card {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
}

.skeleton-line,
.skeleton-icon {
  display: block;
  height: 0.7rem;
  border-radius: var(--radius-xs);
  background: linear-gradient(90deg, var(--paper-deep) 25%, var(--paper) 50%, var(--paper-deep) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s linear infinite;
}

.skeleton-line--short {
  width: 24%;
}

.skeleton-line--mid {
  width: 68%;
}

.skeleton-icon {
  width: 3.15rem;
  height: 3.15rem;
  margin-top: 1.5rem;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media (max-width: 1180px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .catalog-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 1.2rem;
  }

  .head-stat {
    flex-direction: row;
    align-items: baseline;
    gap: 0.7rem;
    padding: 0;
    border-left: 0;
  }

  .head-stat-value {
    font-size: 2.6rem;
  }

  .head-stat-label {
    margin-top: 0;
  }

  .catalog-bar {
    top: 58px;
    flex-direction: column;
  }

  .tabs {
    width: 100%;
  }

  .tab {
    flex: 1;
    justify-content: center;
    padding: 0.58rem 0.5rem;
    font-size: 0.72rem;
  }

  .search-field {
    width: 100%;
  }
}

@media (max-width: 680px) {
  .catalog {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .head-main h1 {
    font-size: clamp(2.1rem, 10vw, 2.8rem);
  }

  .result-line {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }
}
</style>
