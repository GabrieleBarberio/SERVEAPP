export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}


export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
    response?: (response: Response) => Response | Promise<Response>;
    error?: (error: ApiError) => void | Promise<void>;
  };
}
