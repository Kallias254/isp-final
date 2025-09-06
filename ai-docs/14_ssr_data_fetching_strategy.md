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

## 5. Plan for Other Modules

Once the `Subscribers` page is successfully refactored and working, the **exact same SSR pattern** will be applied to the following list pages, replacing their mock data:

-   `.../billing/invoices/page.tsx`
-   `.../billing/payments/page.tsx`
-   `.../crm/leads/page.tsx`
-   `.../crm/buildings/page.tsx`
-   `.../support/tickets/page.tsx`
-   And all other major list pages.

## 6. Next Steps

1.  **Seed the Database:** Run the seed script to provide data for development.
2.  **Refactor Subscribers Page:** Implement the SSR pattern on the Subscribers page as detailed above.
3.  **Verify and Commit:** Ensure the page works as expected and commit the successful implementation.
4.  **Proceed with Other Modules:** Apply the pattern to the remaining pages.
