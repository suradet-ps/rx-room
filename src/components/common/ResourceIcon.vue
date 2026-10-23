<script setup lang="ts">
import type { ResourceItem } from '@/types/resource';

import {
  AlertTriangle,
  Baby,
  Banknote,
  BarChart3,
  Calculator,
  CalendarRange,
  ClipboardList,
  FileDown,
  FileSignature,
  Link as LinkIcon,
  PieChart,
  Pill,
  Siren,
  Users,
} from 'lucide-vue-next';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  name: ResourceItem['iconName'];
  size?: number;
  strokeWidth?: number;
}>(), {
  size: 24,
  strokeWidth: 1.7,
});

const icons = {
  AlertTriangle,
  Baby,
  Banknote,
  BarChart3,
  Calculator,
  CalendarRange,
  ClipboardList,
  FileDown,
  FileSignature,
  Link: LinkIcon,
  PieChart,
  Pill,
  Siren,
  Users,
};

const icon = computed(() => icons[props.name] ?? LinkIcon);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>
