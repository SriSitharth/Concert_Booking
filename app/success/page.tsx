import React from 'react';
import styles from './success.module.css';

export default function SuccessPage() {
  return (
    <div className={styles.successWrapper}>
      <h1 className={styles.successTitle}>Payment Confirmation</h1>
      <p className={styles.successMessage}>
        Your payment has been confirmed. You may now safely close this page or return to the home page.
      </p>
      <p className={styles.successMessage}>
       You will receive the details via email once the seats are completely booked.
      </p>
      <a href="/" className={styles.successHomeLink}>
        Go to Home
      </a>
    </div>
  );
}
