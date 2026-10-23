import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DefaultLayout from '@/layouts/DefaultLayout.vue';

const push = vi.fn();
const route = { path: '/', meta: { navGroup: 'home' } };

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => route,
}));

describe('defaultLayout', () => {
  beforeEach(() => {
    push.mockReset();
    route.path = '/';
    route.meta = { navGroup: 'home' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('renders slot content with the sidebar and mobile navigation', () => {
    const wrapper = mount(DefaultLayout, {
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    });

    expect(wrapper.findAll('.nav-item')).toHaveLength(2);
    expect(wrapper.findAll('.mobile-nav-item')).toHaveLength(3);
    expect(wrapper.findAll('.nav-item .nav-copy strong').map(item => item.text())).toEqual(['ภาพรวม', 'เครื่องมือ']);
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.text()).toContain('Content');
  });

  it('marks the tools item active for tools-group routes', () => {
    route.path = '/reports';
    route.meta = { navGroup: 'tools' };

    const wrapper = mount(DefaultLayout);
    const items = wrapper.findAll('.nav-item');

    expect(items[1]?.classes()).toContain('is-active');
    expect(items[1]?.attributes('aria-current')).toBe('page');
  });

  it('opens the command palette from the sidebar search', async () => {
    const wrapper = mount(DefaultLayout);

    await wrapper.get('.search-trigger').trigger('click');
    await wrapper.vm.$nextTick();

    const input = document.body.querySelector<HTMLInputElement>('.palette-input');
    expect(input?.placeholder).toContain('ค้นหาเครื่องมือ รายงาน หรือหน้าที่ต้องการ');
  });
});
