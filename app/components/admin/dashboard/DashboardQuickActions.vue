<template>
  <div class="rounded-lg border border-border bg-[#0f161f] p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-sm font-medium text-white tracking-tight">
          Quick Actions
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Fast-travel shortcuts to core admin workflows
        </p>
      </div>
      <span class="text-[10px] font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-900/60">
        Navigation
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="flex flex-col p-3.5 rounded-md border border-border bg-[#080c10]/60 hover:bg-[#0b0f14] hover:border-emerald-500/40 transition-all group"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="w-7 h-7 rounded border border-border bg-slate-900/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
            <component :is="action.icon" class="w-3.5 h-3.5" />
          </div>
          <ArrowUpRight class="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </div>
        <span class="text-xs font-medium text-white group-hover:text-emerald-300 transition-colors">
          {{ action.title }}
        </span>
        <span class="text-[11px] text-slate-400 mt-0.5 leading-snug">
          {{ action.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Package,
  Workflow,
  Users,
  Mail,
  ArrowUpRight
} from 'lucide-vue-next'

const quickActions = [
  {
    title: 'Demo Leads',
    description: 'Enterprise walkthrough & session requests',
    to: '/admin/leads',
    icon: Users
  },
  {
    title: 'Contact Inquiries',
    description: 'Incoming RFP & partnership messages',
    to: '/admin/enquiries',
    icon: Mail
  },
  {
    title: 'Manage Products',
    description: 'Catalog, SKU specs & status',
    to: '/admin/products',
    icon: Package
  },
  {
    title: 'Configure Solutions',
    description: 'Architectures & deployments',
    to: '/admin/solutions',
    icon: Workflow
  }
]
</script>
