import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Header.module.css';
import { logoutUser, reset } from '../../redux/auth/authSlice';
import { IoPerson } from 'react-icons/io5';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.auth);

  const userRole = user?.user?.role;

  const onLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    navigate('/');
  };

  const handleNavigateToAccountDetails = () => {
    navigate('/auth/me');
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <Link
          to='/'
          className={styles.logoContainer}>
          <img
            src='../images/logo.png'
            alt='Travelist logo'
            className={styles.logo}
          />
        </Link>
        <div
          className={`${styles.hamburgerMenu} ${menuOpen ? styles.open : ''}`}
          onClick={toggleMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <div className={`${styles.navList} ${menuOpen ? styles.open : ''}`}>
          <ul className={styles.navigationLinks}>
            {user && userRole === 'admin' ? (
              <>
                <li>
                  <NavLink
                    to='/admin/destinations'
                    className={styles.navLink}>
                    Destinations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/admin/bookings'
                    className={styles.navLink}>
                    Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/admin/feedback'
                    className={styles.navLink}>
                    Feedback
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/admin/users'
                    className={styles.navLink}>
                    Users
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to='/'
                    exact='true'
                    className={styles.navLink}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/destinations'
                    exact='true'
                    className={styles.navLink}>
                    Destinations
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to='/experiences'
                    className={styles.navLink}>
                    Experiences
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to='/contact-us'
                    className={styles.navLink}>
                    Contact us
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className={styles.buttonContainer}>
            {user ? (
              <>
                <button
                  onClick={onLogout}
                  className={styles.buttonOne}>
                  Log Out
                </button>
                {userRole === 'registeredUser' ? (
                  <button
                    onClick={handleNavigateToAccountDetails}
                    className={styles.username}>
                    <IoPerson size={24} />
                  </button>
                ) : (
                  <div style={{ display: 'no' }}></div>
                )}
              </>
            ) : (
              <>
                <Link
                  to='/auth/login'
                  className={styles.buttonOne}>
                  Log In
                </Link>

                <Link
                  to='/auth/register'
                  className={styles.buttonTwo}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
