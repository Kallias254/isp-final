# 14. App-Wide Data Fetching Strategy: Server-Side Rendering (SSR)

## 1. Objective

This document outlines a consistent, app-wide strategy for replacing mock data with live data from the backend API. The primary goal is to ensure high performance, a great user experience (by eliminating "Loading..." states), and a maintainable codebase.

## 2. Problem Analysis

A review of the frontend codebase revealed two distinct issues:

1.  **Performance Bottleneck:** The `Subscribers` list page uses a client-side data fetching hook (`useSWR`). This results in a noticeable delay (~5 seconds) where the user sees a "Loading..." message before the data appears. This is because the browser has to make a secondary request to the API after the initial page load.
2.  **Mock Data:** All other major list pages (`Invoices`, `Tickets`, `Leads`, etc.) are currently using static, hard-coded mock data. This was likely a temporary measure to build the UI, and these pages now need to be connected to the live backend.

## 3. Proposed App-Wide Strategy: A Hybrid Approach

To address these issues, we will adopt a hybrid data-fetching strategy, which is a standard best practice for modern Next.js applications.

### Strategy 1: Server-Side Rendering (SSR) for List Pages

For all data-heavy "list" pages (the main page for Subscribers, Invoices, Tickets, etc.), we will use **Server-Side Rendering (SSR)**.

*   **How it Works:** The data will be fetched from the API on the server *before* the page is sent to the user's browser. The fully-rendered HTML, complete with all the data, will be delivered on the initial page load.
*   **Why:** This provides a significant performance boost and a better user experience. It completely eliminates the "Loading..." flicker and makes the application feel much faster.

### Strategy 2: Client-Side Fetching for Forms & Detail Pages

For pages dedicated to creating, viewing, or editing a single item, we will continue to use **Client-Side Data Fetching**.

*   **How it Works:** These pages will remain as Client Components (`'use client'`). Data for a specific item (e.g., for an edit form) or for populating form dropdowns will be fetched using `useSWR` after the page loads.
*   **Why:** The amount of data needed for these pages is typically small. The performance impact of client-side fetching is minimal, and it preserves the interactive nature of the forms without adding unnecessary server load.

## 4. Implementation Plan: Subscribers Page (Proof-of-Concept)

We will first implement the SSR strategy on the `Subscribers` page to serve as a template for all others.

**File to Modify:** `frontend/app/dashboard/crm/subscribers/page.tsx`

### Step 1: Remove Client-Side Logic

The component will be converted from a Client Component to a Server Component.

**BEFORE:**
```tsx
'use client'

import useSWR from 'swr'
// ...

const fetcher = (url: string) => apiFetch(url).then(res => res.json());

export default function SubscribersPage() {
  // ... state management
  const { data: subscribersData, error, isLoading } = useSWR<any>('/subscribers', fetcher);

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    // ... JSX using subscribersData
  )
}
```

### Step 2: Implement Server-Side Data Fetching

We will create a new `async` function that fetches the data on the server and passes it directly to the component.

**AFTER:**
```tsx
// No 'use client' directive

import * as React from "react"
// ... other imports
import { apiFetch } from "@/lib/api"
import { Subscriber } from "@/payload-types"

// 1. Define a function to fetch the data on the server
async function getSubscribers() {
  try {
    const response = await apiFetch('/subscribers');
    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }
    const data = await response.json();
    return data.docs as Subscriber[];
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

// 2. Make the page component async and call the fetch function
export default async function SubscribersPage() {
  const subscribersData = await getSubscribers();

  // Note: The DataTable component itself will need to be a client component
  // if it uses hooks like useState. We will wrap it or the state management part.

  return (
    <div className="container mx-auto py-10">
      {/* ... Breadcrumb and Header ... */}
      <DataTable
        columns={columns}
        data={subscribersData}
        // ... other props
      />
    </div>
  )
}

```
*Note: The `<DataTable>` component and its associated hooks (`useState`, etc.) will need to be extracted into their own Client Component, as hooks are not allowed in Server Components. The `SubscribersPage` will then import and render this new client component, passing the server-fetched data as a prop.*

