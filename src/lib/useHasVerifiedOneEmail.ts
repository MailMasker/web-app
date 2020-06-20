import { useMeQuery } from "../Home/generated/MeQuery";

export default function useHasVerifiedOneEmail() {
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-only" });

  return (
    meQueryData?.me.user.verifiedEmails &&
    meQueryData.me.user.verifiedEmails.length > 0 &&
    !!meQueryData.me.user.verifiedEmails.find(
      (verifiedEmail) => verifiedEmail.verified
    )
  );
}
