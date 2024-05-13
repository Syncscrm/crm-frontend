import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import './style.css';
import { useUser } from '../../../contexts/userContext';

function CreateColumns() {
  const { openModalCreateUser, user } = useUser();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const [error, setError] = useState('');
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    setIsCreatingColumn(true);
    setError('');

    // Considerando que você tenha uma autenticação e tenha empresa_id disponível
    const empresaId = user.empresa_id; // Você precisará obter isso do contexto do usuário ou de outra forma

    const columnData = {
      name,
      description,
      display_order: displayOrder,
      empresa_id: user.empresa_id,
    };

    console.log('create column',columnData)

    try {
      await axios.post(`${apiUrl}/process-columns/create`, columnData, {
        headers: {
          'Content-Type': 'application/json',
          // Assumindo que você tenha um token de autenticação
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      openModalCreateUser(); // Assumindo que este método feche o modal atual ou navegue para onde você deseja ir após a criação
    } catch (error) {
      setError('Erro ao criar a coluna do processo.');
    } finally {
      setIsCreatingColumn(false);
    }
  };

  return (
    <div className='create-column-container'>
      <div className='create-column-header'>
        <label className='create-column-title'>Adicionar Nova Coluna de Processo</label>
      </div>
      <div className="create-column-form-container">
        <form className="create-column-form" onSubmit={handleCreateColumn}>
          <input className="create-column-input" type="text" placeholder="Nome da Coluna" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="create-column-input" type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="create-column-input" type="number" placeholder="Ordem de Exibição" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
          {error && <div className="create-column-error-message">{error}</div>}
          <div className='create-column-footer'>
            <button type="button" className="create-column-close-button" onClick={openModalCreateUser}>Cancelar</button>
            <button type="submit" className="create-column-button" disabled={isCreatingColumn}>Criar Coluna</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateColumns;
