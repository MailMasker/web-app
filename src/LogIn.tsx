import { Button, Checkbox, Form, Icon, Input, Typography } from "antd";
import React, { FormEvent, useCallback, useState } from "react";

import { ApolloError } from "apollo-boost";
import { FormComponentProps } from "antd/lib/form/Form";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

const { Text } = Typography;

const LogInQuery = gql`
  mutation LogIn($username: String!, $password: String!) {
    authenticate(username: $username, password: $password)
  }
`;

type Props = {};

const NormalLoginForm: React.FC<Props & FormComponentProps> = ({ form }) => {
  const [logIn, { data: logInData }] = useMutation(LogInQuery);
  const [logInServerError, setLogInServerError] = useState<ApolloError | null>(
    null
  );
  const history = useHistory();

  console.log(logInData);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.validateFields((err, { username, password }) => {
        if (!err) {
          logIn({ variables: { username, password } })
            .then(() => history.push("/"))
            .catch(err => setLogInServerError(err));
        }
      });
    },
    [form, history, logIn]
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
        <a className="login-form-forgot" href="#">
          Forgot password
        </a>
        {logInServerError && (
          <Text type="danger">{logInServerError.message}</Text>
        )}
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="#">register now!</a>
      </Form.Item>
    </Form>
  );
};

export const LogIn = Form.create({ name: "normal_login" })(NormalLoginForm);
