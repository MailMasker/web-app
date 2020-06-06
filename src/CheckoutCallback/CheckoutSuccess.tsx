import { Button, Result, Space } from "antd";

import { Link } from "react-router-dom";
import React from "react";

const CheckoutSuccess: React.FC<{}> = () => {
  return (
    <React.Fragment>
      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <Result
          status="success"
          title="You're now using Mail Masker Premium!"
          subTitle="Thanks for your support! You can cancel any time."
          extra={[
            <Link to="/">
              <Button type="primary" key="home">
                Home
              </Button>
            </Link>,
            <Link to="/settings/billing">
              <Button key="billing-plan">Billing & Plan</Button>
            </Link>,
          ]}
        />
      </Space>
    </React.Fragment>
  );
};

export default CheckoutSuccess;
