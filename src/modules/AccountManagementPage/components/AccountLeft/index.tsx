import { FC } from 'react';
// import { Row, Col } from "antd";

import AccountInformation from './AccountInformation';
import AccountPreference from './AccountPreference';

const AccountLeftComponent: FC = () => {
  return (
    <div>
      <AccountInformation />
      <AccountPreference />
    </div>
  );
};

export default AccountLeftComponent;
