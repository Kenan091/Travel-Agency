const truncateDescription = (description, maxLength = 50) => {
  if (description.length <= maxLength) {
    return description;
  } else {
    return description.substring(0, maxLength) + '...';
  }
};

export default truncateDescription;
