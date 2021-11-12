import React, { useState, useRef } from 'react';
import { Surface } from 'components/Surface';
import styles from './FileUpload.module.css';
import clsx from 'clsx';
import { Row, Col, Upload } from 'antd';
import { Button } from 'components/Button';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface FileUploadProps {
  label?: string;
  description?: string;
  lists?: string[];
  style?: React.CSSProperties;
  background?: string;
  backgroundHeight?: number;
  onChangeFile?: Function;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  lists,
  style,
  background,
  backgroundHeight,
  onChangeFile,
}) => {
  const [file, setFile] = useState<UploadFile>();
  const uploader = useRef();

  const onChange = (info: UploadChangeParam) => {
    setFile(info.file);
    if (onChangeFile) {
      onChangeFile(info.file);
    }
    return false;
  };

  const beforeUpload = () => {
    return false;
  };

  return (
    <Surface className={clsx(styles.container, null)} style={style}>
      <label className={clsx(styles.label)}>{label}</label>
      <p className={clsx(styles.description)}>{description}</p>
      {lists ? (
        <ul className={clsx(styles.list)}>
          {lists.map((txt, pos) => (
            <li key={pos}>{txt}</li>
          ))}
        </ul>
      ) : null}
      <Upload
        name="upload"
        className={clsx(styles.uploader)}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onChange}
        ref={uploader}
        maxCount={1}
        accept="image/png, image/jpeg"
      >
        <div className={clsx(styles.backgroundWrap)}>
          {file ? (
            <img className={clsx(styles.uploadFileImage)} alt="preview" src={URL.createObjectURL(file)} />
          ) : background ? (
            <img
              className={clsx(styles.uploadBackground)}
              alt="preview"
              src={background}
              style={{ height: backgroundHeight }}
            />
          ) : null}
          {/* {file !== null ? <p>{file?.name}</p> : null} */}
        </div>
        <Row justify="end">
          <Col>
            <Button type="primary" size="small">
              Upload
            </Button>
          </Col>
        </Row>
      </Upload>
    </Surface>
  );
};
