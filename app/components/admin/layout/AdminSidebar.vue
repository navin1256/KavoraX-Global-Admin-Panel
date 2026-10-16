<template>
  <aside
    class="w-[260px] flex-shrink-0 flex flex-col min-h-screen bg-[#080c10] border-r border-border select-none"
  >
    <!-- Brand Header -->
    <div class="h-16 flex items-center justify-between px-5 border-b border-border">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-2.5 group"
        @click="handleNavClick"
      >
        <!-- Restrained geometric square brand emblem (no arcs, no circles) -->
        <div class="w-7 h-7 rounded border border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400/80 transition-colors">
          <span class="font-semibold text-xs tracking-wider">KX</span>
        </div>
        <div class="flex flex-col">
          <span class="font-editorial text-lg tracking-tight font-semibold text-white leading-tight group-hover:text-emerald-400 transition-colors">
            KavoraX
          </span>
          <span class="text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase font-semibold">
            Administration
          </span>
        </div>
      </NuxtLink>

      <!-- Mobile close button -->
      <button
        v-if="isMobile"
        type="button"
        class="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Close navigation sidebar"
        @click="closeMobileNav"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin Navigation">
      <div class="px-2 pb-2 text-[10px] font-mono tracking-wider uppercase text-slate-500 font-medium">
        Platform Core
      </div>

      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group',
          isRouteActive(item.to)
            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
        ]"
        @click="handleNavClick"
      >
        <div class="flex items-center gap-3">
          <component
            :is="resolveIcon(item.icon)"
            :class="[
              'w-4 h-4 flex-shrink-0 transition-colors',
              isRouteActive(item.to)
                ? 'text-emerald-400'
                : 'text-slate-400 group-hover:text-slate-200'
            ]"
          />
          <span class="truncate">{{ item.name }}</span>
        </div>

        <span
          v-if="item.badge"
          :class="[
            'text-[10px] font-mono px-1.5 py-0.5 rounded border',
            isRouteActive(item.to)
              ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/50 group-hover:text-slate-300'
          ]"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- Bottom System Context Footer -->
    <div class="p-3.5 border-t border-border bg-[#0b0f14]/50">
      <div class="flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/60 border border-slate-800/80">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span class="text-[11px] font-mono text-slate-300">Nuxt 4 Active</span>
        </div>
        <span class="text-[10px] font-mono text-slate-500">v4.6.1</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  Workflow,
  Building2,
  CreditCard,
  Mail,
  Users,
  FileText,
  Settings,
  X
} from 'lucide-vue-next'
import { useAdminNav } from '~/composables/useAdminNav'

defineProps<{
  isMobile?: boolean
}>()

const route = useRoute()
const { navItems, closeMobileNav } = useAdminNav()

const handleNavClick = () => {
  closeMobileNav()
}

const isRouteActive = (targetPath: string) => {
  if (targetPath === '/admin') {
    return route.path === '/admin' || route.path === '/admin/'
  }
  return route.path === targetPath || route.path.startsWith(`${targetPath}/`)
}

const resolveIcon = (iconName: string) => {
  switch (iconName) {
    case 'LayoutDashboard':
      return LayoutDashboard
    case 'Package':
      return Package
    case 'Workflow':
      return Workflow
    case 'Building2':
      return Building2
    case 'CreditCard':
      return CreditCard
    case 'Mail':
      return Mail
    case 'Users':
      return Users
    case 'FileText':
      return FileText
    case 'Settings':
      return Settings
    default:
      return LayoutDashboard
  }
}
</script>
