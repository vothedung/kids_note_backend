export interface ApiMeta {
  cursor?: string | null;
  hasMore?: boolean;
  total?: number;
  [key: string]: unknown;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: ApiMeta;
  error?: ApiError;
}
