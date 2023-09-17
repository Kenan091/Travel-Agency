import React from 'react';
import styles from '../css/MainSection.module.css';
import { Carousel } from './Carousel';
import { destinations, reviews } from '../helpers/carouselData';

const MainSection = () => {
  return (
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>Welcome to travelist!</h1>
        <h2 className={styles.title}>Swipe through our special offers:</h2>
        <Carousel items={destinations} />
        <h2 className={styles.title}>
          Browse and find your dream travel destination:
        </h2>
        <button className={styles.mainButton}>Go to destinations</button>
        <div className={styles.aboutUsContainer}>
          <h2 className={styles.mainTitle}>About us</h2>
          <p className={styles.text}>
            Our travel agency is dedicated to providing the best travel
            experiences for our customers. We specialize in creating
            personalized itineraries that cater to your unique interests and
            preferences. Our team of experienced travel agents has extensive
            knowledge of destinations around the world and can help you plan the
            perfect trip. Whether you’re looking for a relaxing beach vacation,
            an adventurous trek through the mountains, or a cultural tour of a
            new city, we’ve got you covered. Let us take care of all the details
            so you can sit back, relax, and enjoy your travels.
          </p>
        </div>
        <div className={styles.experiencesContainer}>
          <h2 className={styles.mainTitle}>Experiences</h2>
          <h3 className={styles.title}>Hear from fellow travellers! </h3>
          <Carousel items={reviews} />
        </div>
        <div className={styles.contactUsContainer}>
          <h2 className={styles.mainTitle}>Contact us</h2>
          <p className={styles.title}>
            Having any questions, requests or impression?
          </p>
          <button className={styles.mainButton}>Contact Us</button>
        </div>
      </div>
    </>
  );
};

export default MainSection;
