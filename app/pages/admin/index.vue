<template>
  <div class="space-y-6">
    <!-- Welcome Overview Area -->
    <AdminPageHeader
      title="Overview"
      description="Manage your KavoraX Global website from one place."
    >
      <template #badge>
        <span class="text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-800/40 bg-emerald-950/40 text-emerald-300">
          Executive View
        </span>
      </template>

      <template #actions>
        <NuxtLink
          to="/admin/leads"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
        >
          <Users class="w-3.5 h-3.5" />
          <span>View Inbound Leads</span>
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <!-- Disclosed Sample Notice Banner -->
    <div class="p-3 rounded-md border border-slate-800 bg-[#080c10]/70 flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <Info class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Demonstration Mode: Metrics and activity streams below represent verified sample data for layout validation.</span>
      </div>
      <span class="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline-block">Simulated State</span>
    </div>

    <!-- 4 Summary Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard
        label="Total Products"
        value="12"
        change="+2 this quarter"
        trend="up"
        description="Core & Enterprise catalog"
        icon-name="Package"
      />
      <DashboardStatCard
        label="Active Solutions"
        value="8"
        change="All deployed"
        trend="neutral"
        description="Enterprise frameworks"
        icon-name="Workflow"
      />
      <DashboardStatCard
        label="New Enquiries"
        value="24"
        change="6 unread"
        trend="up"
        description="B2B prospective accounts"
        icon-name="Mail"
      />
      <DashboardStatCard
        label="Published Pages"
        value="16"
        change="Latest sync today"
        trend="neutral"
        description="Live corporate routes"
        icon-name="FileText"
      />
    </div>

    <!-- Quick Actions Section -->
    <DashboardQuickActions />

    <!-- Two-Column Layout: Recent Activity and System Diagnostics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <RecentActivity />
      </div>

      <!-- Compact System Overview Section -->
      <div class="space-y-4">
        <AdminSectionCard
          title="System Architecture"
          description="Console operational profile"
        >
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between py-1.5 border-b border-border/60">
              <span class="text-slate-400">Application Framework</span>
              <span class="font-mono text-white">Nuxt 4.6.1</span>
            </div>
            <div class="flex items-center justify-between py-1.5 border-b border-border/60">
              <span class="text-slate-400">Reactive Engine</span>
              <span class="font-mono text-white">Vue 3.5 (Composition)</span>
            </div>
            <div class="flex items-center justify-between py-1.5 border-b border-border/60">
              <span class="text-slate-400">Type Discipline</span>
              <span class="font-mono text-emerald-400">Strict TypeScript</span>
            </div>
            <div class="flex items-center justify-between py-1.5 border-b border-border/60">
              <span class="text-slate-400">Design Framework</span>
              <span class="font-mono text-white">Tailwind CSS + shadcn</span>
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-slate-400">Data Persist Tier</span>
              <span class="font-mono text-slate-400">Phase 2 API Wireframe</span>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between w-full">
              <span class="text-[11px] text-slate-400">Status: Fully Operational</span>
              <AdminBadge variant="success" label="Active" />
            </div>
          </template>
        </AdminSectionCard>

        <!-- Brand Identity Reference -->
        <AdminSectionCard
          title="Brand Guidelines"
          description="Corporate design adherence"
        >
          <p class="text-xs text-slate-400 leading-relaxed">
            The admin console adheres strictly to KavoraX Global’s dark editorial palette (<code class="text-emerald-300">#0b0f14</code>, <code class="text-emerald-300">#0f161f</code>) with Cormorant Garamond typography and emerald accents.
          </p>
          <div class="mt-3 flex items-center gap-2">
            <NuxtLink
              to="/admin/content"
              class="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              <span>Manage brand copy</span>
              <span>&rarr;</span>
            </NuxtLink>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail, Users, Info } from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import DashboardStatCard from '~/components/admin/dashboard/DashboardStatCard.vue'
import DashboardQuickActions from '~/components/admin/dashboard/DashboardQuickActions.vue'
import RecentActivity from '~/components/admin/dashboard/RecentActivity.vue'
import AdminSectionCard from '~/components/admin/shared/AdminSectionCard.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard — KavoraX Global Admin'
})
</script>
