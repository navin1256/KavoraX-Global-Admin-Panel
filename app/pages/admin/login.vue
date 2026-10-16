<template>
  <LoginPage />
</template>

<script setup lang="ts">
import LoginPage from '~/pages/login.vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sign In — KavoraX Global Admin'
})
</script>
