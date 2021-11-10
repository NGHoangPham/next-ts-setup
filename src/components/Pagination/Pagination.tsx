import { Pagination as AntdPagination } from 'antd';
import { forwardRef } from 'react';
import styles from './PaginationForm.module.css';

export const PaginationForm = forwardRef<HTMLInputElement, any>(function Pagination({ ...props }, ref) {
  return (
    <div className={styles.root}>
      <AntdPagination className={styles.pagination} {...props} ref={ref} />
    </div>
  );
});
