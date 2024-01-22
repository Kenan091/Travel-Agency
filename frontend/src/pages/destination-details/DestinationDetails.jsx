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
import { IoStar } from 'react-icons/io5';

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
            {isLoadingDestination ? (
              // <div style={{ color: 'black', textAlign: 'center' }}>

              // </div>
              <Spinner />
            ) : destination ? (
              <div className={styles.mainContent}>
                <div>
                  <img src={destination.imageURL} />
                </div>
                <div className={styles.details}>
                  <div className={styles.detailsTopPart}>
                    <h1 className={styles.name}>{destination.name}</h1>
                    <div className={styles.averageRating}>
                      <IoStar
                        color='#FFD233'
                        size={20}
                      />
                      <span>
                        {destination?.averageRating
                          ? destination.averageRating.toFixed(2)
                          : 'Not rated'}
                      </span>
                    </div>
                  </div>
                  <p className={styles.description}>
                    {destination.description}
                  </p>
                  <div className={styles.detailsBottomPart}>
                    <div className={styles.price}>
                      <RiCoinsFill size={32} />
                      <span>{destination.price} /per person</span>
                    </div>
                    <button
                      className={styles.bookNowButton}
                      onClick={() => handleNavigateToBookings(destination._id)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>
                There is no destination with id: {id}
              </p>
            )}
            {isLoadingReviews ? (
              <Spinner />
            ) : (
              reviews && reviews.length > 0 && <Carousel items={reviews} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DestinationDetails;
