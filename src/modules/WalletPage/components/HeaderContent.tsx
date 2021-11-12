import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import styles from './Header.module.css';
import { Surface } from 'components/Surface';
import { PercentIndicator } from 'components/Statistic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { HIDE_XEX_WALLET } from '../constants';
import { WalletTableItem } from 'api/wallet/types';
import { nDecimalFormat } from 'utils/number';
import { MarketGroupItem } from 'api/market/types';
import { priceByCurrency } from 'utils/currency';
import { useAppSelector } from 'hooks';

interface HeaderContentProps {
  assessment: string;
  coins: WalletTableItem[];
  marketList: MarketGroupItem[];
}

const HeaderContent: FC<HeaderContentProps> = ({ assessment, coins, marketList }) => {
  const { t } = useTranslation();
  const { currentCurrency } = useAppSelector((state) => state.account);
  const [assessmentResult, setAssessment] = useState('');
  const [totalNumber, setTotalNumber] = useState('');

  useEffect(() => {
    const assessmentNumber = parseFloat(assessment) || 0;
    let xexAssessment: string | undefined = '0';
    if (HIDE_XEX_WALLET && coins) {
      xexAssessment = coins.find((el) => el.coinType === 'XEX')?.assessment;
    }
    const result: number =
      assessmentNumber - priceByCurrency(parseFloat(xexAssessment || '0'), JSON.parse(currentCurrency).rate);
    setAssessment(`
      ~${JSON.parse(currentCurrency).symbol} ${!result ? '0.00' : nDecimalFormat(result.toString(), 2)}`);

    let btcPrice: number | undefined = 0;
    if (marketList.length > 0) {
      btcPrice = parseFloat(marketList.find((i) => i.pair.split('_')[0] === 'BTC')?.lastTradePrice || '0');
    }
    const totalResult: number = btcPrice ? (assessmentNumber - parseFloat(xexAssessment || '0')) / btcPrice : 0;
    setTotalNumber(`
      ${!totalResult ? '0.00' : nDecimalFormat(totalResult.toString(), 8)}
    `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, marketList]);

  return (
    <div className={clsx(styles.titleContainer, 'f-between')}>
      <Space direction="vertical" size={20}>
        <div className="text-22 weight-900">{t('walletpage.header_content.title')}</div>
        <div>
          <span className="secondary">{t('walletpage.header_content.account_balance')}</span>
          <div className="right">
            <span className="text-28 bold">
              {totalNumber} <span className="medium text-26">BTC</span>
            </span>
            <p className="secondary text-20">
              {assessmentResult}
              <span className="text-18 secondary">USD</span>
            </p>
          </div>
        </div>
      </Space>
      <Space direction="vertical" size={20}>
        <Space size={10}>
          <Typography.Text>{t('walletpage.header_content.deposit_history')}</Typography.Text>
          <FontAwesomeIcon icon={faArrowRight} />
        </Space>
        <Surface className={clsx(styles.pnlWrapper, 'd-flex f-column f-align-end')}>
          <div>
            <div className="secondary">Yesterday&apos;s PNL:</div>
            <span className="medium text-18">
              <span className="text-20">- $</span> 243.05
            </span>
            <span> USD</span>
          </div>
          <PercentIndicator value="-12.5%" className={styles.percentInd} />
        </Surface>
      </Space>
    </div>
  );
};

export default HeaderContent;
