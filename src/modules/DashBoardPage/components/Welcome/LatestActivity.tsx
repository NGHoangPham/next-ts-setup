import { FC, useState, useEffect } from 'react';
import styles from './LatestActivity.module.css';
import { Button, List, Space } from 'antd';

import { Surface } from 'components/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFingerprint } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface IActivity {
  activity: string;
  username: string;
  country: string;
  ipAddress: string;
  createdAt: string;
}

const LatestActivity: FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    setActivities(
      Array.from(Array(6).keys()).map((id) => ({
        id,
        activity: 'web',
        username: 'Izmir',
        country: 'Turkey',
        ipAddress: '192.168.255.255',
        createdAt: dayjs().format('HH:mm:ss - DD/MM/YYYY'),
      }))
    );
  }, []);

  return (
    <Surface filled borderMd className={styles.root}>
      <div className="f-between">
        <div className="bold default">LATEST ACTIVITY</div>
        <FontAwesomeIcon icon={faFingerprint} color="#788686" size="lg" />
      </div>
      <div className="divider-x my-8" />

      <List
        className={styles.listActivity}
        split={false}
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<span className={clsx('text-12 light', styles.text_hover)}>{item.activity}</span>}
              description={<span className="text-14 light">{`${item.username}, ${item.country}`}</span>}
            />
            <Space direction="vertical">
              <div className="text-12 light">{item.ipAddress}</div>
              <div className="text-12 light">{item.createdAt}</div>
            </Space>
          </List.Item>
        )}
      />

      <div className="f-end -mr-15">
        <Button size="middle" type="text" className="right">
          <Space>
            See All <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default LatestActivity;
