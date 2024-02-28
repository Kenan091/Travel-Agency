import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <p className={styles.text}>
        Travelist, Bosnia and Herzegovina. All rights reserved.
      </p>
      <img
        id={styles.logo}
        src='../images/logoFooter.png'
        alt='Travelist logo without text'
      />
    </div>
  );
};

export default Footer;
