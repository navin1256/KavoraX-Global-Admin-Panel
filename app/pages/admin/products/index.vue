<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Products"
      description="Manage enterprise products, feature tiers, and catalog visibility."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          {{ filteredProducts.length }} Registered
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          @click="showNotification('Catalog export feature scheduled for Phase 2 API rollout.')"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export Catalog</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="isAddModalOpen = true"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Product</span>
        </button>
      </template>
    </AdminPageHeader>

    <!-- Notification Toast if triggered -->
    <div
      v-if="actionNotice"
      class="p-3 rounded-md border border-emerald-800/60 bg-emerald-950/40 text-xs text-emerald-300 flex items-center justify-between transition-all"
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

    <!-- Filter & Search Controls -->
    <div class="p-4 rounded-lg border border-border bg-[#0f161f] flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products by title or code..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedCategory"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Core Platform">Core Platform</option>
          <option value="AI Infrastructure">AI Infrastructure</option>
          <option value="Cloud Security">Cloud Security</option>
        </select>

        <select
          v-model="selectedStatus"
          class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Products Data Table -->
    <div class="rounded-lg border border-border bg-[#0f161f] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/80 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-3 px-4">Product Name & SKU</th>
              <th scope="col" class="py-3 px-4">Category</th>
              <th scope="col" class="py-3 px-4">Tier</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4">Last Updated</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="item in filteredProducts"
              :key="item.id"
              class="hover:bg-slate-900/40 transition-colors group"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded border border-border bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                    <Package class="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {{ item.name }}
                    </div>
                    <div class="text-[10px] font-mono text-slate-400 mt-0.5">
                      {{ item.code }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-300">
                {{ item.category }}
              </td>
              <td class="py-3 px-4">
                <span class="font-mono text-[11px] text-slate-300 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/50">
                  {{ item.tier }}
                </span>
              </td>
              <td class="py-3 px-4">
                <AdminBadge
                  :variant="item.status === 'Active' ? 'success' : item.status === 'Draft' ? 'warning' : 'neutral'"
                  :label="item.status"
                />
              </td>
              <td class="py-3 px-4 font-mono text-slate-400 text-[11px]">
                {{ item.updatedAt }}
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Product Specs"
                    @click="showNotification(`Viewing specifications for ${item.name} (${item.code})`)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Product Details"
                    @click="showNotification(`Editing form for ${item.name} ready for Phase 2 API connection.`)"
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
      <div v-if="filteredProducts.length === 0" class="p-8">
        <AdminEmptyState
          title="No Products Match Filter"
          description="Try adjusting your search keywords or resetting the category and status filters."
          icon-name="Package"
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

      <!-- Table Footer Note -->
      <div class="py-3 px-4 border-t border-border/80 bg-[#080c10]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>Displaying sample product catalog data for management layout testing.</span>
        <span class="font-mono text-[10px] text-slate-400">Total Catalog Items: {{ sampleProducts.length }}</span>
      </div>
    </div>

    <!-- Phase 2 Add Product Modal Wireframe -->
    <Teleport to="body">
      <div
        v-if="isAddModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-lg rounded-lg border border-border bg-[#0f161f] p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 class="text-sm font-semibold text-white">New Product Specification</h3>
              <p class="text-xs text-slate-400 mt-0.5">Wireframe form structure for Phase 2 backend integration</p>
            </div>
            <button
              type="button"
              class="p-1 text-slate-400 hover:text-white"
              @click="isAddModalOpen = false"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-300 font-medium mb-1">Product Title</label>
              <input
                type="text"
                placeholder="e.g. Sovereign Vector Vault"
                class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-medium mb-1">SKU / Code</label>
                <input
                  type="text"
                  placeholder="KX-VAULT-01"
                  class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-slate-300 font-medium mb-1">Category</label>
                <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                  <option>Core Platform</option>
                  <option>AI Infrastructure</option>
                  <option>Cloud Security</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-slate-300 font-medium mb-1">Product Description</label>
              <textarea
                rows="3"
                placeholder="Brief technical capability summary..."
                class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>
            <div class="p-3 rounded bg-amber-950/20 border border-amber-800/40 text-amber-300 text-[11px]">
              Form Persistence Notice: Database connections are intentionally decoupled in this setup phase. No changes will be permanently stored until Phase 2 API wiring.
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              class="px-3 py-1.5 rounded text-xs border border-border hover:bg-slate-800 text-slate-300"
              @click="isAddModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded text-xs bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium"
              @click="isAddModalOpen = false; showNotification('Product template initialized. Form ready for API connection.')"
            >
              Simulate Create
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Package,
  Search,
  Plus,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminEmptyState from '~/components/admin/shared/AdminEmptyState.vue'
import type { ProductItem } from '~/types/admin'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Products — KavoraX Global Admin'
})

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedStatus = ref('All')
const actionNotice = ref('')
const isAddModalOpen = ref(false)

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
  selectedCategory.value = 'All'
  selectedStatus.value = 'All'
}

const sampleProducts = ref<ProductItem[]>([
  {
    id: 'prod-1',
    name: 'KavoraX Core Platform Engine',
    code: 'KX-ENG-01',
    category: 'Core Platform',
    tier: 'Sovereign',
    status: 'Active',
    updatedAt: '2026-10-14',
    description: 'Autonomous microkernel orchestrating cloud compute pipelines.'
  },
  {
    id: 'prod-2',
    name: 'Enterprise Vector Mesh Gateway',
    code: 'KX-VEC-04',
    category: 'AI Infrastructure',
    tier: 'Enterprise',
    status: 'Active',
    updatedAt: '2026-10-12',
    description: 'High-throughput embeddings index with low-latency search.'
  },
  {
    id: 'prod-3',
    name: 'Sovereign Cloud Sentry',
    code: 'KX-SEC-09',
    category: 'Cloud Security',
    tier: 'Sovereign',
    status: 'Active',
    updatedAt: '2026-10-10',
    description: 'Continuous cryptographic perimeter and zero-trust policy engine.'
  },
  {
    id: 'prod-4',
    name: 'Neural Mesh Edge Gateway',
    code: 'KX-EDG-02',
    category: 'AI Infrastructure',
    tier: 'Enterprise',
    status: 'Draft',
    updatedAt: '2026-10-08',
    description: 'Edge distributed agent coordination network.'
  },
  {
    id: 'prod-5',
    name: 'Telemetry & Observability Fabric',
    code: 'KX-TEL-11',
    category: 'Core Platform',
    tier: 'Core',
    status: 'Active',
    updatedAt: '2026-10-05',
    description: 'Real-time telemetry aggregator with OpenTelemetry compliance.'
  }
])

const filteredProducts = computed(() => {
  return sampleProducts.value.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'All' || item.category === selectedCategory.value

    const matchesStatus =
      selectedStatus.value === 'All' || item.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})
</script>
