import {
  Button,
  Checkbox,
  Form,
  Input,
  PageHeader,
  Radio,
  Space,
  Tooltip,
  Typography,
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
import { uuidv4 } from "../../lib/uuid";

interface LogInProps {
  onLogInSuccess: () => void;
}

const LogIn = ({ onLogInSuccess }: LogInProps) => {
  const [form] = Form.useForm();

  const history = useHistory();
  const signUpMatch = useRouteMatch("/sign-up");
  const logInMatch = useRouteMatch("/log-in");
  const forgotPasswordMatch = useRouteMatch("/forgot-password");

  const [
    logIn,
    { error: logInError, loading: logInLoading },
  ] = useLogInMutation();

  const [
    createAccount,
    { error: signUpError, loading: signUpLoading },
  ] = useCreateUserMutation();

  const onSubmitLogIn = (values: any) => {
    console.info("Submitted form: ", values);
    logIn({
      variables: {
        username: values.username,
        password: values.password,
      },
    })
      .then(onLogInSuccess)
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
      .then(onLogInSuccess)
      .catch((err) => console.error(err));
  };

  const onSubmitForgotPassword = (values: any) => {
    console.info("Submitted form: ", values);
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
              {forgotPasswordMatch && (
                <React.Fragment>
                  <div style={{ textAlign: "center", width: "300px" }}>
                    <Typography.Title level={3}>
                      Forgot Username or Password?
                    </Typography.Title>
                    <br />
                    <Typography.Text>
                      We will attempt to send you an email with your username
                      and a link to reset your password.
                    </Typography.Text>
                  </div>
                </React.Fragment>
              )}
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={
                  logInMatch
                    ? onSubmitLogIn
                    : signUpMatch
                    ? onSubmitSignUp
                    : onSubmitForgotPassword
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
                    />
                  </Form.Item>
                )}
                {(logInMatch || signUpMatch) && (
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

                {(logInMatch || signUpMatch) && (
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
                      <Link to={"/forgot-password"}>Forgot password?</Link>
                    </div>
                  </Form.Item>
                ) : null}

                <Form.Item>
                  <ErrorAlert error={[logInError, signUpError]} />
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%" }}
                    loading={logInLoading || signUpLoading}
                    disabled={logInLoading || signUpLoading}
                  >
                    {logInMatch
                      ? "Log in"
                      : signUpMatch
                      ? "Sign up"
                      : "Send me an email"}
                  </Button>
                  {logInMatch && (
                    <div>
                      Or <Link to={"/sign-up"}>sign up now!</Link>
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

export default LogIn;
