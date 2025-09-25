export const buildApiUrl = (endpoint: string): string => {
  return `${process.env.NEXT_PUBLIC_API_SERVER}/${endpoint}`;
};
