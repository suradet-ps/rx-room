<script setup lang="ts">
import type { ResourceItem } from '@/types/resource';

import {
  ArrowRight,
  ArrowUpRight,
  Search,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import AnimatedNumber from '@/components/common/AnimatedNumber.vue';
import ResourceIcon from '@/components/common/ResourceIcon.vue';
import { useResources } from '@/composables/use-resources';
import { useUIStore } from '@/stores/ui';

const router = useRouter();
const store = useUIStore();
const { resources } = useResources();

const query = ref('');

const yearLabel = new Intl.DateTimeFormat('th-TH', { year: 'numeric' }).format(new Date());

const groups = [
  { key: 'tool', label: 'เครื่องมือ', labelEn: 'Tools', path: '/tools' },
  { key: 'report', label: 'รายงาน', labelEn: 'Reports', path: '/reports' },
  { key: 'external', label: 'ระบบภายนอก', labelEn: 'External', path: '/external' },
] as const;

const typeLabel: Record<ResourceItem['type'], string> = {
  tool: 'TOOL',
  report: 'REPORT',
  external: 'EXTERNAL',
};

const counts = computed(() => ({
  tool: resources.value.filter(item => item.type === 'tool').length,
  report: resources.value.filter(item => item.type === 'report').length,
  external: resources.value.filter(item => item.type === 'external').length,
}));

const totalCount = computed(() => resources.value.length);
const activeCount = computed(() => resources.value.filter(item => item.isActive).length);

const featuredIds = ['med-safety', 'warfarin-calc', 'hospital-drugs', 'had-list'];

const featured = computed(() => {
  const byId = new Map(resources.value.map(item => [item.id, item]));
  const preferred = featuredIds
    .map(id => byId.get(id))
    .filter((item): item is ResourceItem => Boolean(item));

  if (preferred.length >= 4)
    return preferred;

  const rest = resources.value.filter(item => item.isActive && !featuredIds.includes(item.id));
  return [...preferred, ...rest].slice(0, 4);
});

const suggestions = ['Warfarin', 'MedSafety', 'บัญชียา'];

function submitSearch() {
  store.setSearch(query.value.trim());
  void router.push('/tools');
}

function searchFor(term: string) {
  query.value = term;
  submitSearch();
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
</script>

<template>
  <div class="home">
    <header class="hero">
      <div class="hero-main rise-in" style="--delay: 40ms">
        <div class="hero-kicker">
          <span class="eyebrow"><span class="status-dot status-dot--live status-dot--pulse" /> Internal toolkit</span>
          <span class="hero-edition mono">ROOM 01 / SABOT</span>
        </div>

        <h1 class="hero-title">
          ทุกเรื่อง<br>
          <span class="hero-soft">ของห้องยา</span><br>
          <span class="hero-strong">จบในห้องเดียว<i>.</i></span>
        </h1>

        <p class="hero-lede">
          เครื่องมือและรายงานของห้องยา รวมไว้ที่เดียว
        </p>

        <form class="hero-search" role="search" @submit.prevent="submitSearch">
          <Search class="hero-search-icon" :size="21" :stroke-width="1.7" aria-hidden="true" />
          <input
            v-model="query"
            type="search"
            placeholder="ค้นหาเครื่องมือและรายงาน"
            aria-label="ค้นหาเครื่องมือและรายงาน"
            autocomplete="off"
          >
          <button type="submit" class="hero-search-submit">
            ค้นหา
            <ArrowRight :size="17" :stroke-width="1.9" aria-hidden="true" />
          </button>
        </form>

        <div class="hero-suggest">
          <span class="hero-suggest-label">ลองค้น</span>
          <button
            v-for="term in suggestions"
            :key="term"
            type="button"
            class="hero-suggest-chip"
            @click="searchFor(term)"
          >
            {{ term }}
          </button>
        </div>
      </div>

      <aside class="rx-ticket rise-in" style="--delay: 120ms" aria-label="สารบัญห้องยา">
        <div class="rx-top">
          <header class="rx-head">
            <span class="rx-kicker mono">Rx Index</span>
            <span class="rx-year mono">{{ yearLabel }}</span>
          </header>

          <div class="rx-emblem" aria-hidden="true">
            <span class="rx-bracket rx-bracket--tl" />
            <span class="rx-bracket rx-bracket--tr" />
            <span class="rx-bracket rx-bracket--bl" />
            <span class="rx-bracket rx-bracket--br" />
            <span class="rx-orbit rx-orbit--outer" />
            <span class="rx-orbit rx-orbit--inner" />
            <span class="rx-mark serif">Rx</span>
            <span class="rx-dot" />
            <span class="rx-caption mono">ROOM 01 · SABOT</span>
          </div>
        </div>

        <div class="rx-perforation" aria-hidden="true">
          <span class="rx-seal mono">RX · 01</span>
        </div>

        <div class="rx-stub">
          <div class="rx-stub-head">
            <span class="mono">Room index</span>
            <span class="mono">{{ pad(groups.length) }} หมวด</span>
          </div>

          <ul class="rx-list">
            <li v-for="(group, index) in groups" :key="group.key">
              <a :href="group.path" @click.prevent="router.push(group.path)">
                <span class="rx-row-no mono">{{ pad(index + 1) }}</span>
                <span class="rx-row-name">
                  <strong>{{ group.label }}</strong>
                  <small>{{ group.labelEn }}</small>
                </span>
                <AnimatedNumber class="rx-row-count" :value="counts[group.key]" />
                <span class="rx-row-arrow" aria-hidden="true">
                  <ArrowUpRight :size="16" :stroke-width="1.8" />
                </span>
              </a>
            </li>
          </ul>

          <div class="rx-stub-foot">
            <span class="rx-live">
              <span class="status-dot status-dot--live" />
              พร้อมใช้
            </span>
            <span class="rx-barcode" aria-hidden="true" />
            <span class="rx-total mono">
              <AnimatedNumber :value="activeCount" />
              /
              <AnimatedNumber :value="totalCount" />
            </span>
          </div>
        </div>
      </aside>
    </header>

    <section class="quick rise-in" style="--delay: 320ms" aria-labelledby="quick-title">
      <header class="section-head">
        <div>
          <p class="eyebrow">
            Quick access
          </p>
          <h2 id="quick-title">
            เข้าใช้งานบ่อย
          </h2>
        </div>
        <a class="section-link" href="/tools" @click.prevent="router.push('/tools')">
          ดูทั้งหมด
          <ArrowRight :size="16" :stroke-width="1.8" aria-hidden="true" />
        </a>
      </header>

      <ol v-if="featured.length" class="quick-list">
        <li v-for="(item, index) in featured" :key="item.id">
          <a
            class="quick-row"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="quick-no mono">{{ pad(index + 1) }}</span>
            <span class="quick-icon">
              <ResourceIcon :name="item.iconName" :size="21" :stroke-width="1.6" />
            </span>
            <span class="quick-copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.description }}</small>
            </span>
            <span class="quick-tag mono">{{ typeLabel[item.type] }}</span>
            <span class="quick-arrow" aria-hidden="true">
              <ArrowUpRight :size="18" :stroke-width="1.7" />
            </span>
          </a>
        </li>
      </ol>

      <p v-else class="quick-loading">
        กำลังโหลด...
      </p>
    </section>

    <footer class="home-foot rise-in" style="--delay: 400ms">
      <span class="mono">Rx Room · 01</span>
      <span class="mono">{{ yearLabel }} · Sabot Hospital</span>
    </footer>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3.4rem);
  width: min(100%, 1460px);
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3.6vw, 3.25rem) 4.5rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(340px, 0.82fr) minmax(0, 1.18fr);
  grid-template-areas: 'index main';
  align-items: center;
  gap: clamp(1.75rem, 4vw, 4.5rem);
}

