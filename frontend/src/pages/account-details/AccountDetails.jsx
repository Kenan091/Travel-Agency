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
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from '../../redux/reviews/reviewsSlice';

import ReactStars from 'react-rating-stars-component';

import {
  IoAdd,
  IoClose,
  IoPencil,
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoTrash,
} from 'react-icons/io5';

const AccountDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  const { user, isError } = useSelector(state => state?.auth);
  const message = useSelector(state => state?.auth?.message);

  const bookings = useSelector(state => state?.booking?.bookings);

  const isLoadingBookings = useSelector(state => state?.booking?.isLoading);
  const userBookings =
    bookings?.filter(booking => booking.user._id === user?.user?._id) || [];

  const reviews = useSelector(state => state?.review?.reviews);
  const review = useSelector(state => state?.review?.review);
  const isLoadingReviews = useSelector(state => state?.review?.isLoading);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    comment: '',
    rating: '',
  });

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
  console.log('Reviews:', reviews);
  console.log('Review for editing: ', review);

  const handleNavigationToExperiencesPage = destinationId => {
    navigate(`/experiences/${destinationId}`);
    window.scrollTo(0, 0);
  };

  const hasReviewForDestination = (destinationId, userId) => {
    return reviews.some(
      review =>
        review.destination._id === destinationId && review.user._id === userId
    );
  };

  const onOpenModal = (id = null) => {
    console.log(id);
    setModalOpen(true);
    setEditReviewId(id);
    if (id) {
      dispatch(getReview(id));
    }
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setEditReviewId(null);
  };

  const handleEditReview = reviewId => {
    // dispatch(updateReview(reviewId));
    console.log(`Ready for editing ${reviewId}`);
    onOpenModal(reviewId);
    setFormData({
      name: review?.destination?.name,
      title: review?.title,
      comment: review?.comment,
      rating: review?.rating,
    });
  };

  const handleDeleteReview = reviewId => {
    // dispatch(deleteReview(reviewId));
    console.log(`Deleted ${reviewId}`);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const saveReview = e => {
    e.preventDefault();

    if (editReviewId) {
      dispatch(
        updateReview({
          reviewId: editReviewId,
          updatedData: formData,
        })
      );
      onCloseModal();
    }
  };

  useEffect(() => {
    dispatch(getBookings());
    dispatch(getReviews());

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
              <Spinner
                width={64}
                height={64}
              />
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
                        {/* <th className={styles.tableCell}>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords?.map(booking => (
                        <tr
                          key={booking._id}
                          className={styles.tableDataRow}>
                          <td className={styles.tableDataCell}>
                            {booking.destination.name}
                          </td>
                          <td className={styles.tableDataCell}>
                            {getRegularDate(booking.departureDate)} -{' '}
                            {getRegularDate(booking.returnDate)}
                          </td>
                          <td className={styles.tableDataCell}>
                            {booking.numberOfTravelers}
                          </td>
                          <td className={styles.tableDataCell}>
                            {booking.totalPrice} BAM
                          </td>
                          {/* <td className={styles.tableDataCell}>
                            {hasReviewForDestination(
                              booking.destination._id,
                              user.user._id
                            ) ? (
                              <>
                                {isLoadingReviews ? (
                                  <Spinner />
                                ) : (
                                  <>
                                    <button
                                      className={styles.reviewAction}
                                      onClick={() =>
                                        handleEditReview(review._id)
                                      }>
                                      <IoPencil
                                        size={20}
                                        color='#83ab55'
                                      />
                                      <p>Edit review</p>
                                    </button>
                                    <button
                                      className={styles.reviewAction}
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }>
                                      <IoTrash
                                        size={20}
                                        color='#ff1e1e'
                                      />
                                      <p>Delete review</p>
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <button
                                className={styles.reviewAction}
                                onClick={() =>
                                  handleNavigationToExperiencesPage(
                                    booking.destination._id
                                  )
                                }>
                                <IoAdd
                                  size={20}
                                  color='#061e25'
                                />
                                <p>Add review</p>
                              </button>
                            )}
                          </td> */}
                        </tr>
                      ))}
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
                                {booking?.destination?.name}
                              </div>
                              <div className={styles.accordionText}>
                                <strong>Date created: </strong>
                                {getRegularDate(booking?.createdAt)}
                              </div>
                              <div className={styles.accordionText}>
                                <strong>Description: </strong>
                                {booking?.destination?.briefDescription}
                              </div>
                              <div className={styles.accordionText}>
                                <strong>Total price: </strong>
                                {booking?.totalPrice} BAM
                              </div>
                              <div className={styles.accordionText}>
                                <strong>User: </strong>
                                {booking?.user?.name}
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
              </>
            ) : (
              <div className={styles.noBookedDestinationsDiv}>
                <p>You haven't booked any destinations.</p>
              </div>
            )}

            <div className={styles.writeReviewDiv}>
              <p>
                If you want to write review for one of your booked destinations
                go to:
              </p>
              <button>
                <Link to='/experiences'>Experiences</Link>
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AccountDetails;
