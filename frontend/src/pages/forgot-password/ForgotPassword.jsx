import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './ForgotPassword.module.css';
import { forgotPassword } from '../../redux/auth/authSlice';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const isError = useSelector(state => state?.auth?.isError);
  const message = useSelector(state => state?.auth?.message);

  const handleForgotPassword = e => {
    e.preventDefault();

    if (email === '') {
      toast.warn('You need to enter email to continue!');
    } else {
      dispatch(forgotPassword(email));
      if (isError) {
        toast.error(message);
      } else {
        toast.info(
          "An email with instructions to reset your password has been sent to the provided email address. Please check your inbox. If you don't see the email within a few minutes, please check your spam folder."
        );
        setEmail('');
      }
    }
  };

  useEffect(() => {
    if (!isError && message) {
      setEmail('');
    }
  }, [isError, message]);

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
            src='../images/logo.png'
            alt='Travelist logo'
            className={styles.logo}
          />
        </Link>
      </div>
      <div className={styles.content}>
        <div className={styles.imgWrapper}>
          <img
            src='../images/forgotPasswordCover.jpg'
            alt='Forgot password'
          />
        </div>
        <div className={styles.rightSide}>
          <h1>Forgot Password?</h1>
          <h3>Enter the email address associated with your account.</h3>
          <form
            className={styles.form}
            onSubmit={handleForgotPassword}>
            <input
              type='email'
              placeholder='Enter your email'
              autoComplete='off'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <button type='submit'>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
