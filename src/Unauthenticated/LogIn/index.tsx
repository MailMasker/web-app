import { Button, Checkbox, Form, Input, Typography } from "antd";

import ErrorAlert from "../../lib/ErrorAlert";
import { Link } from "react-router-dom";
import React from "react";
import { useLogInMutation } from "./generated/LogInMutation";

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface LogInProps {
  onLogInSuccess: () => void;
}

const LogIn = ({ onLogInSuccess }: LogInProps) => {
  const [form] = Form.useForm();

  const [logIn, { error, loading }] = useLogInMutation();

  const onFinish = (values: any) => {
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

  const onFinishFailed = (errorInfo: any) => {
    console.info("Failed form submission: ", errorInfo);
  };

  return (
    <React.Fragment>
      <Title>Log In</Title>

      <Form
        {...layout}
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        {/* history.push("/register")
      history.push("/reset-password") */}
        <Form.Item {...tailLayout}>
          <ErrorAlert error={error} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
            <Link to="/forgot-password" style={{ marginLeft: "12px" }}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default LogIn;
