import { Button, Space, Typography } from "antd";

import { Link } from "react-router-dom";
import React from "react";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import useIsPremium from "../lib/useIsPremium";

const { Title } = Typography;

const StartAccountDeletion: React.FC<{}> = () => {
  const isPremium = useIsPremium();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3}>Delete Your Account</Title>
        <Title level={4}>What happens when I delete my account?</Title>
        <ul>
          <li>
            We make every effort to permanently wipe all your data from our
            system.
          </li>
          <li>We delete all of your personally-identifiable from our system</li>
          <li>
            We will give you the opportunity to do a full data export to see a
            snapshot of before and after your account was deleted (this gives
            you a truer sense of what's been deleted, and what remains).
          </li>
        </ul>{" "}
        <Title level={4}>How can I recover my account?</Title>
        <ul>
          <li>
            Once you delete your account, we will assign you an
            impossible-to-guess username. You can recover your account by
            signing back in that new username and your current password.
          </li>
          <li>
            Since we permanently erase your Verified Email addresses, you will
            not be able to reset your password. So it is very important that you
            save your scrambled username and current password if you think you
            will want to undelete your account.
          </li>
          <li>
            We will give you the opportunity to do a full data export to see a
            snapshot of before and after your account was deleted (this gives
            you a truer sense of what's been deleted, and what remains).
          </li>
          <li>
            Should you forget your username or password, our support team is
            unable to help you recover your account, since we will have no way
            to verify your identiy.
          </li>
        </ul>
        <Title level={4}>What happens to my Mail Masks?</Title>
        <ul>
          <li>
            Each of your Mail Masks (ex: tracy@{supportedEmailDomains[0]}) will
            stop forwarding email to you, and instead, emails received will be
            immediately deleted.
          </li>
          <li>
            Since we permanently erase your Verified Email addresses, you will
            not be able to reset your password. So it is very important that you
            save your scrambled username and current password if you think you
            will want to undelete your account.
          </li>
          <li>
            If your recover your account, your Mail Masks will once again be
            usable by you.
          </li>
        </ul>
      </div>
      {isPremium && (
        <p>
          <em>
            To cancel your Premium membership, please{" "}
            <Link to="/help">reach out to us</Link>, as it isn't yet
            automatically canceled when you delete your account. Please also
            feel free to request that we manually wipe as much of your data as
            we can from our payment processor as well.
          </em>
        </p>
      )}
      <Link to="/delete-account">
        <Button danger size="large">
          Begin Account Deletion & Data Export
        </Button>
      </Link>
    </Space>
  );
};

export default StartAccountDeletion;
