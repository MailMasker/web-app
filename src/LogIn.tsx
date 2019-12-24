import { Button, Checkbox, Form, Icon, Input } from "antd";
import React, { FormEvent, useCallback } from "react";

import { FormComponentProps } from "antd/lib/form/Form";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    authenticate(email: $email, password: $password)
  }
`;

type Props = {};

const NormalLoginForm: React.FC<Props & FormComponentProps> = ({ form }) => {
  const [logIn, { data: logInData }] = useMutation(LOG_IN);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.validateFields((err, { username, password }) => {
        if (!err) {
          logIn({ variables: { username, password } });
        } else {
          console.log("Validation error");
        }
      });
    },
    [form, logIn]
  );

  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator("username", {
          rules: [{ required: true, message: "Please input your username!" }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "Please input your Password!" }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("remember", {
          valuePropName: "checked",
          initialValue: true
        })(<Checkbox>Remember me</Checkbox>)}
        <a className="login-form-forgot" href="/forgot-password">
          Forgot password
        </a>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="/register">register now!</a>
      </Form.Item>
    </Form>
  );
};

export const LogIn = Form.create({ name: "normal_login" })(NormalLoginForm);
