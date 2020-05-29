import { Button, Result, Space, Typography } from "antd";

import Bugsnag from "@bugsnag/js";
import ErrorAlert from "../lib/ErrorAlert";
import React from "react";
import { StarTwoTone } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { useCreateCheckoutSessionMutation } from "./generated/CreateCheckoutSessionMutation";
import { useMeQuery } from "../Home/generated/MeQuery";

const { Text, Title } = Typography;

if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  Bugsnag.notify("missing process.env.REACT_APP_STRIPE_PUBLIC_KEY");
}

const BillingSettings: React.FC<{}> = () => {
  const [
    createCheckoutSession,
    { error: createCheckoutSessionError, loading: createVerifiedEmailLoading },
  ] = useCreateCheckoutSessionMutation();
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-only" });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Plan</Title>
      <div>
        <ErrorAlert error={createCheckoutSessionError} />
        {meQueryData?.me.user.plan?.type === "PREMIUM" ? (
          <Result
            icon={<StarTwoTone />}
            title="Mail Masker Premium"
            subTitle={
              <div>
                To cancel, email us at{" "}
                <Text copyable={{ text: "cancel@mailmasker.com" }}>
                  <a href="mailto:cancel@mailmasker.com">
                    cancel@mailmasker.com
                  </a>
                </Text>
              </div>
            }
          />
        ) : (
          <Button
            loading={createVerifiedEmailLoading}
            onClick={async () => {
              const stripe = await loadStripe(
                process.env.REACT_APP_STRIPE_PUBLIC_KEY ?? ""
              );
              if (!stripe) {
                Bugsnag.notify("stripe variable empty");
                return;
              }
              const {
                data: createCheckoutSessionData,
              } = await createCheckoutSession({
                variables: { priceID: "price_HKTm0UENhnuIIJ" },
              });
              const { error } = await stripe.redirectToCheckout({
                sessionId:
                  createCheckoutSessionData?.createCheckoutSession ?? "",
              });
              if (error) {
                console.log(error);
                Bugsnag.notify(
                  `error from stripe while redirecting to checkout: ${JSON.stringify(
                    error
                  )}`
                );
                // Notify the user
                return;
              }
            }}
          >
            Check out
          </Button>
        )}
      </div>
    </Space>
  );
};

export default BillingSettings;
