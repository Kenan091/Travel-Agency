import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminDestinations.module.css';
import {
  addDestination,
  deleteDestination,
  getDestination,
  getDestinations,
  updateDestination,
} from '../../redux/destinations/destinationsSlice';
import Header from '../../components/header/Header';
import Spinner from '../../components/spinner/Spinner';
import Pagination from '../../components/pagination/Pagination';
import Footer from '../../components/footer/Footer';
import getRegularDate from '../../helpers/useGetRegularDate';
import truncateDescription from '../../helpers/useTruncateDescription';
import { IoAdd, IoClose, IoPencil, IoTrash } from 'react-icons/io5';
import { toast } from 'react-toastify';

const AdminDestinations = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDestinationId, setEditDestinationId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageURL: '',
    price: '',
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const destinations = useSelector(
    state => state?.destination?.destinations?.data
  );
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );

  const destination = useSelector(
    state => state?.destination?.destination?.data
  );

  const currentRecords = destinations?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const numberOfPages = Math.ceil(destinations?.length / recordsPerPage);

  const onOpenModal = (title, id = null) => {
    setModalTitle(title);
    setModalOpen(true);
    setEditDestinationId(id);
    if (id) {
      dispatch(getDestination(id));
    }
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setEditDestinationId(null);
  };

  // const onAdd = () => {
  //   console.log('Ready for adding');
  //   setAddModalOpen(true);
  // };

  // const onEdit = destinationId => {
  //   console.log('Ready for editing');
  //   setEditDestinationId(destinationId);
  //   setEditModalOpen(true);
  // };

  const onAdd = () => {
    setFormData({
      name: '',
      description: '',
      imageURL: '',
      price: '',
    });
    onOpenModal('Add New Destination');
  };

  const onEdit = destinationId => {
    setFormData({
      name: destination?.name || '',
      description: destination?.description || '',
      imageURL: destination?.imageURL || '',
      price: destination?.price || '',
    });
    onOpenModal('Edit Destination', destinationId);
  };

  const onDelete = destinationId => {
    console.log('Ready for deleting');
    dispatch(deleteDestination(destinationId));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const saveDestination = e => {
    e.preventDefault();

    if (editDestinationId) {
      dispatch(
        updateDestination({
          destinationId: editDestinationId,
          updatedData: formData,
        })
      );
      onCloseModal();
    } else {
      if (
        formData.name === '' ||
        formData.imageURL === '' ||
        formData.description === '' ||
        formData.price === ''
      ) {
        toast.error('Each field must be entered!');
      } else {
        dispatch(addDestination(formData));
        onCloseModal();
      }
    }
  };

  // const saveDestination = data => {
  //   if (editDestinationId) {
  //     dispatch(
  //       updateDestination({
  //         destinationId: editDestinationId,
  //         updatedData: data,
  //       })
  //     );
  //     setEditModalOpen(false);
  //   } else {
  //     if (
  //       data.name === '' ||
  //       data.imgURL === '' ||
  //       data.description === '' ||
  //       data.price === ''
  //     ) {
  //       toast.error('Each field must be entered!');
  //       console.log(data);
  //     } else {
  //       console.log(data);
  //       dispatch(addDestination(data));
  //       setAddModalOpen(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (editModalOpen && editDestinationId) {
  //     dispatch(getDestination(editDestinationId));
  //   }
  // }, [dispatch, editModalOpen, editDestinationId]);

  console.log(destinations);

  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Welcome admin!</h1>
        <div className={styles.destinations}>
          <h1 className={styles.tableTitle}>Destinations</h1>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableCell}>Image</th>
                <th className={styles.tableCell}>Name</th>
                {/* <th className={styles.tableCell}>Date created</th> */}
                <th className={styles.tableCell}>Average rating</th>
                <th className={styles.tableCell}>Description</th>
                <th className={styles.tableCell}>
                  <div
                    className={styles.addNewButton}
                    onClick={() => onAdd()}>
                    <IoAdd
                      size={16}
                      color='#d8e1ec'
                    />
                    <p>Add New</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                {isLoadingDestinations ? (
                  <tr>
                    <td colSpan='5'>
                      <Spinner />
                    </td>
                  </tr>
                ) : (
                  <>
                    {currentRecords?.map(destination => (
                      <tr
                        key={destination._id}
                        className={styles.tableDataRow}>
                        <td className={styles.tableDataCell}>
                          <img
                            style={{ width: 100, height: 100 }}
                            src={destination.imageURL}
                          />
                        </td>
                        <td className={styles.tableDataCell}>
                          {destination.name}
                        </td>
                        {/* <td className={styles.tableDataCell}>
                          {getRegularDate(destination.createdAt)}
                        </td> */}
                        <td className={styles.tableDataCell}>
                          {destination?.averageRating
                            ? destination.averageRating.toFixed(2)
                            : 'Not rated'}
                        </td>
                        <td className={styles.tableDataCell}>
                          {destination.description}
                        </td>
                        {/* <td className={styles.tableDataCell}>
                          {truncateDescription(destination.description)}
                        </td> */}
                        <td className={styles.tableDataCell}>
                          <div>
                            <div
                              className={styles.actionButton}
                              onClick={() => onEdit(destination._id)}>
                              <IoPencil
                                size={28}
                                color='#83ab55'
                              />
                            </div>
                            <div
                              className={styles.actionButton}
                              onClick={() => onDelete(destination._id)}>
                              <IoTrash
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
              </>
            </tbody>
          </table>
          {/* {addModalOpen && (
            <Modal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSave={saveDestination}
              title='Add New Destination'
              initialData={{
                name: '',
                description: '',
                imageURL: '',
                price: '',
              }}
            />
          )}
          {editModalOpen && (
            <Modal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSave={saveDestination}
              title='Edit Destination'
              initialData={{
                name: destination?.name,
                description: destination?.description,
                imageURL: destination?.imageURL,
                price: destination?.price,
              }}
            />
          )} */}
          {modalOpen && (
            <div className={`${styles.modal} ${modalOpen ? styles.open : ''}`}>
              <div className={styles.modalContent}>
                <span
                  className={styles.close}
                  onClick={onCloseModal}>
                  <IoClose
                    size={24}
                    color='#f00'
                  />
                </span>
                <h2 className={styles.title}>{modalTitle}</h2>
                <form
                  className={styles.modalForm}
                  onSubmit={saveDestination}>
                  <input
                    type='text'
                    name='name'
                    onChange={handleInputChange}
                    placeholder='City, Country'
                    value={formData.name}
                  />
                  <input
                    type='text'
                    name='imageURL'
                    onChange={handleInputChange}
                    placeholder='Image URL '
                    value={formData.imageURL}
                  />
                  <input
                    type='text'
                    name='price'
                    onChange={handleInputChange}
                    placeholder='Price'
                    value={formData.price}
                  />
                  <textarea
                    name='description'
                    onChange={handleInputChange}
                    placeholder='Destination description'
                    value={formData.description}
                  />
                  <button type='submit'>Save</button>
                </form>
              </div>
            </div>
          )}
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

export default AdminDestinations;