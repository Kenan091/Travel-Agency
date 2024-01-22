import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Experiences.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import { getReviews, addReview } from '../../redux/reviews/reviewsSlice';
import Header from '../../components/header/Header';
import Carousel from '../../components/carousel/Carousel';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';

const Experiences = () => {
  const [formData, setFormData] = useState({
    destinationId: '',
    title: '',
    comment: '',
    rating: '',
  });

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.destinationId) {
      return;
    }

    dispatch(addReview(formData));

    setFormData({
      destinationId: '',
      title: '',
      comment: '',
      rating: '',
    });
  };

  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.auth);
  const userId = user?.user?._id;
  const bookings = useSelector(state => state?.booking?.bookings?.data);
  const userBookings =
    bookings?.filter(booking => booking.user === userId) || [];
  const uniqueDestinationIds = [];
  const reviews = useSelector(state => state?.review?.reviews?.data);
  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getReviews());
  }, [dispatch]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.headerDiv}>
            <Header />
          </div>
          {user ? (
            <>
              {isLoadingBookings || isLoadingReviews ? (
                <Spinner />
              ) : (
                <>
                  {userBookings && userBookings.length > 0 ? (
                    <div className={styles.newReview}>
                      <h2 className={styles.mainTitle}>Add your review</h2>
                      <form
                        onSubmit={handleSubmit}
                        className={styles.reviewForm}>
                        <select
                          className={styles.reviewInput}
                          name='destinationId'
                          onChange={handleInputChange}
                          value={formData.destinationId}>
                          <option value=''>Select Destination</option>
                          {userBookings.map(booked => {
                            if (
                              !uniqueDestinationIds.includes(
                                booked.destination._id
                              )
                            ) {
                              uniqueDestinationIds.push(booked.destination._id);
                              return (
                                <option
                                  key={booked._id}
                                  value={booked.destination._id}>
                                  {booked.destination.name}
                                </option>
                              );
                            }
                            return null;
                          })}
                        </select>
                        <input
                          type='text'
                          name='title'
                          onChange={handleInputChange}
                          placeholder='Enter your title here'
                          className={styles.reviewInput}
                        />
                        <input
                          type='text'
                          name='rating'
                          value={formData.rating}
                          onChange={e => {
                            let value = e.target.value;
                            // Remove non-numeric characters
                            value = value.replace(/[^1-5]/g, '');
                            // Ensure the value is a positive integer between 1 and 5
                            const intValue = parseInt(value, 10);

                            if (
                              !isNaN(intValue) &&
                              intValue >= 1 &&
                              intValue <= 5
                            ) {
                              // If it's a valid input, update the state
                              setFormData({
                                ...formData,
                                rating: intValue.toString(), // Convert back to string for controlled input
                              });
                            } else {
                              // If it's not a valid input, set the state to an empty string
                              setFormData({
                                ...formData,
                                rating: '', // You might want to consider leaving the rating unchanged in case of an invalid input
                              });
                            }
                          }}
                          placeholder='Enter rating for this destination here'
                          className={styles.reviewInput}
                        />
                        <textarea
                          type='text'
                          name='comment'
                          onChange={handleInputChange}
                          placeholder='Enter your comment here'
                          className={styles.reviewInput}
                        />
                        <button
                          type='submit'
                          className={styles.submitButton}>
                          Submit
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className={styles.noBookedDestinationsDiv}>
                      <p className={styles.dataParagraph}>
                        You haven't booked any destinations. Please book a
                        destination to write a review.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
          {reviews && reviews.length > 0 ? (
            <div className={styles.carouselContainer}>
              <Carousel items={reviews} />
            </div>
          ) : (
            <p className={styles.dataParagraph}>
              Currently there are no reviews.
            </p>
          )}
        </div>
      </div>
      {/* <div className={styles.footerDiv}> */}
      <Footer />
      {/* </div> */}
    </>
  );
};

export default Experiences;
