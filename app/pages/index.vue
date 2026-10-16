<template>
  <div class="flex items-center justify-center min-h-[60vh] text-slate-400">
    <p class="text-xs font-mono">Redirecting to KavoraX Global Admin...</p>
  </div>
</template>

<script setup lang="ts">
await navigateTo('/admin')
</script>
