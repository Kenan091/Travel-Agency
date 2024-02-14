import { useState } from 'react';
import { toast } from 'react-toastify';

const DatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = e => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate >= today) {
      setSelectedDate(selectedDate);
      onDateChange(selectedDate);
    } else {
      toast.warn('Please select a date in the future.');
      console.log('Warning');
    }
  };

  return (
    <div>
      <input
        type='date'
        id='datePicker'
        value={selectedDate}
        onChange={handleDateChange}
        style={{ outline: 'none' }}
      />
    </div>
  );
};

export default DatePicker;
