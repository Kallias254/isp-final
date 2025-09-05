/**
 * A reusable fetch wrapper that handles authentication for both client and server-side requests.
 * On the client, it uses `credentials: 'include'` to send cookies automatically.
 * On the server (SSR/RSC), it dynamically imports and uses `next/headers` to manually forward cookies.
 * @param url - The URL path to fetch (e.g., '/subscribers')
 * @param options - Optional RequestInit options to merge with defaults
 * @returns The fetch Response object
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions: RequestInit & { headers: HeadersInit } = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  if (typeof window === 'undefined') {
    // On the server, dynamically import 'next/headers' and forward the cookies.
    const { headers } = await import('next/headers');
    const cookie = headers().get('cookie');
    if (cookie) {
      mergedOptions.headers.cookie = cookie;
    }
  } else {
    // On the client, the browser will handle cookies automatically.
    mergedOptions.credentials = 'include';
  }

  const fullUrl = `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, mergedOptions);
    return response;
  } catch (error) {
    console.error(`API Fetch Error: ${error}`);
    throw new Error(`Failed to fetch from API: ${fullUrl}`);
  }
}
