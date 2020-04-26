import { Button, Form, Input, Result } from "antd";

import ErrorAlert from "../lib/ErrorAlert";
import { Link } from "react-router-dom";
import React from "react";
import { useCreateVerifiedEmailMutation } from "./generated/CreateVerifiedEmail";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface CreateVerifiedEmailProps {}

const CreateVerifiedEmail: React.FC<CreateVerifiedEmailProps> = () => {
  const [
    createVerifiedEmail,
    { data, error, loading },
  ] = useCreateVerifiedEmailMutation();

  if (data) {
    return (
      <Result
        status="success"
        title="You're half-way there!"
        subTitle={`Before we can redirect emails to ${data.createVerifiedEmail.email}, you will have to find an email we just sent you and click the 'Verify Email' button. This confirms for us that you own this email account.`}
        extra={[
          <Link to="" key="go-home">
            <Button type="primary" key="console">
              Go Home
            </Button>
          </Link>,
        ]}
      />
    );
  }

  const onFinish = async (values: any) => {
    try {
      await createVerifiedEmail({
        variables: { email: values.email },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const initialValues: { email: string } = { email: "" };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        label="Email Address"
        name="email"
        rules={[{ required: true, message: "Please input an email address" }]}
      >
        <Input type="email" autoFocus />
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
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateVerifiedEmail;
