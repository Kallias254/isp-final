import { headers } from 'next/headers';

// Define the base URL for the backend API from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * A reusable fetch wrapper that handles authentication for both client and server-side requests.
 * On the client, it uses `credentials: 'include'` to send cookies automatically.
 * On the server (SSR/RSC), it manually forwards the incoming request's cookies.
 * @param url - The URL path to fetch (e.g., '/subscribers')
 * @param options - Optional RequestInit options to merge with defaults
 * @returns The fetch Response object
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Merge default options with any provided options
  const mergedOptions: RequestInit & { headers: HeadersInit } = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // If running on the server, manually forward the cookies from the incoming request
  if (typeof window === 'undefined') {
    const cookie = headers().get('cookie');
    if (cookie) {
      mergedOptions.headers.cookie = cookie;
    }
  } else {
    // If running on the client, the browser will handle cookies automatically
    mergedOptions.credentials = 'include';
  }

  const fullUrl = `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, mergedOptions);
    return response;
  } catch (error) {
    console.error(`API Fetch Error: ${error}`);
    // Re-throw a more informative error
    throw new Error(`Failed to fetch from API: ${fullUrl}`);
  }
}
