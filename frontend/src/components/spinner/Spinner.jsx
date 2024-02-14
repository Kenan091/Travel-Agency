import styles from './Spinner.module.css';

const Spinner = ({ width, height }) => {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div
        className={styles.loadingSpinner}
        style={{ width: width, height: height }}></div>
    </div>
  );
};

export default Spinner;
