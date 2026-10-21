<template>
  <Teleport to="body">
    <div
      v-if="isOpen && message"
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
                <span class="text-xs font-mono font-semibold text-emerald-400">#{{ message.id }}</span>
                <AdminBadge
                  :variant="message.status === 'RECEIVED' ? 'info' : 'success'"
                  :label="message.status"
                />
              </div>
              <h2 class="text-base font-semibold text-white mt-1 tracking-tight">
                {{ message.name }}
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
            <!-- Contact Details Card -->
            <div class="space-y-3">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Sender Profile
              </h3>
              <div class="p-4 rounded-lg bg-[#080c10]/80 border border-border space-y-2.5">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Email</span>
                  <a :href="`mailto:${message.email}`" class="text-emerald-400 hover:underline break-all font-medium text-xs">
                    {{ message.email }}
                  </a>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Phone</span>
                  <span class="text-white">{{ message.phone || 'Not provided' }}</span>
                </div>
                <div v-if="message.subject">
                  <span class="text-slate-500 block text-[10px] uppercase font-mono">Subject</span>
                  <span class="text-white font-medium">{{ message.subject }}</span>
                </div>
              </div>
            </div>

            <!-- Inbound Message Body -->
            <div class="space-y-2">
              <h3 class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Message Content
              </h3>
              <div class="p-4 rounded-lg bg-[#080c10]/80 border border-border text-slate-200 leading-relaxed whitespace-pre-wrap">
                {{ message.message }}
              </div>
            </div>

            <!-- Ingestion Telemetry -->
            <div class="space-y-2 pt-2 border-t border-border">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Database ID:</span>
                <span class="font-mono text-slate-300">#{{ message.id }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Received At:</span>
                <span class="font-mono text-slate-300">{{ formatTimestamp(message.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Storage Tier:</span>
                <span class="text-emerald-400 font-medium">PostgreSQL (contact_messages)</span>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-4 border-t border-border bg-[#080c10] flex items-center justify-between gap-3">
            <a
              :href="`mailto:${message.email}?subject=KavoraX%20Support%20Response%20%5B%23${message.id}%5D`"
              class="flex-1 py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail class="w-3.5 h-3.5" />
              <span>Reply to Requester</span>
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
import type { ContactMessageDto } from '~/types/api'

defineProps<{
  isOpen: boolean
  message: ContactMessageDto | null
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
