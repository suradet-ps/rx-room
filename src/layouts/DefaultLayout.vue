<script setup lang="ts">
import type { Component } from 'vue';

import {
  Building2,
  House,
  Search,
  Wrench,
} from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CommandPalette from '@/components/common/CommandPalette.vue';

const router = useRouter();
const route = useRoute();

type NavItem = {
  key: 'home' | 'tools' | 'department';
  index: string;
  label: string;
  labelEn: string;
  icon: Component;
  path: '/' | '/tools' | '/department';
  group?: 'home' | 'department' | 'tools';
};

const navItems: NavItem[] = [
  { key: 'home', index: '01', label: 'ภาพรวม', labelEn: 'Overview', icon: House, path: '/', group: 'home' },
  { key: 'tools', index: '02', label: 'เครื่องมือ', labelEn: 'Tools & reports', icon: Wrench, path: '/tools', group: 'tools' },
  { key: 'department', index: '03', label: 'กลุ่มงาน', labelEn: 'Department', icon: Building2, path: '/department', group: 'department' },
];

const paletteOpen = ref(false);

const today = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

const pageContext = computed(() => {
  if (route.path === '/department')
    return { index: '03', title: 'กลุ่มงานเภสัชกรรม' };

  if (route.path === '/reports')
    return { index: '02', title: 'รายงานและสถิติ' };

  if (route.path === '/external')
    return { index: '02', title: 'ระบบงานภายนอก' };

  if (route.path === '/tools')
    return { index: '02', title: 'เครื่องมือปฏิบัติงาน' };

  return { index: '01', title: 'ภาพรวมห้องยา' };
});

function isActive(item: NavItem): boolean {
  if (item.group === 'tools')
    return route.path === '/tools' || route.path === '/reports' || route.path === '/external' || route.meta.navGroup === 'tools';

  return route.path === item.path || route.meta.navGroup === item.group;
}

function navigateTo(path: string) {
  void router.push(path);
}

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && target.matches('input, textarea, select, [contenteditable="true"]');
}

function onKeydown(event: KeyboardEvent) {
  const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

  if (isCommandK) {
    event.preventDefault();
    paletteOpen.value = true;
    return;
  }

  if (event.key === '/' && !isTypingTarget(event.target)) {
    event.preventDefault();
    paletteOpen.value = true;
  }

  if (event.key === 'Escape') {
    paletteOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div class="shell">
    <a class="skip-link" href="#main-content">ข้ามไปยังเนื้อหา</a>

    <aside class="rail">
      <a class="brand" href="/" aria-label="Rx Room หน้าแรก" @click.prevent="navigateTo('/')">
        <span class="brand-mark" aria-hidden="true">
          Rx
          <i />
        </span>
        <span class="brand-word">
          <strong>Rx Room</strong>
          <small>กลุ่มงานเภสัชกรรม</small>
        </span>
      </a>

      <button class="search-trigger" type="button" @click="paletteOpen = true">
        <Search :size="16" :stroke-width="1.8" aria-hidden="true" />
        <span>ค้นหาในห้อง</span>
        <kbd>⌘K</kbd>
      </button>

      <p class="rail-label">
        สารบัญ <span>/ INDEX</span>
      </p>

      <nav class="rail-nav" aria-label="เมนูหลัก">
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="item.path"
          class="nav-item"
          :class="{ 'is-active': isActive(item) }"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click.prevent="navigateTo(item.path)"
        >
          <span class="nav-index">{{ item.index }}</span>
          <component :is="item.icon" class="nav-icon" :size="19" :stroke-width="1.7" aria-hidden="true" />
          <span class="nav-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.labelEn }}</small>
          </span>
          <span class="nav-mark" aria-hidden="true" />
        </a>
      </nav>

      <div class="rail-foot">
        <div class="room-state">
          <span class="status-dot status-dot--live status-dot--pulse" aria-hidden="true" />
          <span>
            <strong>เปิดทำการ</strong>
            <small>จ. - ศ. 08:00 - 16:00 น.</small>
          </span>
        </div>
        <a class="rail-contact" href="/department" @click.prevent="navigateTo('/department')">
          ติดต่อกลุ่มงาน
          <span aria-hidden="true">↗</span>
        </a>
        <p class="rail-version">
          Rx Room · v0.1
        </p>
      </div>
    </aside>

    <div class="stage">
      <header class="topbar">
        <div class="topbar-context">
          <span class="topbar-index">{{ pageContext.index }}</span>
          <span class="topbar-divider" aria-hidden="true" />
          <span class="topbar-title">{{ pageContext.title }}</span>
        </div>
        <div class="topbar-meta">
          <span class="topbar-date">{{ today }}</span>
          <span class="topbar-hospital">โรงพยาบาลสระโบสถ์</span>
          <button class="topbar-search" type="button" aria-label="เปิดการค้นหา" @click="paletteOpen = true">
            <Search :size="17" :stroke-width="1.8" />
            <kbd>⌘K</kbd>
          </button>
        </div>
      </header>

      <main id="main-content" class="stage-main">
        <slot />
      </main>
    </div>

    <nav class="mobile-nav" aria-label="เมนูหลักบนมือถือ">
      <a
        v-for="item in navItems"
        :key="`mobile-${item.key}`"
        :href="item.path"
        class="mobile-nav-item"
        :class="{ 'is-active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        @click.prevent="navigateTo(item.path)"
      >
        <component :is="item.icon" :size="19" :stroke-width="1.8" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </a>
      <button class="mobile-nav-item mobile-nav-search" type="button" @click="paletteOpen = true">
        <Search :size="19" :stroke-width="1.8" aria-hidden="true" />
        <span>ค้นหา</span>
      </button>
    </nav>

    <CommandPalette :open="paletteOpen" @close="paletteOpen = false" />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.skip-link {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 200;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-xs);
  background: var(--bottle);
  color: var(--paper-raised);
  font-size: 0.78rem;
  transform: translateY(-150%);
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: translateY(0);
}

.rail {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  display: flex;
  width: 272px;
  flex-direction: column;
  padding: 1.6rem 1.15rem 1.25rem;
  border-right: 1px solid var(--line);
  background: var(--paper-raised);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0 0.25rem;
}

.brand-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: var(--radius-sm);
  background: var(--bottle);
  color: var(--paper-raised);
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-style: italic;
  letter-spacing: -0.05em;
}

