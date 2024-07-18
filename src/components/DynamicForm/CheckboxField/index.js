import React from 'react';
import './style.css';

const CheckboxField = ({ label, checked, onChange }) => (
  <div className='check-box-field-container'>
    <label className='check-box-field-label'>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  </div>
);

export default CheckboxField;
