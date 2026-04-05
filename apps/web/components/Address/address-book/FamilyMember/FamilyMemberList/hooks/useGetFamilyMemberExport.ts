import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { FAMILY_MEMBER_ROUTES } from "@web/constants/routes/address_book/family_member/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { familyMember } from "@web/queryKeysFactories/familyMember";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type {
  FilType,
  GetExportPayload,
  GetListArgsAg2,
} from "@web/types/shared-types";

export type GetFamilyMemberExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetFamilyMemberExportArgs = {
  options: UseMutationOptions<
    GetFamilyMemberExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetFamilyMemberExport({
  options = {},
}: UseGetFamilyMemberExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetFamilyMemberExportApiSuccessResponse>(
          FAMILY_MEMBER_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: familyMember.export(),
    ...options,
  });
}
