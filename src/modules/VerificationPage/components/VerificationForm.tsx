import React, { KeyboardEvent, useEffect, useState } from 'react';
import styles from './VerificationForm.module.css';
import { Space } from 'antd';
import { Input } from 'components/Input';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { useRef } from 'react';

const VerificationForm: React.FC = () => {
  const [code, setCode] = useState('______');
  let inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, code.length);
  }, []);

  const handleCodeChange = (data: NumberFormatValues, idx: number) => {
    let nCode = data.value;
    if (!data.value) nCode = '_';
    // Update the code value
    const newCode = code.substring(0, idx) + nCode + code.substring(idx + 1);
    setCode(newCode);

    // Focus on next input
    if (idx + 1 <= code.length && nCode !== '_') {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleDelete = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.keyCode === 8) {
      if (code.charAt(idx) === '_') {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  return (
    <div>
      <Surface className={styles.surface}>
        <div className={styles.headline}>Verification Code:</div>
        <Space size={10}>
          {code.split('').map((item: string, i: number) => (
            <NumberFormat
              getInputRef={(el: HTMLInputElement) => (inputRefs.current[i] = el)}
              key={i}
              value={item}
              className={styles.inputSquare}
              format="#"
              allowEmptyFormatting
              mask="__"
              customInput={Input}
              onValueChange={(value) => handleCodeChange(value, i)}
              onKeyDown={(e) => handleDelete(e, i)}
            />
          ))}
        </Space>
        <Button htmlType="submit" className={styles.btnVerify} type="secondary">
          Verify
        </Button>
      </Surface>
      <Space size="large" align="baseline">
        <Button className={styles.btnSubmit} type="primary">
          Send Again
        </Button>
        <span className={styles.textDescription}>if you didn’t receive the code.</span>
      </Space>
    </div>
  );
};

export default VerificationForm;
