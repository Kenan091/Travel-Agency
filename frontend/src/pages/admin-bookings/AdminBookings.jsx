import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminBookings.module.css';
import { deleteBooking, getBookings } from '../../redux/bookings/bookingsSlice';
import Header from '../../components/header/Header';
import Spinner from '../../components/spinner/Spinner';
import Pagination from '../../components/pagination/Pagination';
import Footer from '../../components/footer/Footer';
import getRegularDate from '../../helpers/useGetRegularDate';
import { IoTrash } from 'react-icons/io5';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const bookings = useSelector(state => state?.booking?.bookings);
  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);

  const currentRecords = bookings?.slice(indexOfFirstRecord, indexOfLastRecord);

  const numberOfPages = Math.ceil(bookings?.length / recordsPerPage);

  const onDelete = bookingId => {
    console.log('Ready for deleting');
    dispatch(deleteBooking(bookingId));
  };

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  console.log(bookings);

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Welcome admin!</h1>
        <div className={styles.bookings}>
          <h1 className={styles.tableTitle}>Bookings</h1>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableCell}>Destination</th>
                <th className={styles.tableCell}>Date Created</th>
                <th className={styles.tableCell}>Description</th>
                <th className={styles.tableCell}>Total Price</th>
                <th className={styles.tableCell}>Username</th>
                <th className={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingBookings ? (
                <tr>
                  <td
                    colSpan='6'
                    style={{ padding: 16 }}>
                    <Spinner
                      width={64}
                      height={64}
                    />
                  </td>
                </tr>
              ) : (
                <>
                  {currentRecords?.map(booking => (
                    <tr
                      key={booking._id}
                      className={styles.tableDataRow}>
                      <td className={styles.tableDataCell}>
                        {booking.destination.name}
                      </td>
                      <td className={styles.tableDataCell}>
                        {getRegularDate(booking.createdAt)}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking.destination.briefDescription}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking.totalPrice}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking.user.name}
                      </td>
                      <td className={styles.tableDataCell}>
                        <div
                          className={styles.actionButton}
                          onClick={() => onDelete(booking._id)}>
                          <IoTrash
                            size={28}
                            color='#ff1e1e'
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          <div className={styles.accordionContainer}>
            {isLoadingBookings ? (
              <Spinner
                width={64}
                height={64}
              />
            ) : (
              <>
                {currentRecords?.map(booking => (
                  <div
                    key={booking._id}
                    className={styles.accordionItem}>
                    <div className={styles.accordionContent}>
                      <div className={styles.accordionText}>
                        <strong>Name: </strong>
                        {booking.destination.name}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Date created: </strong>
                        {getRegularDate(booking.createdAt)}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Description: </strong>
                        {booking.destination.briefDescription}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Total price: </strong>
                        {booking.totalPrice} BAM
                      </div>
                      <div className={styles.accordionText}>
                        <strong>User: </strong>
                        {booking.user.name}
                      </div>
                      <div className={styles.actionButtons}>
                        <div
                          className={styles.actionButton}
                          onClick={() => onDelete(booking._id)}>
                          <IoTrash
                            size={28}
                            color='#ff1e1e'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <Pagination
            numberOfPages={numberOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminBookings;
