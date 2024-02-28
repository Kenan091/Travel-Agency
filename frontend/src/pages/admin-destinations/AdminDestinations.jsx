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

const initialFormData = {
  name: '',
  briefDescription: '',
  detailedDescription: '',
  imageURL: '',
  price: '',
  isPopular: false,
  continents: [],
};

const AdminDestinations = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDestinationId, setEditDestinationId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [isNewDestination, setIsNewDestination] = useState(false);

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
    setFormData(initialFormData);
  };

  const onAdd = () => {
    setIsNewDestination(true);
    setFormData(initialFormData);
    onOpenModal('Add New Destination');
  };

  const onEdit = destinationId => {
    setIsNewDestination(false);
    onOpenModal('Edit Destination', destinationId);
    const selectedDestination = destinations.find(
      dest => dest._id === destinationId
    );
    if (selectedDestination) {
      setFormData({
        name: selectedDestination.name || '',
        briefDescription: selectedDestination.briefDescription || '',
        detailedDescription: selectedDestination.detailedDescription || '',
        imageURL: selectedDestination.imageURL || '',
        price: selectedDestination.price || '',
        isPopular: selectedDestination.isPopular || false,
        continents: selectedDestination.continents || [],
      });
    }
  };

  const onDelete = destinationId => {
    dispatch(deleteDestination(destinationId));
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;

    let filteredValue;

    const allowedKeys = new Set([
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Backspace',
      'Delete',
      'End',
      'Control',
      'Meta',
      'c',
      'v',
      'x',
      'a',
    ]);

    if (name === 'continents') {
      filteredValue = value
        .split('')
        .filter(char => {
          return char.match(/^[a-zA-Z,\s]$/) || allowedKeys.has(char);
        })
        .join('');
    } else if (name === 'name') {
      filteredValue = value.replace(/[^a-zA-ZčćđšžČĆĐŠŽ, ]/g, '');
    } else {
      filteredValue = value;
    }

    const newValue = type === 'checkbox' ? checked : filteredValue;

    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  const validateForm = () => {
    const cityCountryRegex =
      /^[A-ZčćđšžČĆĐŠŽ][a-zčćđšžA-Z]*(?:\s[A-ZčćđšžČĆĐŠŽ][a-zčćđšžA-Z]*)*,\s*[A-ZčćđšžČĆĐŠŽ][a-zčćđšžA-Z]*(?:\s[A-ZčćđšžČĆĐŠŽ][a-zčćđšžA-Z]*)*$/;

    if (!cityCountryRegex.test(formData.name)) {
      toast.warn('Please enter name  in the format "City, Country".', {
        position: 'top-right',
        autoClose: 5000,
      });
      return false;
    }

    const continentsWhitelist = [
      'North America',
      'South America',
      'Europe',
      'Asia',
      'Africa',
      'Australia',
      'Antarctica',
    ];

    function isValidContinent(continent) {
      return continentsWhitelist.includes(continent.trim());
    }

    const validateContinents = continentsString => {
      if (typeof continentsString !== 'string') {
        console.error('Invalid format for continents data. Expected string.');
        return false;
      }

      const continents = continentsString
        ?.split(',')
        .map(continent => continent.trim());
      return continents.every(isValidContinent);
    };

    if (!validateContinents(formData.continents)) {
      toast.warn(
        `Please enter valid continents from the list. \n ${continentsWhitelist.map(
          continent => `\n${continent}`
        )}`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return false;
    }

    if (!formData.imageURL) {
      toast.warn('Please enter image URL.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return false;
    }

    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(formData.price)) {
      toast.warn('Please enter a valid price.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return false;
    }

    if (!formData.briefDescription) {
      toast.warn(
        'Please enter brief description with less than 350 characters.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return false;
    }

    if (!formData.detailedDescription) {
      toast.warn(
        'Please enter detailed description with less than 2000 characters.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return false;
    }

    return true;
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
      if (!validateForm()) {
        return;
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
  };

  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  useEffect(() => {
    if (isErrorDestinations) {
      toast.error(destinationsErrorMessage);
    }
  }, [isErrorDestinations, destinationsErrorMessage]);

  useEffect(() => {
    if (!destination && isNewDestination) {
      setFormData(initialFormData);
    }
  }, [destination, initialFormData, isNewDestination]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  console.log(formData);

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
                <th className={styles.tableCell}>Average rating</th>
                <th className={styles.tableCell}>Description</th>
                <th className={styles.tableCell}>Popular</th>
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
                    <td colSpan='6'>
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
                        <td className={styles.tableDataCell}>
                          {destination?.averageRating ? (
                            <ReactStars
                              count={5}
                              value={destination.averageRating}
                              size={24}
                              isHalf={false}
                              emptyIcon={<IoStarOutline />}
                              halfIcon={<IoStarHalf />}
                              fullIcon={<IoStar />}
                              activeColor='#FFD233'
                              edit={false}
                            />
                          ) : (
                            'Not rated'
                          )}
                        </td>
                        <td className={styles.tableDataCell}>
                          {destination.briefDescription}
                        </td>
                        <td className={styles.tableDataCell}>
                          <input
                            type='checkbox'
                            checked={destination.isPopular}
                            onChange={() => {
                              const updatedDestination = {
                                ...destination,
                                isPopular: !destination.isPopular,
                              };
                              dispatch(
                                updateDestination({
                                  destinationId: destination._id,
                                  updatedData: updatedDestination,
                                })
                              );
                            }}
                          />
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
                        {destination.name}
                      </div>
                      <div className={styles.accordionText}>
                        <strong>Average rating: </strong>
                        {destination?.averageRating ? (
                          <ReactStars
                            count={5}
                            value={parseFloat(destination.averageRating)}
                            size={24}
                            isHalf={false}
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
                      <div className={styles.accordionText}>
                        <strong>Popular: </strong>
                        <input
                          type='checkbox'
                          checked={destination.isPopular}
                          onChange={() => {
                            const updatedDestination = {
                              ...destination,
                              isPopular: !destination.isPopular,
                            };
                            dispatch(
                              updateDestination({
                                destinationId: destination._id,
                                updatedData: updatedDestination,
                              })
                            );
                          }}
                        />
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
                {isNewDestination ? (
                  <form
                    className={styles.modalForm}
                    onSubmit={saveDestination}>
                    <input
                      type='text'
                      name='name'
                      onChange={handleInputChange}
                      placeholder='City, Country'
                    />

                    <input
                      type='text'
                      name='continents'
                      onChange={handleInputChange}
                      placeholder='Continents (separated by commas)'
                    />
                    <input
                      type='text'
                      name='imageURL'
                      onChange={handleInputChange}
                      placeholder='Image URL '
                    />
                    <input
                      type='text'
                      name='price'
                      onChange={handleInputChange}
                      onKeyDown={event => {
                        const allowedKeys = [
                          'Backspace',
                          'Delete',
                          'Tab',
                          'Escape',
                          'ArrowLeft',
                          'ArrowRight',
                          'Home',
                          'End',
                        ];

                        if (event.key === ' ') {
                          event.preventDefault();
                          return;
                        }

                        if (
                          (event.ctrlKey || event.metaKey) &&
                          ['x', 'c', 'v', 'a'].includes(event.key.toLowerCase())
                        ) {
                          return;
                        }

                        if (
                          event.altKey ||
                          (event.altGraphKey && event.key.length === 1)
                        ) {
                          event.preventDefault();
                          return;
                        }

                        if (
                          !allowedKeys.includes(event.key) &&
                          isNaN(Number(event.key))
                        ) {
                          event.preventDefault();
                        }
                      }}
                      placeholder='Price'
                    />
                    <textarea
                      name='briefDescription'
                      onChange={handleInputChange}
                      placeholder='Brief description'
                      className={styles.briefDescription}
                    />
                    <textarea
                      name='detailedDescription'
                      onChange={handleInputChange}
                      placeholder='Detailed description'
                      className={styles.detailedDescription}
                    />
                    <button type='submit'>Save</button>
                  </form>
                ) : (
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
                      name='continents'
                      onChange={handleInputChange}
                      placeholder='Continents (separated by commas)'
                      value={formData.continents}
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
                      onKeyDown={event => {
                        const allowedKeys = [
                          'Backspace',
                          'Delete',
                          'Tab',
                          'Escape',
                          'ArrowLeft',
                          'ArrowRight',
                          'Home',
                          'End',
                        ];

                        if (event.key === ' ') {
                          event.preventDefault();
                          return;
                        }

                        if (
                          (event.ctrlKey || event.metaKey) &&
                          ['x', 'c', 'v', 'a'].includes(event.key.toLowerCase())
                        ) {
                          return;
                        }

                        if (
                          event.altKey ||
                          (event.altGraphKey && event.key.length === 1)
                        ) {
                          event.preventDefault();
                          return;
                        }

                        if (
                          !allowedKeys.includes(event.key) &&
                          isNaN(Number(event.key))
                        ) {
                          event.preventDefault();
                        }
                      }}
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
                )}
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
