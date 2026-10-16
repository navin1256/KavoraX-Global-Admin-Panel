<template>
  <div class="min-h-screen w-full bg-[#080c10] bg-login-ambient text-[#f5f7fa] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-[#10b981]/20 selection:text-[#10b981] overflow-x-hidden">
    <!-- Centered Login Container (max-width ~420px) -->
    <div class="w-full max-w-[420px] mx-auto my-auto flex flex-col items-center">
      <!-- Compact KavoraX Global Logo & Wordmark -->
      <div class="flex items-center gap-2.5 mb-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] border border-[#34d399]/30">
          <svg class="w-4.5 h-4.5 text-[#080c10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-lg font-bold text-[#f5f7fa] tracking-tight">KavoraX</span>
          <span class="text-xs font-semibold text-[#10b981] tracking-wider uppercase">Global</span>
        </div>
      </div>

      <!-- Small Uppercase ADMIN PORTAL Label in Emerald -->
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
        <span class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
        <span>Admin Portal</span>
      </div>

      <!-- Heading & Subtitle -->
      <h1 class="text-2xl sm:text-[26px] font-semibold text-[#f5f7fa] tracking-tight text-center">
        Welcome back
      </h1>
      <p class="text-xs sm:text-sm text-[#94a3b8] mt-1.5 text-center leading-relaxed max-w-[340px]">
        Sign in to your account to continue to the KavoraX ecosystem.
      </p>

      <!-- Centered Login Card (#10161d surface, #26313d border, rounded-2xl) -->
      <div class="w-full rounded-2xl border border-[#26313d] bg-[#10161d] p-6 sm:p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] space-y-4 mt-6">
        <!-- Status / Verification Feedback Banner -->
        <div
          v-if="statusMessage"
          :class="[
            'p-3.5 rounded-xl text-xs border flex items-start justify-between gap-2.5 transition-all',
            statusType === 'error'
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              : statusType === 'info'
              ? 'bg-[#080c10] border-[#26313d] text-[#94a3b8]'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
          ]"
        >
          <div class="flex items-start gap-2.5">
            <Info class="w-4 h-4 flex-shrink-0 mt-0.5 text-[#10b981]" />
            <div class="leading-relaxed">
              <span class="font-medium text-[#f5f7fa] block mb-0.5">{{ statusTitle }}</span>
              {{ statusMessage }}
              <div v-if="showDashboardLink" class="mt-2">
                <NuxtLink
                  to="/admin"
                  class="inline-flex items-center gap-1.5 font-medium text-[#10b981] hover:text-[#34d399] transition-colors underline"
                >
                  <span>Preview Admin Console</span>
                  <span>&rarr;</span>
                </NuxtLink>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="text-[#64748b] hover:text-white p-0.5 flex-shrink-0"
            @click="clearStatus"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Login Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Email Address Field -->
          <div>
            <label for="admin-email" class="text-xs font-medium text-[#94a3b8] block mb-1.5">
              Email address
            </label>
            <div
              :class="[
                'relative rounded-xl border bg-[#080c10] px-3.5 py-2.5 sm:py-3 flex items-center transition-all',
                emailError
                  ? 'border-rose-500/80 ring-2 ring-rose-500/30'
                  : 'border-[#26313d] focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20'
              ]"
            >
              <Mail class="w-4 h-4 text-[#64748b] mr-3 flex-shrink-0" aria-hidden="true" />
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="name@company.com"
                class="w-full bg-transparent text-[#f5f7fa] text-sm placeholder:text-[#64748b] focus:outline-none"
                :disabled="isLoading"
                @input="emailError = ''"
              />
            </div>
            <p v-if="emailError" class="text-xs text-rose-400 mt-1 pl-1">
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field with Show/Hide Toggle -->
          <div>
            <label for="admin-password" class="text-xs font-medium text-[#94a3b8] block mb-1.5">
              Password
            </label>
            <div
              :class="[
                'relative rounded-xl border bg-[#080c10] px-3.5 py-2.5 sm:py-3 flex items-center transition-all',
                passwordError
                  ? 'border-rose-500/80 ring-2 ring-rose-500/30'
                  : 'border-[#26313d] focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20'
              ]"
            >
              <Lock class="w-4 h-4 text-[#64748b] mr-3 flex-shrink-0" aria-hidden="true" />
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="w-full bg-transparent text-[#f5f7fa] text-sm placeholder:text-[#64748b] focus:outline-none"
                :disabled="isLoading"
                @input="passwordError = ''"
              />
              <button
                type="button"
                class="text-[#64748b] hover:text-[#10b981] transition-colors p-1 ml-1 flex-shrink-0 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="passwordError" class="text-xs text-rose-400 mt-1 pl-1">
              {{ passwordError }}
            </p>
          </div>

          <!-- Remember Me Checkbox & Forgot Password Link -->
          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none text-[#94a3b8] hover:text-[#f5f7fa] transition-colors">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-3.5 h-3.5 rounded border-[#26313d] bg-[#080c10] text-[#10b981] focus:ring-[#10b981]/30 focus:ring-1 accent-[#10b981]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              class="text-xs text-[#10b981] hover:text-[#34d399] transition-colors focus:outline-none font-medium"
              @click="handleForgotPassword"
            >
              Forgot password?
            </button>
          </div>

          <!-- Full-width Emerald Gradient Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 rounded-xl font-medium text-sm text-[#080c10] bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] shadow-[0_4px_20px_-2px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin text-[#080c10]" />
              <span>{{ isLoading ? 'Verifying credentials...' : 'Sign in to your account' }}</span>
            </button>
          </div>
        </form>

        <!-- Small Authorized Personnel Only text -->
        <div class="pt-1 text-center">
          <p class="text-[11px] text-[#64748b]">
            Authorized personnel only.
          </p>
        </div>
      </div>

      <!-- Subtle Footer beneath Card -->
      <p class="text-xs text-[#64748b] text-center mt-6">
        © 2026 KavoraX Global. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Info,
  X
} from 'lucide-vue-next'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sign In — KavoraX Global Admin Portal',
  meta: [
    {
      name: 'description',
      content: 'Access the KavoraX Global enterprise administration portal.'
    }
  ]
})

