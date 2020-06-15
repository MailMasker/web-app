import { useMeQuery } from "../Home/generated/MeQuery";

export default function useIsAuthenticated() {
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-first" });
  return !!meQueryData?.me;
}
