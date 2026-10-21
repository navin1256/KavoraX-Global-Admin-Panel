<template>
  <div class="flex items-center justify-center min-h-[60vh] text-slate-400">
    <p class="text-xs font-mono">Redirecting to login portal...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
await navigateTo('/login')
</script>

