<script setup lang="ts">
import type { ResourceItem } from '@/types/resource';

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock3,
  MapPin,
  Search,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import ResourceIcon from '@/components/common/ResourceIcon.vue';
import { useResources } from '@/composables/use-resources';
import { useUIStore } from '@/stores/ui';

const router = useRouter();
const store = useUIStore();
const { resources, loading } = useResources();

const query = ref('');

const todayLabel = new Intl.DateTimeFormat('th-TH', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date());

const yearLabel = new Intl.DateTimeFormat('th-TH', { year: 'numeric' }).format(new Date());

const groups = [
  { key: 'tool', label: 'เครื่องมือ', labelEn: 'Tools', description: 'งานประจำวันที่ใช้ทุกวัน', path: '/tools' },
  { key: 'report', label: 'รายงาน', labelEn: 'Reports', description: 'ข้อมูลสำหรับประชุมและติดตามผล', path: '/reports' },
  { key: 'external', label: 'ระบบภายนอก', labelEn: 'External', description: 'ปลายทางที่ต้องส่งข้อมูลต่อ', path: '/external' },
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
          เครื่องมือ รายงาน และระบบภายนอกของกลุ่มงานเภสัชกรรม
          รวมไว้ในประตูเดียว เลิกไล่หา bookmark ในวันที่ห้องยามีงานรออยู่
        </p>

        <form class="hero-search" role="search" @submit.prevent="submitSearch">
          <Search class="hero-search-icon" :size="21" :stroke-width="1.7" aria-hidden="true" />
          <input
            v-model="query"
            type="search"
            placeholder="ค้นหาเครื่องมือ รายงาน หรือระบบภายนอก"
            aria-label="ค้นหาเครื่องมือ รายงาน หรือระบบภายนอก"
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

      <aside class="index-card rise-in" style="--delay: 150ms" aria-label="สารบัญห้องยา">
        <div class="index-top">
          <span>Room index</span>
          <span>{{ yearLabel }}</span>
        </div>

        <div class="index-figure" aria-hidden="true">
          <span class="figure-ring figure-ring--one" />
          <span class="figure-ring figure-ring--two" />
          <span class="figure-rx serif">Rx</span>
          <span class="figure-dot" />
          <span class="figure-caption mono">PHARMACY<br>DEPARTMENT</span>
        </div>

        <ul class="index-list">
          <li v-for="(group, index) in groups" :key="group.key">
            <a :href="group.path" @click.prevent="router.push(group.path)">
              <span class="index-no mono">{{ pad(index + 1) }}</span>
              <span class="index-name">
                {{ group.label }}
                <small>{{ group.labelEn }}</small>
              </span>
              <strong class="index-count">
                <template v-if="loading">...</template>
                <template v-else>{{ pad(counts[group.key]) }}</template>
              </strong>
              <ArrowUpRight :size="15" :stroke-width="1.8" aria-hidden="true" />
            </a>
          </li>
        </ul>

        <div class="index-foot">
          <span class="index-live"><span class="status-dot status-dot--live" /> ระบบพร้อมใช้งาน</span>
          <span class="mono">{{ activeCount }} / {{ totalCount }}</span>
        </div>
      </aside>
    </header>

    <div class="ticket rise-in" style="--delay: 240ms">
      <div class="ticket-cell">
        <Clock3 :size="18" :stroke-width="1.6" aria-hidden="true" />
        <span>
          <small>เวลาทำการ</small>
          <strong>จ. - ศ. 08:00 - 16:00 น.</strong>
        </span>
      </div>
      <div class="ticket-cell">
        <MapPin :size="18" :stroke-width="1.6" aria-hidden="true" />
        <span>
          <small>ที่ตั้ง</small>
          <strong>โรงพยาบาลสระโบสถ์</strong>
        </span>
      </div>
      <div class="ticket-code" aria-hidden="true">
        <span class="barcode" />
        <small class="mono">RX-ROOM · 01</small>
      </div>
    </div>

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
        กำลังรวบรวมรายการจากห้องยา...
      </p>
    </section>

    <section class="split rise-in" style="--delay: 400ms">
      <article class="department-card">
        <div class="department-copy">
          <p class="eyebrow">
            Department
          </p>
          <h2>หนึ่งห้อง หนึ่งทีม<br>ดูแลทุกงานของเภสัชกรรม</h2>
          <p>
            ข้อมูลหน่วยงาน เวลาทำการ ช่องทางติดต่อ และคำถามที่พบบ่อย
            รวมอยู่ในหน้าของกลุ่มงาน
          </p>
          <a class="department-link" href="/department" @click.prevent="router.push('/department')">
            ทำความรู้จักกลุ่มงาน
            <ArrowUpRight :size="17" :stroke-width="1.8" aria-hidden="true" />
          </a>
        </div>
        <div class="department-graphic" aria-hidden="true">
          <Building2 :size="34" :stroke-width="1.2" />
          <span class="department-rx serif">Rx</span>
        </div>
      </article>

      <article class="stats-card">
        <header class="stats-head">
          <p class="eyebrow">
            Room status
          </p>
          <span class="mono">{{ todayLabel }}</span>
        </header>
        <dl class="stats-grid">
          <div v-for="group in groups" :key="group.key">
            <dt>{{ group.label }}</dt>
            <dd>{{ loading ? '...' : pad(counts[group.key]) }}</dd>
          </div>
          <div>
            <dt>พร้อมใช้งาน</dt>
            <dd>{{ loading ? '...' : pad(activeCount) }}</dd>
          </div>
        </dl>
        <p class="stats-foot mono">
          <span class="status-dot status-dot--live" />
          ทุกระบบเชื่อมต่อจากประตูเดียว
        </p>
      </article>
    </section>
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
  grid-template-columns: minmax(0, 1.32fr) minmax(320px, 0.68fr);
  align-items: stretch;
  gap: clamp(1.25rem, 2.8vw, 2.5rem);
}

