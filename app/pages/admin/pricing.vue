<template>
  <div class="space-y-6">
    <!-- Header -->
    <AdminPageHeader
      title="Pricing Plans"
      description="Configure commercial tiers, feature entitlements, billing intervals, and currency models."
    >
      <template #badge>
        <span class="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/60">
          3 Commercial Tiers
        </span>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          @click="showNotification('Custom contract tier builder ready for Phase 2 API integration.')"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Plan Tier</span>
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

    <!-- Pricing Tiers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        v-for="plan in samplePlans"
        :key="plan.id"
        class="rounded-lg border border-border bg-[#0f161f] p-5 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              {{ plan.name }}
            </span>
            <AdminBadge
              :variant="plan.badge === 'Most Popular' ? 'success' : 'neutral'"
              :label="plan.badge || plan.status"
            />
          </div>

          <div class="my-3">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-semibold text-white tracking-tight">{{ plan.price }}</span>
              <span class="text-xs text-slate-400 font-mono">{{ plan.interval }}</span>
            </div>
            <p class="text-xs text-slate-400 mt-1 leading-snug">
              {{ plan.tagline }}
            </p>
          </div>

          <div class="py-3 border-t border-border/70 space-y-2 text-xs">
            <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Entitlements & SLAs:
            </div>
            <ul class="space-y-1.5 text-slate-300">
              <li
                v-for="(feature, idx) in plan.features"
                :key="idx"
                class="flex items-start gap-2"
              >
                <Check class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-border/70 flex items-center justify-between">
          <span class="text-[11px] font-mono text-slate-400">{{ plan.targetAudience }}</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded text-xs border border-border hover:bg-slate-900 text-slate-200 transition-colors"
            @click="showNotification(`Plan parameters for ${plan.name} opened for configuration.`)"
          >
            Configure
          </button>
        </div>
      </div>
    </div>

    <!-- Future Plan Editing Form Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminSectionCard
        title="Commercial Billing Rules"
        description="Global parameters for invoice schedules and credit limits"
      >
        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-300 font-medium mb-1">Standard Billing Interval</label>
            <select class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option>Annual Pre-Paid (15% Corporate Discount)</option>
              <option>Quarterly Invoiced (Net 30)</option>
              <option>Monthly Subscription</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Supported Billing Currencies</label>
            <div class="grid grid-cols-3 gap-2">
              <label class="flex items-center gap-2 p-2 rounded bg-[#080c10] border border-border text-slate-300 cursor-pointer">
                <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
                <span>USD ($)</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded bg-[#080c10] border border-border text-slate-300 cursor-pointer">
                <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
                <span>EUR (€)</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded bg-[#080c10] border border-border text-slate-300 cursor-pointer">
                <input type="checkbox" checked class="rounded border-border text-emerald-500 focus:ring-emerald-500" />
                <span>GBP (£)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-1">Compute Overage Policy</label>
            <input
              type="text"
              value="$0.045 per vCPU/hour burst rate"
              class="w-full px-3 py-2 rounded bg-[#080c10] border border-border text-slate-300 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] text-slate-400">Sample rules preview — no live DB save</span>
            <button
              type="button"
              class="px-3 py-1 rounded text-xs bg-slate-800 text-slate-300 hover:text-white"
              @click="showNotification('Simulated save: Parameters stored in local memory.')"
            >
              Save Draft Rules
            </button>
          </div>
        </template>
      </AdminSectionCard>

      <AdminSectionCard
        title="Custom Enterprise Contract Workflow"
        description="Configuration checklist for bespoke sovereign proposals"
      >
        <div class="space-y-3 text-xs text-slate-300">
          <div class="p-3 rounded bg-slate-900/60 border border-border flex items-start gap-2.5">
            <Check class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-white">Custom SLA Addenda</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Automates 99.999% uptime guarantee with financial penalty caps.</p>
            </div>
          </div>

          <div class="p-3 rounded bg-slate-900/60 border border-border flex items-start gap-2.5">
            <Check class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-white">Air-Gapped Node Deployment</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Calculates on-premises appliance logistics and hardware HSM keys.</p>
            </div>
          </div>

          <div class="p-3 rounded bg-slate-900/60 border border-border flex items-start gap-2.5">
            <Check class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-white">Dedicated Enterprise Solutions Architect</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Pairs inbound RFPs directly with senior technical lead assignment.</p>
            </div>
          </div>
        </div>

        <template #footer>
          <span class="text-[11px] text-slate-400 italic">Connected to Inbound Enterprise RFP Routing</span>
        </template>
      </AdminSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
  Plus,
  CheckCircle2,
  X
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import AdminSectionCard from '~/components/admin/shared/AdminSectionCard.vue'
import type { PricingPlan } from '~/types/admin'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Pricing Plans — KavoraX Global Admin'
})

const actionNotice = ref('')

const showNotification = (msg: string) => {
  actionNotice.value = msg
  setTimeout(() => {
    if (actionNotice.value === msg) {
      actionNotice.value = ''
    }
  }, 4500)
}

const samplePlans: PricingPlan[] = [
  {
    id: 'plan-starter',
    name: 'Growth Enterprise',
    tagline: 'Core orchestration for growing technology teams.',
    price: '$4,500',
    interval: '/mo billed annually',
    targetAudience: 'Mid-Market Scale',
    features: [
      'Up to 10 Managed Core Clusters',
      '99.9% Uptime Guarantee',
      'Standard 8x5 Technical Support',
      'Multi-Region Data Replication',
      'Automated SOC2 Compliance Export'
    ],
    status: 'Active'
  },
  {
    id: 'plan-enterprise',
    name: 'Mission Critical',
    tagline: 'High-throughput private mesh for global organizations.',
    badge: 'Most Popular',
    price: '$14,200',
    interval: '/mo billed annually',
    targetAudience: 'Global 2000 Enterprises',
    features: [
      'Unlimited Managed Compute Clusters',
      '99.99% Financial Uptime Guarantee',
      '24/7/365 Dedicated SRE Hotline',
      'Zero-Trust Network Perimeter',
      'Custom Role-Based Access Controls',
      'Dedicated Solution Architect (10h/mo)'
    ],
    status: 'Active'
  },
  {
    id: 'plan-sovereign',
    name: 'Sovereign Custom',
    tagline: 'Dedicated air-gapped deployments for government & banking.',
    price: 'Custom',
    interval: 'annual contract',
    targetAudience: 'Federal, Defense & Banking',
    features: [
      'On-Premises Air-Gapped Appliances',
      'Custom FedRAMP & DoD IL6 Enclaves',
      'Hardware Security Module (HSM) Keys',
      'Custom Data Residency Guarantees',
      'Dedicated On-Site Engineering Support'
    ],
    status: 'Custom Only'
  }
]
</script>
