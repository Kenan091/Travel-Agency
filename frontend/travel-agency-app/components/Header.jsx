import React from 'react';
import styles from '../css/Header.module.css';

const Header = () => {
  return (
    <>
      <div className={styles.headerContainer}>
        <img
          src='images/logo.png'
          alt='Travelist logo'
          id={styles.logo}
        />
        <ul className={styles.navigationLinks}>
          <li>Home</li>
          <li>About us</li>
          <li>Experiences</li>
          <li>Contact us</li>
        </ul>
        <div className={styles.buttonContainer}>
          <button className={styles.buttonOne}>Log In</button>
          <button className={styles.buttonTwo}>Register</button>
        </div>
      </div>
    </>
  );
};

export default Header;
