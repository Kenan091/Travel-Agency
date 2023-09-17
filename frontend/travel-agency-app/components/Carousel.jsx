import React, { useState } from 'react';
import styles from '../css/Carousel.module.css';
import {
  IoArrowBack,
  IoArrowForward,
  IoCashSharp,
  IoLocationSharp,
} from 'react-icons/io5';

export const Carousel = ({ items }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const itemsPerPage = 4;

  const onArrowClick = direction => {
    setCurrentItem((currentItem + items.length + direction) % items.length);
  };

  return (
    <div className={styles.carousel}>
      {currentItem > 0 && (
        <button
          className={styles.leftArrow}
          onClick={() => onArrowClick(-1)}>
          <IoArrowBack size={32} />
        </button>
      )}
      {currentItem < items.length - itemsPerPage && (
        <button
          className={styles.rightArrow}
          onClick={() => onArrowClick(1)}>
          <IoArrowForward size={32} />
        </button>
      )}
      <div className={styles.carouselContainer}>
        <div className={styles.carouselContent}>
          {items
            .slice(currentItem, currentItem + itemsPerPage)
            .map((item, index) => (
              <div
                key={index}
                className={styles.carouselItem}>
                {item.price ? (
                  <div
                    key={item.id}
                    className={styles.destinationCard}>
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                    />
                    <div className={styles.destinationInfo}>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div>
                        <div className={styles.price}>
                          <IoCashSharp size={24} />
                          <p>{item.price}</p>
                        </div>
                        <div className={styles.address}>
                          <IoLocationSharp size={24} />
                          <p>{item.address}</p>
                        </div>
                      </div>
                      <div className={styles.destinationButton}>
                        <button>See More</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className={styles.review}>
                    <h2 className={styles.name}>By: {item.reviewerName}</h2>
                    <div className={styles.rating}>
                      {Array.from({ length: item.rating }, (_, i) => (
                        <span
                          key={i}
                          className={styles.star}>
                          ⭐️
                        </span>
                      ))}
                    </div>
                    <img
                      src='../public/images/quotationMark.png'
                      alt='quotation mark'
                      id={styles.quotationMark}
                    />
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
