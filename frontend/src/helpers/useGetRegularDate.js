const getRegularDate = isoDate => {
  const regularDate = new Date(isoDate);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
    regularDate
  );

  return formattedDate;
};

export default getRegularDate;
