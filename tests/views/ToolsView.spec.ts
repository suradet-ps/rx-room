import type { ResourceItem } from '@/types/resource';

import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useUIStore } from '@/stores/ui';
import ToolsView from '@/views/ToolsView.vue';

const push = vi.fn();
const route = { path: '/tools', meta: { tab: 'tool', navGroup: 'tools' } };

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => route,
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
    id: 'had-list',
    title: 'บัญชียา High-Alert Drugs',
    description: 'รายการยาที่ต้องใช้ความระมัดระวังเป็นพิเศษ',
    iconName: 'Siren',
    url: 'https://example.com/had',
    isActive: false,
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
];

describe('toolsView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    push.mockReset();
    route.path = '/tools';
    route.meta = { tab: 'tool', navGroup: 'tools' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResources),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the active catalogue with counts', async () => {
    const wrapper = mount(ToolsView);
    await flushPromises();

    expect(wrapper.text()).toContain('เครื่องมือปฏิบัติงาน');
    expect(wrapper.findAll('.card')).toHaveLength(3);
    expect(wrapper.text()).toContain('2 พร้อมใช้');
  });

  it('filters resources using the shared search query', async () => {
    const wrapper = mount(ToolsView);
    const store = useUIStore();
    await flushPromises();

    store.setSearch('warfarin');
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.card')).toHaveLength(1);
    expect(wrapper.text()).toContain('โปรแกรมคำนวณยา Warfarin');
  });

  it('navigates between catalogue tabs', async () => {
    const wrapper = mount(ToolsView);
    await flushPromises();

    await wrapper.findAll('.tab')[1]?.trigger('click');

    expect(push).toHaveBeenCalledWith('/reports');
  });

  it('shows an empty state when nothing matches', async () => {
    const wrapper = mount(ToolsView);
    const store = useUIStore();
    await flushPromises();

    store.setSearch('ไม่พบแน่นอน');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('ไม่พบข้อมูลที่ค้นหา');
  });
});
