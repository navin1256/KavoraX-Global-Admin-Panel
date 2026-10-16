<template>
  <nav aria-label="Breadcrumb" class="flex items-center text-xs text-slate-400">
    <ol class="inline-flex items-center space-x-1.5 sm:space-x-2">
      <li class="inline-flex items-center">
        <NuxtLink
          to="/admin"
          class="inline-flex items-center hover:text-emerald-400 transition-colors"
        >
          <span>Admin</span>
        </NuxtLink>
      </li>
      <li
        v-for="(crumb, index) in crumbs"
        :key="crumb.path"
        class="inline-flex items-center"
      >
        <ChevronRight class="w-3.5 h-3.5 text-slate-600 mx-1 flex-shrink-0" />
        <NuxtLink
          v-if="index < crumbs.length - 1"
          :to="crumb.path"
          class="hover:text-emerald-400 transition-colors capitalize"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          class="text-slate-200 font-medium capitalize"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const route = useRoute()

const crumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  // Drop the first 'admin' segment since it's the root link
  if (segments[0] === 'admin') {
    segments.shift()
  }

  const result: Array<{ label: string; path: string }> = []
  let cumulative = '/admin'

  for (const seg of segments) {
    cumulative += `/${seg}`
    result.push({
      label: seg.replace(/-/g, ' '),
      path: cumulative
    })
  }

  return result
})
</script>
