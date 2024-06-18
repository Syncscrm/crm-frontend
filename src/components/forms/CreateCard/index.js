import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import { useUser } from '../../../contexts/userContext';
import { useCard } from '../../../contexts/cardContext'

import './style.css';

// API URL for IBGE
const apiUrlIbge = 'https://servicodados.ibge.gov.br/api/v1/localidades';

function CreateCard({ columnId, onClose }) {
  const { openModalCreateUser, user } = useUser();

  const {
    cards,
    setCards
  } = useCard();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [fone, setFone] = useState('');
  const [error, setError] = useState('');
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrlIbge}/estados?orderBy=nome`).then(response => {
      const stateOptions = response.data.map(state => ({
        sigla: state.sigla,
        nome: state.nome,
      }));
      setStates(stateOptions);
    });
  }, []);

  useEffect(() => {
    if (state) {
      axios.get(`${apiUrlIbge}/estados/${state}/municipios?orderBy=nome`).then(response => {
        const cityOptions = response.data.map(city => ({
          id: city.id,
          nome: city.nome,
        }));
        setCities(cityOptions);
      });
    } else {
      setCities([]);
    }
  }, [state]);

  const handleCreateCard = async (e) => {
    e.preventDefault();
    setIsCreatingCard(true);
    setError('');

    const selectedState = states.find((st) => st.sigla === state);
    const selectedCity = cities.find((ct) => ct.id === parseInt(city));

    const cardData = {
      name,
      state: selectedState ? selectedState.sigla : '',
      city: selectedCity ? selectedCity.nome : '',
      fone,
      email,
      column_id: columnId,
      entity_id: user.id,
      empresa_id: user.empresa_id,
    };

    try {
      console.log('createdCard')

      const response = await axios.post(`${apiUrl}/card/create`, cardData);
      const createdCard = response.data;
      console.log(createdCard)
      setCards([...cards, createdCard]); // Atualiza a lista de cards com o novo card

      openModalCreateUser();
      onClose();
    } catch (error) {
      setIsCreatingCard(false);
      setError('Erro ao criar Card.');
    }
  };

  return (
    <div className='create-card-modal'>
      <div className='create-card-container'>
        <div className='header-update-card-container'>
          <label>Criar Oportunidade</label>
        </div>
        <div className="create-card-form-container">
          <form className="create-card-form" onSubmit={handleCreateCard}>
            <label htmlFor="username" className='create-card-label-input'>Nome:</label>
            <input id="username" className="create-card-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="city-state" className='create-card-label-input'>Cidade / Estado:</label>
            <div className='select-cidade-estado-container'>
              <select id="state" className="select-estado-cidade" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Selecione o estado</option>
                {states.map(state => (
                  <option key={state.sigla} value={state.sigla}>{state.nome}</option>
                ))}
              </select>

              <select id="city" className="select-estado-cidade" value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.nome}</option>
                ))}
              </select>
            </div>

            <label htmlFor="fone" className='create-card-label-input'>Fone:</label>
            <input id="fone" className="create-user-input" type="text" value={fone} onChange={(e) => setFone(e.target.value)} />

            <label htmlFor="email" className='create-card-label-input'>Email:</label>
            <input id="email" className="create-user-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className='create-card-label-input'>Column ID: {columnId}</label>
          </form>
        </div>
        {error && <div className="create-card-error-message">{error}</div>}

        <div className='create-card-footer'>
          <button className="create-card-close-button" onClick={onClose}>Cancelar</button>
          <button type="submit" className="create-card-button" onClick={handleCreateCard} disabled={isCreatingCard}>Criar Card</button>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;
