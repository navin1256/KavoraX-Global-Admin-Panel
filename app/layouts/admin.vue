<template>
  <div class="min-h-screen bg-[#0b0f14] text-slate-100 flex relative overflow-x-hidden">
    <!-- Desktop Sidebar (Hidden on mobile, block on lg+) -->
    <div class="hidden lg:block sticky top-0 h-screen z-20">
      <AdminSidebar />
    </div>

    <!-- Mobile Slide-over Drawer -->
    <Teleport to="body">
      <div
        v-if="isMobileNavOpen"
        class="fixed inset-0 z-50 lg:hidden"
        aria-modal="true"
        role="dialog"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          @click="closeMobileNav"
        />

        <!-- Sliding Panel -->
        <div class="fixed inset-y-0 left-0 w-[260px] max-w-full bg-[#080c10] shadow-2xl z-10 flex flex-col">
          <AdminSidebar :is-mobile="true" />
        </div>
      </div>
    </Teleport>

    <!-- Main Content Workspace -->
    <div class="flex-1 flex flex-col min-w-0 min-h-screen bg-tech-grid">
      <!-- Sticky Top Header -->
      <AdminHeader />

      <!-- Page Content Viewport -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>

      <!-- Minimal Admin Footer -->
      <footer class="border-t border-border/60 py-4 px-6 text-center text-xs text-slate-400 bg-[#080c10]/40">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KavoraX Global Private Limited — Internal Administration Console</span>
          <span class="font-mono text-[11px] text-slate-400">Strict TypeScript · Nuxt 4 · Tailwind CSS</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/admin/layout/AdminSidebar.vue'
import AdminHeader from '~/components/admin/layout/AdminHeader.vue'
import { useAdminNav } from '~/composables/useAdminNav'

const { isMobileNavOpen, closeMobileNav } = useAdminNav()
</script>
