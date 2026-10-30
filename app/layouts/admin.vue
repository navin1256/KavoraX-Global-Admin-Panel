<template>
  <div class="h-screen h-dvh overflow-hidden bg-[#0b0f14] text-slate-100 flex relative">
    <!-- Desktop Sidebar (Hidden on mobile, flex column on lg+) -->
    <div class="hidden lg:flex lg:flex-col lg:h-full lg:shrink-0 z-20">
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
        <div class="fixed inset-y-0 left-0 w-[260px] max-w-full bg-[#080c10] shadow-2xl z-10 flex flex-col h-full">
          <AdminSidebar :is-mobile="true" />
        </div>
      </div>
    </Teleport>

    <!-- Main Content Workspace -->
    <div class="flex-1 min-w-0 flex flex-col h-full bg-tech-grid">
      <!-- Fixed Top Header -->
      <AdminHeader />

      <!-- Page Content Viewport (The ONLY scroller) -->
      <main
        ref="mainScroller"
        class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col admin-main-scroller"
      >
        <div class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <slot />
        </div>

        <!-- Minimal Admin Footer -->
        <footer class="mt-auto border-t border-border/60 py-4 px-6 text-center text-xs text-slate-400 bg-[#080c10]/40 shrink-0">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>KavoraX Global Private Limited — Internal Administration Console</span>
            <span class="font-mono text-[11px] text-slate-400">Strict TypeScript · Nuxt 4 · Tailwind CSS</span>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '~/components/admin/layout/AdminSidebar.vue'
import AdminHeader from '~/components/admin/layout/AdminHeader.vue'
import { useAdminNav } from '~/composables/useAdminNav'

const { isMobileNavOpen, closeMobileNav } = useAdminNav()
const route = useRoute()
const mainScroller = ref<HTMLElement | null>(null)

// Reset scroll to top on route path change (not hash-only); scroll hash target if present
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      await nextTick()
      if (route.hash) {
        const targetElement = document.querySelector(route.hash)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }
      if (mainScroller.value) {
        mainScroller.value.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }
  }
)

// Handle hash navigation within same route
watch(
  () => route.hash,
  async (newHash) => {
    if (newHash) {
      await nextTick()
      const targetElement = document.querySelector(newHash)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
)
</script>
