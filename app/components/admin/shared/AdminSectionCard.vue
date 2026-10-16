<template>
  <div
    :class="[
      'rounded-lg border border-border bg-[#0f161f] text-slate-100 transition-colors',
      hoverable ? 'hover:border-slate-700' : '',
      customClass
    ]"
  >
    <div
      v-if="title || $slots.header || $slots.actions"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/80"
    >
      <slot name="header">
        <div>
          <h2 v-if="title" class="text-base font-medium text-white tracking-tight">
            {{ title }}
          </h2>
          <p v-if="description" class="text-xs text-slate-400 mt-0.5">
            {{ description }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div :class="['p-5', bodyClass]">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="px-5 py-3 border-t border-border/80 bg-[#080c10]/40 rounded-b-lg text-xs text-slate-400 flex items-center justify-between"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    hoverable?: boolean
    customClass?: string
    bodyClass?: string
  }>(),
  {
    title: '',
    description: '',
    hoverable: false,
    customClass: '',
    bodyClass: ''
  }
)
</script>
