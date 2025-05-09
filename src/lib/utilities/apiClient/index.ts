import { API_BASE_URL } from '@/lib/constants';
import { httpError } from '@/lib/utilities';

interface IApiResponse<T> {
  success: boolean;
  data?: T;
  status?: number;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer `
    };
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<IApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...(options.headers || {})
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    const status = res.status;

    const data = await ApiClient.parseFetchResponse(res);

    if (!res.ok) {
      if (typeof data === 'string') {
        throw new httpError(ApiClient.defaultErrorMessage(res.status, data), status);
      } else if (typeof data === 'object') {
        throw new httpError(ApiClient.defaultErrorMessage(res.status, data.error ?? data.message), status, data.errors);
      } else {
        throw new httpError(ApiClient.defaultErrorMessage(res.status), status);
      }
    }

    return {
      success: true,
      data: data as T,
      status
    };
  }

  public get<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  public post<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { method: 'POST', ...options });
  }

  public put<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { method: 'PUT', ...options });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  public setDefaultHeaders(headers: HeadersInit) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers
    };
  }

  public setBaseUrl(newBaseUrl: string) {
    this.baseUrl = newBaseUrl;
  }

  public static async parseFetchResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/plain') || contentType?.includes('text/html')) {
      data = await response.text();
    } else if (contentType?.includes('application/octet-stream') || contentType?.includes('application/pdf')) {
      data = await response.blob();
    } else if (contentType?.includes('multipart/form-data')) {
      data = await response.formData();
    }

    return data;
  }

  public static defaultErrorMessage(statusCode: number, defaultMsg = 'An unknown error occurred.') {
    switch (statusCode) {
      case 403:
        return 'Forbidden. You do not have permission to access this resource.';
      case 408:
        return 'Request Timeout. Please try again later.';
      case 500:
        return 'Internal Server Error. Something went wrong on our end.';
      case 502:
        return 'We are having trouble connecting to the server.';
      case 503:
        return 'Service Unavailable. The service is temporarily unavailable.';
      case 504:
        return 'Please wait while our server is busy processing requests.';
      case 429:
        return 'Too Many Requests. You have made too many requests in a short time.';
      case 401:
        return 'Unauthorized. Please check your login credentials.';
      default:
        return defaultMsg;
    }
  }
}

export default ApiClient.getInstance();