.hero-main {
  display: flex;
  grid-area: main;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: clamp(0.5rem, 1.4vw, 1.5rem) 0;
}

.hero-kicker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1.2rem, 2.5vw, 2rem);
}

.hero-kicker .eyebrow {
  gap: 0.55rem;
}

.hero-kicker .eyebrow::before {
  display: none;
}

.hero-edition {
  color: var(--ink-3);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
}

.hero-title {
  max-width: 12ch;
  font-size: clamp(2.7rem, 5.6vw, 5.6rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.hero-soft {
  color: var(--ink-3);
  font-weight: 300;
}

.hero-strong {
  position: relative;
  display: inline-block;
  color: var(--bottle);
}

.hero-strong i {
  color: var(--signal);
  font-family: var(--font-serif);
  font-style: normal;
  font-weight: 400;
}

.hero-strong::after {
  content: '';
  position: absolute;
  right: 0.1em;
  bottom: 0.02em;
  left: 0;
  height: 0.08em;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: left;
  animation: underlineIn 0.9s var(--ease-out) 0.65s forwards;
}

@keyframes underlineIn {
  to {
    transform: scaleX(1);
  }
}

.hero-lede {
  max-width: 46ch;
  margin-top: clamp(1rem, 2vw, 1.6rem);
  color: var(--ink-2);
  font-size: clamp(0.92rem, 1.1vw, 1.02rem);
  line-height: 1.75;
}

.hero-search {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: min(100%, 610px);
  margin-top: clamp(1.5rem, 2.6vw, 2.2rem);
  padding: 0.32rem 0.32rem 0.32rem 1rem;
  border: 1px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
  box-shadow: 4px 4px 0 0 var(--bottle);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.hero-search:focus-within {
  box-shadow: 4px 4px 0 0 var(--signal);
}

.hero-search-icon {
  flex-shrink: 0;
  color: var(--ink-3);
}

.hero-search input {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 0.88rem;
  outline: none;
}

.hero-search input::placeholder {
  color: var(--ink-3);
}

.hero-search input::-webkit-search-cancel-button {
  display: none;
}

.hero-search-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 0.85rem;
  border: 0;
  border-radius: var(--radius-xs);
  background: var(--bottle);
  color: var(--paper-raised);
  font-size: 0.76rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hero-search-submit:hover {
  background: var(--signal);
}

.hero-suggest {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1rem;
}

.hero-suggest-label {
  margin-right: 0.15rem;
  color: var(--ink-3);
  font-size: 0.66rem;
}

.hero-suggest-chip {
  padding: 0.22rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.hero-suggest-chip:hover {
  border-color: var(--signal);
  background: var(--signal-soft);
  color: var(--signal-deep);
}

.rx-ticket {
  position: relative;
  z-index: 1;
  display: flex;
  grid-area: index;
  width: 100%;
  max-width: 440px;
  flex-direction: column;
  justify-self: start;
  filter: drop-shadow(0 20px 30px rgb(20 32 27 / 0.14));
  transform: rotate(-1.2deg);
  transition:
    transform 0.5s var(--ease-out),
    filter 0.5s ease;
}

.rx-ticket::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border: 1px solid var(--line-strong);
  border-radius: 24px;
  background: var(--mint);
  transform: translate(12px, 14px) rotate(1.2deg);
  transition: transform 0.5s var(--ease-out);
}

.rx-ticket:hover {
  filter: drop-shadow(0 26px 34px rgb(20 32 27 / 0.18));
  transform: translateY(-6px) rotate(0deg);
}

.rx-ticket:hover::before {
  transform: translate(18px, 20px) rotate(2.4deg);
}

.rx-top {
  position: relative;
  overflow: hidden;
  padding: 0.95rem 1.05rem 0.8rem;
  border: 2px solid var(--ink);
  border-bottom: 0;
  border-radius: 22px 22px 0 0;
  background:
    linear-gradient(var(--signal) 6px, transparent 6px),
    radial-gradient(circle at 84% 20%, rgb(239 90 47 / 0.08), transparent 32%), var(--paper-raised);
}

.rx-top::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 36%, rgb(239 90 47 / 0.09) 50%, transparent 64%);
  transform: translateX(-120%);
  transition: transform 0.9s var(--ease-out);
}

.rx-ticket:hover .rx-top::after {
  transform: translateX(120%);
}

.rx-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--ink-3);
}

