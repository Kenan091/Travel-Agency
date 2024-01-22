import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './ForgotPassword.module.css';
import { forgotPassword } from '../../redux/auth/authSlice';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleForgotPassword = e => {
    e.preventDefault();

    if (email === '') {
      toast.error('You need to enter email to continue!');
    } else {
      dispatch(forgotPassword(email));
      console.log(`Email sent to ${email}`);
    }
  };

  console.log(email);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link to='/auth/login'>
          {' '}
          <IoArrowBack
            size={32}
            color='#d8e1ec'
          />
        </Link>
      </div>
      <div className={styles.imgWrapper}>
        <img
          src='../images/forgotPasswordCover.jpg'
          alt='Forgot password'
        />
      </div>
      <div className={styles.content}>
        <h1>Forgot Password?</h1>
        <h3>Enter the email address associated with your account.</h3>
        <form
          className={styles.form}
          onSubmit={handleForgotPassword}>
          <input
            type='email'
            onChange={e => setEmail(e.target.value)}
          />
          <button type='submit'>Send email</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
