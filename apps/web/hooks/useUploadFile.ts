"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { uploadKeys } from "@web/queryKeysFactories/upload";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type UploadFileApiResponse = ApiSuccessResponse<{ files: string[] }>;

type UseUploadFileArgs = {
  isUploadForCertificate?: boolean;
  options: UseMutationOptions<
    UploadFileApiResponse,
    ApiErrorResponse<Record<string, string>>,
    File[]
  >;
  uploadFor: string;
};

export function useUploadFile({
  isUploadForCertificate = false,
  options = {},
}: UseUploadFileArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      const { data } = await axiosPrivate.post<UploadFileApiResponse>(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          ...(isUploadForCertificate && {
            baseURL: process.env.NEXT_PUBLIC_CERTIFICATE_UPLOAD_API_SERVER,
          }),
        }
      );

      return data;
    },
    mutationKey: uploadKeys.add(),
    ...options,
  });
}