.rx-kicker {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.rx-year {
  color: var(--signal-deep);
  font-size: 0.54rem;
  letter-spacing: 0.06em;
}

.rx-emblem {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  height: clamp(185px, 18vw, 226px);
  margin: 0.35rem 0 0;
}

.rx-orbit {
  position: absolute;
  border-radius: 50%;
}

.rx-orbit--outer {
  width: clamp(174px, 16.5vw, 212px);
  aspect-ratio: 1;
  border: 1px solid rgb(20 32 27 / 0.14);
}

.rx-orbit--inner {
  width: clamp(118px, 11.5vw, 146px);
  aspect-ratio: 1;
  border: 1px dashed rgb(20 32 27 / 0.24);
  animation: rx-spin 32s linear infinite;
}

.rx-mark {
  position: relative;
  z-index: 1;
  color: var(--bottle);
  font-size: clamp(5rem, 5.8vw, 6.6rem);
  font-style: italic;
  letter-spacing: -0.06em;
  line-height: 0.8;
}

.rx-dot {
  position: absolute;
  top: 22%;
  right: 24%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 0 5px rgb(239 90 47 / 0.12);
  animation: rx-pulse 3s ease-in-out infinite;
}

.rx-caption {
  position: absolute;
  bottom: 0.15rem;
  left: 0;
  color: var(--ink-3);
  font-size: 0.48rem;
  letter-spacing: 0.18em;
  line-height: 1.4;
}

.rx-bracket {
  position: absolute;
  width: 17px;
  height: 17px;
  border-style: solid;
  border-color: var(--signal);
  opacity: 0.8;
}

.rx-bracket--tl {
  top: 4px;
  left: 4px;
  border-width: 1.5px 0 0 1.5px;
}

.rx-bracket--tr {
  top: 4px;
  right: 4px;
  border-width: 1.5px 1.5px 0 0;
}

.rx-bracket--bl {
  bottom: 4px;
  left: 4px;
  border-width: 0 0 1.5px 1.5px;
}

.rx-bracket--br {
  right: 4px;
  bottom: 4px;
  border-width: 0 1.5px 1.5px 0;
}

.rx-perforation {
  position: relative;
  height: 30px;
  background:
    repeating-linear-gradient(to right, var(--signal) 0 5px, transparent 5px 10px) center / 100% 2px no-repeat,
    var(--paper-raised);
}

.rx-perforation::before,
.rx-perforation::after {
  content: '';
  position: absolute;
  top: 50%;
  z-index: 2;
  width: 28px;
  height: 28px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--paper);
  transform: translateY(-50%);
  pointer-events: none;
}

