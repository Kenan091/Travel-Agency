import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './AccountDetails.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import getRegularDate from '../../helpers/useGetRegularDate';
import Spinner from '../../components/spinner/Spinner';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';

const AccountDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError } = useSelector(state => state?.auth);
  const message = useSelector(state => state?.auth?.message);

  const bookings = useSelector(state => state?.booking?.bookings?.data);

  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);
  const userBookings =
    bookings?.filter(booking => booking.user._id === user?.user?._id) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = userBookings.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const numberOfPages = Math.ceil(userBookings.length / recordsPerPage);
  console.log('Bookings:', bookings);
  console.log('User bookings: ', userBookings);

  const handleNavigationToExperiencesPage = destinationId => {
    navigate(`/experiences/${destinationId}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    dispatch(getBookings());

    if (isError) {
      toast.error(message);
    }
  }, []);

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        {user && (
          <>
            <h2 className={styles.mainTitle}>Welcome {user.user.name}</h2>
            {isLoadingBookings ? (
              <Spinner />
            ) : userBookings && userBookings?.length > 0 ? (
              <>
                <div className={styles.usersBookings}>
                  <h3 className={styles.tableTitle}>Your travel history</h3>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.tableCell}>Place</th>
                        <th className={styles.tableCell}>Stay period</th>
                        <th className={styles.tableCell}>Travelers</th>
                        <th className={styles.tableCell}>Total price</th>
                        <th className={styles.tableCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords?.map(item => (
                        <tr
                          key={item._id}
                          className={styles.tableDataRow}>
                          <td className={styles.tableDataCell}>
                            {item.destination.name}
                          </td>
                          <td className={styles.tableDataCell}>
                            {getRegularDate(item.arrivalDate)} -{' '}
                            {getRegularDate(item.departureDate)}
                          </td>
                          <td className={styles.tableDataCell}>
                            {item.numberOfTravelers}
                          </td>
                          <td className={styles.tableDataCell}>
                            {item.totalPrice} BAM
                          </td>
                          <td className={styles.tableDataCell}>
                            <button
                              className={styles.addNewReview}
                              onClick={() =>
                                handleNavigationToExperiencesPage(
                                  item.destination._id
                                )
                              }>
                              Add review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    numberOfPages={numberOfPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <div className={styles.noBookedDestinationsDiv}>
                <p>You haven't booked any destinations.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AccountDetails;
