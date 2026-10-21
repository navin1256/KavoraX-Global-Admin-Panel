import { ref } from 'vue'
import { useApiClient } from '~/composables/useApiClient'
import type { DemoLeadDto, PaginationParams, PaginationMeta } from '~/types/api'

export const useDemoLeadsApi = () => {
  const client = useApiClient()
  const leads = ref<DemoLeadDto[]>([])
  const meta = ref<PaginationMeta>({
    totalCount: 0,
    totalPages: 1,
    currentPage: 0,
    pageSize: 50
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDemoLeads = async (params: PaginationParams = {}): Promise<DemoLeadDto[]> => {
    isLoading.value = true
    error.value = null

    const query: Record<string, any> = {
      page: params.page ?? 0,
      size: params.size ?? 50,
      sortBy: params.sortBy ?? 'createdAt',
      direction: params.direction ?? 'desc'
    }

    if (params.type && params.type !== 'ALL') {
      query.type = params.type
    }

    try {
      const result = await client.getPaginated<DemoLeadDto>('/v1/admin/demo-leads', query)
      leads.value = result.data
      meta.value = result.meta
      return result.data
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch demo leads from database.'
      error.value = msg
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    leads,
    meta,
    isLoading,
    error,
    fetchDemoLeads
  }
}
