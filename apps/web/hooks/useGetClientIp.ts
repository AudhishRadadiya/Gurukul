import { useQuery } from "@tanstack/react-query";

import { useAxios } from "@web/hooks/useAxios";
import { authKeys } from "@web/queryKeysFactories/auth";

export function useGetClientIp() {
  const { axios } = useAxios();

  const fetchClientIp = async () => {
    const { data } = await axios.get<{ ip: string }>(
      "https://api.ipify.org?format=json"
    );

    return data.ip;
  };

  return useQuery({
    queryFn: fetchClientIp,
    queryKey: authKeys.clientIp(),
  });
}