const email = ref('admin@kavorax.com')
const password = ref('kavorax2026')
const showPassword = ref(false)
const rememberMe = ref(true)
const isLoading = ref(false)

const emailError = ref('')
const passwordError = ref('')
const statusTitle = ref('')
const statusMessage = ref('')
const statusType = ref<'info' | 'error' | 'success'>('info')
const showDashboardLink = ref(false)

const validateForm = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim()) {
    emailError.value = 'Email address is required.'
    isValid = false
  } else if (!emailPattern.test(email.value.trim())) {
    emailError.value = 'Please provide a valid corporate email address.'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required.'
    isValid = false
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters in length.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  statusMessage.value = ''
  statusTitle.value = ''
  showDashboardLink.value = false

  // Verify credentials and redirect to Admin Dashboard
  setTimeout(() => {
    isLoading.value = false
    statusType.value = 'success'
    statusTitle.value = 'Sign In Successful'
    statusMessage.value = 'Credentials verified. Redirecting to Admin Console...'
    
    setTimeout(() => {
      navigateTo('/admin')
    }, 700)
  }, 800)
}

const handleForgotPassword = () => {
  statusType.value = 'info'
  statusTitle.value = 'Password Recovery Managed by Administrator'
  statusMessage.value =
    'Self-service password recovery is managed via Enterprise SSO / IT Administrator. Please contact your organization’s IT service desk or systems administrator.'
  showDashboardLink.value = false
}

const clearStatus = () => {
  statusTitle.value = ''
  statusMessage.value = ''
  showDashboardLink.value = false
}
</script>
