<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader
      title="Leads Management"
      description="Manage inbound enquiries, demo requests, and sales opportunities."
    >
      <template #badge>
        <span class="text-xs font-mono text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded bg-emerald-950/40">
          {{ newLeadsCount }} New
        </span>
      </template>

      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-[#0f161f] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors shadow-sm"
            @click="handleExportCsv"
          >
            <Download class="w-3.5 h-3.5 text-slate-400" />
            <span>Export Leads</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm font-semibold"
            @click="openAddModal"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>+ Add Lead</span>
          </button>
        </div>
      </template>
    </AdminPageHeader>

    <!-- Disclosed Demonstration Dataset Notice -->
    <div class="p-3 rounded-lg border border-slate-800 bg-[#080c10]/70 flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <Info class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          Sample Enterprise Dataset: Reactive in-memory state. Changes are reflected live during your session.
        </span>
      </div>
      <span class="text-[10px] font-mono text-slate-500 uppercase hidden sm:inline-block">Demo Mode</span>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="toastMessage"
      class="p-3 rounded-md border border-emerald-800/60 bg-emerald-950/50 text-xs text-emerald-300 flex items-center justify-between transition-all"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button
        type="button"
        class="text-emerald-400 hover:text-emerald-200 p-0.5"
        @click="toastMessage = ''"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- 4 Summary Metric Cards (counts derived from actual displayed dataset) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Total Leads</div>
          <div class="text-2xl font-semibold text-white mt-1">{{ totalLeadsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Active prospects in funnel</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-border bg-[#080c10] flex items-center justify-center text-slate-400">
          <Users class="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">New Leads</div>
          <div class="text-2xl font-semibold text-emerald-400 mt-1">{{ newLeadsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Awaiting initial triage</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-emerald-800/40 bg-emerald-950/30 flex items-center justify-center text-emerald-400">
          <Sparkles class="w-5 h-5" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Contacted</div>
          <div class="text-2xl font-semibold text-sky-400 mt-1">{{ contactedLeadsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Outreach in progress</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-sky-800/40 bg-sky-950/30 flex items-center justify-center text-sky-400">
          <PhoneCall class="w-5 h-5" />
        </div>
      </div>

      <div class="rounded-lg border border-border bg-[#0f161f] p-4 flex items-center justify-between">
        <div>
          <div class="text-[11px] font-mono uppercase text-slate-400">Qualified</div>
          <div class="text-2xl font-semibold text-teal-400 mt-1">{{ qualifiedLeadsCount }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Budget & timeline verified</div>
        </div>
        <div class="w-10 h-10 rounded-lg border border-teal-800/40 bg-teal-950/30 flex items-center justify-center text-teal-400">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Search, Filters, and Controls Toolbar -->
    <div class="p-4 rounded-lg border border-border bg-[#0f161f] space-y-3">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <!-- Search Field -->
        <div class="relative flex-1 max-w-md">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, company, email, or phone..."
            class="w-full pl-9 pr-8 py-2 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            @click="searchQuery = ''"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Filter Dropdowns & Clear Action -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Status Filter -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400 hidden sm:inline">Status:</span>
            <select
              v-model="selectedStatus"
              class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <!-- Source Filter -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400 hidden sm:inline">Source:</span>
            <select
              v-model="selectedSource"
              class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Sources</option>
              <option value="Request a Demo">Request a Demo</option>
              <option value="Contact Form">Contact Form</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400 hidden sm:inline">Date:</span>
            <select
              v-model="selectedDateRange"
              class="px-2.5 py-1.5 rounded-md text-xs bg-[#080c10] border border-border text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">This Quarter</option>
            </select>
          </div>

          <!-- Clear Filters Button -->
          <button
            v-if="isFiltered"
            type="button"
            class="px-2.5 py-1.5 rounded-md text-xs border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 transition-colors flex items-center gap-1"
            @click="clearFilters"
          >
            <RotateCcw class="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      <!-- Filter Results Summary Count -->
      <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-border/40">
        <span>Showing <strong class="text-white">{{ filteredLeads.length }}</strong> of {{ leads.length }} records</span>
        <span v-if="selectedLeadIds.length > 0" class="text-emerald-400 font-medium">
          {{ selectedLeadIds.length }} record(s) selected
        </span>
      </div>
    </div>

    <!-- Bulk Action Bar (when records are selected) -->
    <div
      v-if="selectedLeadIds.length > 0"
      class="p-3 rounded-lg border border-emerald-800/60 bg-emerald-950/30 flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-center gap-2 text-emerald-300 font-medium">
        <CheckSquare class="w-4 h-4 text-emerald-400" />
        <span>{{ selectedLeadIds.length }} lead(s) selected</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-slate-400">Bulk Status:</span>
        <select
          v-model="bulkStatusTarget"
          class="px-2 py-1 rounded bg-[#080c10] border border-border text-xs text-slate-200"
        >
          <option value="" disabled>Select status...</option>
          <option value="Contacted">Mark Contacted</option>
          <option value="Qualified">Mark Qualified</option>
          <option value="Proposal Sent">Mark Proposal Sent</option>
          <option value="Converted">Mark Converted</option>
          <option value="Lost">Mark Lost</option>
        </select>
        <button
          type="button"
          :disabled="!bulkStatusTarget"
          class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium disabled:opacity-50 transition-colors"
          @click="handleBulkStatusApply"
        >
          Apply
        </button>

        <button
          type="button"
          class="px-2.5 py-1 rounded border border-border bg-[#080c10] hover:bg-slate-900 text-slate-300 transition-colors"
          @click="handleExportSelected"
        >
          Export ({{ selectedLeadIds.length }})
        </button>

        <button
          type="button"
          class="text-slate-400 hover:text-white px-2 py-1 text-xs"
          @click="selectedLeadIds = []"
        >
          Deselect All
        </button>
      </div>
    </div>

    <!-- Leads Data Table -->
    <div class="rounded-lg border border-border bg-[#0f161f] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#080c10]/90 border-b border-border text-slate-400 font-mono uppercase text-[11px]">
            <tr>
              <th scope="col" class="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  class="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 focus:ring-1 w-3.5 h-3.5 cursor-pointer"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                />
              </th>
              <th scope="col" class="py-3 px-4">Lead / Contact</th>
              <th scope="col" class="py-3 px-4">Company</th>
              <th scope="col" class="py-3 px-4">Contact Info</th>
              <th scope="col" class="py-3 px-4">Source</th>
              <th scope="col" class="py-3 px-4">Status</th>
              <th scope="col" class="py-3 px-4">Assigned To</th>
              <th scope="col" class="py-3 px-4">Created Date</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/60">
            <!-- Empty State when 0 leads match -->
            <tr v-if="filteredLeads.length === 0">
              <td colspan="9" class="py-12 px-4 text-center">
                <div class="max-w-xs mx-auto space-y-3">
                  <div class="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                    <Search class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-white">No matching leads found</h3>
                    <p class="text-xs text-slate-400 mt-1">
                      Try adjusting your search terms or clearing status and source filters.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-slate-900 text-slate-300 hover:text-white transition-colors"
                    @click="clearFilters"
                  >
                    Clear All Filters
                  </button>
                </div>
              </td>
            </tr>

            <!-- Lead Records -->
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              :class="[
                'hover:bg-slate-900/50 transition-colors group cursor-pointer',
                selectedLeadIds.includes(lead.id) ? 'bg-emerald-950/20' : ''
              ]"
              @click="openDetailsDrawer(lead)"
            >
              <!-- Checkbox -->
              <td class="py-3 px-3 text-center" @click.stop>
                <input
                  v-model="selectedLeadIds"
                  type="checkbox"
                  :value="lead.id"
                  class="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 focus:ring-1 w-3.5 h-3.5 cursor-pointer"
                />
              </td>

              <!-- Name & Job Title -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-semibold text-emerald-400 flex-shrink-0">
                    {{ getInitials(lead.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {{ lead.name }}
                    </div>
                    <div class="text-[11px] text-slate-400">
                      {{ lead.jobTitle || 'Executive' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Company -->
              <td class="py-3 px-4">
                <span class="text-slate-300 font-medium">{{ lead.company }}</span>
              </td>

              <!-- Email & Phone -->
              <td class="py-3 px-4">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1.5 text-slate-300">
                    <Mail class="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span class="truncate max-w-[180px]">{{ lead.email }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Phone class="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span>{{ lead.phone }}</span>
                  </div>
                </div>
              </td>

              <!-- Source -->
              <td class="py-3 px-4">
                <span :class="['px-2 py-0.5 rounded text-[11px] border inline-block whitespace-nowrap', getSourceBadgeClass(lead.source)]">
                  {{ lead.source }}
                </span>
              </td>

              <!-- Status with Quick Change Dropdown -->
              <td class="py-3 px-4" @click.stop>
                <div class="relative inline-block">
                  <select
                    :value="lead.status"
                    :class="['px-2.5 py-1 rounded text-[11px] font-medium border cursor-pointer focus:outline-none appearance-none pr-6', getStatusBadgeClass(lead.status)]"
                    @change="handleQuickStatusChange(lead.id, ($event.target as HTMLSelectElement).value as any)"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                  <ChevronDown class="w-3 h-3 text-current opacity-70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </td>

              <!-- Assigned To -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-1.5 text-slate-300">
                  <User class="w-3.5 h-3.5 text-slate-500" />
                  <span>{{ lead.assignedTo }}</span>
                </div>
              </td>

              <!-- Created Date -->
              <td class="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ formatDate(lead.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Lead Details"
                    @click="openDetailsDrawer(lead)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    class="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Lead"
                    @click="openEditModal(lead)"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lead Details Slide-over Drawer / Modal -->
    <div
      v-if="isDetailsOpen && activeLead"
      class="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end"
      @click.self="isDetailsOpen = false"
    >
      <div class="w-full max-w-lg bg-[#0d1318] border-l border-border h-full flex flex-col shadow-2xl overflow-y-auto">
        <!-- Drawer Header -->
        <div class="p-5 border-b border-border bg-[#080c10] flex items-center justify-between sticky top-0 z-10">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-semibold text-white tracking-tight">
                {{ activeLead.name }}
              </h2>
              <span :class="['px-2 py-0.5 rounded text-[10px] border font-medium', getStatusBadgeClass(activeLead.status)]">
                {{ activeLead.status }}
              </span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5">
              {{ activeLead.company }} &bull; {{ activeLead.id }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-2.5 py-1 rounded text-xs border border-border bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              @click="openEditModal(activeLead)"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              class="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              @click="isDetailsOpen = false"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Drawer Content -->
        <div class="p-5 space-y-6 flex-1 text-xs">
          <!-- Quick Status & Owner Controls -->
          <div class="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#080c10] border border-border">
            <div>
              <label class="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Current Status
              </label>
              <select
                :value="activeLead.status"
                class="w-full px-2.5 py-1.5 rounded bg-[#10161d] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500"
                @change="handleDrawerStatusChange(($event.target as HTMLSelectElement).value as any)"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label class="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Assigned Owner
              </label>
              <select
                :value="activeLead.assignedTo"
                class="w-full px-2.5 py-1.5 rounded bg-[#10161d] border border-border text-white text-xs focus:ring-1 focus:ring-emerald-500"
                @change="handleDrawerOwnerChange(($event.target as HTMLSelectElement).value)"
              >
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="David Kim">David Kim</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <!-- Contact Profile -->
          <div class="space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Contact Profile
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#080c10]/60 border border-border">
              <div>
                <span class="text-slate-500 block text-[11px]">Email</span>
                <a :href="`mailto:${activeLead.email}`" class="text-emerald-400 hover:underline break-all font-medium">
                  {{ activeLead.email }}
                </a>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">Phone</span>
                <span class="text-slate-200">{{ activeLead.phone }}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">Company</span>
                <span class="text-slate-200">{{ activeLead.company }}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">Job Title</span>
                <span class="text-slate-200">{{ activeLead.jobTitle || 'Executive' }}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">Lead Source</span>
                <span class="text-slate-200">{{ activeLead.source }}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px]">Next Follow-up</span>
                <span class="text-slate-200">{{ activeLead.nextFollowUpDate || 'None scheduled' }}</span>
              </div>
            </div>
          </div>

          <!-- Inbound Enquiry Message -->
          <div class="space-y-2">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Enquiry / Message Details
            </h3>
            <div class="p-3.5 rounded-lg bg-[#080c10]/60 border border-border text-slate-300 leading-relaxed whitespace-pre-wrap">
              {{ activeLead.message }}
            </div>
          </div>

          <!-- Follow-up Scheduler -->
          <div class="space-y-2 p-3.5 rounded-lg bg-[#080c10] border border-border">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-semibold text-white">Record Next Follow-Up</h3>
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div class="flex items-center gap-2 mt-2">
              <input
                v-model="drawerFollowUpInput"
                type="date"
                class="flex-1 px-3 py-1.5 rounded bg-[#10161d] border border-border text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                class="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium transition-colors"
                @click="handleSaveFollowUp"
              >
                Save
              </button>
            </div>
          </div>

          <!-- Internal Notes & Timeline -->
          <div class="space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Internal Activity & Notes ({{ activeLead.notes?.length || 0 }})
            </h3>

            <!-- Add Note Form -->
            <div class="space-y-2">
              <textarea
                v-model="newNoteInput"
                rows="2"
                placeholder="Log a call, email, or meeting note..."
                class="w-full p-2.5 rounded-md bg-[#080c10] border border-border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div class="flex justify-end">
                <button
                  type="button"
                  :disabled="!newNoteInput.trim()"
                  class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  @click="handleAddNote"
                >
                  <Send class="w-3 h-3" />
                  <span>Add Note</span>
                </button>
              </div>
            </div>

            <!-- Notes List -->
            <div v-if="activeLead.notes && activeLead.notes.length > 0" class="space-y-2 mt-3">
              <div
                v-for="note in activeLead.notes"
                :key="note.id"
                class="p-3 rounded border border-border bg-[#080c10]/40 space-y-1"
              >
                <div class="flex items-center justify-between text-[11px]">
                  <span class="font-medium text-slate-300">{{ note.author }}</span>
                  <span class="text-slate-500 font-mono">{{ formatDate(note.createdAt) }}</span>
                </div>
                <p class="text-slate-300 leading-snug">{{ note.content }}</p>
              </div>
            </div>
            <div v-else class="text-center py-4 text-slate-500 text-[11px]">
              No internal notes logged yet.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Lead Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="isModalOpen = false"
    >
      <div class="w-full max-w-xl rounded-xl border border-border bg-[#0d1318] p-6 shadow-2xl space-y-5 my-8">
        <div class="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 class="text-base font-semibold text-white tracking-tight">
              {{ modalMode === 'add' ? 'Add New Lead' : `Edit Lead — ${formState.name}` }}
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ modalMode === 'add' ? 'Record an inbound enterprise inquiry or discovery lead.' : 'Update lead contact information and pipeline attributes.' }}
            </p>
          </div>
          <button
            type="button"
            class="p-1 rounded text-slate-400 hover:text-white"
            @click="isModalOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="space-y-4 text-xs" @submit.prevent="handleModalSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Full Name <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="formState.name"
                type="text"
                placeholder="e.g. Elena Rostova"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span v-if="formErrors.name" class="text-[10px] text-rose-400 mt-1 block">
                {{ formErrors.name }}
              </span>
            </div>

            <!-- Email -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Corporate Email <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="formState.email"
                type="email"
                placeholder="elena@company.com"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span v-if="formErrors.email" class="text-[10px] text-rose-400 mt-1 block">
                {{ formErrors.email }}
              </span>
            </div>

            <!-- Phone -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Phone Number <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="formState.phone"
                type="text"
                placeholder="+1 (555) 000-0000"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span v-if="formErrors.phone" class="text-[10px] text-rose-400 mt-1 block">
                {{ formErrors.phone }}
              </span>
            </div>

            <!-- Company -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Company / Organization <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="formState.company"
                type="text"
                placeholder="Acme Aerospace"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span v-if="formErrors.company" class="text-[10px] text-rose-400 mt-1 block">
                {{ formErrors.company }}
              </span>
            </div>

            <!-- Job Title -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Job Title
              </label>
              <input
                v-model="formState.jobTitle"
                type="text"
                placeholder="VP of Engineering"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <!-- Source -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Lead Source
              </label>
              <select
                v-model="formState.source"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Request a Demo">Request a Demo</option>
                <option value="Contact Form">Contact Form</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Initial Status
              </label>
              <select
                v-model="formState.status"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <!-- Assigned Owner -->
            <div>
              <label class="text-[11px] font-medium text-slate-300 block mb-1">
                Assigned Owner
              </label>
              <select
                v-model="formState.assignedTo"
                class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="David Kim">David Kim</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <!-- Next Follow-Up Date -->
          <div>
            <label class="text-[11px] font-medium text-slate-300 block mb-1">
              Next Scheduled Follow-up Date
            </label>
            <input
              v-model="formState.nextFollowUpDate"
              type="date"
              class="w-full px-3 py-2 rounded-md bg-[#080c10] border border-border text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Enquiry Message -->
          <div>
            <label class="text-[11px] font-medium text-slate-300 block mb-1">
              Enquiry Message / Project Scope <span class="text-rose-400">*</span>
            </label>
            <textarea
              v-model="formState.message"
              rows="3"
              placeholder="Describe requirements, timeline, budget, or architectural scope..."
              class="w-full p-2.5 rounded-md bg-[#080c10] border border-border text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span v-if="formErrors.message" class="text-[10px] text-rose-400 mt-1 block">
              {{ formErrors.message }}
            </span>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              class="px-3.5 py-2 rounded-md text-xs border border-border bg-[#080c10] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              @click="isModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ modalMode === 'add' ? 'Create Lead' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Download,
  Plus,
  Search,
  RotateCcw,
  Mail,
  Phone,
  Eye,
  Edit3,
  Calendar,
  Send,
  X,
  User,
  ChevronDown,
  CheckSquare,
  Info,
  Loader2
} from 'lucide-vue-next'
import AdminPageHeader from '~/components/admin/layout/AdminPageHeader.vue'
import { useLeads } from '~/composables/useLeads'
import type { LeadItem, LeadStatus, LeadSource } from '~/types/lead'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Leads Management — KavoraX Global Admin'
})

const {
  leads,
  totalLeadsCount,
  newLeadsCount,
  contactedLeadsCount,
  qualifiedLeadsCount,
  addLead,
  updateLead,
  updateLeadStatus,
  bulkUpdateStatus,
  addNoteToLead,
  exportLeadsToCsv
} = useLeads()

// Search and Filter State
const searchQuery = ref('')
const selectedStatus = ref<string>('All')
const selectedSource = ref<string>('All')
const selectedDateRange = ref<string>('All')

// Toast Feedback State
const toastMessage = ref('')
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = ''
    }
  }, 4000)
}

// Bulk Selection State
const selectedLeadIds = ref<string[]>([])
const bulkStatusTarget = ref<LeadStatus | ''>('')

// Details Drawer State
const isDetailsOpen = ref(false)
const activeLeadId = ref<string | null>(null)
const activeLead = computed(() => leads.value.find(l => l.id === activeLeadId.value) || null)
const drawerFollowUpInput = ref('')
const newNoteInput = ref('')

// Add / Edit Modal State
const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const isSubmitting = ref(false)
const editingLeadId = ref<string | null>(null)

const formState = ref<{
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  source: LeadSource
  status: LeadStatus
  assignedTo: string
  message: string
  nextFollowUpDate: string
}>({
  name: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  source: 'Contact Form',
  status: 'New',
  assignedTo: 'Sarah Chen',
  message: '',
  nextFollowUpDate: ''
})

const formErrors = ref<{
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
}>({})

// Computed Filtering
const isFiltered = computed(() => {
  return searchQuery.value.trim() !== '' ||
    selectedStatus.value !== 'All' ||
    selectedSource.value !== 'All' ||
    selectedDateRange.value !== 'All'
})

const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    // Search query matches name, email, company, or phone
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = lead.name.toLowerCase().includes(q)
      const matchEmail = lead.email.toLowerCase().includes(q)
      const matchCompany = lead.company.toLowerCase().includes(q)
      const matchPhone = lead.phone.toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchCompany && !matchPhone) {
        return false
      }
    }

    // Status filter
    if (selectedStatus.value !== 'All' && lead.status !== selectedStatus.value) {
      return false
    }

    // Source filter
    if (selectedSource.value !== 'All' && lead.source !== selectedSource.value) {
      return false
    }

    // Date range filter
    if (selectedDateRange.value !== 'All') {
      const leadDate = new Date(lead.createdAt).getTime()
      const now = Date.now()
      if (selectedDateRange.value === '7d' && now - leadDate > 7 * 86400000) {
        return false
      }
      if (selectedDateRange.value === '30d' && now - leadDate > 30 * 86400000) {
        return false
      }
      if (selectedDateRange.value === '90d' && now - leadDate > 90 * 86400000) {
        return false
      }
    }

    return true
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'All'
  selectedSource.value = 'All'
  selectedDateRange.value = 'All'
}

// Bulk Selection Logic
const isAllSelected = computed(() => {
  return filteredLeads.value.length > 0 && selectedLeadIds.value.length === filteredLeads.value.length
})

const isIndeterminate = computed(() => {
  return selectedLeadIds.value.length > 0 && selectedLeadIds.value.length < filteredLeads.value.length
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedLeadIds.value = filteredLeads.value.map(l => l.id)
  } else {
    selectedLeadIds.value = []
  }
}

const handleBulkStatusApply = () => {
  if (!bulkStatusTarget.value || selectedLeadIds.value.length === 0) return
  bulkUpdateStatus(selectedLeadIds.value, bulkStatusTarget.value as LeadStatus)
  showToast(`Updated ${selectedLeadIds.value.length} lead(s) to "${bulkStatusTarget.value}"`)
  selectedLeadIds.value = []
  bulkStatusTarget.value = ''
}

const handleExportSelected = () => {
  const selectedItems = leads.value.filter(l => selectedLeadIds.value.includes(l.id))
  if (selectedItems.length > 0) {
    exportLeadsToCsv(selectedItems, 'kavorax-selected-leads')
    showToast(`Exported ${selectedItems.length} selected lead(s) to CSV.`)
  }
}

const handleExportCsv = () => {
  const success = exportLeadsToCsv(filteredLeads.value, 'kavorax-leads-export')
  if (success) {
    showToast(`Exported ${filteredLeads.value.length} lead(s) to CSV.`)
  } else {
    showToast('No leads available to export.')
  }
}

// Quick status change from table dropdown
const handleQuickStatusChange = (leadId: string, newStatus: LeadStatus) => {
  updateLeadStatus(leadId, newStatus)
  showToast(`Lead status updated to "${newStatus}"`)
}

// Details Drawer Handlers
const openDetailsDrawer = (lead: LeadItem) => {
  activeLeadId.value = lead.id
  drawerFollowUpInput.value = lead.nextFollowUpDate || ''
  newNoteInput.value = ''
  isDetailsOpen.value = true
}

const handleDrawerStatusChange = (newStatus: LeadStatus) => {
  if (!activeLead.value) return
  updateLeadStatus(activeLead.value.id, newStatus)
  showToast(`Status updated to "${newStatus}"`)
}

const handleDrawerOwnerChange = (newOwner: string) => {
  if (!activeLead.value) return
  updateLead(activeLead.value.id, { assignedTo: newOwner })
  showToast(`Assigned owner changed to ${newOwner}`)
}

const handleSaveFollowUp = () => {
  if (!activeLead.value) return
  updateLead(activeLead.value.id, { nextFollowUpDate: drawerFollowUpInput.value })
  showToast(`Next follow-up date scheduled for ${drawerFollowUpInput.value || 'None'}`)
}

const handleAddNote = () => {
  if (!activeLead.value || !newNoteInput.value.trim()) return
  addNoteToLead(activeLead.value.id, newNoteInput.value, 'Admin Console')
  newNoteInput.value = ''
  showToast('Internal note recorded successfully.')
}

// Add / Edit Modal Handlers
const openAddModal = () => {
  modalMode.value = 'add'
  editingLeadId.value = null
  formState.value = {
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    source: 'Contact Form',
    status: 'New',
    assignedTo: 'Sarah Chen',
    message: '',
    nextFollowUpDate: ''
  }
  formErrors.value = {}
  isModalOpen.value = true
}

const openEditModal = (lead: LeadItem) => {
  modalMode.value = 'edit'
  editingLeadId.value = lead.id
  formState.value = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    jobTitle: lead.jobTitle || '',
    source: lead.source,
    status: lead.status,
    assignedTo: lead.assignedTo,
    message: lead.message,
    nextFollowUpDate: lead.nextFollowUpDate || ''
  }
  formErrors.value = {}
  isModalOpen.value = true
}

const validateForm = () => {
  formErrors.value = {}
  let valid = true

  if (!formState.value.name.trim()) {
    formErrors.value.name = 'Contact name is required.'
    valid = false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formState.value.email.trim()) {
    formErrors.value.email = 'Email address is required.'
    valid = false
  } else if (!emailPattern.test(formState.value.email.trim())) {
    formErrors.value.email = 'Please provide a valid corporate email format.'
    valid = false
  }

  if (!formState.value.phone.trim()) {
    formErrors.value.phone = 'Phone number is required.'
    valid = false
  }

  if (!formState.value.company.trim()) {
    formErrors.value.company = 'Company organization is required.'
    valid = false
  }

  if (!formState.value.message.trim()) {
    formErrors.value.message = 'Enquiry description or scope is required.'
    valid = false
  }

  return valid
}

const handleModalSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  setTimeout(() => {
    if (modalMode.value === 'add') {
      const created = addLead(formState.value)
      showToast(`Lead "${created.name}" created successfully.`)
    } else if (modalMode.value === 'edit' && editingLeadId.value) {
      updateLead(editingLeadId.value, formState.value)
      showToast(`Lead "${formState.value.name}" updated successfully.`)
    }

    isSubmitting.value = false
    isModalOpen.value = false
  }, 400)
}

