import type { ResourceItem } from '@/types/resource';
import { mount } from '@vue/test-utils';

import { describe, expect, it } from 'vitest';
import ResourceCard from '@/components/common/ResourceCard.vue';

const mockItem: ResourceItem = {
  id: 'test-tool',
  title: 'Test Tool',
  description: 'Test Description',
  iconName: 'Pill',
  url: 'https://example.com',
  isActive: true,
  type: 'tool',
};

describe('resourceCard', () => {
  it('renders tool title, description, and index', () => {
    const wrapper = mount(ResourceCard, {
      props: { item: mockItem, index: 3 },
    });

    expect(wrapper.text()).toContain('Test Tool');
    expect(wrapper.text()).toContain('Test Description');
    expect(wrapper.text()).toContain('03');
    expect(wrapper.text()).toContain('TOOL-03');
  });

  it('shows the ready state and link when active', () => {
    const wrapper = mount(ResourceCard, {
      props: { item: { ...mockItem, isActive: true } },
    });

    expect(wrapper.text()).toContain('พร้อมใช้');
    expect(wrapper.text()).toContain('เปิดใช้งาน');
    expect(wrapper.find('a').exists()).toBe(true);
  });

  it('shows the maintenance state and disables the link when inactive', () => {
    const wrapper = mount(ResourceCard, {
      props: { item: { ...mockItem, isActive: false } },
    });

    expect(wrapper.text()).toContain('ปิดปรับปรุง');
    expect(wrapper.text()).toContain('เร็ว ๆ นี้');
    expect(wrapper.find('a').exists()).toBe(false);
  });

  it('renders the external link with safe attributes', () => {
    const wrapper = mount(ResourceCard, {
      props: { item: mockItem },
    });
    const link = wrapper.find('a');

    expect(link.attributes('href')).toBe('https://example.com');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });
});
