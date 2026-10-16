# KavoraX Global — Enterprise Admin Console

[![Framework](https://img.shields.io/badge/Framework-Nuxt_4.6+-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Build-Passing-10b981)]()

An independent, decoupled, enterprise-grade administrative management console for **KavoraX Global Private Limited**. Built using Nuxt 4, Vue 3 (Composition API), strict TypeScript, Tailwind CSS, and Lucide icons.

---

## 📑 Table of Contents
1. [Overview & Key Capabilities](#1-overview--key-capabilities)
2. [Tech Stack](#2-tech-stack)
3. [Step-by-Step Installation & Setup](#3-step-by-step-installation--setup)
4. [Demo Credentials & Login](#4-demo-credentials--login)
5. [Feature Tour & Admin Modules](#5-feature-tour--admin-modules)
6. [Available Scripts](#6-available-scripts)
7. [Directory Structure](#7-directory-structure)
8. [Environment Variables](#8-environment-variables)
9. [Production Deployment](#9-production-deployment)
10. [Contributing & Git Workflow](#10-contributing--git-workflow)

---

## 1. Overview & Key Capabilities

The **KavoraX Global Admin Panel** serves as the central operational cockpit for managing enterprise digital infrastructure, catalog specifications, solutions, regulatory compliance frameworks, pricing plans, website content, and inbound sales leads.

- **Independent Frontend**: Completely decoupled from the public corporate website.
- **Enterprise Dark Theme**: Obsidian/charcoal palette (`#080c10`, `#0b0f14`, `#10161d`) with signature Emerald accents (`#10b981`).
- **Responsive Architecture**: Pixel-perfect layout across desktop (1440px+), tablet, and mobile (375px+).
- **Zero-Compromise Type Safety**: 100% strict TypeScript verified with `vue-tsc` and zero build warnings.

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Meta-Framework** | [Nuxt 4](https://nuxt.com/) | `^4.6.1` | Full-stack SSR, file-system routing, Nitro server engine |
| **Reactive Core** | [Vue 3](https://vuejs.org/) | `^3.5.43` | `<script setup lang="ts">` Composition API |
| **Type Discipline** | [TypeScript](https://www.typescriptlang.org/) | `^5.8.2` | Strict checking across all SFC components and composables |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.17` | Utility-first design tokens and responsive classes |
| **Icons** | [Lucide Vue Next](https://lucide.dev/) | `^1.16.0` | Crisp SVG iconography |
| **Component Kit** | [shadcn-vue](https://shadcn-vue.com/) | `latest` | Headless, accessible primitives via `shadcn-nuxt` |
| **State Layer** | [Pinia](https://pinia.vuejs.org/) | `^3.0.4` | Global state management |
| **Package Manager**| [pnpm](https://pnpm.io/) | `>= 9.x` | Fast, deterministic dependency management |

---

## 3. Step-by-Step Installation & Setup

Follow these steps to set up the repository locally on your machine.

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **pnpm**: `v9.x` or higher (or `npm` / `yarn`)
- **Git**: `v2.x+`

Verify your installed versions:
```bash
node -v
pnpm -v
git --version
```

---

### Step 1: Clone the Repository
Clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/navin1256/KavoraX-Global-Admin-Panel.git
```

Navigate into the cloned project directory:
```bash
cd KavoraX-Global-Admin-Panel
```

---

### Step 2: Install Dependencies
Install all project dependencies using `pnpm` (recommended):
```bash
pnpm install
```
*(Alternatively, if using npm: `npm install`)*

---

### Step 3: Configure Environment Variables
Copy the `.env.example` file to create your local `.env` configuration:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
copy .env.example .env
```

Default configuration in `.env`:
```env
NODE_ENV=development
NUXT_PUBLIC_APP_NAME="KavoraX Global Admin"
NUXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

---

### Step 4: Run the Development Server
Start the local Nuxt development server with Hot Module Replacement (HMR):
```bash
pnpm dev
```

Once started, open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**  
*(If port 3000 is occupied, Nuxt will automatically bind to `http://localhost:3001`)*

---

## 4. Demo Credentials & Login

The admin panel includes an enterprise authentication gate with client-side credential verification:

| Field | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:3000/login` |
| **Email Address** | `admin@kavorax.com` |
| **Password** | `kavorax2026` |

> **Tip**: The login form comes pre-filled with demo credentials. Simply click **"Sign in to your account"** to immediately navigate to the executive dashboard. Alternatively, you can directly access the console via `/admin`.

---

## 5. Feature Tour & Admin Modules

### 1. 🛡️ Centered Enterprise Authentication (`/login`)
- Clean, focused centered card layout (`max-w-[420px]`).
- Interactive password visibility toggle (`Eye` / `EyeOff`).
- Remember Me state persistence and SSO-managed recovery notice.
- Seamless authentication redirect to the admin console.

### 2. 📊 Executive Dashboard (`/admin`)
- Metric stat cards: Total Products, Active Solutions, New Leads, Published Pages.
- Quick Actions shortcut grid for core administrative workflows.
- Live Recent Activity audit log (Products, Solutions, Enquiries, Content, System events).
- System Architecture diagnostics panel (Nuxt 4.6.1, Vue 3.5, TypeScript Strict).

### 3. 👥 Leads Management (`/admin/leads`)
- **Summary Metrics**: 4 dynamic metric cards tracking Total, New, Contacted, and Qualified leads.
- **Search & Multi-Filters**: Filter by text (name, email, company, phone), Status, Source, and Date Range.
- **Interactive Data Table**: Row selection, sortable columns, quick-status inline changer, and assignees.
- **Slide-Over Details Drawer**: Complete contact profile, message scope, next follow-up date picker, and internal notes log with live author attribution.
- **Add / Edit Modal**: Form validation for creating new prospects with immediate reactive state updates.
- **CSV Export Engine**: Real RFC 4180-compliant `.csv` file generation and download (`kavorax-leads-export-YYYY-MM-DD.csv`).

### 4. 📦 Products Management (`/admin/products`)
- Catalog overview, SKU code management, pricing tiers (Core, Enterprise, Sovereign), and lifecycle states (Active, Draft, Archived).

### 5. ⚡ Solutions Architecture (`/admin/solutions`)
- Enterprise solutions directory, deployment models (Dedicated Cloud, Hybrid Edge, On-Premises, Multi-Region), and vertical alignment.

### 6. 🏢 Industries & Compliance (`/admin/industries`)
- Regulated industry vertical profiles (Finance, Healthcare, Defense, Smart Energy), compliance standards (SOC 2, HIPAA, ISO 27001), and playbook counters.

### 7. 💳 Pricing Matrix (`/admin/pricing`)
- Tier pricing plans, annual/monthly billing intervals, custom SLA features, and enterprise quotation triggers.

### 8. 📝 Website Content CMS (`/admin/content`)
- Published routes, landing page sections, draft states, and synchronization triggers.

### 9. ⚙️ Platform Settings (`/admin/settings`)
- Organization details, Security & Two-Factor Authentication policies, API Gateway keys, and audit logging preferences.

---

## 6. Available Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts local development server on port 3000/3001 |
| `pnpm build` | Compiles full production bundle (`.output/server` & `.output/public`) |
| `pnpm preview` | Runs the compiled production server locally |
| `pnpm typecheck` | Executes `nuxi typecheck` with strict `vue-tsc` validation |
| `pnpm postinstall` | Automatically executes `nuxt prepare` to generate `.nuxt/` types |

---

## 7. Directory Structure

```text
KavoraX-Global-Admin-Panel/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css             # Tailwind layers, tokens & ambient backgrounds
│   ├── components/
│   │   └── admin/
│   │       ├── dashboard/           # DashboardQuickActions, StatCard, RecentActivity
│   │       ├── layout/              # AdminHeader, AdminSidebar, PageHeader, Breadcrumbs
│   │       └── shared/              # AdminBadge, AdminSectionCard, AdminEmptyState
│   ├── composables/
│   │   ├── useAdminNav.ts           # Navigation structure & active route state
│   │   └── useLeads.ts              # Reactive leads CRUD, filtering & CSV export service
│   ├── layouts/
│   │   ├── admin.vue                # Main admin console shell with sidebar & header
│   │   └── default.vue              # Fallback layout
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── content.vue          # CMS & Page Management
│   │   │   ├── enquiries/index.vue  # Redirect alias to /admin/leads
│   │   │   ├── index.vue            # Executive Dashboard Overview
│   │   │   ├── industries/index.vue # Regulated Industries & Compliance
│   │   │   ├── leads/index.vue      # Full Leads Management Console
│   │   │   ├── login.vue            # Alias login route
│   │   │   ├── pricing.vue          # Pricing Matrix & Plans
│   │   │   ├── products/index.vue   # Products Catalog
│   │   │   ├── settings.vue         # Platform & Security Settings
│   │   │   └── solutions/index.vue  # Solutions Frameworks
│   │   ├── index.vue                # Root entry redirecting to /admin
│   │   └── login.vue                # Standalone Centered Enterprise Login Portal
│   ├── types/
│   │   ├── admin.ts                 # Core admin entity interfaces
│   │   └── lead.ts                  # LeadItem, LeadStatus, LeadSource, LeadNote types
│   └── app.vue                      # Top-level Nuxt application root
├── public/                          # Public static assets & favicon
├── server/                          # Nitro server routes (ready for API integration)
├── components.json                  # shadcn-vue configuration
├── nuxt.config.ts                   # Nuxt 4 configuration & pre-bundling rules
├── tailwind.config.ts               # Color tokens & typography extensions
├── tsconfig.json                    # Strict TypeScript compiler options
├── package.json                     # Dependency manifests & lifecycle scripts
├── pnpm-lock.yaml                   # Deterministic package lockfile
├── .gitignore                       # Clean Git ignore rules
├── .env.example                     # Environment template
└── README.md                        # Documentation
```

---

## 8. Environment Variables

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` | No |
| `NUXT_PUBLIC_APP_NAME` | Global console display name | `KavoraX Global Admin` | No |
| `NUXT_PUBLIC_API_BASE_URL` | Base URL for downstream REST/GraphQL backend | `http://localhost:8000` | No |

---

## 9. Production Deployment

### 1. Build the Artifact
Execute the production build:
```bash
pnpm build
```
This produces an optimized server bundle in `.output/server/` and client static assets in `.output/public/`.

### 2. Run with Node.js
Launch the production Nitro server:
```bash
node .output/server/index.mjs
```

### 3. Deploy via PM2 (Process Manager)
```bash
pm2 start .output/server/index.mjs --name "kavorax-admin" --port 3000
```

### 4. Deploy via Docker
Example `Dockerfile`:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
```

---

## 10. Contributing & Git Workflow

1. **Check Status**:
   ```bash
   git status
   ```
2. **Typecheck & Validate**:
   ```bash
   pnpm typecheck
   pnpm build
   ```
3. **Stage Changes**:
   ```bash
   git add .
   ```
4. **Commit with Conventional Messages**:
   ```bash
   git commit -m "feat: complete leads management and enterprise authentication"
   ```
5. **Push to Remote**:
   ```bash
   git push origin main
   ```

---

## 📄 License
Proprietary & Confidential. Copyright © 2026 KavoraX Global Private Limited. All rights reserved.
