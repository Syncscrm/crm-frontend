import React, { useState } from 'react';
import './style.css';

const CpfCnpjField = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    // Remove tudo que não é número
    const numericValue = rawValue.replace(/\D/g, '');

    const valid = isValidCpfCnpj(numericValue);
    setIsValid(valid);

    if (valid) {
      onChange(formatCpfCnpj(numericValue));
    } else {
      onChange(numericValue);
    }
  };

  const isValidCpfCnpj = (value) => {
    if (value.length === 11) {
      return isValidCpf(value);
    } else if (value.length === 14) {
      return isValidCnpj(value);
    }
    return false;
  };

  const isValidCpf = (cpf) => {
    let sum = 0;
    let remainder;

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const isValidCnpj = (cnpj) => {
    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  };

  const formatCpfCnpj = (value) => {
    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length === 14) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  return (
    <div className='cpf-field-container'>
      <label
        className='cpf-field-label'
        style={{ color: isFocused ? '#2797ff' : '#A1A2A2' }}
      >
        {label}
      </label>

      <input
        className='cpf-field-input'
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
            : 'solid 1px #A1A2A2'
        }}
      />
    </div>
  );
};

export default CpfCnpjField;
