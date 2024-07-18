import React, { useState } from 'react';
import './style.css';

const EmailField = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsValid(isValidEmail(value));
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    onChange(rawValue);
    setIsValid(isValidEmail(rawValue));
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className='email-field-container'>
      <label
        className='email-field-label'
        style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
      >
        {label}
      </label>

      <input
        className='email-field-input'
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          border: isFocused
            ? isValid
              ? 'solid 2px #2797ff'
              : 'solid 2px red'
            : isValid
              ? 'solid 1px #A1A2A2'
              : 'solid 1px red'
        }}
      />
    </div>
  );
};

export default EmailField;
