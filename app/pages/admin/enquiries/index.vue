<template>
  <div class="p-6 text-center text-xs text-slate-400">
    Redirecting to Leads Management...
  </div>
</template>

<script setup lang="ts">
navigateTo('/admin/leads', { redirectCode: 301 })
</script>
