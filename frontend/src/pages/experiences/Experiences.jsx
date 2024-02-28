import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Experiences.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import { addReview, getReviews } from '../../redux/reviews/reviewsSlice';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import getRegularDate from '../../helpers/useGetDate';
import CustomSelect from '../../components/custom-select/CustomSelect';

const Experiences = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    destinationId: '',
    bookingId: '',
    title: '',
    comment: '',
    rating: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = useSelector(state => state?.review?.reviews);
  const isErrorReviews = useSelector(state => state?.review?.isError);
  const reviewsErrorMessage = useSelector(state => state?.review?.message);

  const { user } = useSelector(state => state?.auth);
  const isLoadingUser = useSelector(state => state?.auth?.isLoading);
  const isErrorUser = useSelector(state => state?.auth?.isError);
  const userErrorMessage = useSelector(state => state?.auth?.message);
  const userId = user?.user?._id;

  const bookings = useSelector(state => state?.booking?.bookings);
  const isErrorBookings = useSelector(state => state?.booking?.isError);
  const bookingsErrorMessage = useSelector(state => state?.booking?.message);
  const userBookings =
    bookings?.filter(booking => booking.user._id === userId) || [];

  const handleInputChange = (e, bookingId) => {
    const value =
      e.target.name === 'rating' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      destinationId: formData.destinationId,
      bookingId: bookingId || formData.bookingId || '',
      [e.target.name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.comment ||
      !formData.rating ||
      !formData.bookingId
    ) {
      toast.warn('Each field needs to be entered!');
      return;
    }

    setIsSubmitting(true);

    dispatch(addReview(formData));

    if (isErrorReviews) {
      const message =
        reviewsErrorMessage === 'Duplicate field value entered'
          ? 'You can only write one review per destination!'
          : reviewsErrorMessage;
      toast.warn(message);
      setTimeout(() => {
        navigate('/auth/me');
      }, 6000);
    } else {
      toast.success('You successfully added review!');

      setFormData({
        destinationId: '',
        bookingId: '',
        title: '',
        comment: '',
        rating: '',
      });

      setTimeout(() => {
        navigate('/auth/me');
      }, 6000);

      setIsSubmitting(false);
    }
  };

  // const destination = useSelector(state => state?.destination?.destination);

  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  const options = userBookings.map(booked => ({
    value: `${booked.destination._id} ${booked._id}`,
    label: `${booked.destination.name} \n ${getRegularDate(
      booked.departureDate
    )} - ${getRegularDate(booked.returnDate)}`,
  }));

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getReviews());
  }, [dispatch]);

  useEffect(() => {
    if (isErrorUser) {
      toast.error(userErrorMessage);
    }

    if (isErrorReviews) {
      toast.error(reviewsErrorMessage);
    }

    if (isErrorBookings) {
      toast.error(bookingsErrorMessage);
    }
  }, [
    isErrorReviews,
    isErrorBookings,
    reviewsErrorMessage,
    bookingsErrorMessage,
  ]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('user', JSON.stringify(user));
  }, [formData, user]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.headerDiv}>
            <Header />
          </div>
          {user ? (
            <>
              {isLoadingDestination || isLoadingUser ? (
                <Spinner
                  width={64}
                  height={64}
                />
              ) : (
                <>
                  {userBookings && userBookings.length > 0 ? (
                    <div className={styles.newReview}>
                      <h2 className={styles.mainTitle}>Add your review</h2>
                      <form
                        onSubmit={handleSubmit}
                        className={styles.reviewForm}>
                        <CustomSelect
                          options={[{ value: '', label: 'Select' }, ...options]}
                          value={`${formData.destinationId} ${formData.bookingId}`}
                          onChange={value => {
                            const [destinationId, bookingId] = value.split(' ');
                            handleInputChange(
                              {
                                target: {
                                  name: 'destinationId',
                                  value: destinationId,
                                },
                              },
                              bookingId
                            );
                          }}
                          optionHeight='50px'
                        />
                        <input
                          type='text'
                          name='title'
                          onChange={handleInputChange}
                          placeholder='Enter your title here'
                          className={styles.reviewInput}
                          value={formData.title}
                        />
                        <textarea
                          type='text'
                          name='comment'
                          onChange={handleInputChange}
                          placeholder='Enter your comment here'
                          className={styles.reviewInput}
                          value={formData.comment}
                        />
                        <div className={styles.ratingInput}>
                          <p>Enter your rating: </p>
                          <ReactStars
                            count={5}
                            size={32}
                            isHalf={false}
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
                          disabled={isSubmitting}
                          className={styles.submitButton}>
                          {isSubmitting ? (
                            <Spinner
                              width={24}
                              height={24}
                            />
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ display: 'none' }}></div>
                  )}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Experiences;
