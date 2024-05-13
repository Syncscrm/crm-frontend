import React, { useState, useEffect, useRef } from 'react';

import Card from '../../components/Card';
import CreateCard from '../../components/forms/CreateCard';

import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext'

import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import './style.css';

import { Droppable } from 'react-beautiful-dnd';

function Column(props) {

  const { user } = useUser();
  const { cards, setCards } = useCard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCostValue, setTotalCostValue] = useState(0);
  const [cardCount, setCardCount] = useState(0);

  const handleAddCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const fetchCards = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/find/${user.id}/${user.empresa_id}`);
      setCards(response.data);
      const fetchedCards = response.data.filter(card => card.column_id === props.columnData.id);
      setFilteredCards(fetchedCards);
      //const fetchedCards = response.data;
      const totals = calculateTotals(fetchedCards, props.columnData.id);
      setTotalCostValue(totals.totalCost);
      setCardCount(totals.cardCount);
      //console.log(response.data)
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
    }
  };

  useEffect(() => {
    const totals = calculateTotals(cards, props.columnData.id);
    setTotalCostValue(totals.totalCost);
    setCardCount(totals.cardCount);
  }, [cards]);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user, props.columnData.id]);

  const calculateTotals = (cards, columnId) => {
    const filteredCards = cards.filter(card => card.column_id === columnId);
    const totalCost = filteredCards.reduce((acc, card) => acc + parseFloat(card.cost_value || 0), 0);
    return {
      totalCost,
      cardCount: filteredCards.length
    };
  };

  useEffect(() => {
    const filteredCards = cards.filter(card => card.column_id === props.columnData.id);
    setFilteredCards(filteredCards);
  }, [cards, props.columnData.id]);



  // ---------- SCROLL -------------

  const [filteredCards, setFilteredCards] = useState([]);

  const columnBodyRef = useRef(null);

  const [displayedCards, setDisplayedCards] = useState(14);

  useEffect(() => {
    function handleScrollMobile() {
      const { scrollTop, clientHeight, scrollHeight } = columnBodyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setDisplayedCards((prevDisplayed) => prevDisplayed + 10);
      }
    }

    function handleScrollDesktop() {
      if (columnBodyRef.current.offsetHeight + columnBodyRef.current.scrollTop >= columnBodyRef.current.scrollHeight - 10) {
        setDisplayedCards((prevDisplayed) => prevDisplayed + 10);
      }
    }

    const columnBodyElement = columnBodyRef.current;

    if (columnBodyElement) {
      if ('ontouchstart' in window) {
        // Dispositivo móvel
        columnBodyElement.addEventListener('scroll', handleScrollMobile);
      } else {
        // Navegador de computador
        columnBodyElement.addEventListener('scroll', handleScrollDesktop);
      }
    }

    return () => {
      if (columnBodyElement) {
        if ('ontouchstart' in window) {
          // Dispositivo móvel
          columnBodyElement.removeEventListener('scroll', handleScrollMobile);
        } else {
          // Navegador de computador
          columnBodyElement.removeEventListener('scroll', handleScrollDesktop);
        }
      }
    };
  }, []);

  // --------- FIM SCROLL

  return (

    <Droppable droppableId={String(props.columnData.id)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? '#c8f3bf' : '#F0F2F5', // Muda a cor de fundo conforme o card é arrastado sobre
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
            {
              filteredCards.slice(0, displayedCards).map((card, index) => (
                <Card key={card.id} cardData={card} index={index} />
              ))
            }
            {provided.placeholder}
          </div>
          <div style={{ display: 'none' }} className='column-footer'>{props.columnData.id}</div>
          {isModalOpen && <CreateCard columnId={props.columnData.id} onClose={handleCloseModal} />}
        </div>
      )}
    </Droppable>

  );
}

export default Column;

