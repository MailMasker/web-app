import { Button, Checkbox, Form, Icon, Input, Typography } from "antd";
import React, { FormEvent, useCallback, useState } from "react";

import { ApolloError } from "apollo-boost";
import { FormComponentProps } from "antd/lib/form/Form";
import { useHistory } from "react-router-dom";
import { useLogInMutation } from "./generated/LogInMutation";

const { Text } = Typography;

interface NormalLoginFormProps extends FormComponentProps {
  onLoginSuccess: () => void;
}

const NormalLoginForm: React.FC<NormalLoginFormProps> = ({
  form,
  onLoginSuccess
}) => {
  const [logIn] = useLogInMutation();
  const [logInServerError, setLogInServerError] = useState<ApolloError | null>(
    null
  );
  const history = useHistory();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.validateFields((err, { username, password }) => {
        if (!err) {
          logIn({ variables: { username, password } })
            .then(onLoginSuccess)
            .catch(err => setLogInServerError(err));
        }
      });
    },
    [form, logIn, onLoginSuccess]
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
        <Button type="link" onClick={() => history.push("/reset-password")}>
          Forgot password
        </Button>
        {logInServerError && (
          <Text type="danger">{logInServerError.message}</Text>
        )}
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or
        <Button type="link" onClick={() => history.push("/register")}>
          register now!
        </Button>
      </Form.Item>
    </Form>
  );
};

export const LogIn = Form.create<NormalLoginFormProps>({
  name: "normal_login"
})(NormalLoginForm);
