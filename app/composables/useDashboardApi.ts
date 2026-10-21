import { ref } from 'vue'
import { useApiClient } from '~/composables/useApiClient'
import type { DashboardStatsDto } from '~/types/api'

export const useDashboardApi = () => {
  const client = useApiClient()
  const stats = ref<DashboardStatsDto | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchStats = async (): Promise<DashboardStatsDto> => {
    isLoading.value = true
    error.value = null

    try {
      const data = await client.get<DashboardStatsDto>('/v1/admin/dashboard/stats')
      stats.value = data
      return data
    } catch (err: any) {
      const msg = err.message || 'Failed to load dashboard operational statistics.'
      error.value = msg
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    isLoading,
    error,
    fetchStats
  }
}
