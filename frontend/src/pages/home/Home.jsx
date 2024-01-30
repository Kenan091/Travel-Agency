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
import { FaHandshake } from 'react-icons/fa6';
import { MdCardTravel } from 'react-icons/md';
import { RiMapPinUserFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import truncateDescription from '../../helpers/useTruncateDescription';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [sortingOption, setSortingOption] = useState('alphabet');
  const [selectedDestination, setSelectedDestination] = useState('');

  const navigate = useNavigate();

  // const handleNavigateToPage = page => {
  //   navigate(page);
  //   window.scrollTo(0, 0);
  // };

  const dispatch = useDispatch();
  const destinations = useSelector(
    state => state?.destination?.destinations?.data
  );

  const reviews = useSelector(state => state?.review?.reviews?.data);
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  const popularDestinations = destinations?.filter(
    destination => destination?.averageRating > 4
  );

  const { user } = useSelector(state => state?.auth);

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
    switch (sortingOption) {
      case 'alphabet':
        return [...filteredDestinations].sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        );
      case 'alphabetDesc':
        return [...filteredDestinations].sort((a, b) =>
          b.name.toLowerCase() < a.name.toLowerCase() ? -1 : 1
        );
      case 'price':
        return [...filteredDestinations].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...filteredDestinations].sort((a, b) => b.price - a.price);
      default:
        return filteredDestinations;
    }
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
            <h2 className={styles.mainTitle}>Unleash Your Travel Dreams</h2>
            <h3 className={styles.title}>
              Discover new cultures and create unforgettable memories with our
              agency
            </h3>
            <div className={styles.browseDestinations}>
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
                          <option value='alphabetDesc'>Z - A</option>
                          <option value='price'>Price Asc</option>
                          <option value='priceDesc'>Price Desc</option>
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
          <section className={styles.whySection}>
            <h2 className={styles.mainTitle}>Why Travelist?</h2>
            <div className={styles.mainContent}>
              <div className={styles.card}>
                <div className={styles.cardTopPart}>
                  <img
                    src='https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt='Group of travelers'
                    className={styles.cardImg}
                  />
                </div>
                <div className={styles.cardBottomPart}>
                  <div className={styles.cardIcon}>
                    <FaHandshake
                      size={40}
                      color='#082831'
                    />
                  </div>
                  <p>Trusted Travel Agency</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTopPart}>
                  <img
                    src='https://images.unsplash.com/photo-1479888230021-c24f136d849f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D'
                    alt='Travel luggage'
                    className={styles.cardImg}
                  />
                </div>
                <div className={styles.cardBottomPart}>
                  <div className={styles.cardIcon}>
                    <MdCardTravel
                      size={40}
                      color='#082831'
                    />
                  </div>
                  <p>Years of Travel Experience</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTopPart}>
                  <img
                    src='https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt='Cappadocia'
                    className={styles.cardImg}
                  />
                </div>
                <div className={styles.cardBottomPart}>
                  <div className={styles.cardIcon}>
                    <RiMapPinUserFill
                      size={40}
                      color='#082831'
                    />
                  </div>
                  <p>Journey as Unique as You Are</p>
                </div>
              </div>
            </div>
          </section>

          {/* {user ? (
            <div style={{ padding: 25 }}></div>
          ) : ( */}
          <div className={styles.aboutUsContainer}>
            <h2 className={styles.mainTitle}>About us</h2>
            <p className={styles.text}>
              Our travel agency is dedicated to providing the best travel
              experiences for our customers. We specialize in creating
              personalized itineraries that cater to your unique interests and
              preferences. Our team of experienced travel agents has extensive
              knowledge of destinations around the world and can help you plan
              the perfect trip. Whether you’re looking for a relaxing beach
              vacation, an adventurous trek through the mountains, or a cultural
              tour of a new city, we’ve got you covered. Let us take care of all
              the details so you can sit back, relax, and enjoy your travels.
            </p>
          </div>
          {/* )} */}
        </div>
        <div className={styles.popularDestinationsContainer}>
          {popularDestinations && (
            <div className={styles.popularDestinations}>
              <h2 className={styles.mainTitle}>Popular Destinations</h2>
              {isLoadingDestinations ? (
                <Spinner />
              ) : (
                <Carousel items={popularDestinations} />
              )}
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
      </div>
      <Footer />
    </>
  );
};

export default Home;
