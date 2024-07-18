import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectField from '../SelectField';
import './style.css';

const SelectFieldCityState = ({ selectedState, selectedCity, onChange }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const stateOptions = response.data.map(state => ({ value: state.sigla, label: state.nome }));
        setStates(stateOptions);
      })
      .catch(error => {
        console.error("There was an error fetching the states!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedState) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(response => {
          const cityOptions = response.data.map(city => ({ value: city.nome, label: city.nome }));
          setCities(cityOptions);
        })
        .catch(error => {
          console.error("There was an error fetching the cities!", error);
        });
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    const stateValue = e.target.value;
    onChange('estado', stateValue);
    setCities([]);
  };

  const handleCityChange = (e) => {
    const cityValue = e.target.value;
    onChange('cidade', cityValue);
  };

  return (
    <div className='select-field-city-state'>
      <SelectField
        label="Estado"
        value={selectedState}
        options={states}
        onChange={handleStateChange}
      />
      <div className='container-space'></div>
      <SelectField
        style={{marginTop: '10px'}}
        label="Cidade"
        value={selectedCity}
        options={cities}
        onChange={handleCityChange}
        disabled={!selectedState}
        
      />
    </div>
  );
};

export default SelectFieldCityState;
