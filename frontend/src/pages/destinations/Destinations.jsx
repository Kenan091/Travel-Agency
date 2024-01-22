import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Destinations.module.css';
import { getDestinations } from '../../redux/destinations/destinationsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Carousel from '../../components/carousel/Carousel';
import Spinner from '../../components/spinner/Spinner';
import truncateDescription from '../../helpers/useTruncateDescription';
import { IoLocationSharp, IoSearch, IoClose } from 'react-icons/io5';

const Destinations = () => {
  const [activeInputType, setActiveInputType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [sortingOption, setSortingOption] = useState('alphabet');
  const [selectedDestination, setSelectedDestination] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const destinations = useSelector(
    state => state?.destination?.destinations?.data
  );
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );

  const handleInputClick = inputType => {
    if (activeInputType === inputType) {
      setActiveInputType(null);
    } else {
      setActiveInputType(inputType);
    }
  };

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

  console.log(filteredDestinations);
  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.headerDiv}>
            <Header />
          </div>
          <div className={styles.destinationsContainer}>
            <h1 className={styles.mainTitle}>Find your dream destination!</h1>
            <h2 className={styles.title}>
              We will take you wherever you want to go!
            </h2>
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
                <div className={styles.modalOverlay}>
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
        </div>
        <div className={styles.destinationsDiv}>
          <h2 className={styles.title}>Swipe through our special offers:</h2>
          {isLoadingDestinations ? (
            <Spinner />
          ) : destinations && destinations.length > 0 ? (
            <div className={styles.carouselContainer}>
              <Carousel items={destinations} />
            </div>
          ) : (
            <p className={styles.dataParagraph}>No destinations available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Destinations;
