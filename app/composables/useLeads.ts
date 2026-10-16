import { useState, computed } from '#imports'
import type { LeadItem, LeadStatus, LeadSource, LeadNote } from '~/types/lead'

const INITIAL_DEMO_LEADS: LeadItem[] = [
  {
    id: 'LD-9021',
    name: 'Alexander Wright',
    email: 'a.wright@vanguard-logistics.com',
    phone: '+1 (415) 890-3412',
    company: 'Vanguard Global Logistics',
    jobTitle: 'VP of Digital Architecture',
    source: 'Request a Demo',
    status: 'New',
    assignedTo: 'Sarah Chen',
    message: 'Seeking an enterprise orchestration layer for our multi-region distribution hubs across 14 European gateways. Need high-throughput telemetry handling.',
    createdAt: '2026-10-15T10:30:00Z',
    updatedAt: '2026-10-15T10:30:00Z',
    nextFollowUpDate: '2026-10-17',
    notes: [
      {
        id: 'note-1',
        author: 'System Intake',
        content: 'Form submission received via Request a Demo enterprise page.',
        createdAt: '2026-10-15T10:30:00Z'
      }
    ]
  },
  {
    id: 'LD-9020',
    name: 'Dr. Helena Sorensen',
    email: 'hsorensen@nordic-healthtech.dk',
    phone: '+45 32 88 19 00',
    company: 'Nordic Health Systems',
    jobTitle: 'Chief Information Security Officer',
    source: 'Contact Form',
    status: 'Contacted',
    assignedTo: 'Marcus Vance',
    message: 'Evaluating Sovereign Cloud capabilities for healthcare data compliance under EU regulations. Looking for an initial technical architecture discovery call.',
    createdAt: '2026-10-14T14:15:00Z',
    updatedAt: '2026-10-15T09:40:00Z',
    nextFollowUpDate: '2026-10-18',
    notes: [
      {
        id: 'note-2',
        author: 'Marcus Vance',
        content: 'Introductory email sent with KavoraX Healthcare Security Whitepaper.',
        createdAt: '2026-10-15T09:40:00Z'
      }
    ]
  },
  {
    id: 'LD-9019',
    name: 'Rajiv Malhotra',
    email: 'rajiv.m@apex-fintech.sg',
    phone: '+65 6712 9044',
    company: 'Apex Financial Technologies',
    jobTitle: 'Director of Platform Engineering',
    source: 'Website',
    status: 'Qualified',
    assignedTo: 'Elena Rostova',
    message: 'Requirement for ultra-low latency transaction routing across APAC financial corridors. Anticipated Q1 2027 enterprise rollout.',
    createdAt: '2026-10-12T08:00:00Z',
    updatedAt: '2026-10-14T16:20:00Z',
    nextFollowUpDate: '2026-10-19',
    notes: [
      {
        id: 'note-3',
        author: 'Elena Rostova',
        content: 'Discovery call completed. Budget approved for pilot testing in Singapore sandbox.',
        createdAt: '2026-10-14T16:20:00Z'
      }
    ]
  },
  {
    id: 'LD-9018',
    name: 'Catherine Tremblay',
    email: 'c.tremblay@quebec-aero.ca',
    phone: '+1 (514) 732-8801',
    company: 'AeroDynamics Aerospace Group',
    jobTitle: 'Principal Systems Architect',
    source: 'Referral',
    status: 'Proposal Sent',
    assignedTo: 'Sarah Chen',
    message: 'Referred by NorthStar Defense systems team. Need dedicated edge telemetry units and sovereign hardware encryption module support.',
    createdAt: '2026-10-10T11:45:00Z',
    updatedAt: '2026-10-14T11:00:00Z',
    nextFollowUpDate: '2026-10-21',
    notes: [
      {
        id: 'note-4',
        author: 'Sarah Chen',
        content: 'Enterprise Architecture & Pricing Proposal v1.2 delivered to procurement.',
        createdAt: '2026-10-14T11:00:00Z'
      }
    ]
  },
  {
    id: 'LD-9017',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@gulf-energygrid.ae',
    phone: '+971 4 390 2811',
    company: 'Gulf Smart Energy Grid',
    jobTitle: 'Head of Grid Modernization',
    source: 'Request a Demo',
    status: 'Converted',
    assignedTo: 'Marcus Vance',
    message: 'Completed Phase 1 pilot evaluation for renewable power grid distribution. Moving forward with annual Enterprise Sovereign license agreement.',
    createdAt: '2026-10-02T13:20:00Z',
    updatedAt: '2026-10-13T15:30:00Z',
    nextFollowUpDate: '2026-11-01',
    notes: [
      {
        id: 'note-5',
        author: 'Marcus Vance',
        content: 'Contract signed. Onboarding handover scheduled with Solutions Engineering team.',
        createdAt: '2026-10-13T15:30:00Z'
      }
    ]
  },
  {
    id: 'LD-9016',
    name: 'Liam O’Connor',
    email: 'liam@dublin-retailers.ie',
    phone: '+353 1 498 7210',
    company: 'Celtic Retail Logistics',
    jobTitle: 'Procurement Manager',
    source: 'Contact Form',
    status: 'Lost',
    assignedTo: 'David Kim',
    message: 'Looking for a basic Shopify inventory sync plugin for local store outlets.',
    createdAt: '2026-09-28T09:10:00Z',
    updatedAt: '2026-10-05T14:00:00Z',
    notes: [
      {
        id: 'note-6',
        author: 'David Kim',
        content: 'Account disqualified: Requirement does not align with KavoraX B2B enterprise tier.',
        createdAt: '2026-10-05T14:00:00Z'
      }
    ]
  },
  {
    id: 'LD-9015',
    name: 'Samantha Brooks',
    email: 'sbrooks@zenith-robotics.com',
    phone: '+1 (617) 542-1920',
    company: 'Zenith Autonomous Robotics',
    jobTitle: 'Chief Technology Officer',
    source: 'Request a Demo',
    status: 'New',
    assignedTo: 'Elena Rostova',
    message: 'Seeking real-time robotic fleet coordination and remote OTA firmware distribution for autonomous warehouse vehicles.',
    createdAt: '2026-10-16T08:20:00Z',
    updatedAt: '2026-10-16T08:20:00Z',
    nextFollowUpDate: '2026-10-17'
  },
  {
    id: 'LD-9014',
    name: 'Kenji Takahashi',
    email: 'k-takahashi@tokyo-biotech.co.jp',
    phone: '+81 3 5510 9823',
    company: 'Tokyo Genomic Research',
    jobTitle: 'VP Research Computing',
    source: 'Other',
    status: 'Contacted',
    assignedTo: 'David Kim',
    message: 'Inquiry regarding hybrid computing clustering for genomic sequence analysis and compliance with Japanese medical research standards.',
    createdAt: '2026-10-11T07:15:00Z',
    updatedAt: '2026-10-13T10:45:00Z',
    nextFollowUpDate: '2026-10-20'
  }
]

