export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function err(message: string): ApiResponse<never> {
  return { success: false, message };
}
