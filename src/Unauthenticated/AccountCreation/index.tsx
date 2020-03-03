import { Button, Checkbox, Form, Icon, Input, Typography } from "antd";
import React, { FormEvent, useCallback, useState } from "react";

import { ApolloError } from "apollo-boost";
import { FormComponentProps } from "antd/lib/form/Form";
import { useCreateUserMutation } from "./generated/CreateUserMutation";
import { useHistory } from "react-router-dom";
import { uuidv4 } from "../../lib/uuid";

const { Text } = Typography;

interface NormalAccountCreationFormProps extends FormComponentProps {
  onAccountCreationSuccess: () => void;
}

const NormalAccountCreationForm: React.FC<NormalAccountCreationFormProps> = ({
  form,
  onAccountCreationSuccess
}) => {
  const [AccountCreation] = useCreateUserMutation();
  const [
    AccountCreationServerError,
    setAccountCreationServerError
  ] = useState<ApolloError | null>(null);
  const history = useHistory();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.validateFields((err, { username, password }) => {
        if (!err) {
          AccountCreation({ variables: { username, password, uuid: uuidv4() } })
            .then(onAccountCreationSuccess)
            .catch(err => setAccountCreationServerError(err));
        }
      });
    },
    [form, AccountCreation, onAccountCreationSuccess]
  );

  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={handleSubmit} className="AccountCreation-form">
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
        {AccountCreationServerError && (
          <Text type="danger">{AccountCreationServerError.message}</Text>
        )}
        <Button
          type="primary"
          htmlType="submit"
          className="AccountCreation-form-button"
        >
          Register
        </Button>
        Or
        <Button type="link" onClick={() => history.push("/register")}>
          log into an existing account!
        </Button>
      </Form.Item>
    </Form>
  );
};

export const AccountCreation = Form.create<NormalAccountCreationFormProps>({
  name: "normal_AccountCreation"
})(NormalAccountCreationForm);
