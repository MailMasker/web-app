import { Button, Form, Input, Popover, Typography, message } from "antd";
import { MailOutlined, PlusOutlined } from "@ant-design/icons";
import React, { memo, useCallback, useState } from "react";

import { useCreateVerifiedEmailMutation } from "../VerifiedEmails/generated/CreateVerifiedEmail";
import { useForm } from "antd/lib/form/util";
import { useRefreshVerifiedEmailsLazyQuery } from "./generated/RefreshVerifiedEmailsQuery";

type AddVerifiedEmailButtonAndPopoverProps = {
  onSuccess: ({ newVerifiedEmailID }: { newVerifiedEmailID: string }) => void;
};

const AddVerifiedEmailButtonAndPopover: React.FC<AddVerifiedEmailButtonAndPopoverProps> = ({
  onSuccess,
}) => {
  const [form] = useForm();

  const [
    createVerifiedEmail,
    {
      data: createVerifiedEmailData,
      error: createVerifiedEmailError,
      loading: createVerifiedEmailLoading,
    },
  ] = useCreateVerifiedEmailMutation();

  const [
    refreshVerifiedEmails,
    {
      data: refreshVerifiedEmailsData,
      error: refreshVerifiedEmailsError,
      loading: refreshVerifiedEmailsLoading,
    },
  ] = useRefreshVerifiedEmailsLazyQuery({ fetchPolicy: "network-only" });

  const [
    newVerifiedEmailPopoverVisible,
    setNewVerifiedEmailPopoverVisible,
  ] = useState(false);
  const hideNewVerifiedEmailPopover = useCallback(
    () => setNewVerifiedEmailPopoverVisible(false),
    [setNewVerifiedEmailPopoverVisible]
  );
  const handleNewVerifiedEmailPopoverVisibleChange = useCallback(
    (visible) => setNewVerifiedEmailPopoverVisible(visible),
    [setNewVerifiedEmailPopoverVisible]
  );
  const handleFinish = useCallback(
    async (values) => {
      let data = {};
      try {
        await form.validateFields();
        const { data } = await createVerifiedEmail({
          variables: { email: values.email },
        });
        await refreshVerifiedEmails();
        hideNewVerifiedEmailPopover();
        message.success(`Verification email sent to ${values.email}`);
        onSuccess({ newVerifiedEmailID: data?.createVerifiedEmail.id ?? "" });
      } catch {
        return;
      }
    },
    [setNewVerifiedEmailPopoverVisible]
  );

  return (
    <Popover
      content={
        <React.Fragment>
          <div style={{ maxWidth: "340px", marginBottom: "8px" }}>
            <Typography.Text>
              We'll verify that you own this address by email.
            </Typography.Text>
          </div>
          <Form
            form={form}
            name="horizontal_add_verified_email"
            layout="inline"
            onFinish={handleFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "your@realemail.com",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                type="email"
                autoComplete="on"
              />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                  loading={
                    createVerifiedEmailLoading || refreshVerifiedEmailsLoading
                  }
                >
                  Start Verification
                </Button>
              )}
            </Form.Item>
          </Form>
        </React.Fragment>
      }
      title={`Verify new "forward to" address`}
      trigger="click"
      visible={newVerifiedEmailPopoverVisible}
      onVisibleChange={handleNewVerifiedEmailPopoverVisibleChange}
    >
      <Button
        type="link"
        icon={<PlusOutlined />}
        style={{ padding: "12px 0px" }}
      >
        Add new "forward to" email address
      </Button>
    </Popover>
  );
};

export default memo(AddVerifiedEmailButtonAndPopover);
