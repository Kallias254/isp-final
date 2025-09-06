/**
 * A reusable fetch wrapper that handles authentication for both client and server-side requests.
 * On the client, it uses a JWT token from local storage.
 * On the server (SSR/RSC), it can be adapted to use other auth methods if needed.
 * @param url - The URL path to fetch (e.g., '/subscribers')
 * @param options - Optional RequestInit options to merge with defaults
 * @param token - Optional: JWT token to use for authentication. Primarily for server-side use.
 * @returns The fetch Response object
 */
export async function apiFetch(url: string, options: RequestInit = {}, token?: string): Promise<Response> {
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

  const fullUrl = `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, mergedOptions);
    return response;
  } catch (error) {
    console.error(`API Fetch Error: ${error}`);
    throw new Error(`Failed to fetch from API: ${fullUrl}`);
  }
}
