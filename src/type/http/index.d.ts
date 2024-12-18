export {};

declare global {
  /**
   * Standard api response model
   * Success : status = true
   * Failure : status = false
   */
  export type ApiResponse<T> = {
    status: boolean;
    message?: string;
    data?: T;
    error?: any;
  };
}
