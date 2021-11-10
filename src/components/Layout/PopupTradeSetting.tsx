import { FC } from 'react';
import { Col, Modal, Row, Switch } from 'antd';
import styles from './PopupTradeSetting.module.css';
import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined';
import { SelectWithLabel, Option } from 'components/Select';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setExchange } from 'store/ducks/system/slice';

interface Modal2FAProps {
  visible: boolean;
  onCancel: () => void;
}

interface SwitcherProps {
  title: string;
  name: string;
  value: boolean;
  handleChangeSetting: Function;
}

const Switcher = ({ title, name, value, handleChangeSetting }: SwitcherProps) => {
  return (
    <div className={styles.switcher}>
      <div className={styles.title}>{title}</div>
      <div className="switchBtn">
        <Switch checked={value} onChange={(value) => handleChangeSetting(name, value)} />
      </div>
    </div>
  );
};

export const PopupTradeSetting: FC<Modal2FAProps> = ({ visible, onCancel }) => {
  const { exchange } = useAppSelector((state) => state.system);
  const dispatch = useAppDispatch();
  const handleChangeSetting = (name: string, value: boolean) => {
    dispatch(setExchange({ name, value }));
  };
  return (
    <Modal visible={visible} className={styles.root} onCancel={onCancel} centered>
      <div className={styles.header}>
        <SettingOutlined className={styles.settingIcon} />
        <div className={styles.popupTitle}>TRADE PREFERENCES</div>
      </div>
      <div className={styles.inner}>
        <Row gutter={8}>
          <Col span={12} className={styles.selectWrapper}>
            <SelectWithLabel
              value={exchange.language}
              label="Language"
              onChange={(value) => handleChangeSetting('language', value)}
            >
              {['en', 'tr'].map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </SelectWithLabel>
          </Col>
          <Col span={12}>
            <SelectWithLabel
              value={exchange.currency}
              label="Def.Currency"
              onChange={(value) => handleChangeSetting('currency', value)}
            >
              {['BTC', 'ETH', 'USDT'].map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </SelectWithLabel>
          </Col>
        </Row>
        <div className={styles.boxTitle}>Trade Screen Boxes</div>
        <Row gutter={8}>
          <Col span={12}>
            <Switcher
              title="Quick Order"
              value={exchange.quickOrder}
              handleChangeSetting={handleChangeSetting}
              name="quickOrder"
            />
          </Col>
          <Col span={12}>
            <Switcher title="Market" value={exchange.market} name="market" handleChangeSetting={handleChangeSetting} />
          </Col>
          <Col span={12}>
            <Switcher title="Chart" value={exchange.chart} name="chart" handleChangeSetting={handleChangeSetting} />
          </Col>
          <Col span={12}>
            <Switcher
              title="Order Book / Trades"
              value={exchange.orderBook}
              name="orderBook"
              handleChangeSetting={handleChangeSetting}
            />
          </Col>
          <Col span={12}>
            <Switcher
              title="Open Orders"
              value={exchange.openOrders}
              name="openOrders"
              handleChangeSetting={handleChangeSetting}
            />
          </Col>
          <Col span={12}>
            <Switcher
              title="Wallet Snap"
              name="walletSnap"
              value={exchange.walletSnap}
              handleChangeSetting={handleChangeSetting}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