.rx-perforation::before {
  left: -14px;
  clip-path: inset(0 0 0 50%);
}

.rx-perforation::after {
  right: -14px;
  clip-path: inset(0 50% 0 0);
}

.rx-seal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--ink);
  border-radius: var(--radius-pill);
  background: var(--paper-raised);
  color: var(--signal-deep);
  font-size: 0.46rem;
  letter-spacing: 0.14em;
  transform: translate(-50%, -50%);
}

.rx-stub {
  padding: 0.9rem 1.05rem 0.85rem;
  border: 2px solid var(--ink);
  border-top: 0;
  border-radius: 0 0 22px 22px;
  background: var(--bottle);
  color: var(--paper-raised);
}

.rx-stub-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.55rem;
  color: rgb(251 250 245 / 0.6);
  font-size: 0.52rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.rx-list {
  display: grid;
  border-top: 1px dashed rgb(251 250 245 / 0.18);
}

.rx-list li {
  border-bottom: 1px dashed rgb(251 250 245 / 0.18);
}

.rx-list a {
  display: grid;
  grid-template-columns: 1.55rem minmax(0, 1fr) auto 1.8rem;
  align-items: center;
  gap: 0.6rem;
  padding: 0.56rem 0.2rem;
  transition:
    padding 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease;
}

.rx-list a:hover {
  padding-right: 0.55rem;
  padding-left: 0.55rem;
  background: var(--signal);
  color: var(--paper-raised);
}

.rx-row-no {
  color: var(--signal-light);
  font-size: 0.54rem;
}

.rx-list a:hover .rx-row-no {
  color: var(--paper-raised);
}

.rx-row-name {
  display: flex;
  min-width: 0;
  flex-direction: column;
  line-height: 1.25;
}

.rx-row-name strong {
  font-size: 0.8rem;
  font-weight: 500;
}

.rx-row-name small {
  color: rgb(251 250 245 / 0.58);
  font-family: var(--font-mono);
  font-size: 0.49rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rx-list a:hover .rx-row-name small {
  color: rgb(251 250 245 / 0.78);
}

.rx-row-count {
  color: var(--paper-raised);
  font-family: var(--font-mono);
  font-size: 0.92rem;
}

.rx-row-arrow {
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid rgb(251 250 245 / 0.24);
  border-radius: 50%;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease;
}

.rx-list a:hover .rx-row-arrow {
  background: var(--paper-raised);
  color: var(--signal-deep);
  transform: rotate(45deg);
}

.rx-stub-foot {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-top: 0.7rem;
  color: rgb(251 250 245 / 0.66);
  font-size: 0.52rem;
}

.rx-live {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.rx-barcode {
  flex: 1;
  min-width: 34px;
  height: 16px;
  background-image: repeating-linear-gradient(
    90deg,
    rgb(251 250 245 / 0.65) 0 1px,
    transparent 1px 3px,
    rgb(251 250 245 / 0.65) 3px 5px,
    transparent 5px 7px
  );
  opacity: 0.55;
}

.rx-total {
  font-size: 0.54rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

@keyframes rx-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rx-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 5px rgb(239 90 47 / 0.12);
  }
  50% {
    box-shadow: 0 0 0 9px rgb(239 90 47 / 0.03);
  }
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--ink);
}

