import React, { useState } from 'react';
import './style.css';

const FoneField = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsValid(isValidPhone(value));
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    onChange(rawValue);
    setIsValid(isValidPhone(rawValue));
  };

  const isValidPhone = (phone) => {
    // Expressão regular para validar telefones celulares e residenciais brasileiros
    const re = /^\(?\d{2}\)?[\s-]?(\d{4,5})-?\d{4}$/;
    return re.test(phone);
  };

  return (
    <div className='fone-field-container'>
      <label
        className='fone-field-label'
        style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
      >
        {label}
      </label>

      <input
        className='fone-field-input'
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

export default FoneField;
