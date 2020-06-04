import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  PageHeader,
  Radio,
  Space,
  Steps,
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
import { useLogInMutation } from "../LogInForgotPassword/generated/LogInMutation";
import { useResetPasswordMutation } from "../LogInForgotPassword/generated/ResetPasswordMutation";
import { useSendResetPasswordEmailMutation } from "../LogInForgotPassword/generated/SendResetPasswordEmailMutation";
import { uuidv4 } from "../../lib/uuid";

const { Title } = Typography;

interface SignUpProps {
  onAuthenticationSuccess: () => void;
}

const SignUp = ({ onAuthenticationSuccess }: SignUpProps) => {
  const [form] = Form.useForm();

  const history = useHistory<{ username: string }>();

  const [
    createAccount,
    { data: signUpData, error: signUpError, loading: signUpLoading },
  ] = useCreateUserMutation();

  const onSubmitSignUp = (values: any) => {
    console.info("Submitted form: ", values);
    createAccount({
      variables: {
        username: values.username,
        password: values.password,
        uuid: uuidv4(),
        persistent: values.remember as boolean,
      },
    })
      .then(onAuthenticationSuccess)
      .then(() => message.success(`Account created!`))
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
              <Title>Sign Up</Title>
              <div style={{ minWidth: "500px" }}>
                <Steps progressDot current={1} style={{ minWidth: "500px" }}>
                  <Steps.Step
                    title="Finished"
                    description="This is a description."
                  />
                  <Steps.Step
                    title="In Progress"
                    description="This is a description."
                  />
                  <Steps.Step
                    title="Waiting"
                    description="This is a description."
                  />
                </Steps>
              </div>
              <Form
                name="normal_login"
                initialValues={{
                  remember: true,
                  username: history.location.state?.username ?? "",
                }}
                onFinish={onSubmitSignUp}
                style={{ width: "300px" }}
                form={form}
              >
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
                    prefix={<UserOutlined className="site-form-item-icon" />}
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
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    autoComplete={"new-password"}
                  />
                </Form.Item>
                <Form.Item>
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
                <Form.Item>
                  <ErrorAlert error={signUpError} />
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ width: "100%" }}
                    loading={(signUpLoading || signUpData) && !signUpError}
                    disabled={signUpLoading}
                  >
                    Sign up
                  </Button>
                  <div>
                    Or <Link to={"/log-in"}>log in now!</Link>
                  </div>
                </Form.Item>
              </Form>
            </Space>
          </PageHeader>
        </Space>
      </React.Fragment>
    </React.Fragment>
  );
};

export default SignUp;
