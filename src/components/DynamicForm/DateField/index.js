
import React, { useState } from 'react';

import './style.css'


const DateField = ({ label, value, onChange }) => {

  const [isFocused, setIsFocused] = useState(false);

  console.log('TextField Value Date:', value); // Adicione este log

  return (

    <div className='date-field-container'>
      <label
        className='date-field-label'
        style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
      >
        {label}
      </label>
      <input
              className='date-field-input'
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ border: isFocused ? 'solid 2px #2797ff' : 'solid 1px #A1A2A2' }}
      />
    </div>

  );
};

export default DateField;
