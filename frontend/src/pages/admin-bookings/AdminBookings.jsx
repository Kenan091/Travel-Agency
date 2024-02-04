import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminBookings.module.css';
import { getBookings } from '../../redux/bookings/bookingsSlice';
import { getUsers } from '../../redux/users/usersSlice';
import Header from '../../components/header/Header';
import Spinner from '../../components/spinner/Spinner';
import Footer from '../../components/footer/Footer';
import getRegularDate from '../../helpers/useGetRegularDate';
import truncateDescription from '../../helpers/useTruncateDescription';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import Pagination from '../../components/pagination/Pagination';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const bookings = useSelector(state => state?.booking?.bookings?.data);
  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);

  // const users = useSelector(state => state?.user?.users?.data);
  // const isLoadingUsers = useSelector(state => state?.user?.isLoading);

  const currentRecords = bookings?.slice(indexOfFirstRecord, indexOfLastRecord);

  const numberOfPages = Math.ceil(bookings?.length / recordsPerPage);

  const onApprove = () => {
    console.log('Approving booking');
  };

  const onDisapprove = () => {
    console.log('Disapproving booking');
  };

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getUsers());
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
                  <td>
                    <Spinner />
                  </td>
                </tr>
              ) : (
                <>
                  {currentRecords?.map(booking => (
                    <tr
                      key={booking?._id}
                      className={styles.tableDataRow}>
                      <td className={styles.tableDataCell}>
                        {booking?.destination?.name}
                      </td>
                      <td className={styles.tableDataCell}>
                        {getRegularDate(booking?.createdAt)}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking?.destination?.briefDescription}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking?.totalPrice}
                      </td>
                      <td className={styles.tableDataCell}>
                        {booking?.user?.name}
                      </td>
                      <td className={styles.tableDataCell}>
                        <div>
                          {' '}
                          <div
                            className={styles.actionButton}
                            onClick={() => onApprove(booking?._id)}>
                            <IoCheckmark
                              size={28}
                              color='#83ab55'
                            />
                          </div>
                          <div
                            className={styles.actionButton}
                            onClick={() => onDisapprove(booking?._id)}>
                            <IoClose
                              size={28}
                              color='#ff1e1e'
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
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
