import { Button, Checkbox, Form, Input, Typography } from "antd";

import ErrorAlert from "../../lib/ErrorAlert";
import React from "react";
import { useCreateUserMutation } from "./generated/CreateUserMutation";
import { uuidv4 } from "../../lib/uuid";

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface AccountCreationProps {
  onAccountCreationSuccess: () => void;
}

const AccountCreation = ({
  onAccountCreationSuccess,
}: AccountCreationProps) => {
  const [form] = Form.useForm();
  const [createAccount, { error, loading }] = useCreateUserMutation();

  const onFinish = (values: any) => {
    console.info("Submitted form: ", values);
    createAccount({
      variables: {
        username: values.username,
        password: values.password,
        uuid: uuidv4(),
      },
    })
      .then(onAccountCreationSuccess)
      .catch((err) => console.error(err));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.info("Failed form submission: ", errorInfo);
  };

  return (
    <React.Fragment>
      <Title>Sign Up</Title>

      <Form
        {...layout}
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Create Username"
          name="username"
          rules={[{ required: true, message: "Please choose a username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Choose Password"
          name="password"
          rules={[{ required: true, message: "Please choose a password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <ErrorAlert error={error} />
          <div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default AccountCreation;
