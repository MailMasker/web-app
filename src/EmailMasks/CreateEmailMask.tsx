import { Button, Form, Input, Result, Select } from "antd";

import ErrorMessage from "../lib/ErrorMessage";
import { Link } from "react-router-dom";
import React from "react";
import { useCreateEmailMaskMutation } from "./generated/CreateEmailMask";

const { Option } = Select;

const supportedEmailDomains =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? ["mailmasker-local.com"]
    : process.env.REACT_APP_ENVIRONMENT === "dev"
    ? ["mailmasker-dev.com"]
    : ["mailmasker.com"];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface CreateEmailMaskProps {}

const CreateEmailMask: React.FC<CreateEmailMaskProps> = () => {
  const [
    createEmailMask,
    { data, error, loading },
  ] = useCreateEmailMaskMutation();

  // const history = useHistory();

  // const [randomWordsIndex, setRandomWordsIndex] = useState(0);
  // const { allRandomWords, loading: randomWordsLoading } = useRandomWords(10);

  if (data) {
    return (
      <Result
        status="success"
        title={`Your Email Mask ${data.createEmailMask.alias}@${data.createEmailMask.domain} has been created!`}
        subTitle={`Now you just need to set up a "Route" to let us know where you want us to direct emails sent to ${data.createEmailMask.alias}@${data.createEmailMask.domain}.`}
        extra={[
          <Link
            to={{
              pathname: "/routes/new",
              search: `?emailMaskID=${data.createEmailMask.id}`,
            }}
            key="create-route"
          >
            <Button type="primary" key="console">
              Create Route
            </Button>
          </Link>,
        ]}
      />
    );
  }

  const onFinish = async (values: any) => {
    try {
      await createEmailMask({
        variables: { email: `${values.alias}@${values.domain}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const initialValues: { email: string } = { email: "" };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="Email Address">
        <Input.Group compact>
          <Form.Item
            name="alias"
            noStyle
            rules={[
              {
                required: true,
                message:
                  "An alias (aka 'you' part in you@example.com) is required",
              },
            ]}
          >
            <Input
              style={{ width: "30%" }}
              placeholder="Choose an alias"
              autoFocus
            />
          </Form.Item>
          <div style={{ margin: "3px 6px" }}>@</div>
          <Form.Item
            name="domain"
            noStyle
            rules={[
              {
                required: true,
                message:
                  "You must choose a domain (aka the 'example.com' part in you@example.com)",
              },
            ]}
          >
            <Select placeholder="Select domain" style={{ width: "30%" }}>
              {supportedEmailDomains.map((domain) => (
                <Option value={domain}>{domain}</Option>
              ))}
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <ErrorMessage error={error} />
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

export default CreateEmailMask;
