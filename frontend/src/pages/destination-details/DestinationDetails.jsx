import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './DestinationDetails.module.css';
import { getDestination } from '../../redux/destinations/destinationsSlice';
import { deleteReview, getReviews } from '../../redux/reviews/reviewsSlice';
import Header from '../../components/header/Header';
import Review from '../../components/review/Review';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { RiCoinsFill } from 'react-icons/ri';
import ReactStars from 'react-rating-stars-component';

const DestinationDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const destination = useSelector(state => state?.destination?.destination);
  const averageRatingFromDestination = useSelector(
    state => state?.destination?.destination?.averageRating
  );
  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  const averageRatingFromReviews = useSelector(
    state => state?.review?.averageRatingForDestination
  );
  const reviews = useSelector(state => state?.review?.reviews);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  const averageRating =
    averageRatingFromReviews !== 0
      ? averageRatingFromReviews
      : averageRatingFromDestination;

  const user = JSON.parse(localStorage.getItem('user'));

  const handleNavigateToBookings = id => {
    navigate(`/bookings/${id}`);
    window.scrollTo(0, 0);
  };

  const handleDeleteReview = useCallback(
    reviewId => {
      dispatch(deleteReview(reviewId));
    },
    [dispatch]
  );

  useEffect(() => {
    localStorage.setItem('destination', JSON.stringify(destination));

    return () => {
      localStorage.removeItem('destination');
    };
  }, [destination]);

  useEffect(() => {
    dispatch(getDestination(id));
    dispatch(getReviews(id));
  }, [dispatch, id]);

  return (
    <>
      <div style={{ backgroundColor: '#082831' }}>
        <div className={styles.headerDiv}>
          <Header />
        </div>
        <div className={styles.container}>
          <div className={styles.subcontainer}>
            {isLoadingDestination ? (
              <Spinner
                width={64}
                height={64}
              />
            ) : destination ? (
              <div className={styles.mainContent}>
                <div className={styles.content}>
                  <div className={styles.topPart}>
                    <h1 className={styles.name}>{destination?.name}</h1>
                    {reviews?.length > 0 && (
                      <>
                        {averageRating ? (
                          <div className={styles.averageRating}>
                            <ReactStars
                              key={averageRating}
                              count={5}
                              value={averageRating}
                              size={window.innerWidth < 500 ? 20 : 24}
                              isHalf={false}
                              emptyIcon={<IoStarOutline />}
                              halfIcon={<IoStarHalf />}
                              fullIcon={<IoStar />}
                              activeColor='#FFD233'
                              edit={false}
                            />
                            {reviews?.length === 1 ? (
                              <span>{`(${reviews?.length} review)`}</span>
                            ) : (
                              <span>{`(${reviews?.length} reviews)`}</span>
                            )}
                          </div>
                        ) : (
                          'Not rated'
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.mainPart}>
                    <div className={styles.leftSide}>
                      <div className={styles.imageContainer}>
                        <img src={destination.imageURL} />
                      </div>
                    </div>
                    <div className={styles.rightSide}>
                      <div className={styles.descriptionContainer}>
                        <p className={styles.description}>
                          {destination.briefDescription}
                        </p>
                        <p className={styles.description}>
                          {destination.detailedDescription}
                        </p>
                      </div>
                      <div className={styles.bottomPart}>
                        <div className={styles.price}>
                          <RiCoinsFill
                            size={32}
                            color='rgb(255, 210, 51)'
                          />
                          <span>{destination.price} /per person</span>
                        </div>
                        <button
                          className={styles.bookNowButton}
                          onClick={() =>
                            handleNavigateToBookings(destination._id)
                          }>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {isLoadingReviews ? (
                  <Spinner
                    width={64}
                    height={64}
                  />
                ) : (
                  <>
                    {reviews && reviews?.length > 0 && (
                      <div className={styles.reviewsDiv}>
                        {reviews.length > 1 ? (
                          <h2>Reviews ({`${reviews?.length} reviews`})</h2>
                        ) : (
                          <h2>Reviews ({`${reviews?.length} review`})</h2>
                        )}
                        <ul
                          className={`${
                            reviews?.length > 4 ? styles.scrollable : ''
                          }`}>
                          {reviews?.map(review => {
                            return (
                              <Review
                                key={review._id}
                                review={review ? review : null}
                                user={user ? user : null}
                                onDeleteReview={handleDeleteReview}
                              />
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>
                There is no destination with id: {id}
              </p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DestinationDetails;
