import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  PageHeader,
  Radio,
  Space,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import {
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import ErrorAlert from "../../lib/ErrorAlert";
import React from "react";
import { useCreateUserMutation } from "./generated/CreateUserMutation";
import { useLogInMutation } from "./generated/LogInMutation";
import { useResetPasswordMutation } from "./generated/ResetPasswordMutation";
import { useSendResetPasswordEmailMutation } from "./generated/SendResetPasswordEmailMutation";
import { uuidv4 } from "../../lib/uuid";

const { Title } = Typography;

interface LogInSignUpForgotPasswordProps {
  onAuthenticationSuccess: () => void;
}

const LogInSignUpForgotPassword = ({
  onAuthenticationSuccess,
}: LogInSignUpForgotPasswordProps) => {
  const [form] = Form.useForm();

  const history = useHistory();
  const signUpMatch = useRouteMatch("/sign-up");
  const logInMatch = useRouteMatch("/log-in");
  const forgotPasswordMatch = useRouteMatch("/forgot-password");
  const resetPasswordMatch = useRouteMatch<{
    code: string;
    userID: string;
    username: string;
  }>("/reset-password/user/:userID/code/:code/username/:username");

  const [
    logIn,
    { error: logInError, loading: logInLoading },
  ] = useLogInMutation();

  const [
    createAccount,
    { error: signUpError, loading: signUpLoading },
  ] = useCreateUserMutation();

  const [
    sendResetPasswordEmail,
    {
      data: sendResetPasswordEmailData,
      error: sendResetPasswordEmailError,
      loading: sendResetPasswordEmailLoading,
    },
  ] = useSendResetPasswordEmailMutation();

  const [
    resetPassword,
    { loading: resetPasswordLoading, error: resetPasswordError },
  ] = useResetPasswordMutation();

  const onSubmitLogIn = (values: any) => {
    console.info("Submitted form: ", values);
    logIn({
      variables: {
        username: values.username,
        password: values.password,
      },
    })
      .then(onAuthenticationSuccess)
      .catch((err) => console.error(err));
  };

  const onSubmitSignUp = (values: any) => {
    console.info("Submitted form: ", values);
    createAccount({
      variables: {
        username: values.username,
        password: values.password,
        uuid: uuidv4(),
      },
    })
      .then(onAuthenticationSuccess)
      .catch((err) => console.error(err));
  };

  const onSubmitForgotPassword = (values: any) => {
    console.info("Submitted form: ", values);
    sendResetPasswordEmail({
      variables: {
        usernameOrEmail: values.username,
      },
    })
      .then(() => message.success("Email sent"))
      .catch((err) => console.error(err));
  };

  const onSubmitResetPassword = (values: any) => {
    console.info("Submitted form: ", values);
    resetPassword({
      variables: {
        newPassword: values.password,
        userID: resetPasswordMatch?.params.userID ?? "",
        code: resetPasswordMatch?.params.code ?? "",
      },
    })
      .then(() => {
        notification.success({
          message: `Password updated`,
          description: "You are now logged in.",
          placement: "topRight",
        });
        onAuthenticationSuccess();
      })
      .catch((err) => console.error(err));
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <Space size="large" direction="vertical" style={{ width: "100%" }}>
          <PageHeader title="">
            <Space
              size="large"
              direction="vertical"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Radio.Group
                onChange={(e) => {
                  history.push(e.target.value);
                }}
                style={{ marginBottom: 8 }}
                value={history.location.pathname}
              >
                <Radio.Button value="/sign-up">Sign Up</Radio.Button>
                <Radio.Button value="/log-in">Log In</Radio.Button>
              </Radio.Group>
              <Title>
                {logInMatch
                  ? "Log In"
                  : signUpMatch
                  ? "Sign Up"
                  : forgotPasswordMatch
                  ? "Forgot Password"
                  : resetPasswordMatch
                  ? "Reset Password"
                  : () => console.error("unknown case")}
              </Title>
              {forgotPasswordMatch && (
                <React.Fragment>
                  <div style={{ textAlign: "center", width: "300px" }}>
                    <Typography.Title level={3}>
                      Forgot Username or Password?
                    </Typography.Title>
                    <br />
                    <Typography.Text>
                      We will send an email containing your username and a link
                      to reset your password to each of the verified addresses
                      associated with your account.
                    </Typography.Text>
                  </div>
                </React.Fragment>
              )}
              {resetPasswordMatch && (
                <React.Fragment>
                  <div style={{ textAlign: "center", width: "300px" }}>
                    <Typography.Title level={3}>
                      Reset Password
                    </Typography.Title>
                    <Typography.Text>Choose a new password:</Typography.Text>
                  </div>
                </React.Fragment>
              )}
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                  username: resetPasswordMatch?.params.username ?? undefined,
                }}
                onFinish={
                  logInMatch
                    ? onSubmitLogIn
                    : signUpMatch
                    ? onSubmitSignUp
                    : forgotPasswordMatch
                    ? onSubmitForgotPassword
                    : resetPasswordMatch
                    ? onSubmitResetPassword
                    : () => console.error("unknown case")
                }
                style={{ width: "300px" }}
                form={form}
              >
                {forgotPasswordMatch && (
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please provide your username or email!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Username or email"
                      autoComplete="username"
                    />
                  </Form.Item>
                )}
                {(logInMatch || signUpMatch || resetPasswordMatch) && (
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: logInMatch
                          ? "Please enter your username"
                          : "Please choose a username",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Username"
                      disabled={!!resetPasswordMatch}
                      autoComplete="username"
                      suffix={
                        signUpMatch ? (
                          <Tooltip
                            placement="right"
                            title="If you use a password manager like 1Password, we recommend you create a random username, rather than using your personal email address, for extra anonymity."
                          >
                            <InfoCircleOutlined
                              style={{ color: "rgba(0,0,0,.45)" }}
                            />
                          </Tooltip>
                        ) : null
                      }
                    />
                  </Form.Item>
                )}

                {(logInMatch || signUpMatch || resetPasswordMatch) && (
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: logInMatch
                          ? "Please enter your password"
                          : "Please choose a password",
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                      autoFocus={!!resetPasswordMatch}
                      autoComplete={
                        logInMatch ? "current-password" : "new-password"
                      }
                    />
                  </Form.Item>
                )}
                {logInMatch || signUpMatch ? (
                  <Form.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      {logInMatch && (
                        <Link to={"/forgot-password"}>Forgot password?</Link>
                      )}
                    </div>
                  </Form.Item>
                ) : null}

                <Form.Item>
                  <ErrorAlert
                    error={[
                      logInError,
                      signUpError,
                      sendResetPasswordEmailError,
                      resetPasswordError,
                    ]}
                  />
                  {sendResetPasswordEmailData && (
                    <Alert
                      message="Check your email for your username and a link to reset your password."
                      type="success"
                      style={{ marginBottom: "12px" }}
                    />
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%" }}
                    loading={
                      logInLoading ||
                      signUpLoading ||
                      sendResetPasswordEmailLoading ||
                      resetPasswordLoading
                    }
                    disabled={
                      logInLoading ||
                      signUpLoading ||
                      sendResetPasswordEmailLoading ||
                      resetPasswordLoading
                    }
                  >
                    {logInMatch
                      ? "Log in"
                      : signUpMatch
                      ? "Sign up"
                      : forgotPasswordMatch
                      ? "Send me an email"
                      : resetPasswordMatch
                      ? "Reset password"
                      : ""}
                  </Button>
                  {logInMatch && (
                    <div>
                      Or <Link to={"/sign-up"}>sign up now!</Link>
                    </div>
                  )}
                  {signUpMatch && (
                    <div>
                      Or <Link to={"/log-in"}>log in now!</Link>
                    </div>
                  )}
                </Form.Item>
              </Form>
            </Space>
          </PageHeader>
        </Space>
      </React.Fragment>
    </React.Fragment>
  );
};

export default LogInSignUpForgotPassword;
