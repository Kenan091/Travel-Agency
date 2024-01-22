import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { getDestinations } from '../../redux/destinations/destinationsSlice';
import { getReviews } from '../../redux/reviews/reviewsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Carousel from '../../components/carousel/Carousel';
import Spinner from '../../components/spinner/Spinner';
import { IoClose, IoLocationSharp, IoSearch } from 'react-icons/io5';
import { toast } from 'react-toastify';
import truncateDescription from '../../helpers/useTruncateDescription';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [sortingOption, setSortingOption] = useState('alphabet');
  const [selectedDestination, setSelectedDestination] = useState('');

  const navigate = useNavigate();

  const handleNavigateToPage = page => {
    navigate(page);
    window.scrollTo(0, 0);
  };

  const dispatch = useDispatch();
  const destinations = useSelector(
    state => state?.destination?.destinations?.data
  );
  const reviews = useSelector(state => state?.review?.reviews?.data);
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  const { user } = useSelector(state => state?.auth);
  const userRole = user?.user?.role;
  const name = user?.user?.name.split(' ')[0];

  const handleSearchButtonClick = () => {
    if (!selectedDestination) {
      toast.error('Please enter your desired destination.');
      return;
    }

    const matchingDestinations = destinations.filter(destination =>
      destination.name.toLowerCase().includes(selectedDestination.toLowerCase())
    );

    if (matchingDestinations.length > 0) {
      setFilteredDestinations(matchingDestinations);
      setShowModal(true);
    } else {
      toast.warn('No matching destinations found. Please try again.');
    }
  };

  const handleSeeMore = destinationId => {
    navigate(`/destinations/${destinationId}`);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDestination('');
  };

  const handleSortingChange = e => {
    setSortingOption(e.target.value);
  };

  const sortedDestinations = useMemo(() => {
    if (sortingOption === 'alphabet') {
      return [...filteredDestinations].sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      );
    } else if (sortingOption === 'price') {
      return [...filteredDestinations].sort((a, b) => a.price - b.price);
    }

    return filteredDestinations;
  }, [sortingOption, filteredDestinations]);

  useEffect(() => {
    dispatch(getDestinations());
    dispatch(getReviews());
  }, [dispatch]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.heroSection}>
          <div className={styles.headerDiv}>
            <Header />
          </div>
          <div className={styles.destinationsContainer}>
            <h2 className={styles.mainTitle}>Find your dream destination!</h2>
            <h3 className={styles.title}>
              We will take you wherever you want to go!
            </h3>
            <div className={styles.browseDestinations}>
              <div className={styles.searchInputs}>
                <div className={styles.searchInput}>
                  <IoLocationSharp
                    size={32}
                    color='#83ab55'
                  />
                  <div style={{ width: 120, height: 70 }}>
                    <label
                      style={{
                        color: '#d8e1ec',
                        marginLeft: 6,
                        fontSize: 14,
                      }}>
                      Location
                    </label>
                    <input
                      type='text'
                      name='destination'
                      placeholder='Where are you going?'
                      value={selectedDestination}
                      onChange={e => setSelectedDestination(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearchButtonClick}
                className={styles.searchButton}>
                <IoSearch
                  size={32}
                  color='#83ab55'
                />
              </button>
            </div>
            {showModal && sortedDestinations.length > 0 && (
              <>
                <div className={styles.modalOverlay}></div>
                <div className={styles.modal}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalTopPart}>
                      <h2 className={styles.modalTitle}>
                        Search results for:
                        <strong> {selectedDestination}</strong>
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className={styles.closeButton}>
                        <IoClose
                          size={24}
                          color='red'
                        />
                      </button>
                    </div>
                    {sortedDestinations.length > 1 && (
                      <div className={styles.sortDiv}>
                        <select
                          value={sortingOption}
                          onChange={handleSortingChange}
                          className={styles.sortSelect}>
                          <option value=''>Sort by</option>
                          <option value='alphabet'>A - Z</option>
                          <option value='price'>Price</option>
                        </select>
                      </div>
                    )}
                    {sortedDestinations.map(destination => (
                      <div
                        key={destination._id}
                        className={styles.destinationItem}>
                        <img
                          src={destination.imageURL}
                          alt={destination.name}
                          className={styles.destinationImage}
                        />
                        <div className={styles.destinationInfo}>
                          <h3>{destination.name}</h3>
                          <p>
                            {truncateDescription(destination.description, 150)}
                          </p>
                          <div className={styles.buttonContainer}>
                            <button
                              onClick={() => handleSeeMore(destination._id)}
                              className={styles.seeMoreButton}>
                              See More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <h2 className={styles.title}>Swipe through our special offers:</h2>
          {isLoadingDestinations ? (
            <Spinner />
          ) : destinations && destinations.length > 0 ? (
            <Carousel items={destinations} />
          ) : (
            <p className={styles.dataParagraph}>No destinations available.</p>
          )}

          {user ? (
            <div style={{ padding: 25 }}></div>
          ) : (
            <div className={styles.aboutUsContainer}>
              <h2 className={styles.mainTitle}>About us</h2>
              <p className={styles.text}>
                Our travel agency is dedicated to providing the best travel
                experiences for our customers. We specialize in creating
                personalized itineraries that cater to your unique interests and
                preferences. Our team of experienced travel agents has extensive
                knowledge of destinations around the world and can help you plan
                the perfect trip. Whether you’re looking for a relaxing beach
                vacation, an adventurous trek through the mountains, or a
                cultural tour of a new city, we’ve got you covered. Let us take
                care of all the details so you can sit back, relax, and enjoy
                your travels.
              </p>
            </div>
          )}
        </div>
        <div className={styles.experiencesContainer}>
          <h2 className={styles.mainTitle}>Experiences</h2>
          <h3 className={styles.title}>Hear from fellow travellers! </h3>
          {isLoadingReviews ? (
            <Spinner />
          ) : reviews && reviews.length > 0 ? (
            <Carousel items={reviews} />
          ) : (
            <p className={styles.dataParagraph}>No reviews available.</p>
          )}
        </div>
        <div className={styles.contactUsContainer}>
          <h2 className={styles.mainTitle}>Contact us</h2>
          <h3 className={styles.title}>
            Having any questions, requests or impression?
          </h3>
          <button
            className={styles.mainButton}
            onClick={() => handleNavigateToPage('/contact-us')}>
            Contact Us
          </button>
        </div>
      </div>
      {/* )} */}
      <Footer />
    </>
  );
};

export default Home;
