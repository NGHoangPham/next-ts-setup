import React from 'react';
import styles from './PersonalInfoForm.module.css';
import { Form, message, Space } from 'antd';

import { InputWithLabel } from 'components/Input';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';

import { DatePicker } from 'components/DatePicker';
import { SelectWithLabel, Option } from 'components/Select/SelectWithLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { CheckboxWithLabel } from 'components/Checkbox';
import { countriesEn, countriesTr } from 'modules/IdentifyVerification/constant/countries';
import { Avatar } from 'components/Avatar';
import { useAppSelector } from 'hooks';

interface PersonalInfoFormProps {
  onSuccess?: Function;
  kycData: any[];
}
const getFlagImage: any = (countryCode: string) => {
  return `assets/icons/currency/${countryCode.toLowerCase()}.png`;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSuccess, kycData }) => {
  const [data, setData] = kycData;
  let countries: any = countriesTr;
  const { language } = useAppSelector((state) => state.system);

  if (language === 'en-US') {
    countries = countriesEn;
  }
  const onFinish = (values: any) => {
    setData({ ...values, birthday: values.birthday.format('YYYY-MM-DD') });
    if (onSuccess) {
      onSuccess();
    }
  };

  const onFinishFailed = () => {
    message.error('System error!');
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} initialValues={data}>
      <Surface className={styles.surface}>
        <Form.Item label="first name" name="firstName" rules={[{ required: true }]}>
          <InputWithLabel label="FIRST NAME" placeholder="Your First Name " />
        </Form.Item>

        <Form.Item label="last name" name="lastName" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Last Name " label="LAST NAME" />
        </Form.Item>

        <Form.Item label="phone" name="phoneNumber" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Phone " id="phone" label="PHONE" />
        </Form.Item>

        <Form.Item label="birthday" name="birthday" rules={[{ required: true }]}>
          <DatePicker placeholder="Pick The Date" label="BIRTHDAY" />
        </Form.Item>

        <Form.Item label="address" name="address" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Address" label="ADDRESS" />
        </Form.Item>

        <Form.Item label="city" name="city" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your City" id="city" label="CITY" />
        </Form.Item>

        <Form.Item label="prefectures" name="prefectures" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Prefectures" label="PREFECTURES" />
        </Form.Item>

        <Form.Item label="country" name="country" rules={[{ required: true }]}>
          <SelectWithLabel
            showSearch
            placeholder="Pick Your Country"
            label="COUNTRY"
            filterOption={(input: any, option: any) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {countries &&
              Object.keys(countries).map((value: any, index: any) => {
                return (
                  <Option value={countries[value].name} key={index}>
                    <Space size={4} align="center">
                      <Avatar type="secondary" src={getFlagImage(value).default} size={22} />
                      <span>
                        {countries[value].name} {countries[value].dial_code}
                      </span>
                    </Space>
                  </Option>
                );
              })}
          </SelectWithLabel>
        </Form.Item>

        <Form.Item label="country code" name="countryCode" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Country Code" label="COUNTRY CODE" />
        </Form.Item>
        <Form.Item label="postcode" name="postcode" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Your Postcode" label="POSTCODE" />
        </Form.Item>

        <Form.Item name="usCitizen" valuePropName="checked">
          <CheckboxWithLabel label="US CITIZEN" id="uscitizen" />
        </Form.Item>

        <Button htmlType="submit" className={styles.btnSubmit} type="secondary">
          <Space align="center">
            Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Space>
        </Button>
      </Surface>
    </Form>
  );
};

export default PersonalInfoForm;
