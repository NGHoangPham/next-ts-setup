import { InputNumberProps as AntdInputNumberProps, InputProps as AntdInputProps } from 'antd';

export type InputProps = Pick<
  AntdInputProps,
  | 'placeholder'
  | 'id'
  | 'disabled'
  | 'defaultValue'
  | 'addonAfter'
  | 'addonBefore'
  | 'prefix'
  | 'size'
  | 'type'
  | 'value'
  | 'onChange'
  | 'onPressEnter'
  | 'className'
>;

export type InputNumberProps = Pick<
  AntdInputNumberProps,
  | 'defaultValue'
  | 'decimalSeparator'
  | 'disabled'
  | 'formatter'
  | 'max'
  | 'min'
  | 'parser'
  | 'precision'
  | 'size'
  | 'step'
  | 'value'
  | 'onChange'
  | 'onPressEnter'
  | 'className'
>;
