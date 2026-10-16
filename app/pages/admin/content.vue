<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Website Content"
      description="Oversee published pages, hero copy, brand assets, and legal documentation."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          5 Core Routes
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="showNotification('Static page generator ready for Phase 2 API connection.')"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Custom Page</span>
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

    <!-- Section 1: Live Public Website Pages -->
    <AdminSectionCard
      title="Published Website Routes"
      description="Core navigational entry points on the corporate portal"
    >
      <div class="overflow-x-auto -mx-5 -my-2">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/80 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-2.5 px-5">Page Name</th>
              <th scope="col" class="py-2.5 px-4">Slug / Path</th>
              <th scope="col" class="py-2.5 px-4">Content Sections</th>
              <th scope="col" class="py-2.5 px-4">Status</th>
              <th scope="col" class="py-2.5 px-4">Last Synchronized</th>
              <th scope="col" class="py-2.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr
              v-for="page in samplePages"
              :key="page.id"
              class="hover:bg-slate-900/40 transition-colors group"
            >
              <td class="py-3 px-5 font-medium text-white">
                <div class="flex items-center gap-2.5">
                  <FileText class="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  <span>{{ page.title }}</span>
                </div>
              </td>
              <td class="py-3 px-4 font-mono text-[11px] text-emerald-400">
                {{ page.path }}
              </td>
              <td class="py-3 px-4 text-slate-300 font-mono">
                {{ page.sectionsCount }} Sections
              </td>
              <td class="py-3 px-4">
                <AdminBadge
                  :variant="page.status === 'Published' ? 'success' : 'neutral'"
                  :label="page.status"
                />
              </td>
              <td class="py-3 px-4 font-mono text-slate-400 text-[11px]">
                {{ page.lastUpdated }}
              </td>
              <td class="py-3 px-5 text-right">
                <button
                  type="button"
                  class="px-2 py-1 rounded text-xs border border-border hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  @click="showNotification(`Editor for ${page.title} ready for Phase 2 API connection.`)"
                >
                  Edit Copy
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminSectionCard>

    <!-- Two-Column Section: Announcement Banner & Legal Compliance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Announcement Banner Editor Section -->
      <AdminSectionCard
        title="Global Announcement Banner"
        description="Top-level alert banner displayed across the public portal"
      >
        <div class="space-y-4 text-xs">
          <div class="flex items-center justify-between p-3 rounded bg-[#080c10] border border-border">
            <div>
              <span class="font-medium text-white block">Banner Active Status</span>
              <span class="text-[11px] text-slate-400">Toggle whether the banner is visible to visitors</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="bannerActive" type="checkbox" class="sr-only peer" />
              <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Banner Headline Copy</label>
            <input
              v-model="bannerText"
              type="text"
              class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Target Action Link</label>
            <input
              v-model="bannerLink"
              type="text"
              class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <!-- Banner Live Preview Box -->
          <div>
            <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Live Preview:</span>
            <div
              v-if="bannerActive"
              class="p-2.5 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <Sparkles class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span class="truncate">{{ bannerText }}</span>
              </div>
              <span class="font-mono text-[10px] underline ml-2 flex-shrink-0">Learn More &rarr;</span>
            </div>
            <div
              v-else
              class="p-2.5 rounded border border-border bg-[#080c10] text-slate-500 text-xs text-center italic"
            >
              Banner is currently disabled.
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] text-slate-400">Preview editor mode</span>
            <button
              type="button"
              class="px-3 py-1 rounded text-xs bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium"
              @click="showNotification('Banner settings updated in memory.')"
            >
              Update Banner
            </button>
          </div>
        </template>
      </AdminSectionCard>

      <!-- Legal Policies Section -->
      <AdminSectionCard
        title="Legal & Regulatory Documentation"
        description="Public compliance whitepapers, terms, and agreements"
      >
        <div class="space-y-3 text-xs">
          <div
            v-for="doc in legalDocs"
            :key="doc.title"
            class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <span class="font-medium text-white block">{{ doc.title }}</span>
              <span class="text-[11px] text-slate-400 font-mono">{{ doc.code }} · Last reviewed {{ doc.date }}</span>
            </div>
            <button
              type="button"
              class="px-2 py-1 rounded text-xs border border-border hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              @click="showNotification(`Opened policy document: ${doc.title}`)"
            >
              Review
            </button>
          </div>
        </div>

        <template #footer>
          <span class="text-[11px] text-slate-400 italic">Version controlled under strict governance rules</span>
        </template>
      </AdminSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminSectionCard from '~/components/admin/shared/AdminSectionCard.vue'
import type { ContentPageItem } from '~/types/admin'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Website Content — KavoraX Global Admin'
})

const actionNotice = ref('')
const bannerActive = ref(true)
const bannerText = ref('KavoraX Global announces sovereign cloud mesh availability for financial enterprises.')
const bannerLink = ref('/solutions/hybrid-cloud-transformation')

const showNotification = (msg: string) => {
  actionNotice.value = msg
  setTimeout(() => {
    if (actionNotice.value === msg) {
      actionNotice.value = ''
    }
  }, 4500)
}

const samplePages: ContentPageItem[] = [
  {
    id: 'pg-1',
    title: 'Enterprise Homepage',
    slug: 'home',
    path: '/',
    lastUpdated: '2026-10-15',
    status: 'Published',
    sectionsCount: 8
  },
  {
    id: 'pg-2',
    title: 'About Corporate Narrative',
    slug: 'about',
    path: '/about',
    lastUpdated: '2026-10-14',
    status: 'Published',
    sectionsCount: 5
  },
  {
    id: 'pg-3',
    title: 'Interactive Demonstration',
    slug: 'demo',
    path: '/demo',
    lastUpdated: '2026-10-14',
    status: 'Published',
    sectionsCount: 4
  },
  {
    id: 'pg-4',
    title: 'Contact & Global Presence',
    slug: 'contact',
    path: '/contact',
    lastUpdated: '2026-10-14',
    status: 'Published',
    sectionsCount: 3
  },
  {
    id: 'pg-5',
    title: 'Commercial Pricing Matrix',
    slug: 'pricing',
    path: '/pricing',
    lastUpdated: '2026-10-12',
    status: 'Published',
    sectionsCount: 4
  }
]

const legalDocs = [
  {
    title: 'Enterprise Master Services Agreement',
    code: 'DOC-MSA-2026',
    date: 'Oct 2026'
  },
  {
    title: 'Global Privacy & GDPR Policy',
    code: 'DOC-GDPR-V4',
    date: 'Sep 2026'
  },
  {
    title: 'Sovereign Cloud Security Whitepaper',
    code: 'WHT-SEC-99',
    date: 'Oct 2026'
  }
]
</script>
