import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Typography,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";

import AddVerifiedEmailButtonAndPopover from "./AddVerifiedEmailButtonAndPopover";
import ErrorAlert from "../lib/ErrorAlert";
import { PlusOutlined } from "@ant-design/icons";
import ResendVerificationEmailCTA from "./ResendVerificationEmailCTA";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import { useMeQuery } from "./generated/MeQuery";

type NewMailMaskModalAndButtonProps = {};

const NewMailMaskModalAndButton: React.FC<NewMailMaskModalAndButtonProps> = () => {
  const [form] = Form.useForm();

  const { data: meQueryData, error: meQueryError } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const [newMaskModalVisible, setNewMaskModalVisible] = useState(false);

  const showNewMaskModal = useCallback(() => setNewMaskModalVisible(true), [
    setNewMaskModalVisible,
  ]);

  const handleNewMaskOk = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (error) {
      // validation failed
      return;
    }
    setNewMaskModalVisible(false);
  }, [setNewMaskModalVisible, form]);

  const handleFormFinish = useCallback(
    (values: any) => {
      console.log("values: ", values);
      setNewMaskModalVisible(false);
    },
    [setNewMaskModalVisible]
  );

  const handleNewMaskCancel = useCallback(() => setNewMaskModalVisible(false), [
    setNewMaskModalVisible,
  ]);

  const initialValues: { email: string; domain: string } = {
    email: "",
    domain: supportedEmailDomains[0],
  };

  const verifiedEmailOptions: {
    value: string;
    label: string;
    verified: boolean;
  }[] = useMemo(
    () =>
      (meQueryData && meQueryData.me.user.verifiedEmails
        ? meQueryData.me.user.verifiedEmails
        : []
      ).map(({ email, id, verified }) => {
        return { value: id, label: email ? email : "", verified };
      }),
    [meQueryData]
  );

  const [
    recentlyCreatedVerifiedEmailIDs,
    setRecentlyCreatedVerifiedEmailIDs,
  ] = useState(new Set());

  return (
    <React.Fragment>
      <Button type="primary" icon={<PlusOutlined />} onClick={showNewMaskModal}>
        New Mail Mask
      </Button>
      <Modal
        title="New Mail Mask"
        visible={newMaskModalVisible}
        onOk={handleNewMaskOk}
        onCancel={handleNewMaskCancel}
        okButtonProps={{
          disabled:
            !form.isFieldsTouched(true) ||
            form.getFieldsError().filter(({ errors }) => errors.length).length >
              0,
        }}
      >
        <ErrorAlert error={meQueryError} />
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          name="newMailMaskForm"
          initialValues={initialValues}
          onFinish={handleFormFinish}
        >
          <Form.Item
            label="Receive email at"
            style={{ marginBottom: 0 }}
            required
          >
            <Input.Group compact style={{ display: "flex" }}>
              <Form.Item
                name="alias"
                noStyle
                rules={[
                  {
                    required: true,
                    message:
                      "Please choose an alias (aka 'you' part in you@example.com)",
                  },
                ]}
              >
                <Input
                  placeholder="alias"
                  autoFocus
                  autoComplete="off"
                  style={{ height: "32px" }}
                />
              </Form.Item>
              {supportedEmailDomains.length > 1 ? (
                <React.Fragment>
                  <div style={{ margin: "3px 6px" }}>@</div>
                  <Form.Item
                    name="domain"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message:
                          "Please choose a domain (aka the 'example.com' part in you@example.com)",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select domain"
                      style={{ width: "30%" }}
                    >
                      {supportedEmailDomains.map((domain) => (
                        <Select.Option value={domain} key={domain}>
                          {domain}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </React.Fragment>
              ) : (
                <Form.Item
                  style={{
                    height: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    marginLeft: "8px",
                    flexShrink: 0,
                  }}
                >
                  @{supportedEmailDomains[0]}
                </Form.Item>
              )}
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Then forward to"
            name="redirectToVerifiedEmailID"
            rules={[
              {
                required: true,
                message:
                  "Please specify where you'd like emails to be forwarded to",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Radio.Group>
              {verifiedEmailOptions.map(({ value, label, verified }) => (
                <div style={{ marginBottom: "10px" }}>
                  <Radio value={value} style={{ display: "block" }}>
                    {label}
                  </Radio>
                  {!verified &&
                    (recentlyCreatedVerifiedEmailIDs.has(value) ? (
                      <Alert
                        message="Check your email"
                        description={`To verify that you own this email address, click the link in an email that you should have received from support@${supportedEmailDomains[0]}`}
                        type="success"
                        showIcon
                        style={{ marginTop: "4px" }}
                      />
                    ) : (
                      <div>
                        <Typography.Text type="danger">
                          Unverified
                        </Typography.Text>{" "}
                        – <ResendVerificationEmailCTA email={label} />
                      </div>
                    ))}
                </div>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            {...{
              wrapperCol: {
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 16,
                  offset: 8,
                },
              },
            }}
          >
            <AddVerifiedEmailButtonAndPopover
              onSuccess={({ newVerifiedEmailID }) => {
                let s = new Set(recentlyCreatedVerifiedEmailIDs);
                s.add(newVerifiedEmailID);
                setRecentlyCreatedVerifiedEmailIDs(s);
                form.setFieldsValue({
                  redirectToVerifiedEmailID: newVerifiedEmailID,
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default NewMailMaskModalAndButton;
