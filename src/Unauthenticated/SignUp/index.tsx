import {
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  Steps,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import useQueryParams, { QueryParams } from "../../lib/useQueryParam";

import ErrorAlert from "../../lib/ErrorAlert";
import { green } from "@ant-design/colors";
// @ts-ignore
import randomWords from "random-words";
import supportedEmailDomains from "../../lib/supportedEmailDomains";
import { useCreateUserMutation } from "./generated/CreateUserMutation";
import useDebounce from "../../lib/useDebounce";
import { useHistory } from "react-router-dom";
import { useIsEmailMaskAvailableLazyQuery } from "./generated/IsEmailMaskAvailableQuery";
import useIsMobile from "../../lib/useIsMobile";
import { uuidv4 } from "../../lib/uuid";

interface SignUpProps {
  onAuthenticationSuccess: () => void;
}

const SignUp = ({ onAuthenticationSuccess }: SignUpProps) => {
  const [form] = Form.useForm();

  const isMobile = useIsMobile();

  const history = useHistory<{
    username: string | undefined;
    step: number | undefined;
    mailMaskAlias: string | undefined;
    emailAddress: string | undefined;
  }>();

  const [queryParams] = useQueryParams(useState<QueryParams<"alias">>({}));

  const [
    createAccount,
    { data: signUpData, error: signUpError, loading: signUpLoading },
  ] = useCreateUserMutation();

  const [
    isEmailMaskAvailable,
    {
      data: isEmailMaskAvailableData,
      error: isEmailMaskAvailableError,
      loading: isEmailMaskAvailableLoading,
    },
  ] = useIsEmailMaskAvailableLazyQuery();

  const step = history.location.state?.step ?? 0;

  console.log(history.location.state);

  const onSubmit =
    step === 0
      ? (values: any) => {
          history.push("/sign-up", {
            ...history.location.state,
            mailMaskAlias: values.mailMaskAlias,
            step: 1,
          });
        }
      : step === 1
      ? (values: any) => {
          history.push("/sign-up", {
            ...history.location.state,
            emailAddress: values.emailAddress,
            step: 2,
          });
        }
      : (values: any) => {
          console.log("values: ", values);

          if (values.termsAndPrivacy !== true) {
            message.error(
              "You must agree to the Terms of Service and Privacy Policy."
            );
            return;
          }
          createAccount({
            variables: {
              username: values.username,
              password: values.password,
              uuid: uuidv4(),
              persistent: values.remember as boolean,
              emailMask: `${history.location.state?.mailMaskAlias ?? ""}@${
                supportedEmailDomains[0]
              }`,
              verifiedEmail: history.location.state?.emailAddress ?? "",
            },
          })
            .then(onAuthenticationSuccess)
            .then(() => message.success(`Account created!`))
            .catch((err) => console.error(err));
        };

  const [mailMaskAliasInputValue, setMailMaskAliasInputValue] = useState<
    string
  >(form.getFieldValue("mailMaskAlias"));
  const debouncedDesiredEmailMaskAlias = useDebounce(
    mailMaskAliasInputValue,
    500
  );

  // Effect for API call
  useEffect(
    () => {
      if (debouncedDesiredEmailMaskAlias) {
        isEmailMaskAvailable({
          variables: {
            email:
              debouncedDesiredEmailMaskAlias + "@" + supportedEmailDomains[0],
          },
        });
      }
    },
    [debouncedDesiredEmailMaskAlias, isEmailMaskAvailable] // Only call effect if debounced search term changes
  );

  useEffect(() => {
    if (queryParams.alias) {
      setMailMaskAliasInputValue(queryParams.alias);
    }
  }, [queryParams.alias]);

  return (
    <React.Fragment>
      <React.Fragment>
        <Space size="large" direction="vertical" style={{ width: "100%" }}>
          <Space
            size="large"
            direction="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "stretch" : "center",
              width: "100%",
            }}
          >
            <Typography.Title level={2}>Sign Up</Typography.Title>
            <div
              style={{
                minWidth: isMobile ? "100%" : "500px",
                padding: "24px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(0,0,0,0.1)",
                backgroundColor: "rgba(0,0,0,0.03)",
                borderRadius: "4px",
              }}
            >
              <Steps
                progressDot
                current={step}
                direction={isMobile ? "vertical" : "horizontal"}
                style={{ width: "100%" }}
              >
                <Steps.Step
                  title="Create Mail Mask"
                  description="to give out"
                />
                <Steps.Step
                  title="Your Email"
                  description="where we forward to"
                />
                <Steps.Step title="Credentials" description="how you'll log in">
                  Childs
                </Steps.Step>
              </Steps>
            </div>
            {step === 0 ? (
              <Form
                name="choose_mail_mask"
                key="choose_mail_mask"
                initialValues={{
                  remember: true,
                  mailMaskAlias: queryParams.alias ?? "",
                }}
                onFinish={onSubmit}
                style={{ width: "300px", marginTop: "24px" }}
                form={form}
                onValuesChange={(values) => {
                  if (Object.keys(values).includes("mailMaskAlias")) {
                    setMailMaskAliasInputValue(values.mailMaskAlias);
                  }
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <Typography.Title level={4}>
                    Choose your Mail Mask
                  </Typography.Title>
                  <p>
                    This is what you'll give out to companies and services that
                    you want privacy from.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Form.Item
                    name="mailMaskAlias"
                    rules={[
                      {
                        required: true,
                        message: "Please choose your Mail Mask",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                    validateStatus={
                      isEmailMaskAvailableLoading
                        ? "validating"
                        : isEmailMaskAvailableData &&
                          isEmailMaskAvailableData.isEmailMaskAvailable
                        ? "success"
                        : isEmailMaskAvailableError ||
                          (isEmailMaskAvailableData &&
                            !isEmailMaskAvailableData.isEmailMaskAvailable)
                        ? "error"
                        : undefined
                    }
                  >
                    <Input
                      placeholder="you"
                      style={{ textAlign: "end" }}
                      autoComplete="none"
                      addonAfter={`@${supportedEmailDomains[0]}`}
                    />
                  </Form.Item>
                  <Tooltip placement="right" title="Random">
                    <Button
                      type="link"
                      style={{ padding: 0, marginLeft: "12px" }}
                      onClick={() => {
                        const randomAlias =
                          randomWords(1) + Math.floor(Math.random() * 100);
                        form.setFieldsValue({
                          mailMaskAlias: randomAlias,
                        });
                        setMailMaskAliasInputValue(randomAlias);
                      }}
                    >
                      <SyncOutlined />
                    </Button>
                  </Tooltip>
                </div>
                <div
                  style={{
                    marginTop: "24px",
                    textAlign: "center",
                    color: isEmailMaskAvailableData ? green[6] : undefined,
                    fontSize: "1.2em",
                  }}
                >
                  <strong>
                    {!mailMaskAliasInputValue
                      ? " "
                      : isEmailMaskAvailableLoading ||
                        mailMaskAliasInputValue !==
                          debouncedDesiredEmailMaskAlias
                      ? "Checking availability..."
                      : isEmailMaskAvailableData &&
                        isEmailMaskAvailableData.isEmailMaskAvailable
                      ? `Available!`
                      : isEmailMaskAvailableError
                      ? isEmailMaskAvailableError.message
                      : isEmailMaskAvailableData &&
                        !isEmailMaskAvailableData.isEmailMaskAvailable
                      ? "Already taken – please try something else"
                      : " "}
                  </strong>
                </div>
                <Form.Item>
                  <ErrorAlert error={signUpError} />
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%", marginTop: "24px" }}
                    disabled={
                      isEmailMaskAvailableLoading ||
                      !mailMaskAliasInputValue ||
                      isEmailMaskAvailableData?.isEmailMaskAvailable === false
                    }
                  >
                    Next
                  </Button>
                </Form.Item>
              </Form>
            ) : step === 1 ? (
              <Form
                name="email_address"
                key="email_address"
                initialValues={{
                  remember: true,
                  username: history.location.state?.username ?? "",
                }}
                onFinish={onSubmit}
                style={{ width: "300px", marginTop: "24px" }}
                form={form}
              >
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <Typography.Title level={4}>
                    Your Real Email Address
                  </Typography.Title>
                  <p>
                    Where should we forward email sent to{" "}
                    <strong>
                      {history.location.state?.mailMaskAlias ?? "you"}@
                      {supportedEmailDomains[0]}
                    </strong>{" "}
                    ?
                  </p>
                </div>
                <Form.Item
                  name="emailAddress"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your real email address",
                      type: "email",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="you@example.com"
                    style={{ textAlign: "center" }}
                    autoComplete="email"
                    suffix={
                      <Tooltip
                        placement="right"
                        title="If you ever delete your account, this email address will be permanently erased from our system."
                      >
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                            marginLeft: "8px",
                          }}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
                <Form.Item>
                  <ErrorAlert error={signUpError} />
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%", marginTop: "12px" }}
                    loading={(signUpLoading || signUpData) && !signUpError}
                    disabled={signUpLoading}
                  >
                    Next
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Form
                name="credentials"
                key="credentials"
                initialValues={{
                  remember: true,
                  username: history.location.state?.username ?? "",
                  termsAndPrivacy: true,
                }}
                onFinish={onSubmit}
                style={{ width: "300px", marginTop: "24px" }}
                form={form}
              >
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <Typography.Title level={4}>Credentials</Typography.Title>
                  <p>This is how you'll log in later.</p>
                </div>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please choose a username",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    autoComplete="username"
                    suffix={
                      <Tooltip
                        placement="right"
                        title="If you use a password manager like 1Password, we recommend you create a random username, rather than using your personal email address, for extra anonymity."
                      >
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please choose a password",
                    },
                  ]}
                  style={{ marginBottom: "12px" }}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    autoComplete={"new-password"}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Tooltip
                      placement="right"
                      title="If you check this box, we will keep you signed in for a long time. If you're on a shared computer, don't check the box."
                    >
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  </div>
                </Form.Item>
                <Form.Item style={{ marginBottom: "6px" }}>
                  <Form.Item
                    name="termsAndPrivacy"
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox>
                      I agree to the{" "}
                      <a href="https://www.mailmasker.com/terms">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="https://www.mailmasker.com/privacy">
                        Privacy Policy
                      </a>
                    </Checkbox>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <ErrorAlert error={signUpError} />
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={(signUpLoading || signUpData) && !signUpError}
                    disabled={signUpLoading}
                    size="large"
                    style={{
                      width: "100%",
                      backgroundColor: green[5],
                      borderColor: green[5],
                    }}
                  >
                    Finish
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Space>
        </Space>
      </React.Fragment>
    </React.Fragment>
  );
};

export default SignUp;
