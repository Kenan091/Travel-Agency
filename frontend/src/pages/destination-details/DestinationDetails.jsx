import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './DestinationDetails.module.css';
import { getDestination } from '../../redux/destinations/destinationsSlice';
import { getReviews } from '../../redux/reviews/reviewsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/spinner/Spinner';
import Carousel from '../../components/carousel/Carousel';
import { RiCoinsFill } from 'react-icons/ri';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import ReactStars from 'react-rating-stars-component';

const DestinationDetails = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getDestination(id));
    dispatch(getReviews(id));
  }, [dispatch, id]);

  const destination = useSelector(
    state => state?.destination?.destination?.data
  );
  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  const reviews = useSelector(state => state?.review?.reviews?.data);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  const destinationReviews = reviews?.filter(
    review => review?.destination?._id === destination?._id
  );

  const handleNavigateToBookings = id => {
    navigate(`/bookings/${id}`);
    window.scrollTo(0, 0);
  };

  console.log(reviews);

  console.log(destination);

  return (
    <>
      <div style={{ backgroundColor: '#082831' }}>
        <Header />
        <div className={styles.container}>
          <div className={styles.subcontainer}>
            {isLoadingDestination || isLoadingReviews ? (
              <Spinner />
            ) : destination ? (
              <div className={styles.mainContent}>
                <div className={styles.content}>
                  <div className={styles.topPart}>
                    <h1 className={styles.name}>{destination.name}</h1>
                    {destinationReviews.length > 0 && (
                      <div className={styles.averageRating}>
                        <ReactStars
                          count={5}
                          value={destination?.averageRating.toFixed(2)}
                          size={24}
                          isHalf={true}
                          emptyIcon={<IoStarOutline />}
                          halfIcon={<IoStarHalf />}
                          fullIcon={<IoStar />}
                          activeColor='#FFD233'
                          edit={false}
                        />
                        <span>{`(${destinationReviews.length} reviews)`}</span>
                      </div>
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
                            color='rgb(255, 210, 51'
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
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>
                There is no destination with id: {id}
              </p>
            )}
            {destinationReviews && destinationReviews.length > 0 && (
              <Carousel items={destinationReviews} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DestinationDetails;
