import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.css';
import { resetPassword } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';

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
        setTimeout(() => {
          navigate('/auth/login');
        }, 6000);
      }
    }
  };

  console.log(password);

  return (
    <div className={styles.container}>
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
