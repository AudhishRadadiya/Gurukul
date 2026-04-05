import { useQuery } from "@tanstack/react-query";

import { FAMILY_MEMBER_ROUTES } from "@web/constants/routes/address_book/family_member/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { familyMember } from "@web/queryKeysFactories/familyMember";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type FamilyMemberDetail = {
  age: number;
  alternet_mobile_no: string;
  birth_day_month: string;
  birthdate: string;
  contact_id: string;
  contact_no: string;
  family_member_id: string;
  full_count: string;
  main_member_name: string;
  name: string;
  relation: string;
  remark: string;
};

export type GetFamilyMemberSuccessResponse = ApiSuccessResponse<{
  family_memberDetail: FamilyMemberDetail[];
  totalCount: number;
}>;

export function useGetFamilyMember(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getFamilyMemberData = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetFamilyMemberSuccessResponse>(
      FAMILY_MEMBER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { family_memberDetail: [], totalCount: 0 },
    queryFn: () => getFamilyMemberData(body),
    queryKey: familyMember.listing(body),
  });
}
