import React, { useState, useEffect, useRef, useMemo } from 'react';

import Card from '../../components/Card';
import CreateCard from '../../components/forms/CreateCard';

import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext';
import { useColumns } from '../../contexts/columnsContext';

import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import './style.css';

import { Droppable } from 'react-beautiful-dnd';

function Column(props) {
  const { user } = useUser();
  const { cards, setCards } = useCard();
  const { setLoadingResult, setLoadingModal, selectedAfilhados, dataInicial, setDataInicial, dataFinal, orderBy, setOrderBy, isAscending, setIsAscending } = useColumns();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCostValue, setTotalCostValue] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState(14);

  const columnBodyRef = useRef(null);

  const handleAddCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const fetchCards = async () => {
    //console.log('dataInicial', dataInicial)
    //console.log('dataFinal', dataFinal)

    try {
      setLoadingModal(true);
      setLoadingResult('Carregando...');
      const response = await axios.get(`${apiUrl}/card/find/${user.id}/${user.empresa_id}`, {
        params: {
          dataInicial,
          dataFinal,
        },
      });
      setCards(response.data);
      setLoadingModal(false);
      setLoadingResult('');
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
      setLoadingResult('Erro ao Carregar Cards!');
    }
  };

  useEffect(() => {

    fetchCards();

  }, [dataInicial, dataFinal]);


  // useEffect(() => {
  //   const totals = calculateTotals(cards, props.columnData.id);
  //   setTotalCostValue(totals.totalCost);
  //   setCardCount(totals.cardCount);
  // }, [cards, props.columnData.id]);

  useEffect(() => {
    const totals = calculateTotals(filteredCards);  // Use filteredCards
    setTotalCostValue(totals.totalCost);
    setCardCount(totals.cardCount);
  }, [filteredCards]);

  useEffect(() => {
    let filteredCards = [];

    //console.log('selectedAfilhados', selectedAfilhados);

    if (selectedAfilhados.length > 0) {
      filteredCards = cards.filter(card =>
        card.column_id === props.columnData.id &&
        (selectedAfilhados.includes(card.entity_id) || card.compartilhamento === true)
      );
    }

    setFilteredCards(filteredCards);
  }, [cards, props.columnData.id, selectedAfilhados]);


  // const calculateTotals = (cards, columnId) => {
  //   const filteredCards = cards.filter(card => card.column_id === columnId);
  //   const totalCost = filteredCards.reduce((acc, card) => acc + parseFloat(card.cost_value || 0), 0);
  //   return {
  //     totalCost,
  //     cardCount: filteredCards.length
  //   };
  // };

  const calculateTotals = (filteredCards) => {
    const totalCost = filteredCards.reduce((acc, card) => acc + parseFloat(card.cost_value || 0), 0);
    return {
      totalCost,
      cardCount: filteredCards.length
    };
  };

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } = columnBodyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setDisplayedCards(prevDisplayed => prevDisplayed + 10);
      }
    }

    const columnBodyElement = columnBodyRef.current;

    if (columnBodyElement) {
      columnBodyElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (columnBodyElement) {
        columnBodyElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  const sortedCards = useMemo(() => {
    if (!filteredCards) return [];

    const sorted = [...filteredCards].sort((a, b) => {
      let comparison = 0;
      switch (orderBy) {
        case 'nome':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dataStatus':
          comparison = new Date(a.status_date) - new Date(b.status_date);
          break;
        case 'dataCreate':
          comparison = new Date(a.created_at) - new Date(b.created_at);
          break;
        case 'dataUpdate':
          comparison = new Date(a.updated_at) - new Date(b.updated_at);
          break
        case 'value':
          comparison = a.cost_value - b.cost_value;
          break;
        default:
          comparison = 0;
      }
      return isAscending ? comparison : -comparison;
    });

    return sorted;
  }, [filteredCards, orderBy, isAscending]);



  return (
    <Droppable droppableId={String(props.columnData.id)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? '#c8f3bf' : '#F0F2F5',
          }}
          className='column-container'
        >
          <div className='column-header'>
            <div className='column-title'>
              <label>{props.columnData.name}</label>
              <button className='btn-add-new-card' onClick={handleAddCardClick}>+</button>
            </div>
            <div className='column-info'>
              <label>{cardCount} Cards</label>
              <label>R$ {totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</label>
            </div>
          </div>
          <div className='column-body' ref={columnBodyRef}>
            {sortedCards.slice(0, displayedCards).map((card, index) => (
              <Card key={card.card_id} cardData={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
          <div style={{ display: '' }} className='column-footer'>{props.columnData.id}</div>
          {isModalOpen && <CreateCard columnId={props.columnData.id} onClose={handleCloseModal} />}
        </div>
      )}
    </Droppable>
  );
}

export default Column;
