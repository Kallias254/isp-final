# 10. Frontend and Payload CMS Integration Strategy

## 1. Overview

This document outlines the strategy for integrating the Next.js frontend with the Payload CMS backend. The primary focus is on user authentication, session management, data fetching, and leveraging Payload's powerful access control features to build a secure, multi-tenant application.

## 2. Guiding Principle: Backend as the Authority

The Payload CMS backend is the single source of truth for all security, business logic, and data integrity. The frontend is a consumer of the API and is responsible for rendering the UI based on the data and permissions provided by the backend. The frontend will **never** contain duplicative security logic.

## 3. Authentication Flow

The authentication process will use Payload's built-in local API authentication.

1.  **Login Form:** The user enters credentials on the Next.js login page.
2.  **API Request:** The frontend sends a `POST` request to the Payload backend's `/api/staff/login` endpoint.
3.  **Token & Cookie:** On success, Payload generates a JWT and sets it in a secure, **HttpOnly cookie**. This is crucial for preventing XSS attacks.
4.  **Authenticated Requests:** The browser will automatically send the cookie with every subsequent API request to the backend, authenticating the user for each operation.

## 4. Session Management & State

1.  **Auth Context:** A React Context (`AuthContext`) will provide the global authentication state (user object, status, etc.) to the entire Next.js application.
2.  **App Load & User Hydration:** On initial app load, the frontend will make a request to the `/api/staff/me` endpoint. If the user is logged in (i.e., a valid cookie is sent), this endpoint will return the full user object. This object will be used to "hydrate" the `AuthContext`.
3.  **Logout:** The logout function will call `/api/staff/logout`, which instructs the backend to expire the cookie. The frontend will then clear its `AuthContext` and redirect to the login page.

## 5. Handling Multi-tenancy and RBAC

This is handled by combining backend enforcement with frontend presentation.

1.  **Enriched User Object:** The user object returned from the `/api/staff/me` endpoint will be populated by the backend with critical information, such as `role` and `company` (for multi-tenancy).
2.  **Backend Data Scoping:** Payload's collection `access` control functions are responsible for filtering all data. For example, when a user requests `/api/subscribers`, the backend logic will inspect the user's `company` and automatically add a `where` clause to the database query (e.g., `company: { equals: user.company.id }`). The frontend simply requests the data it needs, and the backend guarantees it only receives data it's allowed to see.
3.  **Conditional UI Rendering:** The frontend will use the user object from the `AuthContext` to conditionally render UI components.
    *   **Example (RBAC):** `if (user.roles.includes('admin')) { <AdminDashboardLink /> }`
    *   **Example (Multi-tenancy):** `<h1>Dashboard for {user.company.name}</h1>`

## 6. Implementation Plan

### Backend (`core-and-company`)

*   **`src/collections/Staff.ts`**: Ensure the `staff` collection has relationships to `roles` and `company`.
*   **`src/payload.config.ts`**: Configure `cors` to accept requests from the frontend URL and ensure the `csrf` settings are compatible with the frontend.
*   **Collection `access` functions**: These are the cornerstone of security and must be correctly implemented for every collection to enforce multi-tenancy and RBAC.

### Frontend (`frontend`)

*   **`src/app/(auth)/login/page.tsx`**: Login UI.
*   **`src/lib/api.ts` (New)**: Centralizes API call logic.
*   **`src/context/AuthContext.tsx` (New)**: Manages and provides user state.
*   **`src/hooks/useAuth.ts` (New)**: Simple hook for accessing the auth context.
*   **`middleware.ts` (New, in `src/`)**: Protects routes by checking for the auth cookie and redirecting to login if it's missing.