### Step 3: Server-Side Authentication for `apiFetch`

When fetching data from Server Components, `localStorage` is not available. We need to retrieve the authentication token from the incoming request's cookies and pass it to `apiFetch`.

**Modify `apiFetch` (`frontend/lib/api.ts`):**

Add an optional `token` parameter to `apiFetch` that takes precedence over `localStorage`.

```tsx
// frontend/lib/api.ts
export async function apiFetch(url: string, options: RequestInit = {}, token?: string): Promise<Response> {
  // ... (existing code)

  // Prioritize the token passed as an argument
  if (token) {
    mergedOptions.headers['Authorization'] = `JWT ${token}`;
  } else if (typeof window !== 'undefined') {
    // On the client, get the token from local storage if not provided as an argument
    const clientToken = localStorage.getItem('payload-token');
    if (clientToken) {
      mergedOptions.headers['Authorization'] = `JWT ${clientToken}`;
    }
  }
  // ... (rest of the code)
}
```

**Update `getSubscribers` in Server Components:**

Retrieve the token from cookies using `cookies()` from `next/headers` and pass it to `apiFetch`.

**AFTER:**
```tsx
// No 'use client' directive

import * as React from "react"
// ... other imports
import { apiFetch } from "@/lib/api"
import { Subscriber } from "@/payload-types"
import { cookies } from 'next/headers'; // Import cookies

// 1. Define a function to fetch the data on the server
async function getSubscribers() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('payload-token')?.value; // Get token from cookies

    const response = await apiFetch('/subscribers', {}, token); // Pass token to apiFetch
    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }
    const data = await response.json();
    return data.docs as Subscriber[];
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

// 2. Make the page component async and call the fetch function
export default async function SubscribersPage() {
  const subscribersData = await getSubscribers();

  // Note: The DataTable component itself will need to be a client component
  // if it uses hooks like useState. We will wrap it or the state management part.

  return (
    <div className="container mx-auto py-10">
      {/* ... Breadcrumb and Header ... */}
      <DataTable
        columns={columns}
        data={subscribersData}
        // ... other props
      />
    </div>
  )
}

```
*Note: The `<DataTable>` component and its associated hooks (`useState`, etc.) will need to be extracted into their own Client Component, as hooks are not allowed in Server Components. The `SubscribersPage` will then import and render this new client component, passing the server-fetched data as a prop.*

## 5. Sidebar Hydration Fix

The sidebar often causes hydration mismatches due to its interactive nature and reliance on client-side APIs like `localStorage` or `window` for initial state.

### Problem

The `SidebarProvider` in `frontend/components/ui/sidebar.tsx` initializes `openSections` (which controls collapsible menu items) by reading from `localStorage`. `localStorage` is not available during Server-Side Rendering, leading to a mismatch between the server-rendered HTML (where sections are closed by default) and the client-rendered HTML (where sections might open based on saved `localStorage` state).

### Solution

We will ensure the initial state of the sidebar is consistent between server and client by:

1.  **Determining `openSections` on the server:** The `layout.tsx` (a Server Component) will determine which sidebar sections should be open based on the current `pathname` (URL).
2.  **Passing `openSections` as a prop:** The `SidebarProvider` will receive this server-determined `openSections` as an `initialOpenSections` prop.
3.  **Client-side persistence:** `SidebarProvider` will still use `localStorage` to persist `openSections` changes made by the user on the client, but this will happen *after* the initial render to avoid hydration mismatches.

### Code Changes

**1. Modify `SidebarProvider` (`frontend/components/ui/sidebar.tsx`):**

*   Remove `localStorage` initialization for `openSections`.
*   Accept `initialOpenSections` as a prop.
*   Use `useEffect` to load and save `openSections` to `localStorage` on the client side.

**BEFORE:**
```tsx
// frontend/components/ui/sidebar.tsx
const [openSections, setOpenSections] = React.useState<string[]>(() => {
  if (typeof window !== 'undefined') {
      const savedOpenSections = localStorage.getItem(SIDEBAR_OPEN_SECTIONS_STORAGE_KEY)
      return savedOpenSections ? JSON.parse(savedOpenSections) : []
  }
  return []
})

// ...

React.useEffect(() => {
  localStorage.setItem(SIDEBAR_OPEN_SECTIONS_STORAGE_KEY, JSON.stringify(openSections))
}, [openSections])

// ... (other parts of SidebarProvider)
```

