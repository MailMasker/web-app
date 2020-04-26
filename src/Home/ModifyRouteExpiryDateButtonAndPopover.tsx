import { Button, Form, Input, Popover, Typography, message } from "antd";
import { EditOutlined, MailOutlined } from "@ant-design/icons";
import React, { memo, useCallback, useState } from "react";

import ErrorAlert from "../lib/ErrorAlert";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm } from "antd/lib/form/util";
import { useUpdateRouteMutation } from "./generated/UpdateRouteMutation";

dayjs.extend(relativeTime);

type ModifyRouteExpiryDateButtonAndPopoverProps = {
  route: { expiresISO?: string | null; id: string };
  onSuccess: ({ modifiedRouteID }: { modifiedRouteID: string }) => void;
};

const ModifyRouteExpiryDateButtonAndPopover: React.FC<ModifyRouteExpiryDateButtonAndPopoverProps> = ({
  route,
  onSuccess,
}) => {
  const [form] = useForm();

  const [
    updateRoute,
    { error: updateRouteError, loading: updateRouteLoading },
  ] = useUpdateRouteMutation();

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
      // TODO
      throw new Error("update expiresISO");

      const expiresISO = "";

      // const relativeTimeStatement = route.expiresISO
      //   ? dayjs(route.expiresISO)
      //   : undefined;

      // Printing
      // new Date().toLocaleDateString()

      try {
        await form.validateFields();
        const { data } = await updateRoute({
          variables: { id: route.id, expiresISO },
        });
        hideNewVerifiedEmailPopover();

        // TODO update message here
        message.success(`Expiration updated`);
        onSuccess({ modifiedRouteID: route.id });
      } catch {
        return;
      }
    },
    [form, hideNewVerifiedEmailPopover, onSuccess]
  );

  return (
    <Popover
      content={
        <React.Fragment>
          <ErrorAlert error={updateRouteError} />
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
                  loading={updateRouteLoading}
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
        size="small"
        icon={<EditOutlined />}
        onClick={() => console.log("editing...")}
      />
    </Popover>
  );
};

export default memo(ModifyRouteExpiryDateButtonAndPopover);
