import React, { useState } from 'react';
import styles from './CustomSelect.module.css';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

const CustomSelect = ({ options, value, onChange, optionHeight }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = optionValue => {
    if (optionValue !== '') {
      onChange(optionValue);
      toggleDropdown();
    } else {
      onChange('');
      toggleDropdown();
    }
  };

  return (
    <div className={styles.customSelect}>
      <div
        className={styles.selectedOption}
        onClick={toggleDropdown}>
        {options.find(option => option.value === value)?.label || 'Select'}
        {isOpen ? (
          <TiArrowSortedUp
            size={24}
            color='#082831'
            style={{ position: 'absolute', top: 22, right: 10 }}
          />
        ) : (
          <TiArrowSortedDown
            size={24}
            color='#082831'
            style={{ position: 'absolute', top: 22, right: 10 }}
          />
        )}
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map(option => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option.value)}
              style={{ height: optionHeight }}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
