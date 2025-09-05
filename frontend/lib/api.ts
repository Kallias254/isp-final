/**
 * A reusable fetch wrapper that handles authentication for both client and server-side requests.
 * On the client, it uses a JWT token from local storage.
 * On the server (SSR/RSC), it can be adapted to use other auth methods if needed.
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

  if (typeof window !== 'undefined') {
    // On the client, get the token from local storage
    const token = localStorage.getItem('payload-token');
    if (token) {
      mergedOptions.headers['Authorization'] = `JWT ${token}`;
    }
  } else {
    // On the server, you might handle auth differently, e.g., with service accounts or forwarded headers.
    // The previous cookie-forwarding logic is removed in favor of a clear token-based strategy.
    // If server-side auth is needed, it should be implemented here.
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