.brand-mark i {
  position: absolute;
  top: 0.42rem;
  right: 0.42rem;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: var(--signal);
}

.brand-word {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-word strong {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.brand-word small {
  margin-top: 0.1rem;
  color: var(--ink-3);
  font-size: 0.68rem;
  font-weight: 400;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  margin-top: 1.6rem;
  padding: 0.62rem 0.72rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper);
  color: var(--ink-3);
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.search-trigger:hover {
  border-color: var(--ink-3);
  background: var(--paper-raised);
  color: var(--ink);
}

.search-trigger span {
  flex: 1;
}

kbd {
  padding: 0.08rem 0.32rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper-raised);
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  line-height: 1.5;
}

.rail-label {
  margin: 1.75rem 0 0.55rem;
  padding: 0 0.35rem;
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.rail-label span {
  opacity: 0.6;
}

.rail-nav {
  display: grid;
  gap: 3px;
}

.nav-item {
  display: grid;
  grid-template-columns: 1.5rem 1.35rem minmax(0, 1fr) 0.45rem;
  align-items: center;
  gap: 0.6rem;
  padding: 0.68rem 0.55rem;
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  color: var(--ink-2);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.nav-item:hover {
  border-color: var(--line);
  background: var(--mint-soft);
  color: var(--ink);
}

.nav-item.is-active {
  background: var(--bottle);
  color: var(--paper-raised);
}

.nav-index {
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
}

.nav-item.is-active .nav-index {
  color: var(--signal);
}

.nav-icon {
  opacity: 0.82;
}

.nav-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  line-height: 1.25;
}

.nav-copy strong {
  font-size: 0.86rem;
  font-weight: 500;
}

.nav-copy small {
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.04em;
}

.nav-item.is-active .nav-copy small {
  color: rgb(251 250 245 / 0.72);
}

.nav-mark {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: transparent;
}

.nav-item.is-active .nav-mark {
  background: var(--signal);
  box-shadow: 0 0 0 3px rgb(239 90 47 / 0.18);
}

.rail-foot {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: auto;
  padding: 0 0.15rem;
}

.room-state {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--mint-soft);
}

.room-state span:last-child {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.room-state strong {
  font-size: 0.76rem;
  font-weight: 600;
}

.room-state small {
  margin-top: 0.08rem;
  color: var(--ink-3);
  font-size: 0.64rem;
}

.rail-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.2rem;
  color: var(--ink-2);
  font-size: 0.74rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.rail-contact:hover {
  color: var(--signal-deep);
}

.rail-contact span {
  font-size: 0.9rem;
}

.rail-version {
  padding: 0.2rem;
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stage {
  min-width: 0;
  margin-left: 272px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 62px;
  padding: 0.75rem clamp(1rem, 3.6vw, 3.25rem);
  border-bottom: 1px solid var(--line);
  background: rgb(244 241 233 / 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.topbar-context {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.topbar-index {
  color: var(--signal-deep);
  font-family: var(--font-mono);
  font-size: 0.63rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.topbar-divider {
  width: 1.1rem;
  height: 1px;
  background: var(--line-strong);
}

.topbar-title {
  overflow: hidden;
  color: var(--ink-2);
  font-size: 0.78rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--ink-3);
  font-size: 0.7rem;
}

.topbar-date {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  letter-spacing: 0.03em;
}

.topbar-hospital {
  padding-left: 1rem;
  border-left: 1px solid var(--line);
}

.topbar-search {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.55rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: var(--paper-raised);
  color: var(--ink-2);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.topbar-search:hover {
  border-color: var(--ink-3);
  background: var(--paper);
}

.topbar-search kbd {
  border: 0;
  background: transparent;
  padding: 0;
}

.stage-main {
  min-height: calc(100vh - 62px);
}

.mobile-nav {
  display: none;
}

@media (max-width: 1080px) {
  .rail {
    display: none;
  }

  .stage {
    margin-left: 0;
  }

  .stage-main {
    padding-bottom: 5.5rem;
  }

  .topbar {
    padding: 0.7rem 1rem;
  }

  .topbar-date,
  .topbar-hospital {
    display: none;
  }

  .mobile-nav {
    position: fixed;
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow: hidden;
    border: 1px solid var(--ink);
    border-radius: var(--radius-sm);
    background: var(--paper-raised);
    box-shadow: 4px 4px 0 0 rgb(13 59 49 / 0.16);
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.55rem 0.25rem;
    border: 0;
    border-right: 1px solid var(--line);
    background: transparent;
    color: var(--ink-3);
    font-size: 0.6rem;
    cursor: pointer;
  }

  .mobile-nav-item:last-child {
    border-right: 0;
  }

  .mobile-nav-item.is-active {
    background: var(--bottle);
    color: var(--paper-raised);
  }

  .mobile-nav-search {
    color: var(--signal-deep);
  }
}

@media (max-width: 480px) {
  .topbar-title {
    display: none;
  }

  .topbar-divider {
    display: none;
  }
}
</style>
