import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminFeedback.module.css';
import {
  deleteFeedback,
  getFeedbacks,
} from '../../redux/feedback/feedbacksSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/spinner/Spinner';
import getRegularDate from '../../helpers/useGetDate';
import Pagination from '../../components/pagination/Pagination';
import { IoTrash } from 'react-icons/io5';

const AdminFeedback = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector(state => state?.feedback?.feedbacks);
  const isLoadingFeedbacks = useSelector(state => state?.feedback?.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = feedbacks?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const numberOfPages = Math.ceil(feedbacks?.length / recordsPerPage);

  const onDelete = feedbackId => {
    dispatch(deleteFeedback(feedbackId));
  };

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Welcome admin!</h1>
        {currentRecords.length > 0 ? (
          <div className={styles.feedbacks}>
            <h1 className={styles.tableTitle}>Contact Forms</h1>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableCell}>Full name</th>
                  <th className={styles.tableCell}>Date created</th>
                  <th className={styles.tableCell}>Email address</th>
                  <th className={styles.tableCell}>Message</th>
                  <th className={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <>
                  {isLoadingFeedbacks ? (
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
                      {currentRecords?.map(feedback => (
                        <tr
                          key={feedback?._id}
                          className={styles.tableDataRow}>
                          <td className={styles.tableDataCell}>
                            {feedback?.user_name}
                          </td>
                          <td className={styles.tableDataCell}>
                            {getRegularDate(feedback?.createdAt)}
                          </td>
                          <td className={styles.tableDataCell}>
                            {feedback?.user_email}
                          </td>
                          <td className={styles.tableDataCell}>
                            {feedback?.message}
                          </td>
                          <td className={styles.tableDataCell}>
                            <div
                              className={styles.actionButton}
                              onClick={() => onDelete(feedback?._id)}>
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
                </>
              </tbody>
            </table>
            <div className={styles.accordionContainer}>
              {isLoadingFeedbacks ? (
                <Spinner
                  width={64}
                  height={64}
                />
              ) : (
                <>
                  {currentRecords?.map(feedback => (
                    <div
                      key={feedback?._id}
                      className={styles.accordionItem}>
                      <div className={styles.accordionContent}>
                        <div className={styles.accordionText}>
                          <strong>Name: </strong>
                          {feedback?.user_name}
                        </div>
                        <div className={styles.accordionText}>
                          <strong>Date created: </strong>
                          {getRegularDate(feedback?.createdAt)}
                        </div>
                        <div className={styles.accordionText}>
                          <strong>Email: </strong>
                          {feedback?.user_email}
                        </div>
                        <div className={styles.accordionText}>
                          <strong>Message: </strong>
                          {feedback?.message}
                        </div>
                        <div className={styles.actionButtons}>
                          <div
                            className={styles.actionButton}
                            onClick={() => onDelete(feedback?._id)}>
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
        ) : (
          <p className={styles.noFeedback}>
            Currently, there are no messages or feedback to display. It seems
            our users haven't reached out via the contact form yet.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminFeedback;
