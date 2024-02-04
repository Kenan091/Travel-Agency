import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Experiences.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import { getReviews, addReview } from '../../redux/reviews/reviewsSlice';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import Carousel from '../../components/carousel/Carousel';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
import { getDestination } from '../../redux/destinations/destinationsSlice';
import ReactStars from 'react-rating-stars-component';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

const Experiences = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    destinationId: id,
    title: '',
    comment: '',
    rating: '',
  });

  const isErrorReviews = useSelector(state => state?.review?.isError);

  const reviewsErrorMessage = useSelector(state => state?.review?.message);

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title || !formData.comment || !formData.rating) {
      toast.error(reviewsErrorMessage);
    }

    dispatch(addReview(formData));

    if (isErrorReviews) {
      const message =
        reviewsErrorMessage === 'Duplicate field value entered'
          ? 'You can only write one review per destination!'
          : '';
      toast.error(message);
    }

    setFormData({
      destinationId: id,
      title: '',
      comment: '',
      rating: '',
    });
  };

  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.auth);
  const userId = user?.user?._id;
  const destination = useSelector(
    state => state?.destination?.destination?.data
  );
  // const bookings = useSelector(state => state?.booking?.bookings?.data);
  // const userBookings =
  //   bookings?.filter(booking => booking.user === userId) || [];
  // const uniqueDestinationIds = [];
  // const reviews = useSelector(state => state?.review?.reviews?.data);
  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  useEffect(() => {}, []);

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getDestination(id));
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
                  {/* {userBookings && userBookings.length > 0 ? ( */}
                  <div className={styles.newReview}>
                    <h2 className={styles.mainTitle}>Add your review</h2>
                    <form
                      onSubmit={handleSubmit}
                      className={styles.reviewForm}>
                      <input
                        className={styles.reviewInput}
                        name='destinationId'
                        onChange={handleInputChange}
                        value={destination?.name}
                        readOnly
                      />
                      <input
                        type='text'
                        name='title'
                        onChange={handleInputChange}
                        placeholder='Enter your title here'
                        className={styles.reviewInput}
                      />
                      {/* <input
                      //   type='text'
                      //   name='rating'
                      //   value={formData.rating}
                      //   onChange={e => {
                      //     let value = e.target.value;
                      //     // Remove non-numeric characters
                      //     value = value.replace(/[^1-5]/g, '');
                      //     // Ensure the value is a positive integer between 1 and 5
                      //     const intValue = parseInt(value, 10);

                      //     if (
                      //       !isNaN(intValue) &&
                      //       intValue >= 1 &&
                      //       intValue <= 5
                      //     ) {
                      //       // If it's a valid input, update the state
                      //       setFormData({
                      //         ...formData,
                      //         rating: intValue.toString(), // Convert back to string for controlled input
                      //       });
                      //     } else {
                      //       // If it's not a valid input, set the state to an empty string
                      //       setFormData({
                      //         ...formData,
                      //         rating: '', // You might want to consider leaving the rating unchanged in case of an invalid input
                      //       });
                      //     }
                      //   }}
                      //   placeholder='Enter rating for this destination here'
                      //   className={styles.reviewInput}
                      // /> */}
                      <textarea
                        type='text'
                        name='comment'
                        onChange={handleInputChange}
                        placeholder='Enter your comment here'
                        className={styles.reviewInput}
                      />
                      <div className={styles.ratingInput}>
                        <p>Enter your rating: </p>
                        <ReactStars
                          count={5}
                          size={32}
                          isHalf={true}
                          emptyIcon={<IoStarOutline />}
                          halfIcon={<IoStarHalf />}
                          fullIcon={<IoStar />}
                          color='#d8e1ec'
                          activeColor='#FFD233'
                          onChange={value =>
                            setFormData(prevState => ({
                              ...prevState,
                              rating: value,
                            }))
                          }
                        />
                      </div>
                      <button
                        type='submit'
                        className={styles.submitButton}>
                        Submit
                      </button>
                    </form>
                  </div>
                  {/* ) : (
                    <div className={styles.noBookedDestinationsDiv}>
                      <p className={styles.dataParagraph}>
                        You haven't booked any destinations. Please book a
                        destination to write a review.
                      </p>
                    </div>
                  )} */}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
          {/* {reviews && reviews.length > 0 ? (
            <div className={styles.carouselContainer}>
              <Carousel items={reviews} />
            </div>
          ) : (
            <p className={styles.dataParagraph}>
              Currently there are no reviews.
            </p>
          )} */}
        </div>
      </div>
      {/* <div className={styles.footerDiv}> */}
      <Footer />
      {/* </div> */}
    </>
  );
};

export default Experiences;
