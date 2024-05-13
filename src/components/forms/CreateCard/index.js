import React, { useState, useRef } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

// NAVIGATE
import { useNavigate } from 'react-router-dom';

// STYLE
import './style.css';

// ASSETS
import Logo from '../../../assets/logo-suite-flow.ico';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';

function CreateCard({ columnId, onClose }) {

  // CONTEXT API
  const { openModalCreateUser, user } = useUser();

  // ESTADOS LOCAL
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [fone, setFone] = useState('');
  const [error, setError] = useState('');
  const [isCreatingCard, setIsCreatingCard] = useState(false);


  const handleCreateCard = async (e) => {
    e.preventDefault();
    setIsCreatingCard(true);

    setError('');

    const cardData = {
      name,
      state,
      city,
      fone,
      email,
      column_id: columnId,
      entity_id: user.id,
      empresa_id: user.empresa_id,
    };

    try {
      await axios.post(`${apiUrl}/card/create`, cardData);
      openModalCreateUser();
      onClose()
    } catch (error) {
      setIsCreatingCard(false);
        setError('Erro ao criar Card.');
    }
  };

  return (
    <div className='create-card-modal'>
      <div className='create-card-container'>
        <div className="create-card-form-container">
          <form className="create-card-form" onSubmit={handleCreateCard}>
            <label htmlFor="address" className='create-card-label-input'>Nome:</label>
            <input id="username" className="create-card-input" type="text" placeholder="" value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="address" className='create-card-label-input'>Estado:</label>
            <input id="state" className="create-card-input" type="text" placeholder="" value={state} onChange={(e) => setState(e.target.value)} />

            <label htmlFor="address" className='create-card-label-input'>Cidade:</label>
            <input id="city" className="create-user-input" type="text" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} />

            <label htmlFor="address" className='create-card-label-input'>Fone:</label>
            <input id="fone" className="create-user-input" type="text" placeholder="" value={fone} onChange={(e) => setFone(e.target.value)} />

            <label htmlFor="address" className='create-card-label-input'>Email:</label>
            <input id="email" className="create-user-input" type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="address" className='create-card-label-input'>Column ID: {columnId}</label>

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