export const useLeads = () => {
  const leads = useState<LeadItem[]>('kavorax-leads-data', () => INITIAL_DEMO_LEADS)

  // Summary counts derived directly from actual displayed dataset
  const totalLeadsCount = computed(() => leads.value.length)
  const newLeadsCount = computed(() => leads.value.filter(l => l.status === 'New').length)
  const contactedLeadsCount = computed(() => leads.value.filter(l => l.status === 'Contacted').length)
  const qualifiedLeadsCount = computed(() => leads.value.filter(l => l.status === 'Qualified').length)
  const proposalSentCount = computed(() => leads.value.filter(l => l.status === 'Proposal Sent').length)
  const convertedCount = computed(() => leads.value.filter(l => l.status === 'Converted').length)

  // Add new lead
  const addLead = (newLeadData: Omit<LeadItem, 'id' | 'createdAt' | 'updatedAt' | 'notes'> & { note?: string }) => {
    const nextIdNumber = 9022 + leads.value.length
    const now = new Date().toISOString()
    
    const initialNotes: LeadNote[] = []
    if (newLeadData.note?.trim()) {
      initialNotes.push({
        id: `note-${Date.now()}`,
        author: 'Admin Intake',
        content: newLeadData.note.trim(),
        createdAt: now
      })
    }

    const createdLead: LeadItem = {
      id: `LD-${nextIdNumber}`,
      name: newLeadData.name.trim(),
      email: newLeadData.email.trim(),
      phone: newLeadData.phone.trim(),
      company: newLeadData.company.trim(),
      jobTitle: newLeadData.jobTitle?.trim() || 'Executive',
      source: newLeadData.source || 'Contact Form',
      status: newLeadData.status || 'New',
      assignedTo: newLeadData.assignedTo || 'Unassigned',
      message: newLeadData.message.trim(),
      nextFollowUpDate: newLeadData.nextFollowUpDate,
      createdAt: now,
      updatedAt: now,
      notes: initialNotes
    }

    leads.value = [createdLead, ...leads.value]
    return createdLead
  }

  // Update existing lead
  const updateLead = (id: string, updates: Partial<Omit<LeadItem, 'id'>>) => {
    const index = leads.value.findIndex(l => l.id === id)
    if (index !== -1) {
      const existing = leads.value[index]
      if (!existing) return null
      const now = new Date().toISOString()
      const updated: LeadItem = {
        ...existing,
        ...updates,
        id: existing.id,
        updatedAt: now
      }
      leads.value[index] = updated
      return updated
    }
    return null
  }

  // Delete lead
  const deleteLead = (id: string) => {
    leads.value = leads.value.filter(l => l.id !== id)
  }

  // Update lead status
  const updateLeadStatus = (id: string, status: LeadStatus) => {
    return updateLead(id, { status })
  }

  // Bulk update status
  const bulkUpdateStatus = (leadIds: string[], status: LeadStatus) => {
    const idSet = new Set(leadIds)
    const now = new Date().toISOString()
    leads.value = leads.value.map(lead => {
      if (idSet.has(lead.id)) {
        return {
          ...lead,
          status,
          updatedAt: now
        }
      }
      return lead
    })
  }

  // Add internal note to lead
  const addNoteToLead = (leadId: string, content: string, author: string = 'Admin User') => {
    const lead = leads.value.find(l => l.id === leadId)
    if (lead) {
      const newNote: LeadNote = {
        id: `note-${Date.now()}`,
        author,
        content: content.trim(),
        createdAt: new Date().toISOString()
      }
      const existingNotes = lead.notes || []
      return updateLead(leadId, {
        notes: [newNote, ...existingNotes]
      })
    }
    return null
  }

  // Export filtered leads to real CSV file
  const exportLeadsToCsv = (itemsToExport: LeadItem[], filenamePrefix = 'kavorax-leads-export') => {
    if (!itemsToExport || itemsToExport.length === 0) {
      return false
    }

    const headers = [
      'Lead ID',
      'Name',
      'Company',
      'Job Title',
      'Email',
      'Phone',
      'Source',
      'Status',
      'Assigned Owner',
      'Created Date',
      'Next Follow-Up',
      'Message'
    ]

    const escapeCsvField = (val: string | undefined | null) => {
      if (!val) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    const rows = itemsToExport.map(item => [
      escapeCsvField(item.id),
      escapeCsvField(item.name),
      escapeCsvField(item.company),
      escapeCsvField(item.jobTitle),
      escapeCsvField(item.email),
      escapeCsvField(item.phone),
      escapeCsvField(item.source),
      escapeCsvField(item.status),
      escapeCsvField(item.assignedTo),
      escapeCsvField(item.createdAt),
      escapeCsvField(item.nextFollowUpDate),
      escapeCsvField(item.message)
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const today = new Date().toISOString().split('T')[0]
    const filename = `${filenamePrefix}-${today}.csv`

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return true
  }

  return {
    leads,
    totalLeadsCount,
    newLeadsCount,
    contactedLeadsCount,
    qualifiedLeadsCount,
    proposalSentCount,
    convertedCount,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    bulkUpdateStatus,
    addNoteToLead,
    exportLeadsToCsv
  }
}