**AFTER:**
```tsx
// frontend/components/ui/sidebar.tsx
// Add initialOpenSections to SidebarProvider props
function SidebarProvider({
  initialOpenSections,
  // ... other props
}: React.ComponentProps<"div"> & {
  initialOpenSections?: string[];
  // ... other prop types
}) {
  const [openSections, setOpenSections] = React.useState<string[]>(initialOpenSections || []);

  // Use useEffect to load from localStorage on client-side after initial render
  React.useEffect(() => {
    const savedOpenSections = localStorage.getItem(SIDEBAR_OPEN_SECTIONS_STORAGE_KEY);
    if (savedOpenSections) {
      setOpenSections(JSON.parse(savedOpenSections));
    }
  }, []);

  // Use useEffect to save to localStorage whenever openSections changes
  React.useEffect(() => {
    localStorage.setItem(SIDEBAR_OPEN_SECTIONS_STORAGE_KEY, JSON.stringify(openSections));
  }, [openSections]);

  // ... (rest of SidebarProvider)
}
```

**2. Modify `NavMain` (`frontend/components/nav-main.tsx`):**

*   `NavMain` will remain a Client Component (`'use client'`).
*   It will continue to use `usePathname()` to determine `isActive` states.
*   It will receive `initialOpenSections` as a prop from `layout.tsx` and pass it to `SidebarProvider`.

**BEFORE:**
```tsx
// frontend/components/nav-main.tsx
export function NavMain({
  items,
  title,
  isCollapsed,
}: { /* ... */ }) {
  const pathname = usePathname()
  const { openSections, setOpenSections } = useSidebar()

  // ... (rest of NavMain)
}
```

**AFTER:**
```tsx
// frontend/components/nav-main.tsx
// NavMain will receive initialOpenSections as a prop
export function NavMain({
  items,
  title,
  isCollapsed,
  initialOpenSections, // New prop
}: { /* ... */ } & { initialOpenSections?: string[] }) {
  const pathname = usePathname()
  // Pass initialOpenSections to SidebarProvider
  // The useSidebar hook will now get its initial state from the provider
  // No direct change to useSidebar call here, as it gets context from provider

  // ... (rest of NavMain)
}
```

**3. Modify `RootLayout` (`frontend/app/layout.tsx`):**

*   `RootLayout` is a Server Component.
*   It will determine the `initialOpenSections` based on the `pathname` (using `headers()` from `next/headers` to get the URL).
*   It will pass this `initialOpenSections` to `SidebarProvider`.

**BEFORE:**
```tsx
// frontend/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**AFTER:**
```tsx
// frontend/app/layout.tsx
import { headers } from 'next/headers'; // Import headers
import { AuthProvider } from "@/lib/auth";
import { SidebarProvider } from "@/components/ui/sidebar"; // Import SidebarProvider
import { NavMain } from "@/components/nav-main"; // Import NavMain

// Helper function to determine initial open sections based on pathname
function getInitialOpenSections(pathname: string): string[] {
  // Implement logic here to determine which sections should be open by default
  // based on the current pathname. For example:
  if (pathname.startsWith('/dashboard/crm')) {
    return ['CRM & Sales']; // Assuming 'CRM & Sales' is the title of the collapsible section
  }
  // Add more conditions for other sections
  return []; // Default to no sections open
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || ''; // Get pathname from headers
  const initialOpenSections = getInitialOpenSections(pathname);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SidebarProvider initialOpenSections={initialOpenSections}>
            {/* Your main layout content, including NavMain */}
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 6. Next Steps

1.  **Seed the Database:** Run the seed script to provide data for development.
2.  **Refactor Subscribers Page:** Implement the SSR pattern on the Subscribers page as detailed above.
3.  **Verify and Commit:** Ensure the page works as expected and commit the successful implementation.
4.  **Proceed with Other Modules:** Apply the pattern to the remaining pages.