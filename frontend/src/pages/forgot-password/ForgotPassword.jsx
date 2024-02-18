import { useState } from 'react';
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
        toast.info(`Email sent to ${email}. Check your inbox for reset url!`);
      }
    }
  };

  console.log(email);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link to='/auth/login'>
          <IoArrowBack
            size={32}
            color='#d8e1ec'
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
            />
            <button type='submit'>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
