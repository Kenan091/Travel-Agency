import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Destinations.module.css';
import { getDestinations } from '../../redux/destinations/destinationsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Pagination from '../../components/pagination/Pagination';
import { IoSearch } from 'react-icons/io5';
import { RiCoinsFill } from 'react-icons/ri';
import Spinner from '../../components/spinner/Spinner';

const Destinations = () => {
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [sortingOption, setSortingOption] = useState('alphabet');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(4);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const destinations = useSelector(state => state?.destination?.destinations);
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );

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
    } else {
      toast.warn('No matching destinations found. Please try again.');
    }
  };

  const handleInputKeyDown = e => {
    if (e.key === 'Backspace' && !selectedDestination) {
      // If Backspace is pressed and input is empty, show all destinations
      setFilteredDestinations([]);
    }

    if (e.key === 'Enter') {
      const matchingDestinations = destinations.filter(destination =>
        destination.name
          .toLowerCase()
          .includes(selectedDestination.toLowerCase())
      );

      if (matchingDestinations.length > 0) {
        setFilteredDestinations(matchingDestinations);
      } else {
        toast.warn('No matching destinations found. Please try again.');
      }
    }
  };

  const handleNavigateToDestinationDetails = destinationId => {
    navigate(`/destinations/${destinationId}`);
  };

  const handleSortingChange = e => {
    setSortingOption(e.target.value);
  };

  const sortedDestinations = useMemo(() => {
    const copyOfDestinations = destinations ? [...destinations] : [];

    // Apply sorting to the original destinations
    const sortedOriginalDestinations = copyOfDestinations.sort((a, b) => {
      switch (sortingOption) {
        case 'alphabet':
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        case 'alphabetDesc':
          return b.name.toLowerCase() < a.name.toLowerCase() ? -1 : 1;
        case 'price':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    // Apply sorting to the filtered destinations if there are any
    const sortedFilteredDestinations = filteredDestinations.sort((a, b) => {
      switch (sortingOption) {
        case 'alphabet':
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        case 'alphabetDesc':
          return b.name.toLowerCase() < a.name.toLowerCase() ? -1 : 1;
        case 'price':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    // Return the sorted list based on whether there are filtered destinations
    return filteredDestinations.length > 0
      ? sortedFilteredDestinations
      : sortedOriginalDestinations;
  }, [sortingOption, destinations, filteredDestinations]);

  const currentRecords =
    filteredDestinations.length > 0
      ? filteredDestinations?.slice(indexOfFirstRecord, indexOfLastRecord)
      : sortedDestinations?.slice(indexOfFirstRecord, indexOfLastRecord);

  const numberOfPages =
    filteredDestinations?.length > 0
      ? Math.ceil(filteredDestinations?.length / recordsPerPage)
      : Math.ceil(sortedDestinations?.length / recordsPerPage);

  console.log(filteredDestinations);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 780) {
        setRecordsPerPage(4);
      } else {
        setRecordsPerPage(8);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          </div>
        </div>
        <div className={styles.destinationsDiv}>
          <div className={styles.topPart}>
            <div className={styles.sortDiv}>
              <select
                value={sortingOption}
                onChange={handleSortingChange}
                className={styles.sortSelect}>
                <option value=''>Sort by</option>
                <option value='alphabet'>A - Z</option>
                <option value='alphabetDesc'>Z - A</option>
                <option value='price'>Price ASC</option>
                <option value='priceDesc'>Price DESC</option>
              </select>
            </div>
            <div className={styles.searchDiv}>
              <input
                type='text'
                name='destination'
                placeholder='Search...'
                value={selectedDestination}
                onChange={e => setSelectedDestination(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button
                className={styles.searchButton}
                onClick={handleSearchButtonClick}>
                <IoSearch size={24} />
              </button>
            </div>
          </div>
          <div className={styles.destinationsWithPagination}>
            {isLoadingDestinations ? (
              <Spinner
                width={64}
                height={64}
              />
            ) : (
              <div className={styles.destinations}>
                {currentRecords?.map(destination => (
                  <div
                    key={destination._id}
                    className={styles.destinationCard}>
                    <img
                      src={destination.imageURL}
                      alt={destination.name}
                    />
                    <div className={styles.destinationInfo}>
                      <h3>{destination.name}</h3>
                      <p>{destination.briefDescription}</p>
                    </div>
                    <div className={styles.destinationBottomPart}>
                      <div className={styles.price}>
                        <RiCoinsFill size={24} />
                        <p>{destination.price.toFixed(2)} BAM</p>
                      </div>
                      <button
                        className={styles.destinationButton}
                        onClick={() =>
                          handleNavigateToDestinationDetails(destination._id)
                        }>
                        See more
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination
              numberOfPages={numberOfPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Destinations;
