import React, { useState, useEffect } from 'react';
import './style.css';

import TextField from '../TextField';
import DateField from '../DateField';
import LabelField from '../LabelField';
import SelectField from '../SelectField';
import CheckboxField from '../CheckboxField';
import SelectFieldCityState from '../SelectFieldCityState';

import { MdFactCheck, MdAddBox, MdAddIcCall, MdCalendarMonth, MdAddReaction, MdAddLocationAlt, MdCurrencyExchange, MdEmail } from "react-icons/md";
import ValueField from '../ValueField';
import CpfCnpjField from '../CpfCnpjField';
import EmailField from '../EmailField';
import FoneField from '../FoneField';

function PageTeste() {
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [savedData, setSavedData] = useState([]);
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [existingFieldId, setExistingFieldId] = useState('');
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    const valuesObject = savedData.reduce((acc, val) => {
      const field = fields.find(field => field.id === val.field_id);
      if (field) {
        acc[field.name] = val.value;
      }
      return acc;
    }, {});
    setFieldValues(valuesObject);
  }, [fields, savedData]);

  const handleChange = (name, newValue) => {
    setFieldValues({
      ...fieldValues,
      [name]: newValue
    });
  };

  const addField = (newLabel, newType) => {
    const newName = newLabel.replace(/\s+/g, '');
    if (fields.some(field => field.name === newName)) {
      alert('A field with this name already exists.');
      return;
    }
    const newField = {
      id: availableFields.length + 1,
      name: newName,
      label: newLabel,
      type: newType
    };
    setFields([...fields, newField]);
    setAvailableFields([...availableFields, newField]);
    setFieldValues({
      ...fieldValues,
      [newName]: newType === 'date' || newType === 'checkbox' ? '' : ''
    });
  };

  const addExistingField = () => {
    if (!existingFieldId) return;
    const fieldToReuse = availableFields.find(field => field.id === parseInt(existingFieldId, 10));
    if (fieldToReuse && !fields.some(field => field.name === fieldToReuse.name)) {
      setFields([...fields, fieldToReuse]);
      const existingValue = savedData.find(value => value.field_id === fieldToReuse.id)?.value || '';
      setFieldValues({
        ...fieldValues,
        [fieldToReuse.name]: existingValue
      });
      setExistingFieldId('');
    } else {
      alert('Field is already added or does not exist.');
    }
  };

  const removeField = (name) => {
    const fieldToRemove = fields.find(field => field.name === name);
    if (fieldToRemove) {
      setAvailableFields(prevFields => {
        const updatedFields = prevFields.filter(field => field.name !== fieldToRemove.name);
        return [...updatedFields, fieldToRemove];
      });
      setFields(fields.filter(field => field.name !== name));
    }
  };

  const saveValues = () => {
    setSavedData(fields.map(field => ({
      field_id: field.id,
      value: fieldValues[field.name] || ''
    })));
    console.log('Saved values', fieldValues);
  };

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleChangeState = (newState) => {
    setSelectedState(newState);
    handleChange('Estado', newState);
    setSelectedCity('');
    handleChange('Cidade', '');
  };

  const handleChangeCity = (newCity) => {
    setSelectedCity(newCity);
    handleChange('Cidade', newCity);
  };

  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showEditeComponent, setShowEditeComponent] = useState(false);

  return (
    <div className='geral-modal'>
      <div className='geral-container'>

        <div className='geral-header'>
          <div className='geral-header-title'>
            <label>Nome do Módulo</label>
          </div>
          <button className="geral-header-close-button" >X</button>
        </div>

        <ul className='geral-body-container'>

          {fields.map((field) => (
            <div key={field.id} className='container-components'>
              {field.type === 'value' && (
                <ValueField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(newValue) => handleChange(field.name, newValue)}
                />
              )}
              {field.type === 'cpf' && (
                <CpfCnpjField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(newValue) => handleChange(field.name, newValue)}
                />
              )}
              {field.type === 'city-state' && (
                <SelectFieldCityState
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onChangeState={handleChangeState}
                  onChangeCity={handleChangeCity}
                />
              )}
              {field.type === 'email' && (
                <EmailField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(value) => handleChange(field.name, value)}
                />
              )}
              {field.type === 'fone' && (
                <FoneField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(value) => handleChange(field.name, value)}
                />
              )}
              {field.type === 'text' && (
                <TextField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {field.type === 'date' && (
                <DateField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {field.type === 'label' && (
                <LabelField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                />
              )}
              {field.type === 'select' && (
                <SelectField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  options={['Option 1', 'Option 2', 'Option 3']}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {field.type === 'checkbox' && (
                <CheckboxField
                  label={field.label}
                  checked={fieldValues[field.name] === 'true'}
                  onChange={(e) => handleChange(field.name, e.target.checked ? 'true' : 'false')}
                />
              )}

              <div className='text-field-btns-container'>
                <button
                  onClick={() => removeField(field.name)}
                  className='text-field-btn'
                >Excluir</button>
              </div>
            </div>
          ))}

          <button onClick={() => setShowAddComponent(true)}>Adicionar Componente</button>

        </ul>

        {showAddComponent &&
          <div className='geral-container'>

            <div className='geral-header'>
              <div className='geral-header-title'>
                <label>Nome do Módulo</label>
              </div>
              <button className="geral-header-close-button" onClick={() => setShowAddComponent(false)}>X</button>
            </div>

            <ul className='geral-body-container'>

              <div className='select-item-new-component'>
                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Telefone', 'fone'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Telefone</label>
                  <MdAddIcCall className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Data', 'date'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Data</label>
                  <MdCalendarMonth className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Nome', 'text'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Nome</label>
                  <MdAddReaction className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Cidade e Estado', 'city-state'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Cidade e Estado</label>
                  <MdAddLocationAlt className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Valor', 'value'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Valor</label>
                  <MdCurrencyExchange className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('Email', 'email'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>Email</label>
                  <MdEmail className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => { addField('CPF/CNPJ', 'cpf'); setShowAddComponent(false); }}
                >
                  <label className='label-select-component-field'>CPF / CNPJ</label>
                  <MdFactCheck className='icone-select-component-field' />
                </div>

                <div
                  className='select-component-item-field'
                  onClick={() => setShowEditeComponent(!showEditeComponent)}
                >
                  <label className='label-select-component-field'>Customizado</label>
                  <MdAddBox className='icone-select-component-field' />
                </div>
              </div>

              {showEditeComponent &&
                <>
                  <div className='select-component-container'>
                    <label className='select-field-label'>
                      Nome do Campo
                    </label>
                    <input
                      className='select-component-input'
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                    />
                  </div>
                  <div className='select-component-container'>
                    <label className='select-field-label'>
                      Tipo
                    </label>
                    <select
                      className='select-component-input'
                      value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="label">Label</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="city-state">Cidade e Estado</option>
                    </select>
                  </div>
                  <div>
                    <button type="button" onClick={addField}>Adicionar</button>
                  </div>
                </>
              }
              </ul>
          </div>
        }

        {false &&
          <div className='edite-componente-container'>
            <div className='select-component-container'>
              <label className='select-component-label'>
                Componente
              </label>
              <select
                className='select-component-input'
                value={existingFieldId} onChange={(e) => setExistingFieldId(e.target.value)}>
                <option value="">Select Existing Field</option>
                {availableFields.filter(field => !fields.some(f => f.name === field.name)).map((field) => (
                  <option key={field.id} value={field.id}>{field.label}</option>
                ))}
              </select>
              <button type="button" onClick={addExistingField}>Add Existing Field</button>
            </div>
            <button type="button" onClick={saveValues}>Salvar</button>
          </div>
        }

        <div className="geral-footer">
          <button className='geral-footer-btn-save'>Salvar</button>

        </div>

      </div>
    </div>
  );
}

export default PageTeste;
