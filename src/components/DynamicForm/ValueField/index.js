import React, { useState } from 'react';
import './style.css';

const ValueField = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Apply formatting on blur
    onChange(formatCurrency(value));
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    // Allow numbers and commas only
    const numericValue = rawValue.replace(/[^0-9,]/g, '');
    onChange(numericValue);
  };

  const formatCurrency = (value) => {
    if (value === '') return '0,00';

    // Split integer and decimal parts
    const parts = value.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Format integer part with thousands separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Ensure two decimal places
    const formattedDecimal = decimalPart.padEnd(2, '0').substring(0, 2);

    return `${formattedInteger},${formattedDecimal}`;
  };

  return (
    <div className='value-field-container'>
      <label
        className='value-field-label'
        style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
      >
        {label}
      </label>

      <input
        className='value-field-input'
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ border: isFocused ? 'solid 2px #2797ff' : 'solid 1px #A1A2A2' }}
      />
    </div>
  );
};

export default ValueField;
