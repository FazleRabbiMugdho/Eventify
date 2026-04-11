# Eventify — Full Project Review

A comprehensive code review of the **Eventify** project covering **frontend**, **backend**, and **database** layers.

---

## 📋 Project Overview

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18 + Vite + TypeScript (partially) + TailwindCSS 3 + Bootstrap 5 + Framer Motion |
| **Backend** | Laravel 8 (PHP 7.3/8.0) + JWT Auth (`tymon/jwt-auth`) |
| **Database** | MySQL 8.0 (via Docker) |
| **Infra** | Docker Compose (MySQL + phpMyAdmin + Laravel + Vite client) |
| **AI** | Gemini API integration (chatbot + event content generator) |

---

## 🔴 Critical Issues

### 1. Security Vulnerabilities

> [!CAUTION]
> These issues could lead to data breaches or unauthorized actions in production.

| Issue | Location | Severity |
|-------|----------|----------|
| **Mass Assignment on Booking** | [BookingController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/BookingController.php#L19) — `Booking::create($request->all())` with no validation | 🔴 Critical |
| **Mass Assignment on Payment** | [PaymentController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/PaymentController.php#L19) — `Payment::create($request->all())` with no validation | 🔴 Critical |
| **Mass Assignment on Event Update** | [EventController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/EventController.php#L49) — `$event->update($request->all())` allows overwriting `user_id` | 🔴 Critical |
| **No Authorization / RBAC Enforcement** | All controllers — Any authenticated user can delete any other user, edit any event, cancel any booking | 🔴 Critical |
| **Users list is public** | [api.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/routes/api.php#L30) — `GET /api/users` returns all users without auth | 🟠 High |
| **Bookings/Payments list is public** | [api.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/routes/api.php#L69-L76) — Anyone can see all bookings and payments | 🟠 High |
| **Debug info leaked in production** | [ChatbotController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/ChatbotController.php#L227) — `debug_info` key exposes exception messages | 🟠 High |
| **SSL verification disabled** | [ChatbotController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/ChatbotController.php#L37) — `Http::withoutVerifying()` disables TLS checks | 🟠 High |
| **Hardcoded backend URL** | [secrets.ts](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/secrets.ts) — Should use environment variables | 🟡 Medium |
| **Docker credentials in plaintext** | [docker-compose.yml](file:///d:/CSE-3100%20sd%20Eventify/Eventify/docker-compose.yml#L7-L9) — `password`, `rootpassword` hardcoded | 🟡 Medium |

---

## 🟠 Backend Review

### Architecture & Code Quality

**Good:**
- ✅ Clean separation of concerns (Controllers → Models → Routes)
- ✅ JWT authentication is properly implemented with token invalidation on logout
- ✅ [AuthController](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/AuthController.php#15-109) has proper validation and bcrypt password hashing
- ✅ AI Chatbot has decent error handling with model fallback logic
- ✅ Eloquent relationships defined on models (User ↔ Events ↔ Bookings ↔ Tickets)

**Issues:**

| # | Issue | Details |
|---|-------|---------|
| 1 | **No pagination** | `Event::all()`, `Booking::all()`, `User::all()` — will cause performance issues at scale |
| 2 | **No null checks on show/update/destroy** | `EventController::show()` returns `null` instead of 404 if event not found |
| 3 | **Duplicate registration logic** | Both `AuthController::register()` and `UserController::store()` do the same thing; `/api/register` route points to `UserController::store` but `AuthController::register()` also exists |
| 4 | **`env()` used outside config files** | [ChatbotController.php](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/ChatbotController.php#L19) — `env()` returns `null` after config caching; should use `config()` |
| 5 | **No Form Request classes** | Validation logic is inline in controllers instead of using dedicated `FormRequest` classes |
| 6 | **`role_id` is hardcoded to 1** | No `roles` table, no role lookup, no middleware to enforce role-based access |
| 7 | **Leftover sessions/attendance API methods** | [api.ts](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#L163-L209) has session/attendance methods with no corresponding backend endpoints |
| 8 | **API key in URL query string** | Gemini API key is passed via query string, which gets logged in server access logs |

### 3. Google Auth Integration
- Updated `GoogleController.php` to automatically fetch and save the user's Google avatar URL in the `profile_picture` column upon registration.

### 4. UI/UX Persistence Fixes
- Fixed a bug in `Login.jsx` and `AuthCallback.jsx` where the `profile_picture` field was being stripped out of the local user state during the login process.
- Updated the main navigation bar in all major pages (`EventsPage`, `MyEvents`, `EventDetails`, `CreateEvent`) to dynamically display the user's profile picture or fall back to initials if none exists.

### Recommendations
- Add Laravel **Policies** or **Gates** for authorization
- Use **API Resources** to control the JSON response shape
- Add pagination: `Event::paginate(15)` instead of `Event::all()`
- Create proper `FormRequest` validation classes
- Use `findOrFail($id)` instead of `find($id)` to auto-return 404

---

## 🟡 Frontend Review

### Architecture & Code Quality

**Good:**
- ✅ Clean [ApiClient](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#21-258) class with centralized error handling and toast notifications
- ✅ Context-based authentication and theme management
- ✅ React Router with meaningful route structure
- ✅ Dark mode with system preference detection and localStorage persistence
- ✅ TypeScript interfaces for [User](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Models/User.php#10-71) and [Event](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#14-20) types
- ✅ Conditional sidebar for auth pages

**Issues:**

| # | Issue | Details |
|---|-------|---------|
| 1 | **Mixed .jsx and .ts files** | Project has TypeScript configured but all components are [.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/App.jsx) — pick one and be consistent |
| 2 | **Single monolithic UI component** | [ui.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/components/ui.jsx) is **26KB** — should be split into individual reusable components |
| 3 | **Giant page files** | [Eventspage.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/pages/Eventspage.jsx) (77KB), [EventDetails.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/pages/EventDetails.jsx) (45KB) — extremely large files. Break into smaller components |
| 4 | **TailwindCSS version mismatch** | Root [package.json](file:///d:/CSE-3100%20sd%20Eventify/Eventify/package.json) has `tailwindcss@4.2.0`, client has `tailwindcss@3.4.19` — major version conflict |
| 5 | **Duplicate ThemeContext** | Theme context is defined in both [App.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/App.jsx) and [context/ThemeContext.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/context/ThemeContext.jsx) |
| 6 | **[ApiClient](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#21-258) instantiated per use** | No singleton pattern — each component likely creates a new [ApiClient](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#21-258), each reading localStorage again |
| 7 | **No protected routes** | Any unauthenticated user can navigate to `/create-event`, `/my-events`, `/profile` |
| 8 | **No loading/error states for routes** | No `<Suspense>`, no error boundaries |
| 9 | **[createEvent](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts#144-160) doesn't send `venue_id`/`category_id`** | The API method in [api.ts](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts) only sends `event_name`, `description`, `start_date_time` — but the backend requires `venue_id` and `category_id` |

### Recommendations
- Convert all [.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/App.jsx) files to `.tsx` or vice versa for consistency
- Split [ui.jsx](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/components/ui.jsx) into `Button.tsx`, `Card.tsx`, `Input.tsx`, etc.
- Add a `ProtectedRoute` wrapper component
- Create a singleton `apiClient` instance and export it
- Add React Error Boundaries and Suspense for better UX

---

## 🔵 Database Review

### Schema Design

**Good:**
- ✅ Proper foreign keys linking events → venues, categories, users
- ✅ Booking → Ticket → Event chain is well-structured
- ✅ Separate `payments` table linked to bookings
- ✅ Reviews linked to both events and users

**Issues:**

| # | Issue | Details |
|---|-------|---------|
| 1 | **Dates stored as VARCHAR** | `start_date_time`, `booking_date`, `review_date` are all `VARCHAR(50)` — should be `DATETIME` or `TIMESTAMP` |
| 2 | **No `status` fields** | Events have no status (draft/published/cancelled), bookings have no status (confirmed/cancelled/refunded) |
| 3 | **Missing `roles` table** | `role_id` on users is just an integer with no foreign key constraint or lookup table |
| 4 | **Description too short** | Events `description VARCHAR(100)` — 100 chars is too short for meaningful descriptions |
| 5 | **Comment too short** | Reviews `comment VARCHAR(100)` — should be `TEXT` |
| 6 | **No `end_date_time` for events** | Events only have a start time, no duration or end time |
| 7 | **No soft deletes** | No `deleted_at` columns — hard deletes lose data permanently |
| 8 | **No timestamps on most tables** | Only `users` has `created_at`/`updated_at`; events, bookings, tickets, payments, reviews all lack them |
| 9 | **Table name inconsistencies** | SQL uses [venue](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Models/Event.php#25-29) (singular) and [ticket](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Models/Booking.php#26-30) (singular), but Laravel migrations use `venues` and [tickets](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Models/Event.php#40-44) (plural) |
| 10 | **Duplicate migration systems** | Both raw SQL ([001_init_tables.sql](file:///d:/CSE-3100%20sd%20Eventify/Eventify/database/migrations/001_init_tables.sql)) and Laravel PHP migrations exist for the same tables — only one should be authoritative |
| 11 | **`payment_id` FK on bookings not constrained** | Bookings migration declares `payment_id` column but no foreign key constraint |
| 12 | **No indexes** | No indexes beyond primary keys — `WHERE` clauses on `user_id`, `event_id` etc. will be slow at scale |
| 13 | **`latin1_danish_ci` collation** | [001_init_tables.sql](file:///d:/CSE-3100%20sd%20Eventify/Eventify/database/migrations/001_init_tables.sql#L1) uses a Danish collation — should be `utf8mb4_unicode_ci` for proper internationalization |

### Recommended Schema Improvements
```sql
-- Example: fix date types and add status/timestamps
ALTER TABLE events 
  MODIFY description TEXT,
  MODIFY start_date_time DATETIME NOT NULL,
  ADD end_date_time DATETIME NULL AFTER start_date_time,
  ADD status ENUM('draft','published','cancelled') DEFAULT 'draft',
  ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

---

## 🟢 What's Done Well

1. **Docker Compose setup** — Clean multi-service orchestration with persistent volumes
2. **JWT auth flow** — Login → Token → Protected routes is properly implemented
3. **AI integration** — Smart model fallback strategy with good error handling in [ChatbotController](file:///d:/CSE-3100%20sd%20Eventify/Eventify/server/app/Http/Controllers/API/ChatbotController.php#10-232)
4. **Monorepo structure** — Client/server separation with shared [package.json](file:///d:/CSE-3100%20sd%20Eventify/Eventify/package.json) scripts
5. **CORS configuration** — Properly configured with specific origins (not just `*`)
6. **Error handling** — [api.ts](file:///d:/CSE-3100%20sd%20Eventify/Eventify/client/src/api.ts) centralizes error handling with toast notifications

---

## 📊 Summary Scorecard

| Area | Score | Notes |
|------|-------|-------|
| **Security** | ⭐⭐ / 5 | Mass assignment, no authorization, public sensitive endpoints |
| **Backend Code** | ⭐⭐⭐ / 5 | Clean structure but missing validation, pagination, and error handling |
| **Frontend Code** | ⭐⭐⭐ / 5 | Good patterns but large files, type inconsistency, no route protection |
| **Database Design** | ⭐⭐ / 5 | Good relationships but wrong column types, missing constraints, no indexes |
| **DevOps/Infra** | ⭐⭐⭐⭐ / 5 | Solid Docker Compose setup, CI/CD pipeline, good CORS config |
| **AI Features** | ⭐⭐⭐⭐ / 5 | Well-implemented with fallbacks, though SSL verification should be enabled |

> [!IMPORTANT]
> The most impactful improvements would be: (1) adding authorization/RBAC, (2) input validation on all controllers, (3) fixing VARCHAR date columns to DATETIME, and (4) splitting the large frontend files into smaller components.
