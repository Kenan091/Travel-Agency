import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Carousel.module.css';
import {
  IoArrowBack,
  IoArrowForward,
  IoClose,
  IoStar,
  IoStarHalf,
  IoStarOutline,
} from 'react-icons/io5';
import { RiCoinsFill } from 'react-icons/ri';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa6';
import ReactStars from 'react-rating-stars-component';
import truncateText from '../../helpers/useTruncateText';

export const Carousel = ({ items }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  let itemsArray = Array.isArray(items) ? items : Object.values(items);

  const [showModal, setShowModal] = useState([]);

  useEffect(() => {
    setShowModal(Array(items.length).fill(false));
  }, [items]);

  const toggleModal = index => {
    const newShowModal = [...showModal];
    newShowModal[index] = !newShowModal[index];
    setShowModal(newShowModal);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1530) {
        setItemsPerPage(4);
      } else if (window.innerWidth >= 1220) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 850) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onArrowClick = direction => {
    setCurrentItem((currentItem + items.length + direction) % items.length);
  };

  const handleNavigateToDestinationDetails = id => {
    navigate(`/destinations/${id}`);
    window.scrollTo(0, 0);
  };

  console.log(showModal);

  return (
    <div className={styles.carousel}>
      {currentItem > 0 && (
        <button
          className={styles.leftArrow}
          onClick={() => onArrowClick(-1)}>
          <IoArrowBack size={32} />
        </button>
      )}
      {currentItem < itemsArray.length - itemsPerPage && (
        <button
          className={styles.rightArrow}
          onClick={() => onArrowClick(1)}>
          <IoArrowForward size={32} />
        </button>
      )}
      <div className={styles.carouselContainer}>
        <div className={styles.carouselContent}>
          {itemsArray
            .slice(currentItem, currentItem + itemsPerPage)
            .map((item, index) => (
              <div
                key={item._id}
                className={styles.carouselItem}>
                {item.price ? (
                  <div
                    key={item.id}
                    className={styles.destinationCard}>
                    <img
                      src={item.imageURL}
                      alt={item.name}
                    />
                    <div className={styles.destinationInfo}>
                      <h3>{item.name}</h3>
                      <p>{item.briefDescription}</p>
                    </div>
                    <div className={styles.destinationBottomPart}>
                      <div className={styles.price}>
                        <RiCoinsFill size={24} />
                        <p>{item.price.toFixed(2)} BAM</p>
                      </div>
                      <button
                        className={styles.destinationButton}
                        onClick={() =>
                          handleNavigateToDestinationDetails(item._id)
                        }>
                        See more
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item._id}
                    className={styles.review}>
                    <h2 className={styles.name}>{item?.user?.name}</h2>
                    <h3 className={styles.destinationName}>
                      {item?.destination?.name}
                    </h3>
                    <div className={styles.rating}>
                      <ReactStars
                        count={5}
                        value={parseFloat(item?.rating)}
                        size={24}
                        isHalf={false}
                        emptyIcon={<IoStarOutline />}
                        halfIcon={<IoStarHalf />}
                        fullIcon={<IoStar />}
                        activeColor='#FFD233'
                        edit={false}
                      />
                    </div>
                    <div className={styles.commentParagraph}>
                      <FaQuoteLeft
                        color='#83ab55'
                        className={styles.leftQuote}
                      />
                      <div
                        className={styles.commentText}
                        onClick={() => toggleModal(index)}>
                        <p>{truncateText(item?.comment, 120)}</p>
                      </div>
                      <FaQuoteRight
                        color='#83ab55'
                        className={styles.rightQuote}
                      />
                    </div>
                    {showModal[index] && (
                      <div className={styles.modal}>
                        <div className={styles.modalContent}>
                          <span
                            className={styles.closeModal}
                            onClick={() => toggleModal(index)}>
                            <IoClose
                              size={24}
                              color='red'
                            />
                          </span>
                          <p>{item?.comment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
