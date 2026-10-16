<template>
  <header
    class="h-16 border-b border-border bg-[#080c10]/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
  >
    <div class="flex items-center gap-3">
      <!-- Mobile Drawer Hamburger Toggle Button -->
      <button
        type="button"
        class="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        aria-label="Open navigation sidebar"
        @click="openMobileNav"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Breadcrumbs navigation -->
      <AdminBreadcrumbs />
    </div>

    <!-- Header Right Actions & Profile Placeholder -->
    <div class="flex items-center gap-3 sm:gap-4">
      <!-- Environment Indicator -->
      <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-slate-900/50 text-[11px] text-slate-300 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Production Starter</span>
      </div>

      <!-- Quick Action / Docs Link -->
      <NuxtLink
        to="/admin/settings"
        class="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <Settings class="w-3.5 h-3.5" />
        <span>Console Settings</span>
      </NuxtLink>

      <!-- Link to Login Screen -->
      <NuxtLink
        to="/login"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
        title="View Login Page"
      >
        <LogIn class="w-3.5 h-3.5 text-emerald-400" />
        <span class="hidden sm:inline">Sign In View</span>
      </NuxtLink>

      <div class="h-4 w-px bg-border hidden sm:block" />

      <!-- Administrator Profile Placeholder (No fake auth) -->
      <div class="flex items-center gap-2.5 pl-1">
        <div class="w-8 h-8 rounded border border-emerald-500/30 bg-emerald-950/40 flex items-center justify-center text-xs font-semibold text-emerald-300">
          PA
        </div>
        <div class="hidden sm:flex flex-col text-left">
          <span class="text-xs font-medium text-white leading-tight">Platform Admin</span>
          <span class="text-[10px] text-slate-400 font-mono">Super Admin</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Settings, LogIn } from 'lucide-vue-next'
import { useAdminNav } from '~/composables/useAdminNav'
import AdminBreadcrumbs from '~/components/admin/layout/AdminBreadcrumbs.vue'

const { openMobileNav } = useAdminNav()
</script>