.hero-main {
  display: flex;
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

.index-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 1.15rem 1.15rem 1rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(160deg, rgb(255 255 255 / 0.03), transparent 55%), var(--bottle);
  color: var(--paper-raised);
  box-shadow: 8px 8px 0 0 var(--mint);
}

.index-top {
  display: flex;
  justify-content: space-between;
  color: rgb(251 250 245 / 0.7);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.index-figure {
  position: relative;
  display: grid;
  place-items: center;
  height: clamp(150px, 16vw, 210px);
  margin: 0.8rem 0 0.9rem;
  overflow: hidden;
}

.figure-ring {
  position: absolute;
  border: 1px solid rgb(251 250 245 / 0.14);
  border-radius: 50%;
}

.figure-ring--one {
  width: 190px;
  height: 190px;
}

.figure-ring--two {
  width: 130px;
  height: 130px;
  border-style: dashed;
}

.figure-rx {
  position: relative;
  z-index: 1;
  font-size: clamp(4.6rem, 6vw, 6.4rem);
  font-style: italic;
  line-height: 0.8;
}

.figure-dot {
  position: absolute;
  top: 18%;
  right: 21%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 0 5px rgb(239 90 47 / 0.12);
}

.figure-caption {
  position: absolute;
  bottom: 0.35rem;
  left: 0;
  color: rgb(251 250 245 / 0.58);
  font-size: 0.5rem;
  letter-spacing: 0.2em;
  line-height: 1.5;
}

.index-list {
  display: grid;
  border-top: 1px solid rgb(251 250 245 / 0.14);
}

.index-list a {
  display: grid;
  grid-template-columns: 1.8rem minmax(0, 1fr) auto 1rem;
  align-items: center;
  gap: 0.5rem;
  padding: 0.66rem 0.2rem;
  border-bottom: 1px solid rgb(251 250 245 / 0.12);
  transition:
    background-color 0.2s ease,
    padding 0.2s ease;
}

.index-list a:hover {
  padding-right: 0.4rem;
  padding-left: 0.4rem;
  background: rgb(251 250 245 / 0.06);
}

.index-no {
  color: var(--signal-light);
  font-size: 0.58rem;
}

.index-name {
  display: flex;
  flex-direction: column;
  font-size: 0.82rem;
  line-height: 1.3;
}

.index-name small {
  color: rgb(251 250 245 / 0.64);
  font-family: var(--font-mono);
  font-size: 0.52rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.index-count {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 400;
}

.index-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.85rem;
  color: rgb(251 250 245 / 0.68);
  font-size: 0.58rem;
}

.index-live {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.index-foot .mono {
  letter-spacing: 0.08em;
}

.ticket {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  border-top: 1px dashed var(--line-strong);
  border-bottom: 1px dashed var(--line-strong);
  background: rgb(251 250 245 / 0.5);
}

.ticket::before,
.ticket::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: var(--paper);
  transform: translateY(-50%);
}

.ticket::before {
  left: -8px;
}

.ticket::after {
  right: -8px;
}

.ticket-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--ink-2);
}

