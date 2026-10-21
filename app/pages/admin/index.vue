<template>
  <div class="space-y-6">
    <!-- Welcome Overview Area -->
    <AdminPageHeader
      title="Overview"
      description="Operational management cockpit for KavoraX Global enterprise operations."
    >
      <template #badge>
        <span class="text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-800/40 bg-emerald-950/40 text-emerald-300">
          Executive View
        </span>
      </template>

      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors disabled:opacity-50"
            @click="loadStats"
          >
            <RefreshCw :class="['w-3.5 h-3.5', isLoading ? 'animate-spin text-emerald-400' : 'text-slate-400']" />
            <span>{{ isLoading ? 'Refreshing...' : 'Refresh Stats' }}</span>
          </button>

          <NuxtLink
            to="/admin/leads"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm font-semibold"
          >
            <Users class="w-3.5 h-3.5" />
            <span>View Inbound Leads</span>
          </NuxtLink>
        </div>
      </template>
    </AdminPageHeader>

    <!-- Error Alert if API Fails -->
    <div
      v-if="error"
      class="p-4 rounded-lg border border-rose-800/60 bg-rose-950/40 text-xs text-rose-300 flex items-center justify-between"
    >
      <div class="flex items-center gap-2.5">
        <AlertCircle class="w-4 h-4 text-rose-400 flex-shrink-0" />
        <span>{{ error }}</span>
      </div>
      <button
        type="button"
        class="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white font-medium transition-colors"
        @click="loadStats"
      >
        Retry
      </button>
    </div>

    <!-- Live Operational Status Indicator -->
    <div class="p-3 rounded-md border border-border bg-[#080c10]/70 flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Live Backend API Active: Real-time telemetry synchronized with PostgreSQL persistence.</span>
      </div>
      <span class="text-[10px] font-mono text-emerald-400 uppercase hidden sm:inline-block">API Connected</span>
    </div>

    <!-- 4 Summary Metric Cards Connected to Spring Boot Backend -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard
        label="Total Demo Leads"
        :value="stats ? String(stats.totalDemoLeads) : '—'"
        change="Live Database"
        trend="neutral"
        description="All inbound enterprise prospects"
        icon-name="Users"
      />
      <DashboardStatCard
        label="Demo Bookings"
        :value="stats ? String(stats.totalDemoBookings) : '—'"
        change="Verified Records"
        trend="up"
        description="Scheduled platform walkthroughs"
        icon-name="Package"
      />
      <DashboardStatCard
        label="Session Requests"
        :value="stats ? String(stats.totalSessionRequests) : '—'"
        change="Experience Hub"
        trend="neutral"
        description="Executive briefing requests"
        icon-name="Workflow"
      />
      <DashboardStatCard
        label="Pending Triage"
        :value="stats ? String(stats.pendingLeads) : '—'"
        :change="stats && stats.pendingLeads > 0 ? `${stats.pendingLeads} Action Required` : 'Triage Clean'"
        :trend="stats && stats.pendingLeads > 0 ? 'up' : 'neutral'"
        description="Leads awaiting follow-up"
        icon-name="Mail"
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
              <span class="text-slate-400">Backend Server</span>
              <span class="font-mono text-white">Spring Boot 3.4.1</span>
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-slate-400">Data Persist Tier</span>
              <span class="font-mono text-emerald-400">PostgreSQL (Live)</span>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between w-full">
              <span class="text-[11px] text-slate-400">API Gateway: /api/v1</span>
              <AdminBadge variant="success" label="Connected" />
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
import { onMounted } from 'vue'
import { Users, RefreshCw, AlertCircle } from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import DashboardStatCard from '~/components/admin/dashboard/DashboardStatCard.vue'
import DashboardQuickActions from '~/components/admin/dashboard/DashboardQuickActions.vue'
import RecentActivity from '~/components/admin/dashboard/RecentActivity.vue'
import AdminSectionCard from '~/components/admin/shared/AdminSectionCard.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import { useDashboardApi } from '~/composables/useDashboardApi'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard — KavoraX Global Admin'
})

const { stats, isLoading, error, fetchStats } = useDashboardApi()

const loadStats = async () => {
  try {
    await fetchStats()
  } catch (err) {
    // Error state is captured in useDashboardApi.error
  }
}

onMounted(() => {
  loadStats()
})
</script>
