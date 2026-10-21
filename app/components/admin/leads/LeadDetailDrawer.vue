<template>
  <Teleport to="body">
    <div
      v-if="isOpen && lead"
      class="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      />

      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-[#0d1318] border-l border-border shadow-2xl flex flex-col">
          <!-- Drawer Header -->
          <div class="p-5 border-b border-border flex items-center justify-between bg-[#080c10]">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-emerald-400">#{{ lead.id }}</span>
                <AdminBadge
                  :variant="lead.status === 'PENDING' ? 'warning' : 'success'"
                  :label="lead.status"
                />
              </div>
              <h2 class="text-base font-semibold text-white mt-1 tracking-tight">
                {{ lead.name }}
              </h2>
            </div>
            <button
              type="button"
              class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close drawer"
              @click="$emit('close')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
            <!-- Contact Profile Card -->
            <div class="space-y-3">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Contact Information
              </h3>
              <div class="p-4 rounded-lg bg-[#080c10]/80 border border-border space-y-2.5">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Email</span>
                  <a :href="`mailto:${lead.email}`" class="text-emerald-400 hover:underline break-all font-medium text-xs">
                    {{ lead.email }}
                  </a>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Phone</span>
                  <span class="text-white">{{ lead.phone || 'Not provided' }}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Company / Organization</span>
                  <span class="text-white font-medium">{{ lead.company || 'Enterprise Prospect' }}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Lead Type</span>
                  <span class="font-mono text-emerald-300">{{ lead.type }}</span>
                </div>
              </div>
            </div>

            <!-- Booking Details (if Demo/Session) -->
            <div v-if="lead.date || lead.timeSlot" class="space-y-3">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Scheduled Appointment
              </h3>
              <div class="p-3.5 rounded-lg bg-[#080c10]/80 border border-border flex items-center justify-between">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Preferred Date</span>
                  <span class="text-white font-medium">{{ lead.date || 'To be confirmed' }}</span>
                </div>
                <div class="text-right">
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Time Slot</span>
                  <span class="text-emerald-400 font-mono">{{ lead.timeSlot || 'Flexible' }}</span>
                </div>
              </div>
            </div>

            <!-- Requirements / Scope -->
            <div v-if="lead.requirements" class="space-y-2">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Enterprise Requirements
              </h3>
              <div class="p-3.5 rounded-lg bg-[#080c10]/80 border border-border text-slate-200 leading-relaxed whitespace-pre-wrap">
                {{ lead.requirements }}
              </div>
            </div>

            <!-- Message / Notes -->
            <div v-if="lead.message" class="space-y-2">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Message Scope
              </h3>
              <div class="p-3.5 rounded-lg bg-[#080c10]/80 border border-border text-slate-200 leading-relaxed whitespace-pre-wrap">
                {{ lead.message }}
              </div>
            </div>

            <!-- Ingestion Telemetry -->
            <div class="space-y-2 pt-2 border-t border-border">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Database ID:</span>
                <span class="font-mono text-slate-300">#{{ lead.id }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Recorded Timestamp:</span>
                <span class="font-mono text-slate-300">{{ formatTimestamp(lead.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Persistence State:</span>
                <span class="text-emerald-400 font-medium">PostgreSQL Persisted</span>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-4 border-t border-border bg-[#080c10] flex items-center justify-between gap-3">
            <a
              :href="`mailto:${lead.email}?subject=KavoraX%20Enterprise%20Follow-up%20%5B%23${lead.id}%5D`"
              class="flex-1 py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail class="w-3.5 h-3.5" />
              <span>Compose Reply</span>
            </a>
            <button
              type="button"
              class="px-3.5 py-2 rounded-md border border-border hover:bg-slate-800 text-slate-300 text-xs transition-colors"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Mail } from 'lucide-vue-next'
import AdminBadge from '~/components/admin/shared/AdminBadge.vue'
import type { DemoLeadDto } from '~/types/api'

defineProps<{
  isOpen: boolean
  lead: DemoLeadDto | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

const formatTimestamp = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
