import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Booking.module.css';
import { getDestination } from '../../redux/destinations/destinationsSlice';
import {
  checkDestinationBooking,
  createBooking,
} from '../../redux/bookings/bookingsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/spinner/Spinner';
import { IoCashSharp, IoPeopleSharp } from 'react-icons/io5';
import { RiCalendar2Fill } from 'react-icons/ri';
import DatePicker from '../../components/date-picker/DatePicker';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingFormData, setBookingFormData] = useState({
    departureDate: '',
    returnDate: '',
    numberOfTravelers: '',
  });

  const [paymentFormData, setPaymentFormData] = useState({
    cardHolderFullName: '',
    cardNumber: '',
    cardVerificationValue: '',
    cardExpirationDate: '',
  });

  const { departureDate, returnDate, numberOfTravelers } = bookingFormData;
  const {
    cardHolderFullName,
    cardNumber,
    cardVerificationValue,
    cardExpirationDate,
  } = paymentFormData;

  const dispatch = useDispatch();
  const destination = useSelector(state => state?.destination?.destination);
  const isLoadingDestination = useSelector(
    state => state?.destination?.isLoading
  );
  const bookingMessage = useSelector(state => state?.booking?.message);

  const totalPrice = destination?.price * parseInt(numberOfTravelers);

  useEffect(() => {
    dispatch(getDestination(id));
  }, [dispatch]);

  const handleDateChange = (date, type) => {
    setBookingFormData(prevData => ({
      ...prevData,
      [type]: date,
    }));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === 'cardNumber') {
      updatedValue = value.slice(0, 16); // Limit to 16 digits
    } else if (name === 'cardVerificationValue') {
      updatedValue = value.slice(0, 3); // Limit to 3 digits
    } else if (name === 'cardExpirationDate') {
      updatedValue = value
        .replace(/\D/g, '') // Remove non-digits
        .slice(0, 6); // Limit to 4 digits (MMYY)

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
  };

  const validateForm = () => {
    // Validate booking form
    if (!departureDate || !returnDate || !numberOfTravelers) {
      toast.warn(
        'Please provide valid input for departure date, return date and number of travelers.',
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
      !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpirationDate)
    ) {
      toast.warn('Please provide valid input for all payment fields.', {
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

    if (new Date(departureDate) >= new Date(returnDate)) {
      toast.warn('Return date must be after departure date.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    const destinationId = id;
    const bookingData = {
      destinationId,
      departureDate,
      returnDate,
      numberOfTravelers,
      totalPrice,
    };

    dispatch(createBooking(bookingData));

    toast.success(
      `You have completed the booking process for a trip to ${destination.name}.`,
      {
        position: 'top-right',
        autoClose: true,
        onClose: () => {
          setTimeout(() => {
            navigate('/');
          }, 1000);
        },
      }
    );
  };

  useEffect(() => {
    if (departureDate && returnDate) {
      dispatch(
        checkDestinationBooking({
          destinationId: id,
          departureDate: departureDate,
          returnDate: returnDate,
        })
      );
    }
  }, [dispatch, id, bookingFormData.departureDate, bookingFormData.returnDate]);

  useEffect(() => {
    if (bookingMessage !== '') {
      toast.info(bookingMessage);
    }
  }, [bookingMessage, departureDate, returnDate]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerDiv}>
          <Header />
        </div>
        {isLoadingDestination ? (
          <Spinner
            width={64}
            height={64}
          />
        ) : (
          <>
            {destination ? (
              <div className={styles.booking}>
                <div className={styles.bookingForm}>
                  <h2 className={styles.destinationName}>{destination.name}</h2>
                  <p className={styles.destinationDescription}>
                    {destination.briefDescription}
                  </p>
                  <form className={styles.details}>
                    <div className={styles.priceDiv}>
                      <IoCashSharp size={24} />
                      <span className={styles.price}>
                        {destination.price} BAM
                      </span>
                    </div>
                    <div className={styles.datesDiv}>
                      <RiCalendar2Fill
                        size={32}
                        color='#082831'
                      />
                      <div className={styles.dateInputs}>
                        <div className={styles.datePickerDiv}>
                          <DatePicker
                            onDateChange={date =>
                              handleDateChange(date, 'departureDate')
                            }
                          />
                          <p style={{ fontSize: 15 }}>Departure</p>
                        </div>
                        <span> - </span>

                        <div className={styles.datePickerDiv}>
                          <DatePicker
                            onDateChange={date =>
                              handleDateChange(date, 'returnDate')
                            }
                          />
                          <p style={{ fontSize: 15 }}>Return</p>
                        </div>
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
                          const value = e.target.value.replace(/[^0-9]/g, '');

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
                        onKeyDown={e => {
                          const isCtrlPressed = e.ctrlKey || e.metaKey; // For Mac Command key

                          // Allow Ctrl+C (copy), Ctrl+V (paste), Ctrl+X (cut), Ctrl+A (select all)
                          if (
                            isCtrlPressed &&
                            ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
                          ) {
                            return;
                          }

                          if (
                            e.altKey ||
                            (e.altGraphKey && e.key.length === 1)
                          ) {
                            e.preventDefault();
                            return;
                          }

                          // Allow digits, Backspace, Delete, Arrow keys, and Tab
                          if (
                            /[0-9\b]|ArrowLeft|ArrowRight|Backspace|Delete|Tab/.test(
                              e.key
                            ) ||
                            // Allow Ctrl+ combinations
                            (isCtrlPressed &&
                              ['c', 'v', 'x', 'a'].includes(
                                e.key.toLowerCase()
                              ))
                          ) {
                            return;
                          }

                          e.preventDefault(); // Prevent the default action for other keys
                        }}
                        placeholder='1'
                      />
                    </div>
                  </form>
                  <hr className={styles.separationLine} />
                  {numberOfTravelers && (
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
                      // onChange={e => handleInputChange(e)}
                      onChange={e => {
                        let value = e.target.value.replace(
                          /[^a-zA-ZčćžšđČĆŽŠĐ\s]/g,
                          ''
                        ); // Remove any non-letter characters except space and Bosnian letters

                        // Prevent space as the first character
                        if (value.startsWith(' ')) {
                          value = value.trimStart();
                        }

                        // Ensure only one space after each word
                        value = value.replace(/\s+/g, ' ');

                        // Capitalize the first letter of each word
                        value = value.replace(/\b\w/g, char =>
                          char.toUpperCase()
                        );

                        setPaymentFormData(prevData => ({
                          ...prevData,
                          cardHolderFullName: value,
                        }));
                      }}
                      onKeyDown={e => {
                        const isCtrlPressed = e.ctrlKey || e.metaKey;

                        // Allow Ctrl+C (copy), Ctrl+V (paste), Ctrl+X (cut), Ctrl+A (select all)
                        if (
                          isCtrlPressed &&
                          ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
                        ) {
                          return;
                        }

                        // Allow letters, Backspace, Arrow keys, and Tab
                        if (
                          /[a-zA-ZčćžšđČĆŽŠĐ\s\b]|ArrowLeft|ArrowRight|Delete|Tab/.test(
                            e.key
                          ) ||
                          // Allow Ctrl+ combinations
                          (isCtrlPressed &&
                            ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase()))
                        ) {
                          return;
                        }

                        e.preventDefault(); // Prevent the default action for other keys
                      }}
                      value={cardHolderFullName}
                    />
                    <input
                      type='text'
                      name='cardNumber'
                      placeholder='Card Number (16 digits)'
                      onChange={e => handleInputChange(e)}
                      onKeyDown={e => {
                        const isCtrlPressed = e.ctrlKey || e.metaKey;

                        if (
                          isCtrlPressed &&
                          ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
                        ) {
                          return;
                        }

                        if (e.altKey || (e.altGraphKey && e.key.length === 1)) {
                          e.preventDefault();
                          return;
                        }

                        if (
                          /[0-9\b]|ArrowLeft|ArrowRight|Backspace|Delete|Tab/.test(
                            e.key
                          ) ||
                          (isCtrlPressed &&
                            ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase()))
                        ) {
                          return;
                        }

                        e.preventDefault();
                      }}
                      value={cardNumber}
                      maxLength={16}
                    />
                    <div className={styles.separatedDetails}>
                      <input
                        type='text'
                        name='cardVerificationValue'
                        placeholder='CVV'
                        onChange={e => handleInputChange(e)}
                        onKeyDown={e => {
                          const isCtrlPressed = e.ctrlKey || e.metaKey;

                          if (
                            isCtrlPressed &&
                            ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
                          ) {
                            return;
                          }

                          if (
                            e.altKey ||
                            (e.altGraphKey && e.key.length === 1)
                          ) {
                            e.preventDefault();
                            return;
                          }

                          if (
                            /[0-9\b]|ArrowLeft|ArrowRight|Backspace|Delete|Tab/.test(
                              e.key
                            ) ||
                            (isCtrlPressed &&
                              ['c', 'v', 'x', 'a'].includes(
                                e.key.toLowerCase()
                              ))
                          ) {
                            return;
                          }

                          e.preventDefault();
                        }}
                        value={cardVerificationValue}
                        maxLength={3}
                      />
                      <input
                        type='text'
                        name='cardExpirationDate'
                        placeholder='MM/YY'
                        onChange={e => handleInputChange(e)}
                        value={cardExpirationDate}
                        maxLength={7}
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

export default Booking;
