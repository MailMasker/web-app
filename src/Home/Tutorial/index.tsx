import { Alert, Button, Space, Steps, Typography } from "antd";
import React, { useCallback, useEffect } from "react";

import Bugsnag from "@bugsnag/js";
import { Link } from "react-router-dom";
import supportedEmailDomains from "../../lib/supportedEmailDomains";
import useHasVerifiedOneEmail from "../../lib/useHasVerifiedOneEmail";
import useIsMobile from "../../lib/useIsMobile";
import useLocalStorage from "../../lib/useLocalStorage";
import { useMeQuery } from "../generated/MeQuery";

interface TutorialProps {
  onSkipTutorial: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onSkipTutorial }) => {
  const isMobile = useIsMobile();

  const hasVerifiedOneEmail = useHasVerifiedOneEmail();

  const [currentTutorialStep, setCurrentTutorialStep] = useLocalStorage(
    "currentTutorialStep",
    0
  );

  const handleGoToNextStep = useCallback(() => {
    if (currentTutorialStep >= 4) {
      onSkipTutorial();
    } else {
      setCurrentTutorialStep(currentTutorialStep + 1);
    }
  }, [setCurrentTutorialStep, currentTutorialStep, onSkipTutorial]);

  const handleGoToPreviousStep = useCallback(
    () => setCurrentTutorialStep(Math.max(0, currentTutorialStep - 1)),
    [setCurrentTutorialStep, currentTutorialStep]
  );

  // Automatically advance past the "Verify your email" step if you've already done so
  useEffect(() => {
    if (currentTutorialStep === 0 && hasVerifiedOneEmail) {
      handleGoToNextStep();
    }
  }, [hasVerifiedOneEmail, currentTutorialStep, handleGoToNextStep]);

  return (
    <Space size="large" direction="vertical" style={{ width: "100%" }}>
      <div
        style={{
          display: isMobile ? "block" : "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Learn how to use Mail Masker
        </Typography.Title>
        <div
          style={{
            marginLeft: isMobile ? 0 : "12px",
            marginTop: isMobile ? "12px" : undefined,
          }}
        >
          <Button size="large" onClick={onSkipTutorial}>
            Skip Tutorial
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        {!isMobile && (
          <div
            style={{
              width: isMobile ? "100%" : "200px",
              marginRight: isMobile ? undefined : "24px",
              marginTop: isMobile ? "24px" : undefined,
              flexShrink: 0,
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Steps
              progressDot
              current={currentTutorialStep}
              direction="vertical"
            >
              <Steps.Step title="Verify your email" />
              <Steps.Step title="Receive an email" />
              <Steps.Step title="On-the-fly" />
              <Steps.Step title="Auto-stop" />
              <Steps.Step title="Premium" />
            </Steps>
          </div>
        )}
        <Space
          direction="vertical"
          size="large"
          style={{ flexGrow: 1, marginTop: isMobile ? "24px" : 0 }}
        >
          {isMobile && (
            <hr
              style={{
                borderTop: `1px solid rgba(0,0,0,0.05)`,
                borderBottom: "none",
              }}
            />
          )}
          <TutorialStep step={currentTutorialStep} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "fill",
            }}
          >
            <Button
              onClick={handleGoToPreviousStep}
              disabled={currentTutorialStep === 0}
            >
              Previous
            </Button>
            {isMobile ? <span>{currentTutorialStep + 1} / 5</span> : null}
            <Button type="primary" onClick={handleGoToNextStep}>
              {currentTutorialStep === 4 ? "Finish" : "Next"}
            </Button>
          </div>
        </Space>
      </div>
    </Space>
  );
};

export default React.memo(Tutorial);

const TutorialStep = React.memo(({ step }: { step: number }) => {
  const isMobile = useIsMobile();
  const { data: meQueryData } = useMeQuery({
    fetchPolicy: "cache-only",
  });

  const firstVerifiedEmail =
    meQueryData && meQueryData.me.user.verifiedEmails.length > 0
      ? meQueryData.me.user.verifiedEmails[0]
      : undefined;

  const firstUnverifiedVerifiedEmail =
    meQueryData && meQueryData.me.user.verifiedEmails.length > 0
      ? meQueryData.me.user.verifiedEmails.find(
          (verifiedEmail) => !verifiedEmail.verified
        )
      : undefined;

  const firstMailMask =
    meQueryData && meQueryData.me.user.emailMasks.length > 0
      ? meQueryData.me.user.emailMasks[0]
      : undefined;

  if (step === 0) {
    return (
      <React.Fragment>
        <Typography.Title level={3}>
          Verify your Real Email Address
        </Typography.Title>
        <Alert
          message="Check your email"
          description={
            firstUnverifiedVerifiedEmail
              ? `We've sent a verification email to ${firstUnverifiedVerifiedEmail.email}. Open it and click the "Verify Email" button.`
              : `Look for an email from us that has a button labeled "Verify". Press that button and come back here.`
          }
          type="info"
          style={{ marginTop: "24px" }}
        />
        <p style={{ marginTop: "24px" }}>
          Until you verify your real email address, we can't forward emails to
          it.
        </p>
      </React.Fragment>
    );
  } else if (step === 1) {
    return (
      <React.Fragment>
        <Typography.Title level={3}>
          Use your Mail Mask to receive an email
        </Typography.Title>
        <Alert
          message={
            <span>
              Try it! Send an email to {isMobile && <br />}
              <Typography.Text
                copyable={{
                  text: `${firstMailMask?.alias}@${firstMailMask?.domain}`,
                }}
              >
                <a
                  href={`mailto:${firstMailMask?.alias}@${firstMailMask?.domain}`}
                >
                  {`${firstMailMask?.alias}@${firstMailMask?.domain}`}
                </a>
              </Typography.Text>
            </span>
          }
          description={`You will receive it at ${firstVerifiedEmail?.email ??
            ""}`}
          type="info"
          style={{ marginTop: "24px" }}
        />
      </React.Fragment>
    );
  } else if (step === 2) {
    return (
      <React.Fragment>
        <Typography.Title level={3}>
          Create new Mail Masks on-the-fly
        </Typography.Title>
        <Alert
          message={
            <span>
              Try it! Send an email to {isMobile && <br />}
              <Typography.Text
                copyable={{
                  text: `${firstMailMask?.alias}.test@${firstMailMask?.domain}`,
                }}
              >
                <a
                  href={`mailto:${firstMailMask?.alias}.test@${firstMailMask?.domain}`}
                >
                  {`${firstMailMask?.alias}.test@${firstMailMask?.domain}`}
                </a>
              </Typography.Text>
            </span>
          }
          description={`You will receive it at ${firstVerifiedEmail?.email ??
            ""} and a secondary Mail Mask will be automatically created.`}
          type="info"
        />
        <p style={{ marginTop: "24px" }}>
          <strong>What's going on here?</strong>
        </p>
        <p>
          You can add a dot (".") plus anything to an existing Mail Mask to
          create a new Mail Mask. No need to do anything in advance!
        </p>
        <p>
          This is perfect for signing up for new services online, when you don't
          necessarily want to share your real email address or want to be able
          to prevent endless marketing emails.
        </p>
      </React.Fragment>
    );
  } else if (step === 3) {
    return (
      <React.Fragment>
        <Typography.Title level={3}>
          Create auto-stopping Mail Masks on-the-fly
        </Typography.Title>
        <Alert
          message={
            <span>
              Try it! Send an email to {isMobile && <br />}
              <Typography.Text
                copyable={{
                  text: `${firstMailMask?.alias}.7d@${firstMailMask?.domain}`,
                }}
              >
                <a
                  href={`mailto:${firstMailMask?.alias}.7d@${firstMailMask?.domain}`}
                >
                  {`${firstMailMask?.alias}.7d@${firstMailMask?.domain}`}
                </a>
              </Typography.Text>
            </span>
          }
          description="After you finish this tutorial, you'll see that a new Mail Mask has been created that stops forwarding in 7 days."
          type="info"
        />
        <p style={{ marginTop: "24px" }}>
          <strong>What's going on here?</strong>
        </p>
        <p>
          You can add time periods such as ".7d" (7 days) to automatically
          create a new Mail Mask that will automatically stop forwarding emails
          7 days after the first email is received.
        </p>
      </React.Fragment>
    );
  } else if (step === 4) {
    return (
      <React.Fragment>
        <Typography.Title level={3}>Mail Masker Premium</Typography.Title>
        <p>
          Mail Masker Premium makes it more convenient for you to stop your Mail
          Masks.
        </p>
        <Alert
          message={
            <span>
              Try it! Manually forward any an email you've received at one of
              your Mail Masks to {isMobile && <br />}
              <Typography.Text
                copyable={{ text: `stop@${supportedEmailDomains[0]}` }}
              >
                <a href={`mailto:stop@${supportedEmailDomains[0]}`}>
                  stop@{supportedEmailDomains[0]}
                </a>
              </Typography.Text>
            </span>
          }
          description="After you finish this tutorial, you'll see that the Mail Mask has been stopped."
          type="info"
        />
        <p style={{ marginTop: "24px" }}>
          <strong>What else does Mail Masker Premium offer?</strong>
        </p>
        <p>
          <Link to="/settings/billing">See here</Link> for full details.
        </p>
      </React.Fragment>
    );
  }
  Bugsnag.notify(`unexpected step: ${step}`);
  return null;
});
