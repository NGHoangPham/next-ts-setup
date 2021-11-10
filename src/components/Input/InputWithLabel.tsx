import { forwardRef, useState } from 'react';
import { Input as AntdInput, InputProps } from 'antd';
import styles from './InputWithLabel.module.css';
import clsx from 'clsx';
import { SurfaceLabel } from 'components/SurfaceLabel';

const { Password: AntPassword } = AntdInput;
export type ModifiedInputProps = Partial<InputProps> & {
  id?: string;
  label?: string;
  searchForm?: boolean;
};

export const InputWithLabel = forwardRef<AntdInput, ModifiedInputProps>(function Input(
  // { label, id, valid, className, size = "middle", invalid, ...props },
  { label, id, size = 'middle', searchForm, ...props },
  ref
) {
  const inputWithSize = styles[size];
  const isSearchForm = searchForm ? 'searchForm' : '';
  const [isFocused, setFocused] = useState(false);

  return (
    <SurfaceLabel size={size} id={id} label={label} className={isFocused ? styles.surfaceFocused : ''}>
      <AntdInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={ref}
        id={id}
        className={clsx(styles.input, inputWithSize, isSearchForm)}
        {...props}
      />
    </SurfaceLabel>
  );
});

export const PasswordWithLabel = forwardRef<AntdInput, ModifiedInputProps>(
  // function Input({ label, id, className, size = "middle", ...props }, ref) {
  function Input({ label, id, size = 'middle', ...props }, ref) {
    const inputWithSize = styles[`input__${size}`];
    return (
      <SurfaceLabel size={size} id={id} label={label}>
        <AntPassword ref={ref} id={id} className={clsx(styles.input, inputWithSize)} {...props} />
      </SurfaceLabel>
    );
  }
);
