import { useAuthStore } from '~/stores/auth';

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();
  const store = useAuthStore();

  const getHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {
      'X-App-ID': '0a010fa1-96e8-18fd-8196-ed9cb22d0009',
      'X-App-Version': '0a010fa1-96e8-18fd-8196-ed9d14d0000a',
      'X-2FA-Token': ""
    };

    if (includeAuth && store.accessToken) {
      headers.Authorization = `Bearer ${store.accessToken}`;
    }

    return headers;
  };

  const fetch = async <T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, any>;
      baseUrl?: string;
      includeAuth?: boolean;
    } = {}
  ) => {
    const { 
      method = 'GET', 
      body, 
      params, 
      baseUrl = runtimeConfig.public.API_BASE_URL,
      includeAuth = true 
    } = options;
    
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const url = `${baseUrl}${endpoint}${queryString}`;

    const { data, pending, error, status } = await useFetch<T>(url, {
      method,
      body,
      headers: getHeaders(includeAuth),
    });

    return { data, pending, error, status };
  };

  return {
    fetch,
    getHeaders
  };
}; 