import { List, Spin, Typography } from "antd";

import ErrorMessage from "../lib/ErrorMessage";
import { Link } from "react-router-dom";
import React from "react";
import { useMeQuery } from "./generated/MeQuery";

const { Title } = Typography;

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-and-network"
  });

  if (loading) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (data) {
    return (
      <React.Fragment>
        <Title level={2}>Email Masks</Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no email masks.{" "}
                <Link to="/masks/create">Create one now?</Link>
              </div>
            )
          }}
          dataSource={[...data.me.user.emailMasks]}
          renderItem={emailMask => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/masks/${emailMask.id}`}>
                    {emailMask.base}@{emailMask.domain}
                  </Link>
                }
                description="Potential description goes here"
              />
            </List.Item>
          )}
        />
        <Title level={2}>Verified Email Addresses</Title>
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
            )
          }}
          dataSource={[...data.me.user.verifiedEmails]}
          renderItem={verifiedEmail => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/masks/${verifiedEmail.id}`}>
                    {verifiedEmail.email}
                  </Link>
                }
                description={
                  verifiedEmail.verified ? (
                    "Verified"
                  ) : (
                    <div>
                      Awaiting verification...{" "}
                      <Link to="">Resend verification email?</Link>
                    </div>
                  )
                }
              />
            </List.Item>
          )}
        />
        <Title level={2}>Routes</Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no routes.{" "}
                <Link to="/routes/new">Create one now?</Link>
              </div>
            )
          }}
          dataSource={[...data.me.user.routes]}
          renderItem={route => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/masks/${route.id}`}>
                    Redirect emails received at {route.emailMask.base}@
                    {route.emailMask.domain} to{" "}
                    {route.redirectToVerifiedEmail.email}
                  </Link>
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