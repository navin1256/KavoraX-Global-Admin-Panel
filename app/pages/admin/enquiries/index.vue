<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader
      title="Contact Inquiries"
      description="Review inbound messages, solutions inquiries, and corporate proposals submitted via public portals."
    >
      <template #badge>
        <span class="text-xs font-mono text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded bg-emerald-950/40">
          {{ meta.totalCount }} Inquiries
        </span>
      </template>

      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors disabled:opacity-50"
            @click="loadMessages"
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
            to="/admin/leads"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <Users class="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Leads</span>
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
        @click="loadMessages"
      >
        Retry
      </button>
    </div>

    <!-- Live Telemetry Banner -->
    <div class="p-3 rounded-md border border-border bg-[#080c10]/70 flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Connected to Spring Boot: <code>GET /api/v1/admin/contact-messages</code></span>
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

    <!-- 3 Summary Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Total Inquiries</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ meta.totalCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Contact submissions</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-border bg-[#080c10] flex items-center justify-center text-slate-400">
          <Mail class="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">New / Received</div>
          <div class="text-2xl font-semibold text-emerald-400 mt-1">{{ receivedCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Awaiting reply</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-emerald-800/40 bg-emerald-950/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Channel Origin</div>
          <div class="text-base font-semibold text-white mt-1">Contact & Solutions</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Corporate Website</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-sky-800/40 bg-sky-950/30 flex items-center justify-center text-sky-400">
          <Globe class="w-5 h-5" />
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
          placeholder="Search by name, email, subject, content..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedStatus"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="RECEIVED">Received</option>
          <option value="RESPONDED">Responded</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <button
          v-if="searchQuery || selectedStatus !== 'ALL'"
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
        <p class="text-xs font-mono">Fetching contact messages from database...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMessages.length === 0" class="p-12">
        <AdminEmptyState
          title="No Contact Inquiries Found"
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
              <th scope="col" class="py-3 px-4">Sender</th>
              <th scope="col" class="py-3 px-4">Subject</th>
              <th scope="col" class="py-3 px-4">Message Scope</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4">Received At</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="msg in filteredMessages"
              :key="msg.id"
              class="hover:bg-slate-900/40 transition-colors group cursor-pointer"
              @click="openMessageDrawer(msg)"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                    {{ getInitials(msg.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {{ msg.name }}
                    </div>
                    <div class="text-[11px] text-slate-400">
                      {{ msg.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-300 max-w-xs truncate font-medium">
                {{ msg.subject || 'General Inquiry' }}
              </td>
              <td class="py-3.5 px-4 text-slate-400 max-w-sm truncate" :title="msg.message">
                {{ msg.message }}
              </td>
              <td class="py-3.5 px-4">
                <AdminBadge
                  :variant="msg.status === 'RECEIVED' ? 'info' : 'success'"
                  :label="msg.status"
                />
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                {{ formatDate(msg.createdAt) }}
              </td>
              <td class="py-3.5 px-4 text-right" @click.stop>
                <button
                  type="button"
                  class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Inspect Inquiry"
                  @click="openMessageDrawer(msg)"
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
        <span>Displaying live records from <code>/api/v1/admin/contact-messages</code></span>
        <span class="font-mono text-[10px] text-slate-400">Active Records: {{ filteredMessages.length }} of {{ meta.totalCount }}</span>
      </div>
    </div>

    <!-- Contact Message Detail Drawer -->
    <ContactDetailDrawer
      :is-open="isDrawerOpen"
      :message="activeMessage"
      @close="isDrawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Mail,
  Users,
  Globe,
  Search,
  RefreshCw,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminEmptyState from '~/components/admin/shared/AdminEmptyState.vue'
import ContactDetailDrawer from '~/components/admin/leads/ContactDetailDrawer.vue'
import { useContactMessagesApi } from '~/composables/useContactMessagesApi'
import type { ContactMessageDto } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Contact Inquiries — KavoraX Global Admin'
})

const { messages, meta, isLoading, error, fetchContactMessages } = useContactMessagesApi()

const searchQuery = ref('')
const selectedStatus = ref('ALL')
const toastMessage = ref('')

const isDrawerOpen = ref(false)
const activeMessage = ref<ContactMessageDto | null>(null)

const loadMessages = async () => {
  try {
    await fetchContactMessages()
  } catch (err) {
    // Error is captured in useContactMessagesApi
  }
}

onMounted(() => {
  loadMessages()
})

const receivedCount = computed(() => {
  return messages.value.filter(m => m.status === 'RECEIVED').length
})

const filteredMessages = computed(() => {
  return messages.value.filter((msg) => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesQuery = !q ||
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q)) ||
      (msg.message && msg.message.toLowerCase().includes(q)) ||
      (msg.phone && msg.phone.includes(q))

    const matchesStatus = selectedStatus.value === 'ALL' || msg.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
})

const openMessageDrawer = (msg: ContactMessageDto) => {
  activeMessage.value = msg
  isDrawerOpen.value = true
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'ALL'
}

const getInitials = (name: string) => {
  if (!name) return 'IN'
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
  if (!filteredMessages.value.length) {
    toastMessage.value = 'No inquiries available to export.'
    return
  }

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Received At']
  const rows = filteredMessages.value.map(m => [
    `"${m.id}"`,
    `"${(m.name || '').replace(/"/g, '""')}"`,
    `"${(m.email || '').replace(/"/g, '""')}"`,
    `"${(m.phone || '').replace(/"/g, '""')}"`,
    `"${(m.subject || '').replace(/"/g, '""')}"`,
    `"${(m.message || '').replace(/"/g, '""')}"`,
    `"${(m.status || '').replace(/"/g, '""')}"`,
    `"${(m.createdAt || '').replace(/"/g, '""')}"`
  ].join(','))

  const csvContent = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kavorax-contact-inquiries-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toastMessage.value = `Exported ${filteredMessages.value.length} inquiries to CSV successfully.`
}
</script>
