import {
  Alert,
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

import ErrorAlert from "../lib/ErrorAlert";
import { MeQuery } from "./generated/MeQuery";
import dayjs from "dayjs";
import { deconstructMailMask } from "../lib/common/deconstructMailMask";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm } from "antd/lib/form/util";
import useIsMobile from "../lib/useIsMobile";
import useLocalStorage from "../lib/useLocalStorage";
import { useUpdateRouteMutation } from "./generated/UpdateRouteMutation";

dayjs.extend(relativeTime);

type ModifyRouteExpiryDateButtonAndPopoverProps = {
  route: { expiresISO?: string | null; id: string };
  mailMask: MeQuery["me"]["user"]["emailMasks"][0];
  onSuccess: ({ modifiedRouteID }: { modifiedRouteID: string }) => void;
  triggerText: string;
};

const ModifyRouteExpiryDateButtonAndPopover: React.FC<ModifyRouteExpiryDateButtonAndPopoverProps> = ({
  route,
  mailMask,
  onSuccess,
  triggerText,
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

  const isMobile = useIsMobile();

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

  const [
    hideAutoExpiringMailMasksTip,
    setHideAutoExpiringMailMasksTip,
  ] = useLocalStorage("hideAutoExpiringMailMasksTip", false);

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

  const { expiryToken: currentMailMaskExpiryToken } = deconstructMailMask({
    email: `${mailMask.alias}@${mailMask.domain}`,
  });

  return (
    <React.Fragment>
      <Button
        type="link"
        size="small"
        onClick={showEditRouteExpiryModal}
        style={{ padding: 0 }}
      >
        {triggerText}
      </Button>
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
          <div style={{ marginBottom: "12px" }}>
            <Typography.Text>
              When should we stop forwarding email to{" "}
              <Typography.Text strong>
                {mailMask.alias}@{mailMask.domain}
              </Typography.Text>
              ?
            </Typography.Text>
          </div>
          <Form
            form={form}
            name="horizontal_add_verified_email"
            onFinish={handleOk}
            initialValues={{
              duration: route.expiresISO ?? "never",
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
              <Radio.Group style={{ display: "flex", flexWrap: "wrap" }}>
                {options.map(({ key, value, label }, index) => (
                  <div style={{ width: isMobile ? "100%" : "50%" }} key={key}>
                    <Radio
                      value={value}
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
                  </div>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
          <ErrorAlert error={updateRouteError} />
          {!hideAutoExpiringMailMasksTip && !currentMailMaskExpiryToken && (
            <Alert
              message={
                <div>
                  <p>
                    <strong>Create auto-stopping Mail Masks on-the-fly</strong>
                  </p>
                  <p>
                    Just add ".7d" to any existing Mail Mask and it will be
                    created automatically whenever it receives its first email
                    (no need to create this Mail Mask in advance!). Then, it
                    will auto-stop forwarding after 7 days.
                  </p>
                  <p>
                    <em>Try it now by just sending an email to:</em>
                    <br />
                    <Typography.Text
                      copyable={{
                        text: `${mailMask.alias}.7d@${mailMask.domain}`,
                      }}
                    >
                      <a
                        href={`mailto:${mailMask.alias}.7d@${mailMask.domain}`}
                      >
                        {`${mailMask.alias}.7d@${mailMask.domain}`}
                      </a>
                      .
                    </Typography.Text>
                  </p>
                  <p>
                    You can also specify auto-stop behavior in hours (".12h"),
                    weeks (".2w"), months (".6m"), and years (".1y").
                  </p>
                </div>
              }
              type="info"
              showIcon
              closable
              onClose={() => setHideAutoExpiringMailMasksTip(true)}
            />
          )}
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};

export default memo(ModifyRouteExpiryDateButtonAndPopover);
