import React, { useCallback, useState } from 'react';
import styles from './Review.module.css';
import { IoPencil, IoPerson, IoTrash } from 'react-icons/io5';
import getRegularDate, { formatDate } from '../../helpers/useGetDate';
import Spinner from '../spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, updateReview } from '../../redux/reviews/reviewsSlice';

const Review = ({ review, user }) => {
  const dispatch = useDispatch();

  const reviews = useSelector(state => state?.review?.reviews);
  const [editedComment, setEditedComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  const handleEditReview = useCallback(
    reviewId => {
      const reviewToEdit = reviews.find(review => review._id === reviewId);

      setEditedComment(reviewToEdit.comment);
      setEditingReviewId(reviewId);
    },
    [reviews]
  );

  const handleSaveReview = () => {
    const updatedData = {
      comment: editedComment,
    };

    dispatch(updateReview({ reviewId: editingReviewId, updatedData }));
    setEditingReviewId(null);
  };

  const handleCancelEditing = () => {
    setEditingReviewId(null);
  };

  const handleDeleteReview = useCallback(
    reviewId => {
      dispatch(deleteReview(reviewId));
    },
    [dispatch]
  );

  return (
    <>
      {!review || !user ? (
        <Spinner
          width={64}
          height={64}
        />
      ) : (
        <div
          key={review?._id}
          className={styles.review}>
          {editingReviewId === review?._id ? (
            <div className={styles.userInfo}>
              <li className={styles.listItem}>
                <IoPerson size={24} />
                <div>
                  <p className={styles.userName}>{review?.user?.name}</p>
                  <p className={styles.creationDate}>
                    {formatDate(getRegularDate(review?.createdAt))}
                  </p>
                </div>
              </li>
              <div className={styles.editingPreview}>
                <div>
                  <input
                    type='text'
                    value={editedComment}
                    className={styles.comment}
                    onChange={e => setEditedComment(e.target.value)}
                  />
                </div>
                <div className={styles.editButtonsContainer}>
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSaveReview()}>
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelEditing()}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.userInfo}>
                <li className={styles.listItem}>
                  <IoPerson size={innerWidth < 650 ? 24 : 28} />
                  <div>
                    <p className={styles.userName}>{review?.user?.name}</p>
                    <p className={styles.creationDate}>
                      {formatDate(getRegularDate(review?.createdAt))}
                    </p>
                  </div>
                </li>
                <li className={styles.comment}>{review?.comment}</li>
              </div>
              {user?.user?._id === review?.user?._id && (
                <div className={styles.buttonsContainer}>
                  <div
                    className={styles.actionButton}
                    onClick={() => handleEditReview(review?._id)}>
                    <IoPencil
                      size={innerWidth < 650 ? 24 : 28}
                      color='#83ab55'
                    />
                  </div>
                  <div
                    className={styles.actionButton}
                    onClick={() => handleDeleteReview(review?._id)}>
                    <IoTrash
                      size={innerWidth < 650 ? 24 : 28}
                      color='#ff1e1e'
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Review;