.section-head h2 {
  margin-top: 0.45rem;
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 600;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding-bottom: 0.2rem;
  color: var(--ink-2);
  font-size: 0.72rem;
  font-weight: 500;
  transition:
    color 0.2s ease,
    gap 0.2s ease;
}

.section-link:hover {
  gap: 0.65rem;
  color: var(--signal-deep);
}

.quick-list {
  display: grid;
}

.quick-list li {
  border-bottom: 1px solid var(--line);
}

.quick-row {
  display: grid;
  grid-template-columns: 2.2rem 2.6rem minmax(0, 1fr) auto 2.2rem;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 0.4rem;
  transition:
    background-color 0.2s ease,
    padding 0.2s ease;
}

.quick-row:hover {
  padding-right: 0.8rem;
  padding-left: 0.8rem;
  background: var(--mint-soft);
}

.quick-no {
  color: var(--ink-3);
  font-size: 0.62rem;
}

.quick-icon {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper-raised);
  color: var(--bottle);
}

.quick-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  line-height: 1.35;
}

.quick-copy strong {
  font-size: 0.9rem;
  font-weight: 500;
}

.quick-copy small {
  overflow: hidden;
  margin-top: 0.15rem;
  color: var(--ink-3);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-tag {
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.12em;
}

.quick-arrow {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink-2);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.quick-row:hover .quick-arrow {
  background: var(--bottle);
  color: var(--paper-raised);
  transform: rotate(45deg);
}

.quick-loading {
  padding: 1.5rem 0.4rem;
  color: var(--ink-3);
  font-size: 0.84rem;
}

.home-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--line);
  color: var(--ink-3);
  font-size: 0.55rem;
  letter-spacing: 0.1em;
}

@media (max-width: 1180px) {
  .hero {
    grid-template-columns: minmax(330px, 0.8fr) minmax(0, 1.2fr);
    gap: 2rem;
  }

  .hero-title {
    font-size: clamp(2.5rem, 5.2vw, 4.6rem);
  }

  .rx-ticket {
    max-width: 400px;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-areas:
      'main'
      'index';
    gap: 2.4rem;
  }

  .rx-ticket {
    max-width: 560px;
    justify-self: center;
    transform: none;
  }

  .rx-ticket::before {
    transform: translate(10px, 12px) rotate(1deg);
  }

  .rx-ticket:hover {
    transform: translateY(-4px);
  }

  .rx-ticket:hover::before {
    transform: translate(14px, 16px) rotate(1.6deg);
  }
}

@media (max-width: 680px) {
  .home {
    gap: 2rem;
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .hero-kicker {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-title {
    font-size: clamp(2.35rem, 11vw, 3.2rem);
    letter-spacing: -0.035em;
  }

  .rx-ticket {
    max-width: none;
  }

  .rx-ticket::before {
    display: none;
  }

  .rx-emblem {
    height: 170px;
  }

  .hero-search {
    flex-wrap: wrap;
    padding: 0.6rem;
    box-shadow: 3px 3px 0 0 var(--bottle);
  }

  .hero-search-icon {
    margin-left: 0.15rem;
  }

  .hero-search input {
    width: calc(100% - 2.2rem);
    flex: 0 0 calc(100% - 2.2rem);
  }

  .hero-search-submit {
    width: 100%;
    justify-content: center;
  }

  .quick-row {
    grid-template-columns: 1.8rem 2.4rem minmax(0, 1fr) 2rem;
    gap: 0.65rem;
  }

  .quick-tag {
    display: none;
  }

  .quick-icon {
    width: 2.4rem;
    height: 2.4rem;
  }

  .home-foot {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.22rem;
  }
}
</style>
