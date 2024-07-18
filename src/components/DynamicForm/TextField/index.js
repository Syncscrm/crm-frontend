// TextField.js
import React, { useState } from 'react';

import './style.css'

const TextField = ({ label, value, onChange }) => {

  const [isFocused, setIsFocused] = useState(false);

  console.log('TextField Value:', value); // Adicione este log

  return (

    <div className='text-field-container' >

        <label
          className='text-field-label'
          style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
        >
          {label}
        </label>

        <input
          className='text-field-input'
          type="text" value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ border: isFocused ? 'solid 2px #2797ff' : 'solid 1px #A1A2A2' }}
          onClick={(e) => { e.stopPropagation(); }}
        />

    </div>
  );
};

export default TextField;
