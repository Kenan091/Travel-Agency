import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
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

const AdminDestinations = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDestinationId, setEditDestinationId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    briefDescription: '',
    detailedDescription: '',
    imageURL: '',
    price: '',
  });
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const { user } = useSelector(state => state?.auth);

  const destinations = useSelector(state => state?.destination?.destinations);
  const isLoadingDestinations = useSelector(
    state => state?.destination?.isLoading
  );

  const isErrorDestinations = useSelector(state => state?.destination?.isError);

  const destinationsErrorMessage = useSelector(
    state => state?.destination?.message
  );

  const destination = useSelector(state => state?.destination?.destination);

  const currentRecords = destinations?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const numberOfPages = Math.ceil(destinations?.length / recordsPerPage);

  console.log(destinations);

  console.log(`Details visible: ${detailsVisible}`);

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination?.name || '',
        briefDescription: destination?.briefDescription || '',
        detailedDescription: destination?.detailedDescription || '',
        imageURL: destination?.imageURL || '',
        price: destination?.price || '',
      });
    }
  }, [destination]);

  const onOpenModal = (title, id = null) => {
    console.log(id);
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
    onOpenModal('Edit Destination', destinationId);
    setFormData({
      name: destination?.name || '',
      briefDescription: destination?.briefDescription || '',
      detailedDescription: destination?.detailedDescription || '',
      imageURL: destination?.imageURL || '',
      price: destination?.price || '',
    });
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
        formData.briefDescription === '' ||
        formData.detailedDescription === '' ||
        formData.price === ''
      ) {
        toast.error('Each field must be entered!');
      } else {
        dispatch(addDestination(formData));
        if (isErrorDestinations) {
          toast.error(destinationsErrorMessage);
        } else {
          toast.success('Destination added');
        }
        onCloseModal();
      }
    }
  };

  const openDestinationDetails = destinationId => {
    setDetailsVisible(prevState => !prevState);
    setSelectedDestinationId(destinationId);

    // setDetailsVisible(prevState =>
    //   prevState ? selectedDestinationId !== destinationId : !prevState
    // );
  };

  useEffect(() => {
    dispatch(getDestinations());
    if (isErrorDestinations) {
      toast.error(destinationsErrorMessage);
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  console.log(user);

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
                      <Spinner
                        width={64}
                        height={64}
                      />
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
                          {destination?.averageRating ? (
                            <ReactStars
                              count={5}
                              value={destination?.averageRating.toFixed(2)}
                              size={24}
                              isHalf={true}
                              emptyIcon={<IoStarOutline />}
                              halfIcon={<IoStarHalf />}
                              fullIcon={<IoStar />}
                              activeColor='#FFD233'
                              edit={false}
                            />
                          ) : (
                            // ? destination.averageRating.toFixed(2)
                            'Not rated'
                          )}
                        </td>
                        <td className={styles.tableDataCell}>
                          {destination.briefDescription}
                        </td>
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
          <div className={styles.accordionContainer}>
            <div
              className={styles.addNewButton}
              onClick={() => onAdd()}>
              <IoAdd
                size={16}
                color='#d8e1ec'
              />
              <p>Add New</p>
            </div>
            {isLoadingDestinations ? (
              <Spinner
                width={64}
                height={64}
              />
            ) : (
              <>
                {currentRecords?.map(destination => (
                  <div
                    key={destination._id}
                    className={`${styles.accordionItem} ${
                      selectedDestinationId === destination._id
                        ? styles.showDetails
                        : ''
                    }`}
                    style={{ backgroundImage: `url(${destination.imageURL})` }}
                    onClick={() => openDestinationDetails(destination._id)}>
                    <div className={styles.overlay}></div>
                    <div
                      className={`${styles.destinationName} ${
                        detailsVisible &&
                        selectedDestinationId === destination._id
                          ? styles.hidden
                          : ''
                      }`}>
                      {destination.name}
                    </div>
                    <div
                      className={`${styles.accordionContent} ${
                        detailsVisible &&
                        selectedDestinationId === destination._id
                          ? styles.visible
                          : ''
                      }`}>
                      <div className={styles.accordionText}>
                        <strong>Name: </strong>
                        {destination?.name}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Average rating: </strong>
                        {destination?.averageRating ? (
                          <ReactStars
                            count={5}
                            value={destination?.averageRating.toFixed(2)}
                            size={24}
                            isHalf={true}
                            emptyIcon={<IoStarOutline />}
                            halfIcon={<IoStarHalf />}
                            fullIcon={<IoStar />}
                            activeColor='#FFD233'
                            edit={false}
                          />
                        ) : (
                          'Not rated'
                        )}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Description: </strong>
                        {destination.briefDescription}
                      </div>
                      <div className={styles.actionButtons}>
                        <div
                          className={styles.actionButton}
                          onClick={e => {
                            e.stopPropagation();
                            onEdit(destination._id);
                          }}>
                          <IoPencil
                            size={28}
                            color='#83ab55'
                          />
                        </div>
                        <div
                          className={styles.actionButton}
                          onClick={e => {
                            e.stopPropagation();
                            onDelete(destination._id);
                          }}>
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
                    name='briefDescription'
                    onChange={handleInputChange}
                    placeholder='Brief description'
                    value={formData.briefDescription}
                    className={styles.briefDescription}
                  />
                  <textarea
                    name='detailedDescription'
                    onChange={handleInputChange}
                    placeholder='Detailed description'
                    value={formData.detailedDescription}
                    className={styles.detailedDescription}
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
