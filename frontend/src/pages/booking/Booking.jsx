import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Booking.module.css';
import { getDestinations } from '../../redux/destinations/destinationsSlice';
import { createBooking } from '../../redux/bookings/bookingsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/spinner/Spinner';
import { IoCashSharp, IoPeopleSharp } from 'react-icons/io5';
import { RiCalendar2Fill } from 'react-icons/ri';

const Bookings = () => {
  const [activeInputType, setActiveInputType] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    arrivalDate: '',
    departureDate: '',
    numberOfTravelers: '',
  });

  const { arrivalDate, departureDate, numberOfTravelers } = formData;

  const dispatch = useDispatch();
  const destination = useSelector(
    state => state?.destination?.destination?.data
  );
  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  const { isError } = useSelector(state => state?.booking);
  const message = useSelector(state => state?.booking?.message);

  const { user } = useSelector(state => state.auth);

  const totalPrice = destination?.price * parseInt(numberOfTravelers);

  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  const handleInputClick = inputType => {
    if (activeInputType === inputType) {
      setActiveInputType(null);
    } else {
      setActiveInputType(inputType);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateBlur = () => {
    setActiveInputType(null);
  };

  const handleBooking = async e => {
    e.preventDefault();

    if (
      !arrivalDate ||
      !departureDate ||
      !numberOfTravelers ||
      isNaN(numberOfTravelers)
    ) {
      toast.error(
        'Please provide valid input for arrival date, departure date and number of travelers.',
        {
          position: 'top-right',
          autoClose: 5000, // Close the toast after 5 seconds
        }
      );
      return; // Exit the function if validation fails
    }

    const destinationId = id;
    const bookingData = {
      destinationId,
      arrivalDate,
      departureDate,
      numberOfTravelers,
      totalPrice,
    };

    console.log(bookingData);
    dispatch(createBooking(bookingData));

    if (parseInt(numberOfTravelers) === 1) {
      toast.success(
        'You have completed the booking process for a trip to Tokyo, Japan. You will hear from us shortly, check your email inbox!',
        {
          position: 'top-right',
          autoClose: false,
          onClose: () => {
            console.log('Toast closed');
            setTimeout(() => {
              // You can use the navigate function here
              navigate('/');
            }, 2000);
          },
        }
      );
    } else if (parseInt(numberOfTravelers) > 1) {
      toast.success('You successfully booked tickets for this destination !', {
        position: 'top-right',
        autoClose: false,
        onClose: () => {
          console.log('Toast closed');
          setTimeout(() => {
            // You can use the navigate function here
            navigate('/');
          }, 2000);
        },
      });
    }
  };

  console.log(arrivalDate, departureDate, numberOfTravelers);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerDiv}>
          <Header />
        </div>
        {isLoadingDestination ? (
          <Spinner />
        ) : (
          <>
            {destination ? (
              <div className={styles.booking}>
                <div className={styles.bookingForm}>
                  <h2 className={styles.destinationName}>{destination.name}</h2>
                  <p className={styles.destinationDescription}>
                    {destination.description}
                  </p>
                  <form className={styles.details}>
                    <div className={styles.priceDiv}>
                      <IoCashSharp size={24} />
                      <span className={styles.price}>
                        {destination.price} BAM
                      </span>
                    </div>
                    <div className={styles.datesDiv}>
                      <div>
                        <RiCalendar2Fill
                          size={32}
                          color='#082831'
                        />
                      </div>
                      <div>
                        <input
                          type={
                            activeInputType === 'arrivalDate' ? 'date' : 'text'
                          }
                          name='arrivalDate'
                          onClick={() => handleInputClick('arrivalDate')}
                          onBlur={handleDateBlur}
                          onChange={handleInputChange}
                          readOnly={activeInputType !== 'arrivalDate'}
                          placeholder='Arrival date'
                        />
                        <span> - </span>
                        <input
                          type={
                            activeInputType === 'departureDate'
                              ? 'date'
                              : 'text'
                          }
                          name='departureDate'
                          onClick={() => handleInputClick('departureDate')}
                          onBlur={handleDateBlur}
                          onChange={handleInputChange}
                          readOnly={activeInputType !== 'departureDate'}
                          placeholder='Departure date'
                        />
                      </div>
                    </div>
                    <div className={styles.numberOfTravelersDiv}>
                      <IoPeopleSharp
                        size={32}
                        color='#082831'
                      />
                      <input
                        type='text'
                        name='numberOfTravelers'
                        onChange={e => {
                          let value = e.target.value;

                          // Remove non-numeric characters
                          value = value.replace(/[^0-9]/g, '');

                          // Ensure the value is a positive integer greater than 0
                          if (value !== '' && parseInt(value, 10) > 0) {
                            // If it's a valid input, update the state
                            setFormData(prevData => ({
                              ...prevData,
                              numberOfTravelers: value,
                            }));
                          } else {
                            // If it's not a valid input, set the state to an empty string
                            setFormData(prevData => ({
                              ...prevData,
                              numberOfTravelers: '',
                            }));
                          }
                        }}
                        placeholder='1'
                      />
                    </div>
                  </form>
                  <hr className={styles.separationLine} />
                  {formData.numberOfTravelers && (
                    <div className={styles.totalPriceDiv}>
                      <h2 className={styles.totalPriceLabel}>Total price: </h2>
                      <p className={styles.totalPriceValue}>{totalPrice} BAM</p>
                    </div>
                  )}
                </div>
                <form
                  onSubmit={handleBooking}
                  className={styles.payment}>
                  <h1>Payment</h1>
                  <div className={styles.paymentInputs}>
                    <input
                      type='text'
                      placeholder='Cardholder Name and Surname'
                    />
                    <input
                      type='text'
                      placeholder='Card Number'
                    />
                    <div className={styles.separatedDetails}>
                      <input
                        type='text'
                        placeholder='CVV'
                      />
                      <input
                        type='text'
                        placeholder='MM YYYY'
                      />
                    </div>
                  </div>
                  <button
                    type='submit'
                    className={styles.finishPaymentButton}>
                    Finish
                  </button>
                </form>
              </div>
            ) : (
              <p className={styles.dataParagraph}>No data available.</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Bookings;
