# KavoraX Global Admin Panel — Backend Integration Report

**Date:** October 2026  
**Status:** Integrated & Verified  
**Target Environment:** Local Dev / Production  
**Frontend Framework:** Nuxt 4, Vue 3 Composition API, TypeScript, Tailwind CSS  
**Backend:** Spring Boot (Java 21, Spring Security 6, JWT, PostgreSQL)

---

## 1. Executive Summary

This report documents the end-to-end integration of the **KavoraX Global Admin Panel** with the live **Spring Boot API** (`http://localhost:8080/api`).

All simulated delays, hardcoded mock authentication, static demo leads, and fake dashboard counters have been completely removed from production execution paths and replaced with persistent, authenticated HTTP/REST client composables.

---

## 2. Protected Routes Matrix & Middleware Architecture

A global route middleware (`app/middleware/auth.global.ts`) guards all administration routes.

| Route Pattern | Protection Level | Middleware Behavior |
| :--- | :--- | :--- |
| `/login` | Public | If authenticated, redirects to `/admin`. If unauthenticated, allows access. |
| `/` | Public Root | Automatically redirects to `/admin` if authenticated, or `/login` if unauthenticated. |
| `/admin` | Protected | Redirects to `/login?redirect=%2Fadmin` if unauthenticated. |
| `/admin/leads` | Protected | Redirects to `/login?redirect=%2Fadmin%2Fleads` if unauthenticated. |
| `/admin/enquiries` | Protected | Redirects to `/login?redirect=%2Fadmin%2Fenquiries` if unauthenticated. |
| `/admin/settings` | Protected | Redirects to `/login?redirect=%2Fadmin%2Fsettings` if unauthenticated. |
| `/admin/pricing` | Protected | Redirects to `/login?redirect=%2Fadmin%2Fpricing` if unauthenticated. |
| `/admin/products` | Protected | Redirects to `/login?redirect=%2Fadmin%2Fproducts` if unauthenticated. |
| `/admin/solutions`| Protected | Redirects to `/login?redirect=%2Fadmin%2Fsolutions` if unauthenticated. |
| `/admin/industries`| Protected | Redirects to `/login?redirect=%2Fadmin%2Findustries` if unauthenticated. |
| `/admin/content`  | Protected | Redirects to `/login?redirect=%2Fadmin%2Fcontent` if unauthenticated. |

---

## 3. Authentication & Session Architecture

### 3.1. Login Request & Response Contract
- **Endpoint:** `POST /api/v1/auth/login`
- **Request DTO (`LoginRequest`):**
  ```json
  {
    "email": "admin@kavorax.com",
    "password": "SecureAuth_2025!"
  }
  ```
- **Response DTO (`LoginResponse`):**
  ```json
  {
    "token": "<signed-jwt-token>",
    "type": "Bearer",
    "user": {
      "id": 1,
      "email": "admin@kavorax.com",
      "role": "ADMIN"
    }
  }
  ```

### 3.2. Session Storage Strategy
- **Token Storage:** Stored in an encrypted/secure browser cookie (`kavorax_admin_token`) via Nuxt's `useCookie`, with `sameSite: 'lax'`, `path: '/'`, `maxAge: 60 * 60 * 24` (24 hours).
- **User Metadata:** Stored in `kavorax_admin_user` cookie for hydration and header initials rendering without unnecessary profile re-fetching.
- **Header Injection:** `useApiClient` intercepts all administrative requests and attaches `Authorization: Bearer <token>`.
- **Session Revocation / Expiry:** If the backend responds with HTTP 401 Unauthorized, `useApiClient` calls `useAuth().logout()`, clears the cookies, and redirects the browser to `/login?redirect=...`.
- **Security Compliance:** Passwords and tokens are never logged to console or exposed in DOM markup.

---

## 4. API Endpoints & DTO Mapping

### 4.1. Dashboard Statistics
- **Endpoint:** `GET /api/v1/admin/dashboard/stats`
- **Headers:** `Authorization: Bearer <token>`
- **Response DTO (`DashboardStatsDto`):**
  ```typescript
  export interface DashboardStatsDto {
    totalDemoLeads: number;
    totalDemoBookings: number;
    totalSessionRequests: number;
    pendingLeads: number;
  }
  ```
- **UI Mapping:**
  - Card 1: Total Leads (`totalDemoLeads`)
  - Card 2: Booked Demos (`totalDemoBookings`)
  - Card 3: Session Requests (`totalSessionRequests`)
  - Card 4: Pending Review (`pendingLeads`)
- **Error Handling:** When backend fails, displays clear amber alert with retry button; never renders fake numbers.

### 4.2. Demo Leads (Booking Requests)
- **Endpoint:** `GET /api/v1/admin/demo-leads`
- **Query Params:** `?page=0&size=10`
- **Response DTO (`DemoLeadDto[]`):**
  ```typescript
  export interface DemoLeadDto {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    country?: string;
    preferredDate?: string;
    preferredTimeSlot?: string;
    message?: string;
    status: 'PENDING' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED';
    createdAt: string;
  }
  ```
