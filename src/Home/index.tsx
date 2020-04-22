import { Button, List, Spin, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";

import ErrorMessage from "../lib/ErrorMessage";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { useMeQuery } from "./generated/MeQuery";
import { useResendVerificationEmailMutation } from "./generated/ResendVerificationEmail";

const { Title } = Typography;

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-and-network",
  });
  const [
    resendVerificationEmail,
    {
      data: resendVerificationEmailData,
      loading: resendVerificationEmailLoading,
      error: resendVerificationEmailError,
    },
  ] = useResendVerificationEmailMutation();
  const history = useHistory();

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, - 50%)",
        }}
      />
    );
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (data) {
    return (
      <React.Fragment>
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Email Masks
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/masks/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no email masks.{" "}
                <Link to="/masks/new">Create one now?</Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.emailMasks]}
          renderItem={(emailMask) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    {emailMask.alias}@{emailMask.domain}
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Verified Email Addresses
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/verified-emails/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no verified emails addresses.{" "}
                <Link to="/verified-emails/new">
                  Verify your email address now?
                </Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.verifiedEmails]}
          renderItem={(verifiedEmail) => (
            <List.Item>
              <List.Item.Meta
                title={verifiedEmail.email}
                description={
                  verifiedEmail.verified ? (
                    "Verified"
                  ) : (
                    <div>
                      Awaiting verification...{" "}
                      {!resendVerificationEmailData && (
                        <Button
                          type="link"
                          onClick={() => {
                            resendVerificationEmail({
                              variables: { email: verifiedEmail.email ?? "" },
                            });
                          }}
                        >
                          Resend verification email?
                        </Button>
                      )}
                      {resendVerificationEmailLoading && "Sending..."}
                      {resendVerificationEmailData && "Sent!"}
                      {resendVerificationEmailError &&
                        `Error: ${resendVerificationEmailError.message}`}
                    </div>
                  )
                }
              />
            </List.Item>
          )}
        />
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Routes
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/routes/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no routes.{" "}
                <Link to="/routes/new">Create one now?</Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.routes]}
          renderItem={(route) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    Redirect emails received at {route.emailMask.alias}@
                    {route.emailMask.domain} to{" "}
                    {route.redirectToVerifiedEmail.email}
                  </div>
                }
                description={"Never expires"}
              />
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default Home;