.ticket-cell svg {
  color: var(--signal-deep);
}

.ticket-cell span {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.ticket-cell small {
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.54rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ticket-cell strong {
  font-size: 0.78rem;
  font-weight: 500;
}

.ticket-code {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding-left: 1rem;
  border-left: 1px solid var(--line);
}

.ticket-code small {
  color: var(--ink-3);
  font-size: 0.52rem;
  letter-spacing: 0.1em;
}

.barcode {
  width: 58px;
  height: 20px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--ink) 0 1px,
    transparent 1px 3px,
    var(--ink) 3px 5px,
    transparent 5px 6px,
    var(--ink) 6px 7px,
    transparent 7px 10px
  );
  opacity: 0.72;
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

.split {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: clamp(1rem, 2vw, 1.5rem);
}

.department-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  min-height: 260px;
  padding: clamp(1.3rem, 2.4vw, 2rem);
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--mint);
  color: var(--ink);
}

.department-copy {
  position: relative;
  z-index: 1;
  max-width: 36rem;
}

.department-copy h2 {
  margin-top: 0.6rem;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
}

.department-copy p:not(.eyebrow) {
  max-width: 40ch;
  margin-top: 0.7rem;
  color: var(--ink-2);
  font-size: 0.82rem;
  line-height: 1.7;
}

.department-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.1rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--ink);
  font-size: 0.74rem;
  font-weight: 500;
  transition:
    gap 0.2s ease,
    color 0.2s ease;
}

.department-link:hover {
  gap: 0.65rem;
  color: var(--signal-deep);
}

.department-graphic {
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 9rem;
  height: 9rem;
  color: var(--bottle);
}

.department-graphic::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgb(13 59 49 / 0.18);
  border-radius: 50%;
}

.department-graphic::after {
  content: '';
  position: absolute;
  inset: 1.1rem;
  border: 1px dashed rgb(13 59 49 / 0.22);
  border-radius: 50%;
}

.department-rx {
  font-size: 2.9rem;
  font-style: italic;
  line-height: 1;
}

.stats-card {
  display: flex;
  flex-direction: column;
  padding: clamp(1.2rem, 2vw, 1.6rem);
  border: 1px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--paper-raised);
}

.stats-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.stats-head .mono {
  color: var(--ink-3);
  font-size: 0.54rem;
  letter-spacing: 0.08em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 0.9rem;
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.stats-grid div {
  padding: 0.8rem 0.85rem;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.stats-grid dt {
  color: var(--ink-3);
  font-size: 0.62rem;
}

.stats-grid dd {
  margin-top: 0.15rem;
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  line-height: 1;
}

.stats-foot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  color: var(--ink-3);
  font-size: 0.56rem;
  letter-spacing: 0.05em;
}

@media (max-width: 1180px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) minmax(290px, 0.6fr);
  }

  .hero-title {
    font-size: clamp(2.5rem, 5.2vw, 4.6rem);
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .index-card {
    min-height: auto;
  }

  .index-figure {
    height: 140px;
  }

  .split {
    grid-template-columns: 1fr;
  }

  .department-card {
    min-height: 230px;
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

  .ticket {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    padding: 1rem 1.1rem;
  }

  .ticket-code {
    padding: 0.6rem 0 0;
    border-top: 1px dashed var(--line-strong);
    border-left: 0;
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

  .department-graphic {
    display: none;
  }

  .stats-grid dd {
    font-size: 1.6rem;
  }
}
</style>