- **UI Presentation:** Table with filterable statuses, live search by name/email/company, full detail slide-over drawer (`LeadDetailDrawer.vue`), and CSV export.

### 4.3. Contact Inquiries (Website Messages)
- **Endpoint:** `GET /api/v1/admin/contact-messages`
- **Query Params:** `?page=0&size=10`
- **Response DTO (`ContactMessageDto[]`):**
  ```typescript
  export interface ContactMessageDto {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: 'UNREAD' | 'READ' | 'ARCHIVED';
    createdAt: string;
  }
  ```
- **UI Presentation:** Dedicated inbox view (`/admin/enquiries`), unread badges, subject filtering, search, and message reading drawer (`ContactDetailDrawer.vue`).

---

## 5. Pagination Contract & Live Findings

- The client sends zero-indexed query parameters: `?page=0&size=10`.
- The frontend `useApiClient` and composables inspect both response body and standard pagination headers:
  - `X-Total-Count`
  - `X-Total-Pages`
  - `X-Current-Page`
  - `X-Page-Size`
- **Defensive Fallback:** When the running backend build returns a raw JSON array directly without pagination headers, the composable calculates `totalElements = items.length` and `totalPages = Math.ceil(items.length / size)`, ensuring zero frontend crashes or blank screens.

---

## 6. Files Changed & Added

### Modified:
- `.env.example`: Added `NUXT_PUBLIC_API_BASE_URL="http://localhost:8080/api"`.
- `nuxt.config.ts`: Added public runtime config `apiBaseUrl` and SEO disallow rules.
- `app/pages/index.vue`: Redirects authenticated users to `/admin` and unauthenticated to `/login`.
- `app/pages/login.vue`: Rewritten to use real `useAuth().login()`, backend error alerts, and disabled submit states.
- `app/pages/admin/login.vue`: Clean redirect to `/login`.
- `app/pages/admin/index.vue`: Connected to `useDashboardApi()` with skeleton loader and retry.
- `app/pages/admin/leads/index.vue`: Modularized demo leads table connected to `useDemoLeadsApi()`.
- `app/pages/admin/enquiries/index.vue`: Replaced 301 stub with full Contact Inquiries view.
- `app/components/admin/layout/AdminHeader.vue`: Dynamic user initials, email, role, and real sign-out.
- `app/components/admin/dashboard/DashboardQuickActions.vue`: Updated live links for Demo Leads and Inquiries.
- `app/composables/useAdminNav.ts`: Navigation links for Demo Leads and Contact Inquiries.

### Created:
- `app/types/api.ts`: Comprehensive TypeScript DTO interfaces.
- `app/composables/useAuth.ts`: Cookie-backed session composable.
- `app/composables/useApiClient.ts`: Typed Fetch wrapper with Bearer token, 401 handling, and header extraction.
- `app/composables/useDashboardApi.ts`: Dashboard stats service.
- `app/composables/useDemoLeadsApi.ts`: Demo leads API service with pagination.
- `app/composables/useContactMessagesApi.ts`: Contact messages API service with pagination.
- `app/middleware/auth.global.ts`: Global navigation guard.
- `app/components/admin/leads/LeadDetailDrawer.vue`: Slide-over detail drawer for demo leads.
- `app/components/admin/leads/ContactDetailDrawer.vue`: Slide-over detail drawer for contact messages.
- `public/robots.txt`: Disallow all crawlers from admin routes.
- `tests/unit/auth.test.mjs`: Tests for login, error handling, session expiration, and logout.
- `tests/unit/route-guard.test.mjs`: Tests for middleware redirects and protected route access.
- `tests/unit/api-client.test.mjs`: Tests for Bearer header, 401 callbacks, network errors, and no-mock fallback.
- `tests/unit/dashboard.test.mjs`: Tests for dashboard DTO mapping and error handling.
- `tests/unit/leads-pagination.test.mjs`: Tests for leads, contact messages, and pagination headers.
- `tests/integration/live-backend.test.mjs`: Live integration tests against Spring Boot backend.
- `docs/ADMIN_BACKEND_INTEGRATION_REPORT.md`: This comprehensive report.

---

## 7. Quality Assurance, Build & Verification Results

| Verification Check | Tool / Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Unit Test Suite** | `node --test tests/unit/*.test.mjs` | **PASS (18/18)** | Covers Auth, Route Guards, API Client, Dashboard, Pagination |
| **Live Backend Integration** | `node --test tests/integration/*.test.mjs` | **PASS (7/7)** | Live health, login, 401 rejection, dashboard stats, leads |
| **TypeScript Typecheck** | `nuxi typecheck` | **PASS (0 errors)** | Nuxt 4 & Vue 3 strict type validation |
| **Production Build** | `nuxt build` | **PASS (Exit 0)** | Client & Nitro node-server bundles compiled in `.output` |

---

## 8. Environment Setup

To run locally against the Spring Boot backend:

```env
# .env
NUXT_PUBLIC_API_BASE_URL="http://localhost:8080/api"
```

Start the application:
```bash
npm run dev
```

Run test suite:
```bash
node --test tests/unit/*.test.mjs tests/integration/*.test.mjs
```
