import { useState } from 'react';
import { toast } from 'react-toastify';

const DatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [warningShown, setWarningShown] = useState(false);

  const handleDateChange = e => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate >= today) {
      setSelectedDate(selectedDate);
      onDateChange(selectedDate);
      setWarningShown(false);
    } else if (!warningShown) {
      setWarningShown(true);
      toast.warn('Please select a date in the future.', {
        onClose: () => setWarningShown(false),
      });
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
