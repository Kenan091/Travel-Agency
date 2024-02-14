import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Register.module.css';
import { registerUser, reset } from '../../redux/auth/authSlice';
import { IoArrowBack } from 'react-icons/io5';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  console.log(password, confirmPassword);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, message } = useSelector(state => state?.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const handleInputChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      const userData = { name, email, password, role: 'registeredUser' };

      dispatch(registerUser(userData));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link to='/'>
          {' '}
          <IoArrowBack
            size={32}
            color='#d8e1ec'
          />
        </Link>
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
          <Link to='/auth/login'>Log in</Link>
        </span>
      </p>

      <form
        onSubmit={handleRegister}
        className={styles.form}>
        <input
          type='text'
          placeholder='Full name'
          onChange={handleInputChange}
          name='name'
        />
        <input
          type='email'
          placeholder='Email address'
          onChange={handleInputChange}
          name='email'
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleInputChange}
          name='password'
        />
        <input
          type='password'
          placeholder='Confirm password'
          onChange={handleInputChange}
          name='confirmPassword'
        />
        <button
          type='submit'
          className={styles.submitButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
