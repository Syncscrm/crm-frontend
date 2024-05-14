import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useUser } from '../../../contexts/userContext'
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'

import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

import './style.css';
import Column from '../../Column';
import Card from '../../Card';

import { DragDropContext } from 'react-beautiful-dnd';
import PreviewCard from '../../PreviewCard';

import { MdOutlineSearch } from "react-icons/md";
import ImportExcel from '../../ImportExcel';
import ImportExcelSuiteFlow from '../../ImportExcelSuiteFlow';

function HomePage() {

  const { user, openCloseImportExcelEntidades, setOpenCloseImportExcelEntidades, openCloseImportExcelSuiteFlow, setOpenCloseImportExcelSuiteFlow} = useUser();
  const { columnsUser } = useColumns();
  const { addHistoricoCardContext, cards, setCards, previewSearchCards, setPreviewSearchCards, searchTerm, setSearchTerm, setCurrentCardData, setOpenCloseUpdateCard } = useCard();

  const fetchCardsByName = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`${apiUrl}/card/search?name=${encodeURIComponent(searchTerm)}&entityId=${user.id}&empresaId=${user.empresa_id}`);
        setPreviewSearchCards(response.data)
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    } else {
      setPreviewSearchCards([])
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCardsByName();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, user]);

  function getCardData(card) {
    setCurrentCardData(card)
    setOpenCloseUpdateCard(true)
    setSearchTerm('')
  }

  const getNameColumnCard = (idColumn) => {

    if (!columnsUser) {
      return 'Dados ainda estão carregando...';
    }
  
    const nameColumn = columnsUser.find((item) => item.id === idColumn);
    
    return nameColumn ? nameColumn.name : 'Nome não encontrado';
  };


  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return; // Não faz nada se não há destino ou se o card foi largado na mesma posição
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return; // Não faz nada se o card foi largado na mesma posição
    }

    const currentCardId = parseInt(draggableId, 10);
    const newColumnId = parseInt(destination.droppableId, 10);

    // Atualização otimista: Atualiza o estado imediatamente
    const startCards = [...cards];
    const newCards = cards.map(card => {
        if (card.id === currentCardId) {
            return { ...card, column_id: newColumnId }; // Assume que a propriedade que define a coluna é `column_id`
        }
        return card;
    });
    setCards(newCards);

    try {
      // Chama a API para atualizar o column_id no banco de dados
      const response = await axios.post(`${apiUrl}/card/update-column`, {
        cardId: currentCardId,
        columnId: newColumnId
      });

      if (response.data) {
        addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(newColumnId)}`, currentCardId, user.id);
      } else {
        throw new Error('No data returned');
      }

    } catch (error) {
      console.error('Failed to update card column:', error);
      // Reverte a mudança otimista em caso de erro
      setCards(startCards);
      alert('Failed to move card, please try again.');
    }
};




  useEffect(() => {

  }, [cards]);

  return (

    <div className='home-page-container'>
      <Header />
      <div className='tools-container'>

        <div className='search-card-container'>
          
          <input
            style={{ backgroundColor: searchTerm.trim() ? '#e0e0e0' : '', color: searchTerm.trim() ? 'rgb(83, 83, 83)' : '' }}
            className='search-card-input'
            placeholder="Buscar Cards..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <MdOutlineSearch style={{ display: '' }} className='search-icon' />
          <button style={{ display: searchTerm.trim() ? '' : 'none' }} className='btn-clear-search' onClick={() => setSearchTerm('')}>X</button>

        </div>

      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='home-container'>
          {
            columnsUser ? (columnsUser.map(column => (
              <Column key={column.id} columnData={column} />
            ))
            ) : (<>sem colunas</>)
          }

        </div>
      </DragDropContext>

      {
        searchTerm.trim() &&
        <div className='search-result-container'>
          {
            previewSearchCards.map((item) => (
              <div className='item-search-result-card' key={item.id} onClick={() => getCardData(item)}>
                <PreviewCard key={item.id} cardData={item} />
              </div>
            ))
          }

        </div>
      }

      {
        openCloseImportExcelEntidades && 
        <ImportExcel />
      }

      {
        openCloseImportExcelSuiteFlow &&
        <ImportExcelSuiteFlow />
      }
    </div>
  );
}

export default HomePage;
