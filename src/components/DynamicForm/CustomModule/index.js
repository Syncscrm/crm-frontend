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

import { useUser } from '../../../contexts/userContext';
import { useCard } from '../../../contexts/cardContext';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

function CustomModule() {
  const { openCloseCustomModule, setOpenCloseCustomModule } = useUser();
  const { user } = useUser();
  const { currentCardData, currentModuleCard, setCurrentModuleCard } = useCard();

  const [fieldValues, setFieldValues] = useState({});
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [existingFieldId, setExistingFieldId] = useState('');
  const [availableFields, setAvailableFields] = useState([]);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showEditeComponent, setShowEditeComponent] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [fieldToRemove, setFieldToRemove] = useState(null);

  const [fields, setFields] = useState([]);
  const [inactiveFields, setInactiveFields] = useState([]);

  useEffect(() => {
    const valuesObject = fields.reduce((acc, field) => {
      acc[field.name] = fieldValues[field.name] || '';
      return acc;
    }, {});
    setFieldValues(valuesObject);
  }, [fields]);

  const createOrUpdate = async () => {
    const card_id = currentCardData.card_id;
    const empresa_id = user.empresa_id;
    const module_id = currentModuleCard.id;

    if (!card_id) {
      console.error('Invalid card_id');
      return;
    }

    if (!empresa_id) {
      console.error('Invalid empresa_id');
      return;
    }

    try {
      for (let field of fields) {
        const fieldData = {
          name: field.name,
          label: field.label,
          type: field.type,
          empresa_id,
          module_id
        };
        await axios.post(`${apiUrl}/custom-modules/upsert-field`, fieldData);
      }

      for (let field of fields) {
        if (field.type === 'city-state') {
          await axios.post(`${apiUrl}/custom-modules/upsert-field-value`, {
            card_id,
            field_id: field.id,
            empresa_id,
            module_id,
            value: fieldValues[`${field.name}-estado`] || ''
          });
          await axios.post(`${apiUrl}/custom-modules/upsert-field-value`, {
            card_id,
            field_id: field.id,
            empresa_id,
            module_id,
            value: fieldValues[`${field.name}-cidade`] || ''
          });
        } else {
          await axios.post(`${apiUrl}/custom-modules/upsert-field-value`, {
            card_id,
            field_id: field.id,
            empresa_id,
            module_id,
            value: fieldValues[field.name] || ''
          });
        }
      }

      console.log('Campos e valores atualizados');

      setOpenCloseCustomModule(false);
    } catch (error) {
      console.error('Erro ao criar ou atualizar módulo:', error);
    }
  };

  const handleChange = (name, newValue) => {
    setFieldValues({
      ...fieldValues,
      [name]: newValue
    });
  };

  const addField = (label, type) => {
    if (typeof label !== 'string' || label.trim() === '') {
      alert('Label must be a non-empty string.');
      return;
    }

    const newLabel = label.trim();
    const newType = type;
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

    setNewFieldLabel('');
    setNewFieldType('text');
    setShowAddComponent(false);
    setShowEditeComponent(false);
  };

  const addExistingField = () => {
    if (!existingFieldId) return;

    const fieldToReuse = availableFields.find(field => field.id === parseInt(existingFieldId, 10));

    if (fieldToReuse && !fields.some(field => field.name === fieldToReuse.name)) {
      setFields([...fields, fieldToReuse]);
      const existingValue = fieldValues[fieldToReuse.name] || '';
      setFieldValues({
        ...fieldValues,
        [fieldToReuse.name]: existingValue
      });
      setExistingFieldId('');
    } else {
      alert('Field is already added or does not exist.');
    }
  };

  const removeField = async (name) => {
    const fieldToRemove = fields.find(field => field.name === name);

    if (!fieldToRemove) return;

    const hasData = await axios.get(`${apiUrl}/custom-modules/check-field-data`, {
      params: { field_id: fieldToRemove.id }
    });

    if (hasData.data.exists) {
      setFieldToRemove(fieldToRemove);
      setShowConfirmationModal(true);
    } else {
      await axios.post(`${apiUrl}/custom-modules/delete-field`, { fieldId: fieldToRemove.id });
      setFields(fields.filter(field => field.name !== name));
    }
  };

  const handleDeactivate = async () => {
    if (fieldToRemove) {
      await axios.post(`${apiUrl}/custom-modules/deactivate-field`, { fieldId: fieldToRemove.id });
      setFields(fields.filter(field => field.name !== fieldToRemove.name));
      setFieldToRemove(null);
      setShowConfirmationModal(false);
    }
  };

  const handleDelete = async () => {
    if (fieldToRemove) {
      await axios.post(`${apiUrl}/custom-modules/delete-field`, { fieldId: fieldToRemove.id });
      setFields(fields.filter(field => field.name !== fieldToRemove.name));
      setFieldToRemove(null);
      setShowConfirmationModal(false);
    }
  };

  // const reactivateField = async () => {
  //   if (!existingFieldId) return;

  //   await axios.post(`${apiUrl}/custom-modules/reactivate-field`, { fieldId: existingFieldId });
  //   fetchFields();
  //   setExistingFieldId('');
  // };

  const reactivateField = async (fieldId) => {
    try {
      await axios.post(`${apiUrl}/custom-modules/reactivate-field`, { fieldId });
      fetchFields();
    } catch (error) {
      console.error('Erro ao reativar campo:', error);
    }
  };



  const handleChangeState = (newState) => {
    setSelectedState(newState);
    handleChange('estado', newState);
    setSelectedCity('');
  };

  const handleChangeCity = (newCity) => {
    setSelectedCity(newCity);
    handleChange('cidade', newCity);
  };


  const fetchFields = async () => {
    const card_id = currentCardData.card_id;
    const empresa_id = user.empresa_id;
    const module_id = currentModuleCard.id;

    try {
      const response = await axios.get(`${apiUrl}/custom-modules/fields`, {
        params: { card_id, empresa_id, module_id }
      });

      const { fields = [], inactiveFields = [] } = response.data;

      const activeFields = fields.filter(field => field.ativo);

      setFields(activeFields);
      setInactiveFields(inactiveFields);
      setAvailableFields([...activeFields, ...inactiveFields]); // Adicione essa linha para garantir que availableFields seja preenchido

      const valuesObject = activeFields.reduce((acc, field) => {
        acc[field.name] = field.value || '';
        return acc;
      }, {});
      setFieldValues(valuesObject);
    } catch (error) {
      console.error('Erro ao buscar campos e valores:', error);
    }
  };


  useEffect(() => {
    if (currentCardData && user) {
      fetchFields();
    }
  }, [currentCardData, user]);

  const saveValues = () => {
    createOrUpdate();
  };

  const [showEditeCustomModal, setShowEditeCustomModal] = useState(false);
  const [showModuleDeleteConfirmation, setShowModuleDeleteConfirmation] = useState(false);

  const deleteModule = async () => {
    if (currentModuleCard) {
      try {
        await axios.post(`${apiUrl}/custom-modules/delete-module`, { moduleId: currentModuleCard.id });
        setOpenCloseCustomModule(false);
        alert('Módulo e todos os campos e valores associados foram excluídos com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir módulo:', error);
        alert('Erro ao excluir o módulo.');
      }
    }
  };








  return (
    <div className='geral-modal'>
      <div className='geral-container'>
        <div className='geral-header'>
          <div className='geral-header-title'>
            <label>{currentModuleCard.name}</label>
          </div>
          <button className="geral-header-close-button" onClick={(e) => { setOpenCloseCustomModule(false); e.stopPropagation() }}>X</button>
        </div>

        <ul className='geral-body-container'>
          {fields.map((field) => (
            <div key={field.id} className='container-components'>
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
              {field.type === 'cpf' && (
                <CpfCnpjField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(newValue) => handleChange(field.name, newValue)}
                />
              )}
              {field.type === 'city-state' && (
                <SelectFieldCityState
                  selectedState={fieldValues['estado'] || ''}
                  selectedCity={fieldValues['cidade'] || ''}
                  onChange={handleChange}
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
              {field.type === 'value' && (
                <ValueField
                  label={field.label}
                  value={fieldValues[field.name] || ''}
                  onChange={(newValue) => handleChange(field.name, newValue)}
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

              {showEditeCustomModal &&
                <div className='text-field-btns-container'>
                  <button
                    onClick={() => removeField(field.name)}
                    className='text-field-btn'
                  >Excluir</button>
                </div>
              }
            </div>
          ))}

          {showEditeCustomModal &&
            <div className='btn-add-new-field-module-container'>
              <button className='btn-add-new-field-module' onClick={(e) => { setShowAddComponent(true); e.stopPropagation() }}>+</button>
            </div>
          }
        </ul>

        {showAddComponent && (
          <div className='geral-container'>
            <div className='geral-header'>
              <div className='geral-header-title'>
                <label>Nome do Módulo</label>
              </div>
              <button className="geral-header-close-button" onClick={(e) => { setShowAddComponent(false); e.stopPropagation() }}>X</button>
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






              <div className="reactivate-field-container">
                <label className="reactivate-field-label">Reativar Campo</label>
                <div className="select-item-new-component">
                  {inactiveFields.map((field) => (
                    <div
                      key={field.id}
                      className="reactivate-field-card"
                      onClick={() => { reactivateField(field.id); setShowAddComponent(false); }}
                    >
                      <label className='label-select-component-field'>{field.label}</label>
                      {field.type === 'fone' && <MdAddIcCall className='icone-select-component-field' />}
                      {field.type === 'date' && <MdCalendarMonth className='icone-select-component-field' />}
                      {field.type === 'text' && <MdAddReaction className='icone-select-component-field' />}
                      {field.type === 'city-state' && <MdAddLocationAlt className='icone-select-component-field' />}
                      {field.type === 'value' && <MdCurrencyExchange className='icone-select-component-field' />}
                      {field.type === 'email' && <MdEmail className='icone-select-component-field' />}
                      {field.type === 'cpf' && <MdFactCheck className='icone-select-component-field' />}
                      {field.type === 'select' && <MdAddBox className='icone-select-component-field' />}
                    </div>
                  ))}
                </div>


              </div>
            </ul>
          </div>
        )}

        {showConfirmationModal && (
          <div className='confirmation-modal'>
            <div className='confirmation-modal-content'>
              <h2>Confirmação</h2>
              <p>Este campo possui dados associados. Deseja desativá-lo (os dados serão mantidos) ou excluí-lo permanentemente (os dados serão apagados)?</p>
              <div className="confirmation-modal-actions">
                <button onClick={handleDeactivate} className="deactivate-button">Desativar</button>
                <button onClick={handleDelete} className="delete-button">Excluir Permanentemente</button>
                <button onClick={() => setShowConfirmationModal(false)} className="close-button">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <div className="geral-footer">
          {showEditeCustomModal &&
            <button className='geral-footer-btn-delete' onClick={() => setShowModuleDeleteConfirmation(true)}>Excluir Módulo</button>
          }

          <button
            style={{ backgroundColor: showEditeCustomModal ? '#3ae942' : '' }}
            className='geral-footer-btn-edite'
            onClick={() => setShowEditeCustomModal(!showEditeCustomModal)}>
            Editar Módulo
          </button>
          <button className='geral-footer-btn-save' onClick={saveValues}>Salvar</button>
        </div>

        {showModuleDeleteConfirmation && (
          <div className='module-delete-confirmation-modal'>
            <div className='module-delete-confirmation-content'>
              <h2>Confirmação</h2>
              <p>Você tem certeza que deseja excluir este módulo? Isso irá excluir todos os campos e valores associados permanentemente.</p>
              <div className="module-delete-confirmation-actions">
                <button onClick={deleteModule} className="module-delete-button">Excluir</button>
                <button onClick={() => setShowModuleDeleteConfirmation(false)} className="module-cancel-button">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default CustomModule;
