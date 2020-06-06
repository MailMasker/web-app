import { Space, Typography } from "antd";

import React from "react";
import supportedEmailDomains from "../../lib/supportedEmailDomains";

interface HelpProps {}

const Help: React.FC<HelpProps> = () => {
  return (
    <Space direction="vertical">
      <Typography.Title>Need help?</Typography.Title>
      <div>
        If you need help at any time, please reach out to us over email. We will
        respond as soon as possible:
      </div>
      <div>
        <Typography.Text
          copyable={{ text: `support@${supportedEmailDomains[0]}` }}
        >
          <a href={`mailto:support@${supportedEmailDomains[0]}`}>
            support@{supportedEmailDomains[0]}
          </a>
        </Typography.Text>
      </div>
    </Space>
  );
};

export default Help;
