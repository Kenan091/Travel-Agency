import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { getDestinations } from '../../redux/destinations/destinationsSlice';
import { getReviews } from '../../redux/reviews/reviewsSlice';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Carousel from '../../components/carousel/Carousel';
import Spinner from '../../components/spinner/Spinner';
import { IoClose, IoLocationSharp, IoSearch } from 'react-icons/io5';
import { FaHandshake } from 'react-icons/fa6';
import { MdCardTravel } from 'react-icons/md';
import { RiMapPinUserFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [sortingOption, setSortingOption] = useState('alphabet');
  const [selectedDestination, setSelectedDestination] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const destinations = useSelector(state => state?.destination?.destinations);
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );
  const isErrorDestinations = useSelector(state => state?.destination?.isError);
  const destinationsErrorMessage = useSelector(
    state => state?.destination?.message
  );
  const popularDestinations = destinations?.filter(
    destination => destination?.isPopular
  );

  const reviews = useSelector(state => state?.review?.reviews);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);
  const isErrorReviews = useSelector(state => state?.review?.isError);
  const reviewsErrorMessage = useSelector(state => state?.review?.message);

  const { user } = useSelector(state => state?.auth);
  const isErrorUser = useSelector(state => state?.auth?.isError);
  const userErrorMessage = useSelector(state => state?.auth?.message);

  const bookings = useSelector(state => state?.booking?.bookings);
  const userBookings = bookings.filter(
    booking => booking?.user?._id === user?.user?._id
  );

  const userBookedDestinations = useMemo(() => {
    if (!user) return [];
    const bookedDestinations = userBookings.map(booking => booking.destination);
    return bookedDestinations;
  }, [user, userBookings]);

  // const recommendedDestinations = useMemo(() => {
  //   if (!user || !userBookedDestinations?.length || !destinations) return [];

  //   // Extract continents and countries from booked destinations
  //   const continents = userBookedDestinations?.flatMap(
  //     destination => destination?.continents
  //   );
  //   const countries = userBookedDestinations?.map(destination =>
  //     destination?.name.split(',')[1]?.trim().split(' ').pop()
  //   );

  //   // Find recommended destinations by continent

  //   let recommendedByContinent = destinations.filter(destination =>
  //     destination.continents.some(continent => continents.includes(continent))
  //   );

  //   // If no recommended destinations by continent, find by country

  //   let recommendedByCountry = [];
  //   if (!recommendedByContinent.length) {
  //     recommendedByCountry = destinations.filter(destination =>
  //       countries.includes(destination.name.split(',').pop()?.trim())
  //     );
  //   }

  //   // Exclude destinations that user has already booked
  //   const filteredRecommended =
  //     recommendedByContinent.length > 0
  //       ? recommendedByContinent.filter(
  //           destination =>
  //             !userBookedDestinations.some(
  //               bookedDestination =>
  //                 bookedDestination.name.split(',')[0]?.trim() ===
  //                 destination.name.split(',')[0]?.trim()
  //             )
  //         )
  //       : recommendedByCountry.length > 0
  //       ? recommendedByCountry.filter(
  //           destination =>
  //             !userBookedDestinations.some(
  //               bookedDestination =>
  //                 bookedDestination.name.split(',')[0]?.trim() ===
  //                 destination.name.split(',')[0]?.trim()
  //             )
  //         )
  //       : [];

  //   let sortedRecommended = filteredRecommended.sort((a, b) => {
  //     // If both destinations have the same continent, sort by name
  //     if (a.continents.some(continent => b.continents.includes(continent))) {
  //       return a.name.localeCompare(b.name);
  //     }
  //     // Otherwise, sort by continent
  //     const continentA = a.continents[0];
  //     const continentB = b.continents[0];
  //     return continentA.localeCompare(continentB);
  //   });

  //   // If there are no recommendations by continent, sort by country
  //   if (sortedRecommended.length === 0 && recommendedByCountry.length > 0) {
  //     sortedRecommended = recommendedByCountry.sort((a, b) => {
  //       const countryA = a.name.split(',').pop().trim();
  //       const countryB = b.name.split(',').pop().trim();
  //       return countryA.localeCompare(countryB);
  //     });
  //   }

  //   // If there are recommended destinations, return them, else return popular destinations
  //   return sortedRecommended.length ? sortedRecommended : [];
  // }, [user, userBookedDestinations, destinations]);

  // const recommendedDestinations = useMemo(() => {
  //   if (!user || !userBookedDestinations?.length || !destinations) return [];

  //   // Extract countries from booked destinations
  //   const bookedCountries = userBookedDestinations?.map(destination =>
  //     destination.name.split(',').pop()?.trim()
  //   );

  //   // Find recommended destinations by country
  //   let recommendedByCountry = destinations.filter(destination =>
  //     bookedCountries.includes(destination.name.split(',').pop()?.trim())
  //   );

  //   // If no recommended destinations by country, find by continent
  //   let recommendedByContinent = [];
  //   if (!recommendedByCountry.length) {
  //     const continents = userBookedDestinations?.flatMap(
  //       destination => destination?.continents
  //     );
  //     recommendedByContinent = destinations.filter(destination =>
  //       destination.continents.some(continent => continents.includes(continent))
  //     );
  //   }

  //   // Exclude destinations that user has already booked
  //   const filteredRecommended =
  //     recommendedByCountry.length > 0
  //       ? recommendedByCountry.filter(
  //           destination =>
  //             !userBookedDestinations.some(
  //               bookedDestination =>
  //                 bookedDestination.name.split(',')[0]?.trim() ===
  //                 destination.name.split(',')[0]?.trim()
  //             )
  //         )
  //       : recommendedByContinent.length > 0
  //       ? recommendedByContinent.filter(
  //           destination =>
  //             !userBookedDestinations.some(
  //               bookedDestination =>
  //                 bookedDestination.name.split(',')[0]?.trim() ===
  //                 destination.name.split(',')[0]?.trim()
  //             )
  //         )
  //       : [];

  //   let sortedRecommended = filteredRecommended.sort((a, b) => {
  //     // Sort by country first
  //     const countryA = a.name.split(',').pop()?.trim();
  //     const countryB = b.name.split(',').pop()?.trim();
  //     const countryComparison = countryA.localeCompare(countryB);

  //     // If countries are the same, sort by continent
  //     if (countryComparison === 0) {
  //       const continentA = a.continents[0];
  //       const continentB = b.continents[0];
  //       return continentA.localeCompare(continentB);
  //     }

  //     return countryComparison;
  //   });

  //   // If there are no recommendations, return empty array
  //   return sortedRecommended;
  // }, [user, userBookedDestinations, destinations]);

  // const recommendedDestinations = useMemo(() => {
  //   if (!user || !userBookedDestinations?.length || !destinations) return [];

  //   // Extract countries from booked destinations
  //   const bookedCountries = userBookedDestinations?.map(destination =>
  //     destination.name.split(',').pop()?.trim()
  //   );

  //   console.log('Booked countries: ', bookedCountries);

  //   // Find recommended destinations by country, excluding booked ones
  //   const recommendedByCountry = destinations.filter(destination => {
  //     const country = destination.name.split(',').pop()?.trim();
  //     return (
  //       bookedCountries.includes(country) &&
  //       !userBookedDestinations.some(booked => {
  //         const bookedCountry = booked.name.split(',').pop()?.trim();
  //         return bookedCountry === country;
  //       })
  //     );
  //   });

  //   console.log('Recommended by countries: ', recommendedByCountry);

  //   // If no recommendations by country, find by continent, excluding booked ones
  //   const recommendedByContinent = [];
  //   const continents = userBookedDestinations?.flatMap(
  //     destination => destination?.continents
  //   );

  //   console.log('Continents: ', continents);

  //   recommendedByContinent.push(
  //     ...destinations.filter(destination => {
  //       return (
  //         destination.continents.some(continent =>
  //           continents.includes(continent)
  //         ) &&
  //         !userBookedDestinations.some(booked => {
  //           const bookedCountry = booked.name.split(',').pop()?.trim();
  //           return bookedCountry === destination.name.split(',').pop()?.trim();
  //         })
  //       );
  //     })
  //   );

  //   console.log('Recommended by continent: ', recommendedByContinent);

  //   // Sort recommendations according to your preferences
  //   const sortedByCountry = recommendedByCountry.sort((a, b) => {
  //     // Sort by country first
  //     const countryA = a.name.split(',').pop()?.trim();
  //     const countryB = b.name.split(',').pop()?.trim();
  //     return countryA.localeCompare(countryB);
  //   });

  //   console.log('Sorted by country: ', sortedByCountry);

  //   const sortedByContinent = recommendedByContinent.sort((a, b) => {
  //     const continentA = a.continents[0];
  //     const continentB = b.continents[0];
  //     return continentA.localeCompare(continentB);
  //   });

  //   console.log('Sorted by continent: ', sortedByContinent);

  //   // Return recommendations, prioritizing country and excluding booked destinations
  //   return recommendedByCountry.length ? sortedByCountry : sortedByContinent;
  // }, [user, userBookedDestinations, destinations]);

  const recommendedDestinations = useMemo(() => {
    if (!user || !userBookedDestinations?.length || !destinations) return [];

    // Extract countries from booked destinations
    const bookedCountries = userBookedDestinations?.map(destination =>
      destination.name.split(',').pop()?.trim()
    );

    // Find recommended destinations by country, excluding booked ones
    const recommendedByCountry = destinations.filter(destination => {
      const country = destination.name.split(',').pop()?.trim();
      return (
        bookedCountries.includes(country) &&
        !userBookedDestinations.some(booked => {
          const bookedCountry = booked.name.split(',').pop()?.trim();
          return bookedCountry === country;
        })
      );
    });
    console.log('Recommended by country: ', recommendedByCountry);

    // If there are recommendations by country, sort them
    if (recommendedByCountry.length) {
      recommendedByCountry.sort((a, b) => {
        const countryA = a.name.split(',').pop()?.trim();
        const countryB = b.name.split(',').pop()?.trim();
        return countryA.localeCompare(countryB);
      });
    }

    console.log('Sorted recommended by country: ', recommendedByCountry);
    // Find recommended destinations by continent, excluding booked ones
    const recommendedByContinent = [];
    const continents = userBookedDestinations?.flatMap(
      destination => destination?.continents
    );

    recommendedByContinent.push(
      ...destinations.filter(destination => {
        return (
          destination.continents.some(continent =>
            continents.includes(continent)
          ) &&
          !userBookedDestinations.some(booked => {
            const bookedCountry = booked.name.split(',').pop()?.trim();
            return bookedCountry === destination.name.split(',').pop()?.trim();
          })
        );
      })
    );

    // If there are recommendations by continent, sort them by country
    if (recommendedByContinent.length) {
      recommendedByContinent.sort((a, b) => {
        const countryA = a.name.split(',').pop()?.trim();
        const countryB = b.name.split(',').pop()?.trim();
        return countryA.localeCompare(countryB);
      });
    }

    // Return recommendations, prioritizing country and excluding booked destinations
    return recommendedByCountry.length
      ? recommendedByCountry
      : recommendedByContinent;
  }, [user, userBookedDestinations, destinations]);

  // console.log(userBookedDestinations);
  // console.log(recommendedDestinations);

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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
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
    dispatch(getBookings());
  }, [dispatch]);

  useEffect(() => {
    if (isErrorUser) {
      toast.error(userErrorMessage);
    }

    if (isErrorDestinations) {
      toast.error(destinationsErrorMessage);
    }

    if (isErrorReviews) {
      toast.error(reviewsErrorMessage);
    }
  }, [
    isErrorUser,
    isErrorDestinations,
    isErrorReviews,
    userErrorMessage,
    destinationsErrorMessage,
    reviewsErrorMessage,
  ]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className={styles.wrapper}>
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
                    onKeyDown={handleKeyDown}
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
                          <p>{destination.briefDescription}</p>
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

          {/* {!user && ( */}
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
        {recommendedDestinations?.length > 0 ? (
          <div className={styles.additionalDestinationsContainer}>
            <div className={styles.additionalDestinations}>
              <h2 className={styles.mainTitle}>Recommended for you</h2>
              {isLoadingDestinations ? (
                <Spinner
                  width={64}
                  height={64}
                />
              ) : (
                <Carousel items={recommendedDestinations} />
              )}
            </div>
          </div>
        ) : (
          popularDestinations.length > 0 && (
            <div className={styles.additionalDestinationsContainer}>
              <div className={styles.additionalDestinations}>
                <h2 className={styles.mainTitle}>Popular Destinations</h2>
                {isLoadingDestinations ? (
                  <Spinner
                    width={64}
                    height={64}
                  />
                ) : (
                  <Carousel items={popularDestinations} />
                )}
              </div>
            </div>
          )
        )}
        <div className={styles.experiencesContainer}>
          {reviews?.length > 0 && (
            <>
              <h2 className={styles.mainTitle}>Experiences</h2>
              <h3 className={styles.title}>Hear from fellow travellers! </h3>
              {isLoadingReviews ? (
                <Spinner
                  width={64}
                  height={64}
                />
              ) : (
                <Carousel items={reviews} />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
