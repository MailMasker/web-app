import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Typography,
  message,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";

import AddVerifiedEmailButtonAndPopover from "./AddVerifiedEmailButtonAndPopover";
import ErrorAlert from "../lib/ErrorAlert";
import { PlusOutlined } from "@ant-design/icons";
import ResendVerificationEmailCTA from "./ResendVerificationEmailCTA";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import { useCreateEmailMaskMutation } from "./generated/CreateEmailMask";
import { useCreateRouteMutation } from "./generated/CreateRouteMutation";
import useIsMobile from "../lib/useIsMobile";
import useLocalStorage from "../lib/useLocalStorage";
import { useMeQuery } from "./generated/MeQuery";
import { useRefreshRoutesAndEmailMasksLazyQuery } from "./generated/RefreshRoutesAndEmailMasksQuery";

type NewMailMaskModalAndButtonProps = {};

const NewMailMaskModalAndButton: React.FC<NewMailMaskModalAndButtonProps> = () => {
  const [form] = Form.useForm();

  const { data: meQueryData } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const firstMailMask =
    meQueryData && meQueryData.me.user.emailMasks.length > 0
      ? meQueryData?.me.user.emailMasks[0]
      : undefined;

  const [
    createEmailMask,
    { loading: createEmailMaskLoading, error: createEmailMaskError },
  ] = useCreateEmailMaskMutation();

  const [
    createRoute,
    { error: createRouteError, loading: createRouteLoading },
  ] = useCreateRouteMutation();

  const [
    refreshRoutesAndEmailMasks,
    {
      error: refreshRoutesAndEmailMasksError,
      loading: refreshRoutesAndEmailMasksLoading,
    },
  ] = useRefreshRoutesAndEmailMasksLazyQuery({ fetchPolicy: "network-only" });

  const [newMaskModalVisible, setNewMaskModalVisible] = useState(false);

  const showNewMaskModal = useCallback(() => setNewMaskModalVisible(true), [
    setNewMaskModalVisible,
  ]);

  const handleNewMaskOk = useCallback(async () => {
    try {
      await form.validateFields();
      const newMailMask = `${form.getFieldValue("alias")}@${form.getFieldValue(
        "domain"
      )}`;
      const { data } = await createEmailMask({
        variables: {
          email: newMailMask,
        },
      });
      await createRoute({
        variables: {
          redirectToVerifiedEmailID: form.getFieldValue(
            "redirectToVerifiedEmailID"
          ),
          emailMaskID: data?.createEmailMask.id ?? "",
        },
      });
      await refreshRoutesAndEmailMasks();
      message.success(`Created Mail Mask ${newMailMask}`);
      setNewMaskModalVisible(false);
    } catch (error) {
      // validation may be a reason for failure
      return;
    }
  }, [
    setNewMaskModalVisible,
    form,
    createEmailMask,
    createRoute,
    refreshRoutesAndEmailMasks,
  ]);

  const handleFormFinish = useCallback(
    (values: any) => {
      console.log("values: ", values);
      handleNewMaskOk();
    },
    [handleNewMaskOk]
  );

  const handleNewMaskCancel = useCallback(() => setNewMaskModalVisible(false), [
    setNewMaskModalVisible,
  ]);

  type FormStore = {
    alias: string;
    domain: string;
    redirectToVerifiedEmailID: string;
  };

  const initialValues: FormStore = {
    alias: "",
    domain: supportedEmailDomains[0],
    redirectToVerifiedEmailID:
      meQueryData && meQueryData.me.user.verifiedEmails.length > 0
        ? meQueryData.me.user.verifiedEmails[0].id
        : "",
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

  const [hideMailMaskCreationTip, setHideMailMaskCreationTip] = useLocalStorage(
    "hideMailMaskCreationTip",
    false
  );

  const isMobile = useIsMobile();

  return (
    <React.Fragment>
      <Button type="primary" icon={<PlusOutlined />} onClick={showNewMaskModal}>
        {isMobile ? "New" : "New Mail Mask"}
      </Button>
      {/* unmount because I was having issues getting the validation to reset upon reopening the modal */}
      {newMaskModalVisible && (
        <Modal
          title="New Mail Mask"
          visible
          onOk={handleNewMaskOk}
          onCancel={handleNewMaskCancel}
          okButtonProps={{
            loading:
              createEmailMaskLoading ||
              createRouteLoading ||
              refreshRoutesAndEmailMasksLoading,
            disabled:
              createEmailMaskLoading ||
              createRouteLoading ||
              refreshRoutesAndEmailMasksLoading ||
              form.getFieldsError().filter(({ errors }) => errors.length)
                .length > 0,
          }}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
            name="newMailMaskForm"
            initialValues={initialValues}
            onFinish={handleFormFinish}
          >
            <Form.Item label="Receive email at" required>
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
                  style={{
                    marginBottom: 0,
                  }}
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
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      <Select placeholder="Select domain">
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
                      marginBottom: 0,
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
                  <div style={{ marginBottom: "10px" }} key={value}>
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
          {firstMailMask && hideMailMaskCreationTip && (
            <Alert
              message={
                <div>
                  <p>
                    <strong>The easiest way to create new Mail Masks</strong>
                  </p>
                  <p>
                    Add ".anything" to your existing Mail Mask and a new one
                    will be created automatically upon receiving its first
                    email.
                  </p>
                  <p>
                    Try it now by just sending an email to:
                    <br />
                    <Typography.Text
                      copyable={{
                        text: `${firstMailMask.alias}.test@${firstMailMask.domain}`,
                      }}
                    >
                      <a
                        href={`mailto:${firstMailMask.alias}.test@${firstMailMask.domain}`}
                      >
                        {`${firstMailMask.alias}.test@${firstMailMask.domain}`}
                      </a>
                    </Typography.Text>
                  </p>
                </div>
              }
              type="info"
              showIcon
              closable
              onClose={() => setHideMailMaskCreationTip(true)}
            />
          )}
          <ErrorAlert
            error={[
              createRouteError,
              createEmailMaskError,
              refreshRoutesAndEmailMasksError,
            ]}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default React.memo(NewMailMaskModalAndButton);
