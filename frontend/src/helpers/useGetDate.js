const getRegularDate = isoDate => {
  const regularDate =
    isoDate !== null || isoDate !== undefined ? new Date(isoDate) : new Date();
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
    regularDate
  );

  return formattedDate;
};

export default getRegularDate;

export const formatDate = dateString => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Split the dateString into day, month, and year components
  const [day, month, year] = dateString.split('/');

  // Create a new Date object using the components
  const date = new Date(`${year}-${month}-${day}`);

  // Get the month name
  const monthName = months[date.getMonth()];

  // Get the day and year
  const formattedDate = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;

  return formattedDate;
};
