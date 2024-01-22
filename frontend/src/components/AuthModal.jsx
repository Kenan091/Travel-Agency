import React, { useState, useEffect } from 'react';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
import styles from '../css/AuthModal.module.css';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, modalType }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Delay removing the backdrop to allow the closing animation to complete
      const timeoutId = setTimeout(() => {
        setIsClosing(false);
      }, 300); // Adjust the delay based on your closing animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const closeModal = () => {
    setIsClosing(true);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className={`${styles.backdrop} ${
            isClosing ? styles.closing : ''
          }`}></div>
      )}
      {modalType === 'login' ? (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
          <div
            className={styles.closeButton}
            onClick={onClose}>
            <IoClose
              size={32}
              color='red'
            />
          </div>
          <img
            src='../images/logo.png'
            alt='Travelist logo'
            className={styles.logo}
          />
          <h2 className={styles.title}>Log In</h2>
          <p className={styles.text}>
            New user?{' '}
            <span>
              {' '}
              <Link to='auth/register'>Register</Link>
            </span>
          </p>

          <div className={styles.modalInputs}>
            <input
              type='text'
              placeholder='Email address'
            />
            <input
              type='password'
              placeholder='Password'
            />
          </div>

          <p className={styles.forgotPassword}>Forgot your password?</p>

          <button className={styles.modalButton}>Log in</button>
        </div>
      ) : modalType === 'register' ? (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
          <div
            className={styles.closeButton}
            onClick={onClose}>
            <IoClose
              size={32}
              color='red'
            />
          </div>
          <img
            src='../images/logo.png'
            alt='Travelist logo'
            className={styles.logo}
          />
          <h2 className={styles.title}>Register</h2>
          <p className={styles.text}>
            Already have an account?{' '}
            <span>
              {' '}
              <Link to='auth/login'>Log in</Link>
            </span>
          </p>

          <div className={styles.modalInputs}>
            <input
              type='text'
              placeholder='Full name'
            />
            <input
              type='text'
              placeholder='Email address'
            />
            <input
              type='password'
              placeholder='Password'
            />
          </div>

          <button className={styles.modalButton}>Register</button>
        </div>
      ) : null}
    </>
  );
};

export default AuthModal;
