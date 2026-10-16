<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Industries"
      description="Organize industry vertical playbooks, compliance standards, and specialized offerings."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          {{ filteredIndustries.length }} Industry Verticals
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="showNotification('Vertical playbook editor scheduled for Phase 2 API integration.')"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Add Vertical</span>
        </button>
      </template>
    </AdminPageHeader>

    <!-- Notification Toast -->
    <div
      v-if="actionNotice"
      class="p-3 rounded-md border border-emerald-800/60 bg-emerald-950/40 text-xs text-emerald-300 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ actionNotice }}</span>
      </div>
      <button
        type="button"
        class="text-emerald-400 hover:text-emerald-200"
        @click="actionNotice = ''"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-4 rounded-lg border border-border bg-[#0f161f] flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by industry name or code..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedStatus"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Under Review">Under Review</option>
        </select>
      </div>
    </div>

    <!-- Industries Table -->
    <div class="rounded-lg border border-border bg-[#0f161f] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/80 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-3 px-4">Industry Vertical</th>
              <th scope="col" class="py-3 px-4">Code</th>
              <th scope="col" class="py-3 px-4">Compliance Framework</th>
              <th scope="col" class="py-3 px-4">Active Playbooks</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="item in filteredIndustries"
              :key="item.id"
              class="hover:bg-slate-900/40 transition-colors group"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded border border-border bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                    <Building2 class="w-3.5 h-3.5" />
                  </div>
                  <span class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {{ item.name }}
                  </span>
                </div>
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                {{ item.verticalCode }}
              </td>
              <td class="py-3.5 px-4">
                <span class="font-mono text-[11px] text-slate-300 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
                  {{ item.complianceStandard }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-300 font-mono">
                {{ item.activePlaybooks }} Playbooks
              </td>
              <td class="py-3.5 px-4">
                <AdminBadge
                  :variant="item.status === 'Active' ? 'success' : 'warning'"
                  :label="item.status"
                />
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Industry Overview"
                    @click="showNotification(`Viewing details for ${item.name}`)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Compliance Standards"
                    @click="showNotification(`Editing ${item.name} ready for Phase 2 API connection.`)"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredIndustries.length === 0" class="p-8">
        <AdminEmptyState
          title="No Industries Found"
          description="No industry verticals matched your search parameters."
          icon-name="Building2"
        >
          <template #action>
            <button
              type="button"
              class="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              @click="resetFilters"
            >
              Reset Search
            </button>
          </template>
        </AdminEmptyState>
      </div>

      <!-- Footer Note -->
      <div class="py-3 px-4 border-t border-border/80 bg-[#080c10]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>Displaying sample industry vertical standards for management UI validation.</span>
        <span class="font-mono text-[10px] text-slate-400">Total Verticals: {{ sampleIndustries.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Building2,
  Search,
  Plus,
  Eye,
  Edit3,
  CheckCircle2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminEmptyState from '~/components/admin/shared/AdminEmptyState.vue'
import type { IndustryItem } from '~/types/admin'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Industries — KavoraX Global Admin'
})

const searchQuery = ref('')
const selectedStatus = ref('All')
const actionNotice = ref('')

const showNotification = (msg: string) => {
  actionNotice.value = msg
  setTimeout(() => {
    if (actionNotice.value === msg) {
      actionNotice.value = ''
    }
  }, 4500)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'All'
}

const sampleIndustries = ref<IndustryItem[]>([
  {
    id: 'ind-1',
    name: 'Financial Services & Capital Markets',
    verticalCode: 'IND-FIN-01',
    complianceStandard: 'SOC2 Type II · PCI-DSS v4',
    activePlaybooks: 8,
    status: 'Active'
  },
  {
    id: 'ind-2',
    name: 'Healthcare & Life Sciences',
    verticalCode: 'IND-HLT-02',
    complianceStandard: 'HIPAA · HITECH · FDA 21 CFR',
    activePlaybooks: 6,
    status: 'Active'
  },
  {
    id: 'ind-3',
    name: 'Industrial, Energy & Utilities',
    verticalCode: 'IND-ENG-03',
    complianceStandard: 'NERC CIP · IEC 62443',
    activePlaybooks: 5,
    status: 'Active'
  },
  {
    id: 'ind-4',
    name: 'Telecommunications & 5G Carrier Edge',
    verticalCode: 'IND-TEL-04',
    complianceStandard: '3GPP Rel 18 · ETSI NFV',
    activePlaybooks: 4,
    status: 'Active'
  },
  {
    id: 'ind-5',
    name: 'Government, Defense & Sovereign Public',
    verticalCode: 'IND-GOV-05',
    complianceStandard: 'FedRAMP High · DoD IL5/IL6',
    activePlaybooks: 9,
    status: 'Active'
  }
])

const filteredIndustries = computed(() => {
  return sampleIndustries.value.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.verticalCode.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'All' || item.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})
</script>
