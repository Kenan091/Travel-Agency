import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.css';
import { resetPassword } from '../../redux/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isError = useSelector(state => state?.auth?.isError);
  const message = useSelector(state => state?.auth?.message);

  const handleResetPassword = e => {
    e.preventDefault();

    if (password === '') {
      toast.warn('You need to enter your new password!');
    } else {
      dispatch(resetPassword(password));
      if (isError) {
        toast.error(message);
      } else {
        toast.info(`Password reset completed. Login with your new password!`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topPart}>
        <div className={styles.backButton}>
          <Link to='/auth/login'>
            <IoArrowBack
              size={32}
              color='#d8e1ec'
            />
          </Link>
        </div>
        <Link
          to='/'
          className={styles.logoContainer}>
          <img
            src='/public/images/logo.png'
            alt='Travelist logo'
            className={styles.logo}
          />
        </Link>
      </div>
      <div className={styles.content}>
        <h1>Reset Password</h1>
        <h3>Set your new password</h3>
        <form
          className={styles.form}
          onSubmit={handleResetPassword}>
          <input
            type='password'
            placeholder='Enter new password'
            onChange={e => setPassword(e.target.value)}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
