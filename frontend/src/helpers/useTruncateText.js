const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength) + '...';
  }
};

export default truncateText;
