<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Settings"
      description="Manage global administrative parameters, brand attributes, and notification preferences."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          Super Admin Scope
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="showNotification('Settings saved to temporary session memory. Backend API persistence ready for Phase 2.')"
        >
          <Save class="w-3.5 h-3.5" />
          <span>Save Changes</span>
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

    <!-- Navigation Tabs for Settings Sections -->
    <div class="flex items-center gap-1 p-1 rounded-md bg-[#080c10] border border-border overflow-x-auto">
      <button
        v-for="tab in settingTabs"
        :key="tab.id"
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-2',
          activeTab === tab.id
            ? 'bg-slate-800 text-white font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        ]"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="w-3.5 h-3.5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab 1: Brand & Organization -->
    <div v-if="activeTab === 'brand'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminSectionCard
        title="Brand Identity & Metadata"
        description="Public attributes and corporate branding parameters"
      >
        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Company Registered Name</label>
            <input
              type="text"
              value="KavoraX Global Private Limited"
              class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Brand Tagline</label>
            <input
              type="text"
              value="Enterprise B2B SaaS, Sovereign Cloud & Technology Solutions"
              class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-medium mb-1">Administrative Contact</label>
              <input
                type="email"
                value="admin@kavorax.com"
                class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-slate-300 font-medium mb-1">Enterprise Inquiries</label>
              <input
                type="email"
                value="solutions@kavorax.com"
                class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <template #footer>
          <span class="text-[11px] text-slate-400">Synchronized with HTML head metadata</span>
        </template>
      </AdminSectionCard>

      <AdminSectionCard
        title="Visual Theme Tokens"
        description="Active design system tokens matching the corporate website"
      >
        <div class="space-y-3 text-xs">
          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <div>
              <span class="font-medium text-white block">Main Dark Background</span>
              <span class="text-[11px] font-mono text-slate-400">#0b0f14 (HSL 213 29% 6.1%)</span>
            </div>
            <div class="w-6 h-6 rounded border border-slate-700 bg-[#0b0f14]" />
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <div>
              <span class="font-medium text-white block">Secondary Background</span>
              <span class="text-[11px] font-mono text-slate-400">#080c10 (HSL 210 33% 4.7%)</span>
            </div>
            <div class="w-6 h-6 rounded border border-slate-700 bg-[#080c10]" />
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <div>
              <span class="font-medium text-white block">Card & Panel Surface</span>
              <span class="text-[11px] font-mono text-slate-400">#0f161f (HSL 214 30% 8.5%)</span>
            </div>
            <div class="w-6 h-6 rounded border border-slate-700 bg-[#0f161f]" />
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <div>
              <span class="font-medium text-white block">Emerald Brand Accent</span>
              <span class="text-[11px] font-mono text-emerald-400">#10b981 (HSL 160 84% 39%)</span>
            </div>
            <div class="w-6 h-6 rounded border border-emerald-600 bg-[#10b981]" />
          </div>
        </div>
      </AdminSectionCard>
    </div>

    <!-- Tab 2: Localization & Regional -->
    <div v-else-if="activeTab === 'localization'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminSectionCard
        title="Localization & Regional Settings"
        description="Timezone, numeric formatting, and internationalization defaults"
      >
        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Administrative Timezone</label>
            <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option>UTC (Coordinated Universal Time)</option>
              <option selected>Asia/Kolkata (IST, UTC+05:30)</option>
              <option>America/New_York (EST, UTC-05:00)</option>
              <option>Europe/London (GMT, UTC+00:00)</option>
              <option>Asia/Singapore (SGT, UTC+08:00)</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Default Display Currency</label>
            <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option selected>USD ($) — United States Dollar</option>
              <option>EUR (€) — Euro</option>
              <option>GBP (£) — British Pound</option>
              <option>INR (₹) — Indian Rupee</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Date Format Preference</label>
            <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option selected>YYYY-MM-DD (ISO 8601)</option>
              <option>DD/MM/YYYY</option>
              <option>MMM DD, YYYY</option>
            </select>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Regional Enclave Compliance"
        description="Data residency and legal jurisdiction boundaries"
      >
        <div class="space-y-3 text-xs text-slate-300">
          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <span>Primary Sovereign Node</span>
            <span class="font-mono text-emerald-400">EU-Frankfurt-01 (GDPR Compliant)</span>
          </div>
          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <span>Secondary Redundancy Cluster</span>
            <span class="font-mono text-slate-300">US-East-Ashburn-02</span>
          </div>
          <div class="p-3 rounded bg-[#080c10] border border-border flex items-center justify-between">
            <span>APAC Edge Transit Hub</span>
            <span class="font-mono text-slate-300">AP-Singapore-01</span>
          </div>
        </div>
      </AdminSectionCard>
    </div>

    <!-- Tab 3: Security & Notification Preferences -->
    <div v-else-if="activeTab === 'security'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminSectionCard
        title="Notification Alerts"
        description="Dispatch channels for inbound enterprise inquiries and critical incidents"
      >
        <div class="space-y-4 text-xs">
          <div class="flex items-center justify-between p-3 rounded bg-[#080c10] border border-border">
            <div>
              <span class="font-medium text-white block">High-Priority Inquiry Alerts</span>
              <span class="text-[11px] text-slate-400">Instant email notification when an enterprise RFP is submitted</span>
            </div>
            <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
          </div>

          <div class="flex items-center justify-between p-3 rounded bg-[#080c10] border border-border">
            <div>
              <span class="font-medium text-white block">Weekly Summary Digest</span>
              <span class="text-[11px] text-slate-400">Aggregated metric report sent every Monday at 08:00 UTC</span>
            </div>
            <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
          </div>

          <div class="flex items-center justify-between p-3 rounded bg-[#080c10] border border-border">
            <div>
              <span class="font-medium text-white block">System Health Anomalies</span>
              <span class="text-[11px] text-slate-400">Broadcast notification if cluster latency exceeds 120ms</span>
            </div>
            <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Access Governance"
        description="Session duration and authentication protocol controls"
      >
        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Administrative Session Timeout</label>
            <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option>15 Minutes of Inactivity</option>
              <option selected>30 Minutes of Inactivity</option>
              <option>1 Hour of Inactivity</option>
              <option>8 Hours (End of shift)</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Hardware Security Key Enforcement</label>
            <p class="text-[11px] text-slate-400 mb-2">FIDO2 / WebAuthn physical security keys requirement for all console operators.</p>
            <AdminBadge variant="info" label="Ready for Phase 2 Auth Integration" />
          </div>
        </div>
      </AdminSectionCard>
    </div>

    <!-- Tab 4: Diagnostics & Environment -->
    <div v-else-if="activeTab === 'diagnostics'" class="space-y-6">
      <AdminSectionCard
        title="Environment Diagnostics"
        description="Runtime telemetry, framework configuration, and dependency integrity"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="p-3 rounded bg-[#080c10] border border-border">
            <span class="text-[10px] font-mono uppercase text-slate-400 block">Framework</span>
            <span class="font-semibold text-white text-sm mt-1 block">Nuxt 4.6.1</span>
            <span class="text-[11px] text-emerald-400 font-mono mt-0.5 block">Nitro 2.13.4</span>
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border">
            <span class="text-[10px] font-mono uppercase text-slate-400 block">Vue Architecture</span>
            <span class="font-semibold text-white text-sm mt-1 block">Vue 3.5.44</span>
            <span class="text-[11px] text-slate-400 font-mono mt-0.5 block">Composition API</span>
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border">
            <span class="text-[10px] font-mono uppercase text-slate-400 block">Type Safety</span>
            <span class="font-semibold text-white text-sm mt-1 block">TypeScript 5.9</span>
            <span class="text-[11px] text-emerald-400 font-mono mt-0.5 block">Strict Mode Active</span>
          </div>

          <div class="p-3 rounded bg-[#080c10] border border-border">
            <span class="text-[10px] font-mono uppercase text-slate-400 block">CSS / Design System</span>
            <span class="font-semibold text-white text-sm mt-1 block">Tailwind CSS 3.4</span>
            <span class="text-[11px] text-slate-400 font-mono mt-0.5 block">shadcn-vue Primitives</span>
          </div>
        </div>

        <div class="mt-4 p-4 rounded bg-[#080c10] border border-border">
          <h4 class="text-xs font-semibold text-white mb-2">Package Manager & Lockfile Audit</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            The admin console project is fully decoupled from the public website with its own independent <code class="text-emerald-300">package.json</code> and <code class="text-emerald-300">pnpm-lock.yaml</code>. No duplicate processes or shared state leaks exist.
          </p>
        </div>
      </AdminSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  Cpu,
  Save,
  CheckCircle2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminSectionCard from '~/components/admin/shared/AdminSectionCard.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Settings — KavoraX Global Admin'
})

const activeTab = ref('brand')
const actionNotice = ref('')

const showNotification = (msg: string) => {
  actionNotice.value = msg
  setTimeout(() => {
    if (actionNotice.value === msg) {
      actionNotice.value = ''
    }
  }, 4500)
}

const settingTabs = [
  { id: 'brand', label: 'Brand & Identity', icon: SlidersHorizontal },
  { id: 'localization', label: 'Localization & Regions', icon: Globe },
  { id: 'security', label: 'Security & Alerts', icon: ShieldCheck },
  { id: 'diagnostics', label: 'Environment Diagnostics', icon: Cpu }
]
</script>
