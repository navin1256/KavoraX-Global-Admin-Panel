<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
    <div>
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold text-white tracking-tight">
          {{ title }}
        </h1>
        <slot name="badge" />
      </div>
      <p v-if="description" class="text-sm text-slate-400 mt-1 max-w-2xl">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2.5 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
