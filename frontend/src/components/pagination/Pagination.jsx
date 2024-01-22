import styles from '../pagination/Pagination.module.css';

const Pagination = ({ numberOfPages, currentPage, setCurrentPage }) => {
  // const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const pageNumbers = Array.from(
    { length: numberOfPages },
    (_, index) => index + 1
  );

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav>
      <ul className={styles.pagination}>
        <li className={styles.pageItem}>
          <button
            disabled={currentPage === 1 ? true : false}
            className={styles.pageLink}
            onClick={goToPrevPage}>
            Previous
          </button>
        </li>
        {pageNumbers.map(pageNumber => (
          <li
            key={pageNumber}
            className={`${styles.pageItem} ${
              currentPage == pageNumber ? 'active' : ''
            } `}>
            <button
              className={styles.pageLink}
              onClick={() => setCurrentPage(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={styles.pageItem}>
          <button
            disabled={currentPage === numberOfPages ? true : false}
            className={styles.pageLink}
            onClick={goToNextPage}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
