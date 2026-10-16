export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Converted'
  | 'Lost'

export type LeadSource =
  | 'Contact Form'
  | 'Request a Demo'
  | 'Website'
  | 'Referral'
  | 'Other'

export interface LeadNote {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface LeadItem {
  id: string
  name: string
  email: string
  phone: string
  company: string
  jobTitle?: string
  source: LeadSource
  status: LeadStatus
  assignedTo: string
  message: string
  createdAt: string
  updatedAt: string
  nextFollowUpDate?: string
  notes?: LeadNote[]
}

export interface LeadFilters {
  search: string
  status: string
  source: string
  dateRange: string
}
