export const buildApiSuccessResponse = <T>({
  data,
  message,
}: {
  data?: any;
  message?: string;
}): ApiResponse<T> => {
  return {
    status: true,
    message,
    ...(Array.isArray(data) && { count: data.length }),
    data,
  };
};

export const buildApiErrorResponse = (message: string): ApiResponse<any> => {
  return {
    status: false,
    message,
  };
};