// Visual Helpers
const getInitials = (name: string) => {
  if (!name) return 'LD'
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusBadgeClass = (status: LeadStatus) => {
  switch (status) {
    case 'New':
      return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
    case 'Contacted':
      return 'bg-sky-950/40 text-sky-300 border-sky-800/50'
    case 'Qualified':
      return 'bg-teal-950/40 text-teal-300 border-teal-800/50'
    case 'Proposal Sent':
      return 'bg-amber-950/40 text-amber-300 border-amber-800/50'
    case 'Converted':
      return 'bg-emerald-900/60 text-emerald-200 border-emerald-600/60 font-semibold'
    case 'Lost':
      return 'bg-slate-800/60 text-slate-400 border-slate-700/50'
    default:
      return 'bg-slate-900 text-slate-400 border-slate-800'
  }
}

const getSourceBadgeClass = (source: LeadSource) => {
  switch (source) {
    case 'Request a Demo':
      return 'bg-purple-950/30 text-purple-300 border-purple-800/40'
    case 'Contact Form':
      return 'bg-blue-950/30 text-blue-300 border-blue-800/40'
    case 'Website':
      return 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40'
    case 'Referral':
      return 'bg-amber-950/30 text-amber-300 border-amber-800/40'
    default:
      return 'bg-slate-900 text-slate-400 border-slate-800'
  }
}
</script>
