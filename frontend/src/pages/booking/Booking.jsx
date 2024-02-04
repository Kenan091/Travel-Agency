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

  // const [formData, setFormData] = useState({
  //   arrivalDate: '',
  //   departureDate: '',
  //   numberOfTravelers: '',
  // });

  // const { arrivalDate, departureDate, numberOfTravelers } = formData;

  const [bookingFormData, setBookingFormData] = useState({
    arrivalDate: '',
    departureDate: '',
    numberOfTravelers: '',
  });

  const [paymentFormData, setPaymentFormData] = useState({
    cardHolderFullName: '',
    cardNumber: '',
    cardVerificationValue: '',
    cardExpirationDate: '',
  });

  const { arrivalDate, departureDate, numberOfTravelers } = bookingFormData;
  const {
    cardHolderFullName,
    cardNumber,
    cardVerificationValue,
    cardExpirationDate,
  } = paymentFormData;

  const dispatch = useDispatch();
  const destination = useSelector(
    state => state?.destination?.destination?.data
  );
  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );

  // const { isError } = useSelector(state => state?.booking);
  // const message = useSelector(state => state?.booking?.message);

  // const { user } = useSelector(state => state.auth);

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

  // const handleInputChange = e => {
  //   const { name, value } = e.target;

  //   setFormData(prevData => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;

    if (formType === 'booking') {
      setBookingFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    } else if (formType === 'payment') {
      let updatedValue = value;

      if (name === 'cardNumber') {
        updatedValue = value.slice(0, 16); // Limit to 16 digits
      } else if (name === 'cardVerificationValue') {
        updatedValue = value.slice(0, 3); // Limit to 3 digits
      } else if (name === 'cardExpirationDate') {
        updatedValue = value
          .replace(/\D/g, '') // Remove non-digits
          .slice(0, 6); // Limit to 4 digits (MMYY or MMYYYY)

        if (updatedValue.length > 2) {
          // Add a '/' after the first two digits
          updatedValue = `${updatedValue.slice(0, 2)}/${updatedValue.slice(2)}`;

          // Validate month (01 to 12)
          const month = parseInt(updatedValue.slice(0, 2), 10);
          if (month < 1 || month > 12) {
            // Display an error or handle invalid month input
            return;
          }
        }
      }

      setPaymentFormData(prevData => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const handleDateBlur = () => {
    setActiveInputType(null);
  };
  const validateForm = () => {
    // Validate booking form
    if (
      !arrivalDate ||
      !departureDate ||
      !numberOfTravelers
      // isNaN(numberOfTravelers)
    ) {
      toast.error(
        'Please provide valid input for arrival date, departure date and number of travelers.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return false;
    }

    // Validate payment form
    if (
      !cardHolderFullName ||
      !cardNumber ||
      !cardVerificationValue ||
      !cardExpirationDate ||
      !/^\d{16}$/.test(cardNumber) ||
      !/^\d{3}$/.test(cardVerificationValue) ||
      !/^(0[1-9]|1[0-2])\/(20\d{2}|21[0-9]{2})$/.test(cardExpirationDate)
    ) {
      toast.error('Please provide valid input for all payment fields.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return false;
    }

    return true;
  };

  const handleBooking = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const destinationId = id;
    const bookingData = {
      destinationId,
      arrivalDate,
      departureDate,
      numberOfTravelers,
      totalPrice,
    };

    dispatch(createBooking(bookingData));

    toast.success(
      `You have completed the booking process for a trip to ${destination.name}. You will hear from us shortly!`,
      {
        position: 'top-right',
        autoClose: false,
        onClose: () => {
          console.log('Toast closed');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        },
      }
    );
  };

  // const handleBooking = async e => {
  //   e.preventDefault();

  //   if (
  //     !arrivalDate ||
  //     !departureDate ||
  //     !numberOfTravelers ||
  //     isNaN(numberOfTravelers)
  //   ) {
  //     toast.error(
  //       'Please provide valid input for arrival date, departure date and number of travelers.',
  //       {
  //         position: 'top-right',
  //         autoClose: 5000,
  //       }
  //     );
  //     return;
  //   }
  //   const destinationId = id;
  //   const bookingData = {
  //     destinationId,
  //     arrivalDate,
  //     departureDate,
  //     numberOfTravelers,
  //     totalPrice,
  //   };

  //   console.log(bookingData);
  //   dispatch(createBooking(bookingData));

  //   toast.success(
  //     `You have completed the booking process for a trip to ${destination.name}. You will hear from us shortly, check your email inbox!`,
  //     {
  //       position: 'top-right',
  //       autoClose: false,
  //       onClose: () => {
  //         console.log('Toast closed');
  //         setTimeout(() => {
  //           navigate('/');
  //         }, 2000);
  //       },
  //     }
  //   );
  // };

  console.log(arrivalDate, departureDate, numberOfTravelers);
  console.log(
    cardHolderFullName,
    cardNumber,
    cardVerificationValue,
    cardExpirationDate
  );

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
                          onChange={e => handleInputChange(e, 'booking')}
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
                          onChange={e => handleInputChange(e, 'booking')}
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

                          value = value.replace(/[^0-9]/g, '');

                          if (value !== '' && parseInt(value, 10) > 0) {
                            setBookingFormData(prevData => ({
                              ...prevData,
                              numberOfTravelers: value,
                            }));
                          } else {
                            setBookingFormData(prevData => ({
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
                  {bookingFormData.numberOfTravelers && (
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
                      name='cardHolderFullName'
                      placeholder='Cardholder Name and Surname'
                      onChange={e => handleInputChange(e, 'payment')}
                      value={cardHolderFullName}
                    />
                    <input
                      type='text'
                      name='cardNumber'
                      placeholder='Card Number'
                      onChange={e => handleInputChange(e, 'payment')}
                      value={cardNumber}
                      maxLength={16}
                    />
                    <div className={styles.separatedDetails}>
                      <input
                        type='text'
                        name='cardVerificationValue'
                        placeholder='CVV'
                        onChange={e => handleInputChange(e, 'payment')}
                        value={cardVerificationValue}
                        maxLength={3}
                      />
                      <input
                        type='text'
                        name='cardExpirationDate'
                        placeholder='MM/YY or MM/YYYY'
                        onChange={e => handleInputChange(e, 'payment')}
                        value={cardExpirationDate}
                        maxLength={7}
                      />
                    </div>
                  </div>
                  {/* <div className={styles.paymentInputs}>
                    <input
                      type='text'
                      name='cardHolderFullName'
                      placeholder='Cardholder Name and Surname'
                      onChange={handleInputChange}
                      value={cardHolderFullName}
                    />
                    <input
                      type='text'
                      name='cardNumber'
                      placeholder='Card Number'
                      onChange={handleInputChange}
                    />
                    <div className={styles.separatedDetails}>
                      <input
                        type='text'
                        name='cardVerificationValue'
                        placeholder='CVV'
                      />
                      <input
                        type='text'
                        name='cardExpirationDate'
                        placeholder='MM/YY'
                      />
                    </div>
                  </div> */}
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
      {/* <form
                  onSubmit={handleBooking}
                  className={styles.payment}>
                  <h1>Payment</h1>
                  <div className={styles.paymentInputs}>
                    <input
                      type='text'
                      name='cardHolderFullName'
                      placeholder='Cardholder Name and Surname'
                    />
                    <input
                      type='text'
                      name='cardNumber'
                      placeholder='Card Number'
                    />
                    <div className={styles.separatedDetails}>
                      <input
                        type='text'
                        name='cardVerificationValue'
                        placeholder='CVV'
                      />
                      <input
                        type='text'
                        name='cardExpirationDate'
                        placeholder='MM/YY'
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
      <Footer /> */}
    </>
  );
};

export default Bookings;
