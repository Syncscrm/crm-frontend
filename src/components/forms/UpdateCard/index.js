import React, { useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

import { Md360, MdThumbDown, MdThumbUp } from "react-icons/md";

// STYLE
import './style.css';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'

function UpdateCard({ idCard, cardData }) {

  // CONTEXT API
  const { user } = useUser();
  const { columnsUser } = useColumns();
  const { addHistoricoCardContext, setOpenCloseUpdateCard, cards, setCards, setPreviewSearchCards, setListNotifications } = useCard();

  // ESTADOS LOCAL
  const [statusCard, setStatusCard] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [entityId, setEntityId] = useState();
  const [name, setName] = useState('');
  const [saleValue, setSaleValue] = useState();
  const [costValue, setCostValue] = useState();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [fone, setFone] = useState('');
  const [columnId, setColumnId] = useState();
  const [error, setError] = useState('');
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [count, setCount] = useState(0)

  const [currentIdColumn, setCurrentIdColumn] = useState();

  useEffect(() => {
    setCount(count + 1)
    if (count > 1) {
      setIsUpdatingCard(true)
    }

  }, [statusCard, documentNumber, entityId, name, saleValue, costValue, email, state, city, fone, columnId]);


  useEffect(() => {
    //console.log('updateCard', cardData);
    if (cardData) { // Verifica se cardData e cardData.cardData existem
      //console.log('2', cardData.document_number);
      setDocumentNumber(cardData.document_number || '');
      setSaleValue(cardData.sale_value);
      setCostValue(cardData.cost_value);
      setName(cardData.name);
      setEmail(cardData.email);
      setState(cardData.state);
      setCity(cardData.city);
      setFone(cardData.fone);
      setColumnId(cardData.column_id);
      setEntityId(cardData.entity_id);
      setStatusCard(cardData.status);
    }
  }, [cardData]);

  const getNameColumnCard = (idColumn) => {
    if (!columnsUser) {
      return 'Dados ainda estão carregando...';
    }
    const nameColumn = columnsUser.find((item) => item.id === idColumn);
    return nameColumn ? nameColumn.name : 'Nome não encontrado';
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    setIsUpdatingCard(true);
    setError('');
  
    const cardData = {
      id: idCard,
      name,
      state,
      city,
      fone,
      email,
      column_id: columnId,
      entity_id: entityId,
      empresa_id: user.empresa_id,
      document_number: documentNumber ? documentNumber : '',
      cost_value: costValue,
      sale_value: saleValue,
      status: statusCard ? statusCard : '',
    };
  
    try {
      const response = await axios.post(`${apiUrl}/card/update`, cardData);
      //console.log(response.data);  // Verifique se todos os dados necessários estão sendo retornados

      const updatedCardData = response.data[0]; // Atualiza o item 0 do array

      setCards(prevCards => prevCards.map(card => card.id === idCard ? { ...card, ...updatedCardData } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.id === idCard ? { ...card, ...updatedCardData } : card));
      setListNotifications(prevCards => prevCards.map(card => card.id === idCard ? { ...card, ...updatedCardData } : card));

  
      setOpenCloseUpdateCard(false);
      setIsUpdatingCard(false);
      console.log('Card atualizado com sucesso!');

      console.log(columnId,currentIdColumn )

      if(columnId != currentIdColumn){
        addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(columnId)}`, idCard, user.id)
      }

    } catch (error) {
      setIsUpdatingCard(false);
      setError('Erro ao atualizar o Card.');
    }
  };
  
  useEffect(() => {
    if(cardData){
      setCurrentIdColumn(cardData.column_id)

    }

  }, [cardData])

  return (
    <div className='update-card-modal'>
      <div className='update-card-container'>
        <div className="update-card-form-container">

          <label htmlFor="address" className='update-card-label-input'>Selecionar Coluna:</label>
          <div className='update-card-select-column-container'>
            {
              columnsUser.map(column => (
                <button style={{ backgroundColor: columnId === column.id ? 'red' : '' }} key={column.id} className='update-card-btn-select-column' onClick={() => setColumnId(column.id)}>{column.name}</button>
              ))
            }
          </div>

          <form className="update-card-form" onSubmit={handleUpdateCard}>

            <label htmlFor="address" className='update-card-label-input'>Nome do Cliente:</label>
            <input id="username" className="update-card-input" type="text" placeholder="" value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Estado:</label>
            <input id="state" className="update-card-input" type="text" placeholder="" value={state} onChange={(e) => setState(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Cidade:</label>
            <input id="city" className="update-card-input" type="text" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Fone:</label>
            <input id="fone" className="update-card-input" type="text" placeholder="" value={fone} onChange={(e) => setFone(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Email:</label>
            <input id="email" className="update-card-input" type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Número do Orçamento:</label>
            <input id="username" className="update-card-input" type="text" placeholder="" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Valor de Custo:</label>
            <input id="username" className="update-card-input" type="text" placeholder="" value={costValue} onChange={(e) => setCostValue(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Valor de Venda:</label>
            <input id="username" className="update-card-input" type="text" placeholder="" value={saleValue} onChange={(e) => setSaleValue(e.target.value)} />

            <label htmlFor="address" className='update-card-label-input'>Column ID: {columnId}</label>

          </form>
        </div>
        {error && <div className="update-card-error-message">{error}</div>}

        <div className='update-card-footer'>
          <button className="update-card-close-button" onClick={(e) => { setOpenCloseUpdateCard(false) }}>Cancelar</button>
          <button style={{ backgroundColor: !isUpdatingCard ? '' : 'dodgerblue' }} type="submit" className="update-card-button" onClick={handleUpdateCard} disabled={!isUpdatingCard}>Atualizar Card</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateCard; 
