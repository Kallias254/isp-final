# 13. Frontend Authentication Plan

This document outlines the strategy for implementing authentication in the Next.js frontend application, ensuring a robust, professional, and progressively built system.

## Core Principles

Authentication will be implemented **app-wide (globally)** rather than on a per-module basis. This approach ensures:

*   **Consistency:** A single, unified login experience for all users.
*   **Security:** Centralized management of tokens, refresh mechanisms, and security best practices.
*   **Maintainability:** Avoids code duplication and simplifies updates.
*   **User Experience:** Seamless navigation between protected and public areas of the application.

## Implementation Phases

We will implement authentication in progressive phases, starting with the most critical components to unblock current development.

### Phase 1: Core Authentication Flow (Addressing the 403 Error)

**Goal:** Enable the frontend to successfully authenticate with the Payload CMS backend and send authenticated requests, resolving the current 403 Forbidden errors.

**Steps:**

1.  **Create an Authentication Context (React Context API):**
    *   A global React Context (`AuthContext`) will be created to manage the user's authentication state.
    *   It will store the authentication token, user information, and provide `login` and `logout` functions.
    *   This context will wrap the main application component to make the authentication state available throughout the app.

2.  **Modify `lib/api.ts` (`apiFetch` utility):**
    *   The existing `apiFetch` utility will be enhanced to automatically retrieve the authentication token from the `AuthContext` (or local storage as a fallback/initial simple approach).
    *   This token will then be attached to the `Authorization` header of all outgoing API requests to the backend.
    *   This step is crucial for resolving the 403 Forbidden errors when fetching data from protected endpoints.

3.  **Implement a Basic Login Component/Function:**
    *   A temporary or basic login form will be created to allow users to authenticate against the Payload CMS `/api/staff/login` endpoint.
    *   Upon successful login, the received authentication token and user data will be stored in the `AuthContext`.

### Phase 2: User Experience & Route Protection

**Goal:** Provide a complete and secure user authentication experience within the frontend application.

**Steps:**

4.  **Create a Dedicated Login Page:**
    *   Design and implement a proper user interface for the login page (`/login`).
    *   This page will utilize the login function provided by the `AuthContext`.

5.  **Implement Route Protection:**
    *   Integrate logic to protect specific routes or pages that require authentication.
    *   This can be achieved using Next.js features such as:
        *   **Middleware:** For server-side route protection and redirection.
        *   **`getServerSideProps` / `getStaticProps`:** To check authentication status before rendering pages.
        *   **Client-side checks:** Within layout components or individual page components to redirect unauthenticated users.

6.  **Implement Logout Functionality:**
    *   Add a logout button/link in the UI that triggers the `logout` function from the `AuthContext`.
    *   This function will clear the authentication token and user data, and redirect the user to the login page.

### Phase 3: Advanced Features (Future Enhancements)

**Goal:** Enhance the authentication system for robustness and improved user experience in a production environment.

**Steps:**

7.  **Token Refreshing:**
    *   Implement a mechanism to automatically refresh expired authentication tokens without requiring the user to re-login.
    *   This typically involves using refresh tokens issued by the backend.

8.  **Role-Based Access Control (RBAC) in Frontend:**
    *   While Payload CMS handles RBAC on the backend, implement frontend logic to dynamically show or hide UI elements (e.g., navigation links, buttons) based on the authenticated user's roles and permissions.

This phased approach ensures that we address the immediate blocking issues first, then build out a complete and professional authentication system incrementally.