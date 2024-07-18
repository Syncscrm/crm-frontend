import React from 'react';
import './style.css';

const LabelField = ({ label, value }) => (
  <div className='label-field-container'>
    <label className='label-field-label'>{label}</label>
    <span className='label-field-value'>{value}</span>
  </div>
);

export default LabelField;
