import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Experiences.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import { addReview, getReviews } from '../../redux/reviews/reviewsSlice';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { getDestination } from '../../redux/destinations/destinationsSlice';
import ReactStars from 'react-rating-stars-component';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

const Experiences = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem('formData');
    return storedFormData
      ? JSON.parse(storedFormData)
      : {
          destinationId: id,
          title: '',
          comment: '',
          rating: '',
        };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = useSelector(state => state?.review?.reviews);
  const isErrorReviews = useSelector(state => state?.review?.isError);
  const reviewsErrorMessage = useSelector(state => state?.review?.message);

  const handleInputChange = e => {
    const value =
      e.target.name === 'rating' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title || !formData.comment || !formData.rating) {
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
        destinationId: id,
        title: '',
        comment: '',
        rating: '',
      });

      setIsSubmitting(false);
    }
  };

  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.auth);
  const isLoadingUser = useSelector(state => state?.auth?.isLoading);

  const destination = useSelector(state => state?.destination?.destination);

  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  const isLoadingReview = useSelector(state => state?.review?.isLoading);

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getReviews());
    dispatch(getDestination(id));
  }, [dispatch]);

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
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'none' }}></div>
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
