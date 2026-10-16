# KavoraX Global — Admin Panel Starter

An independent, enterprise-grade frontend project starter for the **KavoraX Global Admin Panel**, built with Nuxt 4, Vue 3, TypeScript (strict mode), Tailwind CSS, shadcn-vue, and Pinia.

---

## 1. Project Overview

This project serves as a dedicated, decoupled frontend administration panel for KavoraX Global Private Limited. It is completely isolated from the public corporate website.

- **Framework**: Nuxt 4 (`^4.6.1`)
- **UI Foundation**: Vue 3 (`^3.5.43`) with Composition API (`<script setup lang="ts">`)
- **Type Safety**: TypeScript 5.8+ configured in strict mode with `vue-tsc`
- **Styling**: Tailwind CSS with dark theme tokens (`#0b0f14`, `#080c10`, `#0f161f`, emerald `#10b981`)
- **Component Architecture**: shadcn-vue (`shadcn-nuxt` integration)
- **Icons**: Lucide Vue Next (`lucide-vue-next`)
- **State Management**: Pinia with `@pinia/nuxt` module
- **Schema & Validation**: VeeValidate and Zod (`@vee-validate/zod`)

---

## 2. Directory Structure

This project follows standard Nuxt 4 conventions with an `app/` directory root for the client layer:

```text
kavorax-admin/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css        # Tailwind directives and design tokens
│   ├── components/             # Reusable UI & presentation components
│   ├── composables/            # Shared business composables
│   ├── layouts/                # Nuxt layout templates
│   ├── middleware/             # Client route middleware & auth guards
│   ├── pages/
│   │   └── index.vue           # Verification starter page
│   ├── plugins/                # Nuxt client/universal plugins
│   ├── stores/                 # Pinia state stores
│   ├── types/                  # App-level TypeScript interfaces
│   ├── utils/                  # Utility helper functions
│   └── app.vue                 # Top-level application shell
├── public/                     # Static assets served from root
├── shared/
│   └── types/                  # Types shared across client and server
├── server/
│   ├── api/                    # Server API handlers (Nitro)
│   └── utils/                  # Server-side utility helpers
├── components.json             # shadcn-vue configuration
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts          # Tailwind theme and animation configuration
├── tsconfig.json               # TypeScript strict configuration
├── package.json                # Project dependencies and lifecycle scripts
├── .gitignore                  # Git ignore rules
├── .env.example                # Safe environment variable template
└── README.md                   # Project documentation
```

---

## 3. Available Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Starts the Nuxt 4 local development server with hot-module replacement |
| `pnpm build` | Compiles the production application bundle (`.output/`) |
| `pnpm preview` | Serves the production build locally for verification |
| `pnpm typecheck` | Executes strict TypeScript checking across all Vue SFCs and TS files |
| `pnpm postinstall` | Generates Nuxt type definitions via `nuxt prepare` |

---

## 4. Setup and Development

### Prerequisites
- Node.js >= 20.x (v22.x recommended)
- pnpm >= 9.x (v12.x tested)

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Type Checking
```bash
pnpm typecheck
```

### Production Build
```bash
pnpm build
```

---

## 5. Environment Configuration

Copy the example environment file and configure variables as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Application environment mode | `development` |
| `NUXT_PUBLIC_APP_NAME` | Display name of the admin console | `KavoraX Admin` |
| `NUXT_PUBLIC_API_BASE_URL` | Base endpoint URL for backend API services | `http://localhost:8000` |
