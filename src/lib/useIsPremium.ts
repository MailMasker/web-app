import { useMeQuery } from "../Home/generated/MeQuery";

export default function useIsPremium() {
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-only" });

  return meQueryData?.me.user.plan?.type === "PREMIUM";
}
