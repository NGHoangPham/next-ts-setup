import { FC, useState } from 'react';
import styles from './styles.module.css';
import { Steps } from 'components/Steps';
import PersonalInfoForm from './components/PersonalInfoForm';
import { Button, message, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import UploadDocument from './components/UploadDocument';
import Congratulation from './components/Congratulation';
import { createKYCUploadPromises, getPresignedUrl, verifyUser } from 'api/kyc';
import { useMutation } from 'react-query';
import { useUser } from '@auth0/nextjs-auth0';

const { Step } = Steps;

// interface TKYCData {
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   birthday: string;
//   address: string;
//   city: string;
//   prefectures: string;
//   country: string;
//   countryCode: number;
//   postcode: string;
//   usCitizen: boolean;
// }

const IdentifyVerification: FC = () => {
  const [current, setCurrent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { user } = useUser();
  const [data, setData] = useState<any>({
    // firstName: "Nhi",
    // lastName: "Le",
    // phoneNumber: "0999900099",
    // birthday: "",
    // address: "Da Nang",
    // city: "Ngu Hanh Son",
    // prefectures: "Hoa Hai",
    // country: "VN",
    // countryCode: "84",
    // postcode: "55000",
    // usCitizen: false,
    // documentType: 1,
    // identityNumber: 9999000999,
    // front: undefined,
    // back: undefined,
    // selfie: undefined,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthday: '',
    address: '',
    city: '',
    prefectures: '',
    country: '',
    countryCode: '',
    postcode: '',
    usCitizen: false,
    documentType: 0,
    identityNumber: undefined,
    front: undefined,
    back: undefined,
    selfie: undefined,
  });

  const { mutateAsync: mutateGetPresignedURL } = useMutation(getPresignedUrl);
  const { mutateAsync: mutateVerifyUser } = useMutation(verifyUser);
  const onFinish = async (tempData: any) => {
    try {
      setLoading(true);
      const presignedUrl = await mutateGetPresignedURL({
        sub: user?.sub || '',
      });
      await Promise.all(createKYCUploadPromises(presignedUrl, tempData));
      await mutateVerifyUser({
        ...tempData,
        sub: user?.sub || '',
      });
      setCurrent(2);
    } catch (error: any) {
      message.error('Identify failed! Please try again!');
    }
    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <div className={clsx('f-end', styles.howTo)}>
        <Button type="text">
          <Space className="secondary">
            How To <FontAwesomeIcon icon={faQuestionCircle} />
          </Space>
        </Button>
      </div>

      <h1 className={styles.title}>IDENTITY VERIFICATION</h1>
      <p className="primary text-18 center">Your identity will be verified manually</p>

      <Steps className={styles.stepper} labelPlacement="vertical" current={current}>
        <Step title="Personal Info" />
        <Step title="Document" />
        <Step title="Get Verified" />
      </Steps>

      {current === 0 ? (
        <PersonalInfoForm
          onSuccess={() => {
            setCurrent(1);
          }}
          kycData={[data, setData]}
        />
      ) : null}
      {current === 1 ? <UploadDocument isLoading={isLoading} onSuccess={onFinish} kycData={[data, setData]} /> : null}
      {current === 2 ? <Congratulation /> : null}
    </div>
  );
};

export default IdentifyVerification;
