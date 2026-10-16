import type { Component } from 'vue'

export interface NavItem {
  name: string
  to: string
  icon: string
  badge?: string
}

export interface StatMetric {
  id: string
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: string
  description?: string
}

export interface ActivityItem {
  id: string
  action: string
  target: string
  user: string
  timeAgo: string
  type: 'product' | 'solution' | 'enquiry' | 'content' | 'system'
}

export interface ProductItem {
  id: string
  name: string
  code: string
  category: string
  tier: 'Core' | 'Enterprise' | 'Sovereign'
  status: 'Active' | 'Draft' | 'Archived'
  updatedAt: string
  description: string
}

export interface SolutionItem {
  id: string
  title: string
  slug: string
  targetSector: string
  deploymentModel: 'Dedicated Cloud' | 'Hybrid Edge' | 'On-Premises' | 'Multi-Region'
  status: 'Active' | 'Draft' | 'In Review'
  lastModified: string
  overview: string
}

export interface IndustryItem {
  id: string
  name: string
  verticalCode: string
  complianceStandard: string
  activePlaybooks: number
  status: 'Active' | 'Under Review'
}

export interface PricingPlan {
  id: string
  name: string
  tagline: string
  badge?: string
  price: string
  interval: string
  targetAudience: string
  features: string[]
  status: 'Active' | 'Custom Only'
}

export interface EnquiryItem {
  id: string
  requesterName: string
  organization: string
  email: string
  interest: string
  date: string
  status: 'New' | 'In Review' | 'Responded' | 'Archived'
  priority: 'High' | 'Normal'
  message: string
}

export interface ContentPageItem {
  id: string
  title: string
  slug: string
  path: string
  lastUpdated: string
  status: 'Published' | 'Draft' | 'Scheduled'
  sectionsCount: number
}
