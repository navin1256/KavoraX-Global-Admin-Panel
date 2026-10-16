<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Solutions"
      description="Configure enterprise solution architectures, use cases, and capability frameworks."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          {{ filteredSolutions.length }} Active Blueprints
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="showNotification('Solution blueprint builder ready for Phase 2 API connection.')"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Blueprint</span>
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
          placeholder="Search solutions by title or sector..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedDeployment"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Deployments</option>
          <option value="Dedicated Cloud">Dedicated Cloud</option>
          <option value="Hybrid Edge">Hybrid Edge</option>
          <option value="On-Premises">On-Premises</option>
          <option value="Multi-Region">Multi-Region</option>
        </select>

        <select
          v-model="selectedStatus"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="In Review">In Review</option>
        </select>
      </div>
    </div>

    <!-- Solutions Data Table -->
    <div class="rounded-lg border border-border bg-[#0f161f] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/80 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-3 px-4">Solution Title & Slug</th>
              <th scope="col" class="py-3 px-4">Target Sector</th>
              <th scope="col" class="py-3 px-4">Deployment Model</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4">Last Modified</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="item in filteredSolutions"
              :key="item.id"
              class="hover:bg-slate-900/40 transition-colors group"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded border border-border bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                    <Workflow class="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {{ item.title }}
                    </div>
                    <div class="text-[10px] font-mono text-slate-400 mt-0.5">
                      /solutions/{{ item.slug }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-300">
                {{ item.targetSector }}
              </td>
              <td class="py-3.5 px-4">
                <span class="font-mono text-[11px] text-slate-300 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/50">
                  {{ item.deploymentModel }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <AdminBadge
                  :variant="item.status === 'Active' ? 'success' : item.status === 'In Review' ? 'info' : 'warning'"
                  :label="item.status"
                />
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                {{ item.lastModified }}
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Solution"
                    @click="showNotification(`Viewing details for ${item.title}`)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Architecture"
                    @click="showNotification(`Editing ${item.title} ready for Phase 2 API connection.`)"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State If Filter Returns Nothing -->
      <div v-if="filteredSolutions.length === 0" class="p-8">
        <AdminEmptyState
          title="No Solutions Found"
          description="Try broadening your search term or clearing the deployment model filter."
          icon-name="Workflow"
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

      <!-- Footer Note -->
      <div class="py-3 px-4 border-t border-border/80 bg-[#080c10]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>Displaying sample enterprise solutions for administrative layout verification.</span>
        <span class="font-mono text-[10px] text-slate-400">Total Solutions: {{ sampleSolutions.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Workflow,
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
import type { SolutionItem } from '~/types/admin'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Solutions — KavoraX Global Admin'
})

const searchQuery = ref('')
const selectedDeployment = ref('All')
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
  selectedDeployment.value = 'All'
  selectedStatus.value = 'All'
}

const sampleSolutions = ref<SolutionItem[]>([
  {
    id: 'sol-1',
    title: 'Hybrid Cloud Transformation',
    slug: 'hybrid-cloud-transformation',
    targetSector: 'Global Enterprise & Banking',
    deploymentModel: 'Hybrid Edge',
    status: 'Active',
    lastModified: '2026-10-15',
    overview: 'Seamless migration bridges legacy on-prem infrastructure into private cloud meshes.'
  },
  {
    id: 'sol-2',
    title: 'Zero-Trust Sovereign Perimeter',
    slug: 'zero-trust-sovereign',
    targetSector: 'Government & Defense',
    deploymentModel: 'Dedicated Cloud',
    status: 'Active',
    lastModified: '2026-10-12',
    overview: 'Air-gapped verification nodes preventing credential leaks across federal networks.'
  },
  {
    id: 'sol-3',
    title: 'Real-Time Vector Search Fabric',
    slug: 'vector-search-fabric',
    targetSector: 'FinTech & Capital Markets',
    deploymentModel: 'Multi-Region',
    status: 'Active',
    lastModified: '2026-10-11',
    overview: 'Distributed embedding clusters enabling sub-millisecond fraud pattern detection.'
  },
  {
    id: 'sol-4',
    title: 'Autonomous Edge Observability',
    slug: 'autonomous-edge',
    targetSector: 'Industrial IoT & Energy',
    deploymentModel: 'On-Premises',
    status: 'In Review',
    lastModified: '2026-10-09',
    overview: 'Telemetry aggregation nodes optimized for intermittent connectivity in remote grids.'
  }
])

const filteredSolutions = computed(() => {
  return sampleSolutions.value.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.targetSector.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesDeployment =
      selectedDeployment.value === 'All' || item.deploymentModel === selectedDeployment.value

    const matchesStatus =
      selectedStatus.value === 'All' || item.status === selectedStatus.value

    return matchesSearch && matchesDeployment && matchesStatus
  })
})
</script>
