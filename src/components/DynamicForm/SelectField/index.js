import React from 'react';
import './style.css';

const SelectField = ({ label, value, options, onChange, disabled }) => {
  return (
    <div className='select-field-container'>
      <label className='select-field-label'>
        {label}
      </label>
      <select
        className='select-field-select'
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value=''>Selecione uma opção</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
