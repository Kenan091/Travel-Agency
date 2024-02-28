import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './AdminUsers.module.css';
import { deleteUser, getUsers } from '../../redux/users/usersSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/spinner/Spinner';
import { IoTrash } from 'react-icons/io5';
import Pagination from '../../components/pagination/Pagination';
import getRegularDate from '../../helpers/useGetDate';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const users = useSelector(state => state?.user?.users);
  const { isError } = useSelector(state => state?.user?.isError);
  const message = useSelector(state => state?.user?.message);
  const isLoadingUsers = useSelector(state => state?.user?.isLoading);
  const filteredUsers = users
    ? users.filter(user => user.email !== 'admin@gmail.com')
    : [];

  const currentRecords = filteredUsers?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const numberOfPages = Math.ceil(filteredUsers?.length / recordsPerPage);

  const onDelete = userId => {
    dispatch(deleteUser(userId));
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Welcome admin!</h1>
        <div className={styles.users}>
          <h1 className={styles.tableTitle}>Users</h1>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableCell}>User ID</th>
                <th className={styles.tableCell}>Full Name</th>
                <th className={styles.tableCell}>Registration Date</th>
                <th className={styles.tableCell}>Email Address</th>
                <th className={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan='5'>
                    <Spinner
                      width={64}
                      height={64}
                    />
                  </td>
                </tr>
              ) : (
                <>
                  {currentRecords?.map(user => (
                    <tr
                      className={styles.tableDataRow}
                      key={user._id}>
                      <td className={styles.tableDataCell}>{user._id}</td>
                      <td className={styles.tableDataCell}>{user.name}</td>
                      <td className={styles.tableDataCell}>
                        {getRegularDate(user.createdAt)}
                      </td>
                      <td className={styles.tableDataCell}>{user.email}</td>
                      <td className={styles.tableDataCell}>
                        <div
                          className={styles.actionButton}
                          onClick={() => onDelete(user._id)}>
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
            {isLoadingUsers ? (
              <Spinner
                width={64}
                height={64}
              />
            ) : (
              <>
                {currentRecords?.map(user => (
                  <div
                    key={user._id}
                    className={styles.accordionItem}>
                    <div className={styles.accordionContent}>
                      <div className={styles.accordionText}>
                        <strong>User ID: </strong>
                        {user?._id}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Full name: </strong>
                        {user?.name}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Registration date: </strong>
                        {getRegularDate(user?.createdAt)}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Email address: </strong>
                        {user?.email}
                      </div>
                      <div className={styles.actionButtons}>
                        <div
                          className={styles.actionButton}
                          onClick={() => onDelete(user?._id)}>
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

export default AdminUsers;
