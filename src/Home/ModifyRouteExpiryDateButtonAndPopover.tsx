import {
  Button,
  DatePicker,
  Form,
  Modal,
  Radio,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { memo, useCallback, useState } from "react";

import { EditOutlined } from "@ant-design/icons";
import ErrorAlert from "../lib/ErrorAlert";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm } from "antd/lib/form/util";
import { useUpdateRouteMutation } from "./generated/UpdateRouteMutation";

dayjs.extend(relativeTime);

type ModifyRouteExpiryDateButtonAndPopoverProps = {
  route: { expiresISO?: string | null; id: string };
  mailMaskEmail: string;
  onSuccess: ({ modifiedRouteID }: { modifiedRouteID: string }) => void;
};

const ModifyRouteExpiryDateButtonAndPopover: React.FC<ModifyRouteExpiryDateButtonAndPopoverProps> = ({
  route,
  mailMaskEmail,
  onSuccess,
}) => {
  const [form] = useForm();

  const [
    updateRoute,
    { error: updateRouteError, loading: updateRouteLoading },
  ] = useUpdateRouteMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = useCallback(() => setModalVisible(false), [
    setModalVisible,
  ]);

  const options: {
    key: string;
    value: string;
    label: string;
  }[] = [
    ...(route.expiresISO
      ? [
          {
            key: "current",
            value: route.expiresISO,
            label: dayjs().to(dayjs(route.expiresISO)),
          },
        ]
      : []),
    {
      key: "expire-now",
      value: "now",
      label: "now",
    },
    {
      key: "never",
      value: "never",
      label: "never",
    },
    {
      key: "in-a-day",
      value: dayjs()
        .add(1, "day")
        .toISOString(),
      label: "in 1 day",
    },
    {
      key: "in-a-week",
      value: dayjs()
        .add(1, "week")
        .toISOString(),
      label: "in 1 week",
    },
    {
      key: "in-a-month",
      value: dayjs()
        .add(1, "month")
        .toISOString(),
      label: "in 1 month",
    },
    {
      key: "in-a-year",
      value: dayjs()
        .add(1, "year")
        .toISOString(),
      label: "in 1 year",
    },
    {
      key: "custom",
      value: "custom",
      label: "",
    },
  ];

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const showEditRouteExpiryModal = useCallback(() => setModalVisible(true), [
    setModalVisible,
  ]);

  const handleOk = useCallback(async () => {
    let update = {};
    if (form.getFieldValue("duration") === "never") {
      update = {
        clearExpiresISO: true,
      };
    } else if (form.getFieldValue("duration") === "now") {
      update = {
        expiresISO: dayjs().toISOString(),
      };
    } else if (form.getFieldValue("duration") === "custom") {
      update = {
        expiresISO: dayjs(
          form.getFieldValue("customDurationISO")
        ).toISOString(),
      };
    } else {
      update = {
        expiresISO: dayjs(form.getFieldValue("duration")).toISOString(),
      };
    }

    try {
      await form.validateFields();
      await updateRoute({
        variables: {
          id: route.id,
          ...update,
        },
      });
      hideModal();

      // TODO update message here
      message.success(`Expiration updated`);
      onSuccess({ modifiedRouteID: route.id });
    } catch {
      return;
    }
  }, [form, hideModal, onSuccess, route.id, updateRoute]);

  const handleCancel = useCallback(() => setModalVisible(false), [
    setModalVisible,
  ]);

  return (
    <React.Fragment>
      <Button
        type="link"
        size="small"
        icon={<EditOutlined />}
        onClick={showEditRouteExpiryModal}
      />
      <Modal
        title="Stop-forwarding Date"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          loading: updateRouteLoading,
          disabled:
            updateRouteLoading ||
            form.getFieldsError().filter(({ errors }) => errors.length).length >
              0,
        }}
      >
        <React.Fragment>
          <ErrorAlert error={updateRouteError} />
          <div style={{ marginBottom: "12px" }}>
            <Typography.Text>
              When should we stop forwarding email to{" "}
              <Typography.Text strong>{mailMaskEmail}</Typography.Text>?
            </Typography.Text>
          </div>
          <Form
            form={form}
            name="horizontal_add_verified_email"
            onFinish={handleOk}
            initialValues={{
              duration: route.expiresISO,
              customDurationISO: "",
            }}
          >
            <Form.Item
              name="duration"
              shouldUpdate={true}
              rules={[
                {
                  required: true,
                  message: "Please select when this Mail Mask should expire",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value === "custom") {
                      const customDurationISO = getFieldValue(
                        "customDurationISO"
                      );
                      if (!customDurationISO) {
                        return Promise.reject(
                          "Please choose a custom duration"
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Radio.Group>
                {options.map(({ key, value, label }, index) => (
                  <Radio
                    value={value}
                    key={key}
                    style={radioStyle}
                    autoFocus={index === 0}
                  >
                    {key === "custom" ? (
                      <React.Fragment>
                        <DatePicker
                          onChange={(date) => {
                            form.setFieldsValue({
                              customDurationISO: date?.toISOString(),
                              duration: value,
                            });
                          }}
                        />
                      </React.Fragment>
                    ) : (
                      <Tooltip
                        title={() => {
                          if (key === "never") {
                            return "Emails will be forwarded indefinitely";
                          }
                          if (key === "expire-now") {
                            return "We will stop forwarding emails immediately";
                          }
                          return new Date(value).toLocaleDateString();
                        }}
                        placement="right"
                      >
                        <span>{label}</span>
                      </Tooltip>
                    )}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};

export default memo(ModifyRouteExpiryDateButtonAndPopover);
