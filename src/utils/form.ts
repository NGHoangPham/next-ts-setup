/* eslint-disable import/no-extraneous-dependencies */
import { message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { StoreValue } from 'rc-field-form/lib/interface';
import { i18n } from 'next-i18next';
import { isServer } from 'utils/constant';

export const onFinishFailed = (e: any) => {
  message.error(e.errorFields[0].errors[0]);
};

export const validateMessages = {
  required: 'form.validate:required',
};

export const onImagePreview = (data: UploadFile) => {
  if (data.originFileObj && !isServer()) {
    // FIXME: This WILL cause memory leak without cleanup
    const previewUrl = URL.createObjectURL(data.originFileObj);
    window.open(previewUrl);
  } else if (data.url) {
    window.open(data.url);
  }
  return false;
};

export const getUploadValueProps = (value: StoreValue) => {
  if (typeof value === 'string') {
    return {
      fileList: [
        {
          uid: '-1',
          status: 'done',
          url: value, // is imageUrl
          name: value.substring(value.lastIndexOf('/') + 1),
        },
      ],
    };
  }
  return { fileList: value }; // maybe array of fileList
};

export const getUploadValueFromEvent = (value: any) => {
  // FIXME: possibly upstream bug: https://github.com/ant-design/ant-design/issues/2423
  // flaky behavior here!
  // BUG: React dont know fileList has changed
  return value.fileList;
};

export const getUploadValueFromEventWithValidate = (originalValueFn: any, { fileTypes, maxFileSize }: any) => {
  return (value: any) => {
    if (value.fileList.length === 0) return [];
    const { file } = value;
    if (fileTypes && !fileTypes.includes(file.type)) {
      // validate file type
      message.error(
        i18n?.t('error.file_unaccepted', {
          fileTypes: fileTypes.map((ft: string) => ft.split('/')[1]).join(', '),
        })
      );
      // antd acts weird if we return falsy value
      return originalValueFn() || [];
    }
    if (maxFileSize && file.size > maxFileSize) {
      message.error(
        i18n?.t('error.file_large', {
          size: `${maxFileSize / 1000000}MB`,
        })
      );
      // antd acts weird if we return falsy value
      return originalValueFn() || [];
    }
    return getUploadValueFromEvent(value);
  };
};
