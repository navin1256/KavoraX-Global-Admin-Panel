<template>
  <div class="rounded-lg border border-border bg-[#0f161f] p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-sm font-medium text-white tracking-tight">
          Recent Platform Activity
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Audit stream of recent modifications and incoming requests
        </p>
      </div>
      <span class="text-[10px] font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-900/60">
        Sample Log
      </span>
    </div>

    <!-- Sample Activity Stream -->
    <div class="divide-y divide-border/60">
      <div
        v-for="item in sampleActivities"
        :key="item.id"
        class="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              'w-7 h-7 rounded border flex items-center justify-center flex-shrink-0 mt-0.5',
              typeBadgeClasses(item.type)
            ]"
          >
            <component :is="typeIcon(item.type)" class="w-3.5 h-3.5" />
          </div>
          <div>
            <p class="text-xs text-slate-200">
              <span class="font-medium text-white">{{ item.user }}</span>
              {{ ' ' }}{{ item.action }}{{ ' ' }}
              <span class="text-emerald-300 font-medium">{{ item.target }}</span>
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-mono text-slate-400">
                {{ item.timeAgo }}
              </span>
              <span class="text-slate-600 text-xs">•</span>
              <span class="text-[10px] font-mono uppercase text-slate-400">
                {{ item.type }}
              </span>
            </div>
          </div>
        </div>

        <span class="text-[10px] font-mono text-slate-400 border border-slate-800 px-1 py-0.5 rounded bg-slate-900/40 hidden sm:inline-block">
          #{{ item.id }}
        </span>
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-border/60 text-center">
      <p class="text-[11px] text-slate-400 italic">
        Note: The events above are simulated sample records for visual verification. No live audit logs are currently streaming.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Package,
  Workflow,
  Mail,
  FileText,
  SlidersHorizontal
} from 'lucide-vue-next'
import type { ActivityItem } from '~/types/admin'

const sampleActivities: ActivityItem[] = [
  {
    id: 'ACT-1092',
    action: 'received enterprise demo request from',
    target: 'Acme Federal Cloud Corp',
    user: 'Inbound Portal',
    timeAgo: '12 minutes ago',
    type: 'enquiry'
  },
  {
    id: 'ACT-1091',
    action: 'updated deployment model for',
    target: 'Zero-Trust Architecture',
    user: 'Platform Admin',
    timeAgo: '1 hour ago',
    type: 'solution'
  },
  {
    id: 'ACT-1090',
    action: 'published new feature tier on',
    target: 'Sovereign Cloud Engine',
    user: 'Platform Admin',
    timeAgo: '3 hours ago',
    type: 'product'
  },
  {
    id: 'ACT-1089',
    action: 'revised hero copy on',
    target: 'Enterprise Solutions Overview',
    user: 'Content Editor',
    timeAgo: 'Yesterday',
    type: 'content'
  },
  {
    id: 'ACT-1088',
    action: 'synchronized security playbooks for',
    target: 'Financial Services Vertical',
    user: 'Security Lead',
    timeAgo: '2 days ago',
    type: 'system'
  }
]

const typeIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'product':
      return Package
    case 'solution':
      return Workflow
    case 'enquiry':
      return Mail
    case 'content':
      return FileText
    case 'system':
    default:
      return SlidersHorizontal
  }
}

const typeBadgeClasses = (type: ActivityItem['type']) => {
  switch (type) {
    case 'enquiry':
      return 'bg-amber-950/40 text-amber-300 border-amber-800/40'
    case 'product':
      return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
    case 'solution':
      return 'bg-sky-950/40 text-sky-300 border-sky-800/40'
    case 'content':
      return 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40'
    case 'system':
    default:
      return 'bg-slate-900 text-slate-300 border-slate-700/60'
  }
}
</script>
