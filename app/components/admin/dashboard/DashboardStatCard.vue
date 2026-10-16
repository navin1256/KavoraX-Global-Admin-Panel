<template>
  <div
    class="rounded-lg border border-border bg-[#0f161f] p-5 transition-colors hover:border-slate-700/80 flex flex-col justify-between"
  >
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
        {{ label }}
      </span>
      <div class="w-8 h-8 rounded border border-border bg-slate-900/80 flex items-center justify-center text-slate-300">
        <component :is="resolvedIcon" class="w-4 h-4 text-emerald-400" />
      </div>
    </div>

    <div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-semibold text-white tracking-tight">
          {{ value }}
        </span>
        <span
          v-if="change"
          :class="[
            'text-xs font-medium',
            trend === 'up' ? 'text-emerald-400' : 'text-slate-400'
          ]"
        >
          {{ change }}
        </span>
      </div>
      <p class="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
        <span>{{ description }}</span>
        <span class="text-[9px] font-mono text-slate-400 border border-slate-800 px-1 rounded bg-slate-900/60">
          Sample
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Package,
  Workflow,
  Mail,
  FileText,
  Activity
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    label: string
    value: string
    change?: string
    trend?: 'up' | 'down' | 'neutral'
    description?: string
    iconName?: string
  }>(),
  {
    change: '',
    trend: 'neutral',
    description: '',
    iconName: 'Package'
  }
)

const resolvedIcon = computed(() => {
  switch (props.iconName) {
    case 'Package':
      return Package
    case 'Workflow':
      return Workflow
    case 'Mail':
      return Mail
    case 'FileText':
      return FileText
    default:
      return Activity
  }
})
</script>
