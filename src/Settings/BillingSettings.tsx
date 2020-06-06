import { Button, List, Popover, Result, Space, Typography } from "antd";
import React, { useState } from "react";

import Bugsnag from "@bugsnag/js";
import ErrorAlert from "../lib/ErrorAlert";
import { Link } from "react-router-dom";
import { StarTwoTone } from "@ant-design/icons";
import { green } from "@ant-design/colors";
import { loadStripe } from "@stripe/stripe-js";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import { useCreateCheckoutSessionMutation } from "./generated/CreateCheckoutSessionMutation";
import { useMeQuery } from "../Home/generated/MeQuery";

const { Text } = Typography;

if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  Bugsnag.notify("missing process.env.REACT_APP_STRIPE_PUBLIC_KEY");
}

const BillingSettings: React.FC<{}> = () => {
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-only" });

  const [showPlans, setShowPlans] = useState(false);

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", textAlign: "center" }}
    >
      <Typography.Title
        level={2}
        style={{ marginBottom: "0px", marginTop: "36px" }}
      >
        Flexible plans with no surprises
      </Typography.Title>
      <div style={{ marginBottom: "12px" }}>
        Choose the plan that works for you and cancel at any time.
      </div>
      {meQueryData?.me.user.plan?.type === "PREMIUM" ? (
        <React.Fragment>
          <Result
            icon={<StarTwoTone />}
            title="You've got Mail Masker Premium!"
            subTitle={
              <div>
                To cancel, email us at{" "}
                <Text copyable={{ text: `cancel@${supportedEmailDomains[0]}` }}>
                  <a href={`mailto:cancel@${supportedEmailDomains[0]}`}>
                    cancel@{supportedEmailDomains[0]}
                  </a>
                </Text>
              </div>
            }
            style={{
              padding: "24px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(0,0,0,0.1)",
              backgroundColor: "rgba(0,0,0,0.03)",
              borderRadius: "4px",
            }}
          />
          <Button type="link" onClick={() => setShowPlans(!showPlans)}>
            {showPlans ? "Hide" : "Show"} Plans
          </Button>
          {showPlans && <PlansDescription currentPlan={"PREMIUM"} />}
        </React.Fragment>
      ) : (
        <PlansDescription currentPlan={"FREE"} />
      )}
    </Space>
  );
};

const PlansDescription = ({
  currentPlan,
}: {
  currentPlan: "PREMIUM" | "FREE";
}) => {
  const [
    createCheckoutSession,
    { error: createCheckoutSessionError, loading: createVerifiedEmailLoading },
  ] = useCreateCheckoutSessionMutation();

  const freeFeatures = [
    {
      title: "Your Mail Masks are yours forever",
      description: `Once you create a Mail Mask (ex: you@${supportedEmailDomains[0]}), it belongs to your account forever and no one else can use it.`,
    },
    {
      title: "3 primary Mail Masks",
      description: `You can create up to 3 Mail Masks (ex: you@${supportedEmailDomains[0]}), and unlimited secondary masks (ex: you.whatever1@${supportedEmailDomains[0]}, you.whatever2@${supportedEmailDomains[0]}, etc)`,
    },
    {
      title: "Unlimited secondary Mail Masks",
      description:
        "A secondary Mail Mask has a dot after the alias of one of your primary Mail Masks. For example, if your primary Mail Mask was you@example.com, then you could create a secondary mask by sending an email to you.whatever@example.com.",
    },
    {
      title: "1 Verified Email",
      description:
        "Verified Email addresses are where we forward email received at your Mail Masks.",
    },
    {
      title: "-",
      description: "",
    },
  ];

  const premiumFeatures = [
    {
      title: "+ All Free features",
      description: "Premium includes everything in the Free plan, plus more!",
    },
    {
      title: "Unlimited primary Mail Masks",
      description: `Create as many as you'd like: you1@${supportedEmailDomains[0]}, you2@${supportedEmailDomains[0]}, etc`,
    },
    {
      title: "Unlimited Verified Emails",
      description:
        "Set up complex workflows by forwarding email received at each Mail Mask to a different email inbox.",
    },
    {
      title: "Automatically-stopping Mail Masks",
      description: `You can add ".14d" to any Mail Mask (ex: you.14d@${supportedEmailDomains[0]}) and that Mail Mask will automatically stop forwarding email in 14 days.`,
    },
    {
      title: `Forward to stop@${supportedEmailDomains[0]}`,
      description: `Forward any email that you receive via one of your Mail Masks to stop the Mail Mask immediately.`,
    },
  ];
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={freeFeatures}
          header={
            <React.Fragment>
              <Typography.Title style={{ margin: "12px" }}>
                Free
              </Typography.Title>
              <Typography.Title level={4} style={{ margin: "6px" }}>
                $0
              </Typography.Title>
            </React.Fragment>
          }
          bordered
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Popover
                    title={item.title}
                    content={
                      <div style={{ maxWidth: "500px" }}>
                        {item.description}
                      </div>
                    }
                  >
                    <Typography.Text style={{ cursor: "help" }}>
                      {item.title}
                    </Typography.Text>
                  </Popover>
                }
              />
            </List.Item>
          )}
          footer={
            currentPlan === "FREE" ? (
              <Button disabled size="large">
                Current Plan
              </Button>
            ) : (
              <Link to="/help">
                <Button size="large">Contact Us to Downgrade</Button>
              </Link>
            )
          }
        />
        <List
          style={{
            marginLeft: "36px",
            borderColor: green[4],
          }}
          itemLayout="horizontal"
          dataSource={premiumFeatures}
          header={
            <React.Fragment>
              <Typography.Title style={{ margin: "12px" }}>
                Premium
              </Typography.Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                }}
              >
                <Typography.Title level={4} style={{ margin: "6px" }}>
                  $1 / month
                </Typography.Title>
                <div>or $9 / year</div>
              </div>
            </React.Fragment>
          }
          bordered
          footer={
            currentPlan === "FREE" ? (
              <React.Fragment>
                <ErrorAlert error={createCheckoutSessionError} />
                <Button
                  loading={createVerifiedEmailLoading}
                  type="primary"
                  style={{
                    backgroundColor: green[5],
                    borderColor: green[5],
                  }}
                  size="large"
                  color={green[5]}
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
                  Upgrade
                </Button>
              </React.Fragment>
            ) : (
              <Button disabled size="large">
                Current Plan
              </Button>
            )
          }
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Popover
                    title={item.title}
                    content={
                      <div style={{ maxWidth: "500px" }}>
                        {item.description}
                      </div>
                    }
                  >
                    <Typography.Text style={{ cursor: "help" }}>
                      {item.title}
                    </Typography.Text>
                  </Popover>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <p style={{ marginTop: "36px" }}>
        Have a question?
        <br />
        <Text copyable={{ text: `plans@${supportedEmailDomains[0]}` }}>
          <a href={`mailto:plans@${supportedEmailDomains[0]}`}>
            plans@{supportedEmailDomains[0]}
          </a>
        </Text>
      </p>
    </React.Fragment>
  );
};

export default BillingSettings;
