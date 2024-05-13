import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/userContext'
import { useCard } from '../../contexts/cardContext'
import { useColumns } from '../../contexts/columnsContext';
import { format, parseISO } from 'date-fns';

// ICONS
import { GrTask } from "react-icons/gr";
import { MdAttachFile, MdViewColumn, MdWhatsapp, MdEdit, MdOutlineHistory, MdAnalytics, MdCreate, MdOutlineUpdate, Md360, MdWindow, MdRoom, MdShoppingCart, MdThumbDown, MdThumbUp, MdShare, MdHome, MdAccountBox, MdAlternateEmail, MdGrade, MdAccountBalance, MdArticle } from "react-icons/md";

import './style.css';

// API
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import { differenceInCalendarDays } from 'date-fns';

import { Draggable } from 'react-beautiful-dnd';

function Card({ cardData, index }) {

  const { user, afilhadosList } = useUser();
  const { setOpenCloseUpdateCard, setCurrentCardData,
    setCards, setPreviewSearchCards,
    setListNotifications,
    setOpenCloseHistoricModal,
    setOpenCloseTarefasModal,
    setOpenCloseCompartilharModal,
    setOpenCloseModuloEsquadriasModal,
    addHistoricoCardContext
  } = useCard();
  const { columnsUser } = useColumns();

  const [potencialVenda, setPotencialVenda] = useState(1)
  const [showCard, setShowCard] = useState(false);
  const [statusCard, setStatusCard] = useState('');
  const [openCloseEditStatusModal, setOpenCloseEditStatusModal] = useState(false)

  useEffect(() => {
    setPotencialVenda(cardData.potencial_venda)
    setStatusCard(cardData.status)
  }, [cardData])

  const openCompartilharModal = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseCompartilharModal(true)
  };

  const openModuloEsquadriasModal = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseModuloEsquadriasModal(true)
  };

  const openHistoricModal = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseHistoricModal(true)
  };

  const openTarefasModal = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseTarefasModal(true)
  };

  const viewCard = (e) => {
    e.stopPropagation();
    setShowCard(!showCard)
  }

  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm:ss');
  }

  const getUsernameById = (entityId) => {

    if (!user) {
      return 'Erro: Dados necessários não estão disponíveis.';
    }

    const entidade = afilhadosList.find(afilhado => afilhado.id === entityId);
    if (entidade && entidade.username) {
      return entidade.username;
    }

    if (entityId === user.id) {
      return user.username;
    }

    return 'id não encontrado';
  };

  function updatePotencialVenda(event, number) {
    event.stopPropagation();
    setPotencialVenda(number)
    handleUpdatePotencialVenda(number)
  }

  const handleUpdatePotencialVenda = async (potencial) => {
    const currentCard = {
      id: cardData.id,
      potencial_venda: potencial,
    };

    try {
      const response = await axios.post(`${apiUrl}/card/update-potencial-venda`, currentCard);
      setCards(prevCards => prevCards.map(card => card.id === currentCard.id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.id === currentCard.id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.id === currentCard.id ? { ...card, ...response.data } : card));
      addHistoricoCardContext(`Potencial de Venda alterado para ${potencial} estrelas`, cardData.id, user.id)
    } catch (error) {
      console.error('Erro ao Atualizar potencial de venda:', error);
    }
  };

  function getDaysSinceUpdate(updatedAt) {
    const today = new Date();
    const lastUpdateDate = parseISO(updatedAt);
    return differenceInCalendarDays(today, lastUpdateDate);
  }

  function getCardData(e) {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseUpdateCard(true)
  }

  function openCloseEditEstatusCard(event) {
    event.stopPropagation();
    setStatusCard(cardData.status)
    console.log(cardData.status)

    setOpenCloseEditStatusModal(!openCloseEditStatusModal)
  }

  const updateCardStatus = async (id, status, event) => {
    event.stopPropagation();
    try {
      const response = await axios.post(`${apiUrl}/card/update-status`, { id, status });
      console.log(response.data);
      setStatusCard(response.data.status);
      setCards(prevCards => prevCards.map(card => card.id === id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.id === id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.id === id ? { ...card, ...response.data } : card));
      openCloseEditEstatusCard(event);
      addHistoricoCardContext(`Status alterado de ${cardData.status} para  ${status != null ? status : 'Sem Status'}`, cardData.id, user.id)
    } catch (error) {
      console.error('Erro ao atualizar o cartão:', error);
    }
  };

  function abrirWhatsApp(fone) {
    const confirmDelete = window.confirm('Iniciar conversa pelo WhatsApp?');
    if (confirmDelete) {
      const numeroLimpo = fone.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
      const codigoPais = '+55'; // Código do país (Brasil)
      const numeroTelefone = codigoPais + numeroLimpo;

      // Preparando uma mensagem padrão
      const mensagemPadrao = encodeURIComponent(`Olá, gostaria de discutir mais sobre a oportunidade: ${cardData.name}, ${cardData.city}/${cardData.state}. Meu nome é ${user.username}`);

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemPadrao}`;
      } else {
        window.open(`https://web.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemPadrao}`, '_blank');
      }
      addHistoricoCardContext(`Conversa iniciada pelo WhatsApp ${cardData.fone}`, cardData.id, user.id)

    }
  }

  const getNameColumnCard = (idColumn) => {

    if (!columnsUser) {
      return 'Dados ainda estão carregando...';
    }

    const nameColumn = columnsUser.find((item) => item.id === idColumn);

    return nameColumn ? nameColumn.name : 'Nome não encontrado';
  };


  return (
    <Draggable draggableId={String(cardData.id)} index={index}>
      {(provided) => (
        <div
          className='card-container'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => viewCard(e)}
        >
          {
            openCloseEditStatusModal && (
              <div className='edit-status-footer-container'>
                <div className='update-card-status-container'>

                  <div onClick={(event) => updateCardStatus(cardData.id, null, event)} className='icon-edit-status-card-container' >
                    <Md360 style={{ color: statusCard === null || statusCard === '' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatus(cardData.id, 'Vendido', event)} className='icon-edit-status-card-container' >
                    <MdThumbUp style={{ color: statusCard === 'Vendido' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatus(cardData.id, 'Perdido', event)} className='icon-edit-status-card-container' >
                    <MdThumbDown style={{ color: statusCard === 'Perdido' ? '' : '#9c9c9c' }} className='icon-status-card-perdido' />
                  </div>
                </div>
              </div>
            )
          }
          <div className='card-header'>
            <label className='card-title'>{cardData.name.toUpperCase()}</label>
          </div>
          <div className='card-body'>

            {
              showCard && (
                <>
                  <label className='card-body-item'>
                    <MdArticle className='card-icon-item' />{cardData.document_number}
                  </label>
                  {cardData && cardData.nome_obra && cardData.nome_obra != '' &&
                    <label className='card-body-item'>
                      <MdHome className='card-icon-item' />{cardData.nome_obra}
                    </label>
                  }

                  <label className='card-body-item-fone'>
                    <div className='card-body-item-fone-number'>
                      <MdWhatsapp className='icons-whatsapp' onClick={() => abrirWhatsApp(cardData.fone)} />{cardData.fone}
                    </div>
                  </label>
                  <label className='card-body-item'>
                    <MdAlternateEmail className='card-icon-item' />{cardData.email}
                  </label>
                  <label className='card-body-item'>
                    <MdAccountBox className='card-icon-item' />{getUsernameById(cardData.entity_id)}
                  </label>
                  <label className='card-body-item'>
                    <MdRoom className='card-icon-item' /> {cardData.city + '/' + cardData.state}
                  </label>
                  <label className='card-body-item'>
                    <MdAccountBalance className='card-icon-item' />
                    <label className='card-valor-item'>R$ {cardData.cost_value ? cardData.cost_value : 0}</label>
                  </label>
                  <label className='card-body-item'>
                    <MdShoppingCart className='card-icon-item' />
                    <label className='card-valor-item'>R$ {cardData.sale_value ? cardData.sale_value : 0}</label>
                  </label>
                  <label className='card-body-item'>
                    <MdCreate className='card-icon-item' />{formatDate(cardData.created_at)}
                  </label>
                  <label className='card-body-item'>
                    <MdOutlineUpdate className='card-icon-item' />{formatDate(cardData.updated_at)}
                  </label>
                  <label className='card-body-item'>
                    <MdAnalytics className='card-icon-item' />{cardData.status_date ? formatDate(cardData.status_date) : ''}
                  </label>

                  <label className='card-body-item'>
                    <MdViewColumn className='card-icon-item' />{cardData.column_id ? getNameColumnCard(cardData.column_id) : '---'}
                  </label>

                  <div className='btns-card-container'>
                    <button onClick={(e) => getCardData(e)} className='btn-update-card'>
                      <MdEdit className='icons-btns-update-card' />
                    </button>
                    <button onClick={openHistoricModal} className='btn-update-card'>
                      <MdOutlineHistory className='icons-btns-update-card' />
                    </button>
                    <button onClick={openTarefasModal} className='btn-update-card'>
                      <GrTask className='icons-btns-update-card' />
                    </button>
                    <button onClick={openCompartilharModal} className='btn-update-card'>
                      <MdShare className='icons-btns-update-card' />
                    </button>
                    <button onClick={openModuloEsquadriasModal} className='btn-update-card'>
                      <MdWindow className='icons-btns-update-card' />
                    </button>
                    <button onClick={openModuloEsquadriasModal} className='btn-update-card'>
                      <MdAttachFile className='icons-btns-update-card' />
                    </button>
                  </div>

                </>
              )
            }

            {
              true && !showCard && (
                <>
                  <label className='card-body-item-separate'>
                    <label className='card-valor-item-separate'>R$ {cardData.cost_value ? cardData.cost_value : 0}</label>
                  </label>
                </>
              )
            }

          </div>
          <div className='card-footer'>

            <label className='card-n-dias'>{getDaysSinceUpdate(cardData.updated_at)} dias</label>
            <label className='card-star-container'>
              <MdGrade
                onClick={(event) => updatePotencialVenda(event, 1)}
                className='card-icon-star'
                style={{ color: potencialVenda > 1 || potencialVenda === 1 ? 'gold' : '' }}
              />
              <MdGrade
                onClick={(event) => updatePotencialVenda(event, 2)}
                className='card-icon-star'
                style={{ color: potencialVenda > 2 || potencialVenda === 2 ? 'gold' : '' }}
              />
              <MdGrade
                onClick={(event) => updatePotencialVenda(event, 3)}
                className='card-icon-star'
                style={{ color: potencialVenda > 3 || potencialVenda === 3 ? 'gold' : '' }}
              />
              <MdGrade
                onClick={(event) => updatePotencialVenda(event, 4)}
                className='card-icon-star'
                style={{ color: potencialVenda > 4 || potencialVenda === 4 ? 'gold' : '' }}
              />
              <MdGrade
                onClick={(event) => updatePotencialVenda(event, 5)}
                className='card-icon-star'
                style={{ color: potencialVenda > 5 || potencialVenda === 5 ? 'gold' : '' }}
              />
            </label>

            <div className='card-icons-status-container'>
              <Md360 onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === null || statusCard === '' ? '' : 'none' }} className='card-icon-em-andamento' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Vendido' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbDown onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Perdido' ? '' : 'none' }} className='card-icon-perdido' />

            </div>

          </div>

        </div>
      )}
    </Draggable>
  );
}

export default Card;

