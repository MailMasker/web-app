import { AutoComplete, Button, Form, Input, Radio, Result, Select } from "antd";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";

import ErrorMessage from "../lib/ErrorMessage";
import { useCreateRouteMutation } from "./generated/CreateRouteMutation";
import { useMeQuery } from "../Home/generated/MeQuery";
import useRandomWords from "../lib/useRandomWords";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

interface CreateRouteProps {}

const CreateRoute: React.FC<CreateRouteProps> = ({}) => {
  const [createRoute, { data, error, loading }] = useCreateRouteMutation();
  const { data: meQueryData, loading: meQueryLoading } = useMeQuery();

  const history = useHistory();

  const [randomWordsIndex, setRandomWordsIndex] = useState(0);
  const { allRandomWords, loading: randomWordsLoading } = useRandomWords(10);

  if (data) {
    return (
      <Result
        status="success"
        title={`${data.createRoute.emailMask.base}@${data.createRoute.emailMask.domain} will now forward to ${data.createRoute.redirectToVerifiedEmail.email}!`}
        extra={[
          <Link to="/" key="create-route">
            <Button type="primary" key="console">
              Go Home
            </Button>
          </Link>
        ]}
      />
    );
  }

  // If there's only one of either Email Mask or Verified Email, use it as the default value
  const initialValues: {
    redirectToVerifiedEmailID?: string;
    emailMaskEmail?: string;
  } = {
    redirectToVerifiedEmailID:
      meQueryData && meQueryData.me.user.verifiedEmails.length === 1
        ? meQueryData.me.user.verifiedEmails[0].id
        : undefined,
    emailMaskEmail:
      meQueryData && meQueryData.me.user.emailMasks.length === 1
        ? `${meQueryData.me.user.emailMasks[0].base}@${meQueryData.me.user.emailMasks[0].domain}`
        : undefined
  };

  const verifiedEmailOptions: {
    value: string;
    label: string;
  }[] = (meQueryData && meQueryData.me.user.verifiedEmails
    ? meQueryData.me.user.verifiedEmails
    : []
  ).map(({ email, id }) => {
    return { value: id, label: email ? email : "" };
  });

  const emailMaskOptions: {
    value: string;
    label: string;
    key: string;
    id: string;
  }[] = (meQueryData && meQueryData.me.user.emailMasks
    ? meQueryData.me.user.emailMasks
    : []
  ).map(({ base, domain, id }) => {
    return {
      label: `${base}@${domain}`,
      value: `${base}@${domain}`,
      key: id,
      id
    };
  });

  const onFinish = async ({
    redirectToVerifiedEmailID,
    emailMaskEmail
  }: any) => {
    console.log({ redirectToVerifiedEmailID, emailMaskEmail });
    const emailMask = emailMaskOptions.find(em => em.value === emailMaskEmail);
    if (!emailMask) {
      console.error(
        new Error(
          "couldn't find email mask in list, which should never happen –– silently failing to submit"
        )
      );
      return;
    }
    try {
      await createRoute({
        variables: { redirectToVerifiedEmailID, emailMaskID: emailMask.id }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={(changedValues, allValues) =>
        console.log(changedValues, allValues)
      }
    >
      <Form.Item label="Emails recieved at" name="emailMaskEmail">
        <AutoComplete
          autoFocus
          style={{ width: 200 }}
          placeholder="Select an Email Mask"
          options={emailMaskOptions}
          filterOption={(inputValue, option) => {
            if (option) {
              return (
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              );
            }
            return false;
          }}
          disabled={meQueryLoading || loading}
        />
      </Form.Item>

      <Form.Item label="Redirect to" name="redirectToVerifiedEmailID">
        <Radio.Group>
          {verifiedEmailOptions.map(({ value, label }) => (
            <Radio style={radioStyle} value={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <ErrorMessage error={error} />
        <div>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={meQueryLoading || loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateRoute;