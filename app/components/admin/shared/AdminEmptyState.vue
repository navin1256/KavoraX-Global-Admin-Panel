<template>
  <div class="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-lg bg-[#0b0f14]/50">
    <div class="w-12 h-12 rounded-full bg-slate-900 border border-border flex items-center justify-center text-slate-400 mb-4">
      <slot name="icon">
        <component :is="resolvedIcon" v-if="resolvedIcon" class="w-6 h-6 text-slate-400" />
      </slot>
    </div>
    <h3 class="text-sm font-medium text-white mb-1">
      {{ title }}
    </h3>
    <p class="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="flex items-center gap-3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Inbox,
  Package,
  Workflow,
  Building2,
  FileQuestion
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    iconName?: string
  }>(),
  {
    iconName: 'Inbox'
  }
)

const resolvedIcon = computed(() => {
  switch (props.iconName) {
    case 'Package':
      return Package
    case 'Workflow':
      return Workflow
    case 'Building2':
      return Building2
    case 'Inbox':
      return Inbox
    default:
      return FileQuestion
  }
})
</script>
