<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader
      title="Demo & Session Leads"
      description="Manage enterprise product walkthrough bookings and experience center session requests."
    >
      <template #badge>
        <span class="text-xs font-mono text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded bg-emerald-950/40">
          {{ meta.totalCount }} Total
        </span>
      </template>

      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors disabled:opacity-50"
            @click="loadLeads"
          >
            <RefreshCw :class="['w-3.5 h-3.5', isLoading ? 'animate-spin text-emerald-400' : 'text-slate-400']" />
            <span>{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors shadow-sm"
            @click="handleExportCsv"
          >
            <Download class="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <NuxtLink
            to="/admin/enquiries"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <Mail class="w-3.5 h-3.5 text-emerald-400" />
            <span>Contact Inquiries</span>
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
        @click="loadLeads"
      >
        Retry
      </button>
    </div>

    <!-- Live Telemetry Banner -->
    <div class="p-3 rounded-md border border-border bg-[#080c10]/70 flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Connected to Spring Boot: <code>GET /api/v1/admin/demo-leads</code></span>
      </div>
      <span class="text-[10px] font-mono text-emerald-400 uppercase hidden sm:inline-block">PostgreSQL Persisted</span>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="toastMessage"
      class="p-3 rounded-md border border-emerald-800/60 bg-emerald-950/50 text-xs text-emerald-300 flex items-center justify-between transition-all"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button
        type="button"
        class="text-emerald-400 hover:text-emerald-200 p-0.5"
        @click="toastMessage = ''"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- 4 Summary Metric Cards (Derived from real backend dataset) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Total Records</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ meta.totalCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Persisted in database</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-border bg-[#080c10] flex items-center justify-center text-slate-400">
          <Users class="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Demo Bookings</div>
          <div class="text-2xl font-semibold text-emerald-400 mt-1">{{ demoBookingsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Walkthrough requests</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-emerald-800/40 bg-emerald-950/30 flex items-center justify-center text-emerald-400">
          <Package class="w-5 h-5" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Experience Sessions</div>
          <div class="text-2xl font-semibold text-sky-400 mt-1">{{ sessionRequestsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Center scheduling</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-sky-800/40 bg-sky-950/30 flex items-center justify-center text-sky-400">
          <Workflow class="w-5 h-5" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Pending Triage</div>
          <div class="text-2xl font-semibold text-amber-400 mt-1">{{ pendingLeadsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Action required</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-amber-800/40 bg-amber-950/30 flex items-center justify-center text-amber-400">
          <Calendar class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Filter & Search Controls -->
    <div class="p-4 rounded-lg border border-border bg-[#0f161f] flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, company, email, requirements..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedType"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">All Types</option>
          <option value="DEMO_BOOKING">Demo Booking</option>
          <option value="SESSION_REQUEST">Session Request</option>
          <option value="ENQUIRY">Enquiry</option>
        </select>

        <select
          v-model="selectedStatus"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          v-if="searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL'"
          type="button"
          class="px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="rounded-lg border border-border bg-[#0f161f] overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center text-slate-400 space-y-3">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-emerald-400" />
        <p class="text-xs font-mono">Fetching demo leads from database...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLeads.length === 0" class="p-12">
        <AdminEmptyState
          title="No Demo Leads Found"
          description="No records match your active search or filter criteria."
          icon-name="Inbox"
        >
          <template #action>
            <button
              type="button"
              class="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              @click="resetFilters"
            >
              Reset Filters
            </button>
          </template>
        </AdminEmptyState>
      </div>

      <!-- Populated Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/80 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-3 px-4">Lead / Contact</th>
              <th scope="col" class="py-3 px-4">Company</th>
              <th scope="col" class="py-3 px-4">Lead Type</th>
              <th scope="col" class="py-3 px-4">Requirements / Scope</th>
              <th scope="col" class="py-3 px-4">Scheduled Date</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4">Recorded</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              class="hover:bg-slate-900/40 transition-colors group cursor-pointer"
              @click="openLeadDrawer(lead)"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                    {{ getInitials(lead.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {{ lead.name }}
                    </div>
                    <div class="text-[11px] text-slate-400">
                      {{ lead.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-300">
                <span class="font-medium">{{ lead.company || '—' }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="font-mono text-[10px] text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded bg-emerald-950/40">
                  {{ lead.type }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-300 max-w-xs truncate" :title="lead.requirements || lead.message || ''">
                {{ lead.requirements || lead.message || '—' }}
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                <div v-if="lead.date">
                  <span class="text-white">{{ lead.date }}</span>
                  <div v-if="lead.timeSlot" class="text-[10px] text-slate-500">{{ lead.timeSlot }}</div>
                </div>
                <span v-else>—</span>
              </td>
              <td class="py-3.5 px-4">
                <AdminBadge
                  :variant="lead.status === 'PENDING' ? 'warning' : 'success'"
                  :label="lead.status"
                />
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                {{ formatDate(lead.createdAt) }}
              </td>
              <td class="py-3.5 px-4 text-right" @click.stop>
                <button
                  type="button"
                  class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Inspect Lead Details"
                  @click="openLeadDrawer(lead)"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer Note -->
      <div class="py-3 px-4 border-t border-border/80 bg-[#080c10]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>Displaying live records from <code>/api/v1/admin/demo-leads</code></span>
        <span class="font-mono text-[10px] text-slate-400">Active Records: {{ filteredLeads.length }} of {{ meta.totalCount }}</span>
      </div>
    </div>

    <!-- Lead Detail Slide-Over Drawer -->
    <LeadDetailDrawer
      :is-open="isDrawerOpen"
      :lead="activeLead"
      @close="isDrawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Users,
  Package,
  Workflow,
  Calendar,
  Search,
  RefreshCw,
  Download,
  Eye,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminEmptyState from '~/components/admin/shared/AdminEmptyState.vue'
import LeadDetailDrawer from '~/components/admin/leads/LeadDetailDrawer.vue'
import { useDemoLeadsApi } from '~/composables/useDemoLeadsApi'
import type { DemoLeadDto } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Demo Leads — KavoraX Global Admin'
})

const { leads, meta, isLoading, error, fetchDemoLeads } = useDemoLeadsApi()

const searchQuery = ref('')
const selectedType = ref('ALL')
const selectedStatus = ref('ALL')
const toastMessage = ref('')

const isDrawerOpen = ref(false)
const activeLead = ref<DemoLeadDto | null>(null)

const loadLeads = async () => {
  try {
    await fetchDemoLeads({
      type: selectedType.value !== 'ALL' ? selectedType.value : undefined
    })
  } catch (err) {
    // Error is captured in useDemoLeadsApi
  }
}

onMounted(() => {
  loadLeads()
})

const demoBookingsCount = computed(() => {
  return leads.value.filter(l => l.type === 'DEMO_BOOKING').length
})

const sessionRequestsCount = computed(() => {
  return leads.value.filter(l => l.type === 'SESSION_REQUEST').length
})

const pendingLeadsCount = computed(() => {
  return leads.value.filter(l => l.status === 'PENDING').length
})

const filteredLeads = computed(() => {
  return leads.value.filter((lead) => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesQuery = !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.company && lead.company.toLowerCase().includes(q)) ||
      (lead.requirements && lead.requirements.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.includes(q))

    const matchesType = selectedType.value === 'ALL' || lead.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'ALL' || lead.status === selectedStatus.value

    return matchesQuery && matchesType && matchesStatus
  })
})

const openLeadDrawer = (lead: DemoLeadDto) => {
  activeLead.value = lead
  isDrawerOpen.value = true
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'ALL'
  selectedStatus.value = 'ALL'
}

const getInitials = (name: string) => {
  if (!name) return 'LD'
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatDate = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleExportCsv = () => {
  if (!filteredLeads.value.length) {
    toastMessage.value = 'No leads available to export.'
    return
  }

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Lead Type', 'Requirements', 'Date', 'Time Slot', 'Status', 'Created At']
  const rows = filteredLeads.value.map(l => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${(l.type || '').replace(/"/g, '""')}"`,
    `"${(l.requirements || l.message || '').replace(/"/g, '""')}"`,
    `"${(l.date || '').replace(/"/g, '""')}"`,
    `"${(l.timeSlot || '').replace(/"/g, '""')}"`,
    `"${(l.status || '').replace(/"/g, '""')}"`,
    `"${(l.createdAt || '').replace(/"/g, '""')}"`
  ].join(','))

  const csvContent = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kavorax-demo-leads-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toastMessage.value = `Exported ${filteredLeads.value.length} demo leads to CSV successfully.`
}
</script>
