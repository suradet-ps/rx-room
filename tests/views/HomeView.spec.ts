import type { ResourceItem } from '@/types/resource';

import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useUIStore } from '@/stores/ui';
import HomeView from '@/views/HomeView.vue';

const push = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}));

const mockResources: ResourceItem[] = [
  {
    id: 'med-safety',
    title: 'MedSafety Net',
    description: 'ระบบบันทึกความคลาดเคลื่อนทางยา',
    iconName: 'AlertTriangle',
    url: 'https://example.com/med-safety',
    isActive: true,
    type: 'tool',
  },
  {
    id: 'warfarin-calc',
    title: 'โปรแกรมคำนวณยา Warfarin',
    description: 'เครื่องมือช่วยคำนวณขนาดยา Warfarin',
    iconName: 'Calculator',
    url: 'https://example.com/warfarin',
    isActive: true,
    type: 'tool',
  },
  {
    id: 'hospital-drugs',
    title: 'บัญชียาโรงพยาบาล',
    description: 'ตรวจสอบรายการยาที่มีใช้ในโรงพยาบาล',
    iconName: 'Pill',
    url: 'https://example.com/drugs',
    isActive: true,
    type: 'tool',
  },
  {
    id: 'had-list',
    title: 'บัญชียา High-Alert Drugs',
    description: 'รายการยาที่ต้องใช้ความระมัดระวังเป็นพิเศษ',
    iconName: 'Siren',
    url: 'https://example.com/had',
    isActive: true,
    type: 'tool',
  },
  {
    id: 'dashboard-safety',
    title: 'MedSafety Net Dashboard',
    description: 'รายงานและจัดการคลาดเคลื่อนทางยา',
    iconName: 'BarChart3',
    url: 'https://example.com/dashboard',
    isActive: true,
    type: 'report',
  },
  {
    id: 'thai-acc-warfarin',
    title: 'Warfarin and NOACs Registry Network',
    description: 'ระบบลงทะเบียนผู้ป่วย',
    iconName: 'Link',
    url: 'https://example.com/registry',
    isActive: true,
    type: 'external',
  },
];

function mountHome() {
  return mount(HomeView);
}

describe('homeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    push.mockReset();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResources),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the room hero and index', () => {
    const wrapper = mountHome();

    expect(wrapper.text()).toContain('ทุกเรื่อง');
    expect(wrapper.text()).toContain('จบในห้องเดียว');
    expect(wrapper.text()).toContain('Room index');
    expect(wrapper.findAll('.index-list a')).toHaveLength(3);
  });

  it('renders quick access rows from the resource catalogue', async () => {
    const wrapper = mountHome();
    await flushPromises();

    expect(wrapper.findAll('.quick-row')).toHaveLength(4);
    expect(wrapper.text()).toContain('MedSafety Net');
    expect(wrapper.text()).toContain('บัญชียา High-Alert Drugs');
  });

  it('routes the hero search to the tools page with the query', async () => {
    const wrapper = mountHome();
    const store = useUIStore();
    const input = wrapper.get('.hero-search input');

    await input.setValue('warfarin');
    await wrapper.get('.hero-search').trigger('submit');

    expect(store.searchQuery).toBe('warfarin');
    expect(push).toHaveBeenCalledWith('/tools');
  });

  it('applies a suggested search from the hero', async () => {
    const wrapper = mountHome();
    const store = useUIStore();

    await wrapper.findAll('.hero-suggest-chip')[0]?.trigger('click');

    expect(store.searchQuery).toBe('Warfarin');
    expect(push).toHaveBeenCalledWith('/tools');
  });
});
