import { ref } from 'vue'
import { useApiClient } from '~/composables/useApiClient'
import type { ContactMessageDto, PaginationParams, PaginationMeta } from '~/types/api'

export const useContactMessagesApi = () => {
  const client = useApiClient()
  const messages = ref<ContactMessageDto[]>([])
  const meta = ref<PaginationMeta>({
    totalCount: 0,
    totalPages: 1,
    currentPage: 0,
    pageSize: 50
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchContactMessages = async (params: PaginationParams = {}): Promise<ContactMessageDto[]> => {
    isLoading.value = true
    error.value = null

    const query: Record<string, any> = {
      page: params.page ?? 0,
      size: params.size ?? 50,
      sortBy: params.sortBy ?? 'createdAt',
      direction: params.direction ?? 'desc'
    }

    try {
      const result = await client.getPaginated<ContactMessageDto>('/v1/admin/contact-messages', query)
      messages.value = result.data
      meta.value = result.meta
      return result.data
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch contact inquiries.'
      error.value = msg
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    messages,
    meta,
    isLoading,
    error,
    fetchContactMessages
  }
}
