/**
 * KavoraX Global Admin Panel — Backend API Type Definitions
 * Matches Spring Boot API Contract v2.0.0
 */

export interface AdminUserDto {
  id: number
  email: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUserDto
}

export interface DashboardStatsDto {
  totalDemoLeads: number
  totalDemoBookings: number
  totalSessionRequests: number
  totalEnquiries: number
  newLeads: number
  pendingLeads: number
  totalContactMessages?: number
}

export interface ContactMessageDto {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: string
}

export interface DemoLeadDto {
  id: number
  type: 'DEMO_BOOKING' | 'SESSION_REQUEST' | 'ENQUIRY' | string
  name: string
  email: string
  phone: string | null
  company: string | null
  requirements: string | null
  message: string | null
  date: string | null
  timeSlot: string | null
  status: string
  createdAt: string
}

export interface PaginationMeta {
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
  type?: string
}

export interface ApiErrorResponse {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  validationErrors?: Record<string, string>
}
