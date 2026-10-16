<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide border',
      variantClasses
    ]"
  >
    <span
      v-if="dot"
      :class="['w-1.5 h-1.5 rounded-full mr-1.5', dotClasses]"
      aria-hidden="true"
    />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'success' | 'warning' | 'info' | 'neutral' | 'danger'
    label?: string
    dot?: boolean
  }>(),
  {
    variant: 'neutral',
    label: '',
    dot: true
  }
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
    case 'warning':
      return 'bg-amber-950/40 text-amber-300 border-amber-800/40'
    case 'danger':
      return 'bg-rose-950/40 text-rose-300 border-rose-800/40'
    case 'info':
      return 'bg-sky-950/40 text-sky-300 border-sky-800/40'
    case 'neutral':
    default:
      return 'bg-slate-800/50 text-slate-300 border-slate-700/60'
  }
})

const dotClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-400'
    case 'warning':
      return 'bg-amber-400'
    case 'danger':
      return 'bg-rose-400'
    case 'info':
      return 'bg-sky-400'
    case 'neutral':
    default:
      return 'bg-slate-400'
  }
})
</script>
