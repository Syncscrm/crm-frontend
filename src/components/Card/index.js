import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/userContext'
import { useCard } from '../../contexts/cardContext'
import { useColumns } from '../../contexts/columnsContext';
import { format, parseISO } from 'date-fns';

// ICONS
import { GrTask } from "react-icons/gr";
import { MdDeleteForever, MdCreditCard, MdLibraryAdd, MdAutoAwesomeMotion, MdOutlineSendToMobile, MdLockOpen, MdLockOutline, MdBookmark, MdAssignment, MdAssignmentTurnedIn, MdAdsClick, MdColorLens, MdAttachFile, MdViewColumn, MdWhatsapp, MdEdit, MdOutlineHistory, MdAnalytics, MdCreate, MdOutlineUpdate, Md360, MdWindow, MdRoom, MdShoppingCart, MdThumbDown, MdThumbUp, MdShare, MdHome, MdAccountBox, MdAlternateEmail, MdGrade, MdAccountBalance, MdArticle } from "react-icons/md";
import { GiWindow } from "react-icons/gi";

import './style.css';

// API
import axios from 'axios';
import { apiUrl ,fileApiUrl} from '../../config/apiConfig';

import { differenceInCalendarDays } from 'date-fns';

import { Draggable } from 'react-beautiful-dnd';
import VendaPerdida from '../VendaPerdida';


import fb from '../../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


function Card({ cardData, index }) {

  const { user, afilhadosList, listAllUsers, editableColumns, getAccessLevel } = useUser();
  const { setOpenCloseUpdateCard, setCurrentCardData,
    setCards, setPreviewSearchCards,
    setListNotifications,
    setOpenCloseHistoricModal,
    setOpenCloseTarefasModal,
    setOpenCloseCompartilharModal,
    setOpenCloseModuloEsquadriasModal,
    addHistoricoCardContext,
    cards,
    currentCardIdMessage, setCurrentCardIdMessage,
    openCloseModalMessenger, setOpenCloseModalMessenger,
    openCloseAnexosModal, setOpenCloseAnexosModal,
    listaEtiquetas
  } = useCard();
  const { columnsUser, columns } = useColumns();

  const [potencialVenda, setPotencialVenda] = useState(1)
  const [showCard, setShowCard] = useState(false);
  const [statusCard, setStatusCard] = useState('');
  const [openCloseEditStatusModal, setOpenCloseEditStatusModal] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState(cardData.column_id);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const [blockColumnCard, setBlockColumnCard] = useState(false);


  const [selectedEtiquetaId, setSelectedEtiquetaId] = useState(null);


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

  const openAnexosModal = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseAnexosModal(true)
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

    //console.log(cardData)


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

    const entidade = listAllUsers.find(afilhado => afilhado.id === entityId);
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

    if (!getAccessLevel('estrelas')) {
      const confirmDelete = window.alert('Não autorizado pelo Administrador!');
      return
    }

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }

    const currentCard = {
      id: cardData.card_id,
      potencial_venda: potencial,
    };

    try {
      setModalLoading(true)
      const response = await axios.post(`${apiUrl}/card/update-potencial-venda`, currentCard);
      setCards(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      addHistoricoCardContext(`Potencial de Venda alterado para ${potencial} estrelas`, cardData.card_id, user.id)
      setModalLoading(false)
    } catch (error) {
      console.error('Erro ao Atualizar potencial de venda:', error);
      setMensagemLoading('Erro ao Salvar Status!')
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

    if (!getAccessLevel('status')) {
      event.stopPropagation();
      const confirmDelete = window.alert('Não autorizado pelo Administrador!');
      return
    }


    event.stopPropagation();
    setStatusCard(cardData.status)
    console.log(cardData.status)

    setOpenCloseEditStatusModal(!openCloseEditStatusModal)
  }

  const updateCardStatus = async (id, status, event) => {
    event.stopPropagation();

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }


    // Verificar se existe uma coluna com o nome 'Vendidos' e obter seu ID
    const vendidosColumn = columns.find(column => column.name === 'Vendidos');
    if (!vendidosColumn) {
      console.error("Coluna 'Vendidos' não encontrada");
      return;
    }

    // Definir o ID da coluna para 'Vendidos' se o status for 'Vendido'
    const columnId = status === 'Vendido' ? vendidosColumn.id : null;

    try {
      setModalLoading(true);
      const response = await axios.post(`${apiUrl}/card/update-status`, { id, status, columnId });
      //console.log(response.data);
      setStatusCard(response.data.status);
      setCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      openCloseEditEstatusCard(event);
      addHistoricoCardContext(`Status alterado de ${cardData.status} para ${status != null ? status : 'Sem Status'}`, cardData.card_id, user.id);
      setModalLoading(false);
    } catch (error) {
      console.error('Erro ao atualizar o cartão:', error);
      setMensagemLoading('Erro ao Salvar Status!');
    }
  };


  const [openCloseModalVendaPerdida, setOpenCloseModalVendaPerdida] = useState(false)

  const closeVendaPerdidaModal = () => {
    setOpenCloseModalVendaPerdida(false);
  };

  const updateCardStatusPerdido = async (id, status, event) => {
    event.stopPropagation();
    setCurrentCardData(cardData)
    setOpenCloseEditStatusModal(false)
    setOpenCloseModalVendaPerdida(true)
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
      addHistoricoCardContext(`Conversa iniciada pelo WhatsApp ${cardData.fone}`, cardData.card_id, user.id)

    }
  }

  const getNameColumnCard = (idColumn) => {

    if (!columnsUser) {
      return 'Dados ainda estão carregando...';
    }

    const nameColumn = columnsUser.find((item) => item.id === idColumn);

    return nameColumn ? nameColumn.name : 'Nome não encontrado';
  };

  const [modalLoading, setModalLoading] = useState(false)
  const [mensagemLoading, setMensagemLoading] = useState('Salvando...')






  // ------------- ALTERAR COLUNA DO CARD -------------

  const updateCardColumn = async (newColumnId) => {
    const currentCardId = cardData.card_id;

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }





    try {
      setModalLoading(true);
      setShowConfirmButton(true);
      setMensagemLoading('Alterando Coluna...');
      const response = await axios.post(`${apiUrl}/card/update-column`, {
        cardId: currentCardId,
        columnId: newColumnId
      });

      if (response.data) {
        addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(newColumnId)}`, currentCardId, user.id);
      } else {
        throw new Error('No data returned');
      }

      setCards(prevCards => prevCards.map(card => card.card_id === currentCardId ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === currentCardId ? { ...card, ...response.data } : card));

      setModalLoading(false);
      setMensagemLoading('');
      setShowConfirmButton(false);
    } catch (error) {
      setMensagemLoading('Erro ao alterar Card de Coluna!');
      console.error('Failed to update card column:', error);
      setCards(prevCards => prevCards.map(card => card.card_id === currentCardId ? { ...card, column_id: cardData.column_id } : card));
      alert('Failed to move card, please try again.');
      setShowConfirmButton(false);
    }
  };


  const shareCard = (cardId, event) => {
    event.stopPropagation();
    setCurrentCardIdMessage(cardId);
    setOpenCloseModalMessenger(true)
  }



  function getEtiquetaColorById(id) {
    const etiqueta = listaEtiquetas.find(etiqueta => etiqueta.id === id);
    return etiqueta ? etiqueta.color : '';
  }



  const updateCardEtiqueta = async (etiqueta) => {
    const currentCardId = cardData.card_id;

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }


    try {
      setModalLoading(true);
      setShowConfirmButton(true);
      setMensagemLoading('Alterando Etiqueta...');
      const response = await axios.post(`${apiUrl}/card/update-etiqueta`, {
        cardId: currentCardId,
        etiqueta_id: etiqueta,
      });

      if (response.data) {
        addHistoricoCardContext(`Etiqueta alterada`, currentCardId, user.id);
      } else {
        throw new Error('No data returned');
      }

      setCards(prevCards => prevCards.map(card => card.card_id === currentCardId ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === currentCardId ? { ...card, ...response.data } : card));

      setModalLoading(false);
      setMensagemLoading('');
      setShowConfirmButton(false);
    } catch (error) {
      setMensagemLoading('Erro ao alterar Etiqueta!');
      setShowConfirmButton(false);
    }
  };


  const sortedEtiquetas = [...listaEtiquetas].sort((a, b) => a.order - b.order);
  const editableColumnIds = editableColumns.map(column => column.columnId);

  const canEditCurrentColumn = editableColumnIds.includes(cardData.column_id);







  const updateBlockColumnCard = async (block) => {

    if (user.access_level != 5) {
      const userConfirmed = window.confirm(`Apenas Administrador!`);
      return;
    }



    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }

    const currentCard = {
      id: cardData.card_id,
      block_column: block,
    };

    try {
      setModalLoading(true)
      const response = await axios.post(`${apiUrl}/card/update-block-column`, currentCard);
      setCards(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.card_id === currentCard.card_id ? { ...card, ...response.data } : card));
      setModalLoading(false)
      setBlockColumnCard(block)
    } catch (error) {
      console.error('Erro ao Atualizar bloqueio de coluna:', error);
    }
  };










  // ---------------- Enviar whatsapp CHATBOT--------------------





  function enviarMensagemPotencialCliente() {

    const userConfirmed = window.confirm(`Emviar mensagem para Parceiro?`);
    if (!userConfirmed) {
      return;
    }


    sendMessage(
      buscarFoneReferencia(cardData.entity_id),
      '',
      `${getUsernameById(cardData.entity_id)}\n \nCard com Link Patrocinado criado com sucesso no CRM! \n \nCliente: ${cardData.name} \nNúmero do orçamento: ${cardData.document_number} \nValor: ${cardData.sale_value ? parseFloat(cardData.sale_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'}\n\n Verifique as informações fornecidas!\n\nBazze PVC`
    );
  }

  const sendMessage = async (numero, contato, mensagem) => {
    try {

      // Envie a mensagem
      await axios.post(`${apiUrl}/card/enviar`, { numero, mensagem, contato });

      const userConfirmed = window.confirm('Mensagem enviada!');

      console.log('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error.message);
    }
  };



  // PEGAR FONE CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarFoneReferencia(entidade) {

    const listaFiltrada = listAllUsers.filter((item) => item.id.toString() === entidade.toString());

    const fone = listaFiltrada.map((item) => item.fone);

    return fone.toString();
  }



  const criarEtapaDeProducao = async () => {

    if (!getAccessLevel('etapaProducao')) {
      const userConfirmed = window.alert(`Não autorizado pelo ADM!`);
      return;
    }


    const userConfirmed = window.confirm(`Criar etapa de Produção?`);
    if (!userConfirmed) {
      return;
    }


    try {
      const cardDataPayload = {
        created_at: new Date(),
        name: cardData.name ? cardData.name : '',
        document_number: cardData.document_number ? cardData.document_number : '',
        cost_value: 0,
        column_id: cardData.column_id,
        entity_id: cardData.entity_id,
        empresa_id: user.empresa_id,
        origem: cardData.origem ? cardData.origem : '',
        sale_value: 0,
        potencial_venda: cardData.potencial_venda,
        produto: cardData.produto,
        status: cardData.status,
        motivo_venda_perdida: cardData.motivo_venda_perdida,
        nivel_prioridade: cardData.nivel_prioridade,
        status_date: cardData.status_date,
        updated_at: cardData.updated_at,
        email: cardData.email ? cardData.email : '',
        fone: cardData.fone ? cardData.fone : '',
        state: cardData.state ? cardData.state : '',
        city: cardData.city ? cardData.city : '',
        pedido_number: cardData.pedido_number ? cardData.pedido_number : '',
        etapa_producao: cardData.etapa_producao + 1,
        etiqueta_id: cardData.etiqueta_id ? cardData.etiqueta_id : 1,
      };

      const response = await axios.post(`${apiUrl}/card/import-suiteflow`, cardDataPayload);
      setCards([...cards, response.data]);

      const userConfirmed = window.alert(`Etapa de produção criada com sucesso!`);

    } catch (error) {
      console.error('Erro ao criar etapa de produção');
      const userConfirmed = window.alert(`Erro ao criar etapa de Produção!`);
    }
  };




  // const excluirCard = async () => {
  //   if (!getAccessLevel('excluir')) {
  //     window.alert(`Não autorizado pelo ADM!`);
  //     return;
  //   }

  //   const userConfirmed = window.confirm(`Excluir Card?`);
  //   if (!userConfirmed) {
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(`${apiUrl}/card/${cardData.card_id}`);
  //     setCards(prevCards => prevCards.filter(card => card.card_id !== cardData.card_id));
  //     window.alert(`Card excluído com sucesso!`);
  //   } catch (error) {
  //     console.error('Erro ao excluir o card:', error);
  //     window.alert(`Erro ao excluir o card!`);
  //   }
  // };


  // const excluirCard = async () => {
  //   if (!getAccessLevel('excluir')) {
  //     window.alert(`Não autorizado pelo ADM!`);
  //     return;
  //   }
  //   const userConfirmed = window.confirm(`Excluir Card?`);
  //   if (!userConfirmed) {
  //     return;
  //   }
  //   try {
  //     // Chame o endpoint para excluir todos os anexos
  //     const anexosResponse = await axios.delete(`${apiUrl}/card/${cardData.card_id}/delete-all-anexos`);
  //     if (anexosResponse.data) {
  //       // Exclua os arquivos do Firebase Storage
  //       const storage = getStorage(fb);
  //       for (const anexo of anexosResponse.data) {
  //         const storagePath = `syncs/empresa-id-${user.empresa_id}/${anexo.nome_arquivo}`;
  //         const storageRef = ref(storage, storagePath);
  //         await deleteObject(storageRef);
  //       }
  //     }
  //     // Chame o endpoint para excluir o card
  //     const response = await axios.delete(`${apiUrl}/card/${cardData.card_id}`);
  //     setCards(prevCards => prevCards.filter(card => card.card_id !== cardData.card_id));
  //     window.alert(`Card excluído com sucesso!`);
  //   } catch (error) {
  //     console.error('Erro ao excluir o card:', error);
  //     window.alert(`Erro ao excluir o card!`);
  //   }
  // };


  const excluirCard = async () => {
    if (!getAccessLevel('excluir')) {
      window.alert(`Não autorizado pelo ADM!`);
      return;
    }
    const userConfirmed = window.confirm(`Excluir Card?`);
    if (!userConfirmed) {
      return;
    }
    try {
      setModalLoading(true);
      setMensagemLoading('Excluindo anexos...');
  
      // Obtenha todos os anexos do card
      const anexosResponse = await axios.get(`${apiUrl}/card/${cardData.card_id}/anexos`);

      console.log('lista-anexos', anexosResponse.data)

      const anexos = anexosResponse.data;
  
      // Exclua todos os anexos do servidor de arquivos
      for (const anexo of anexos) {
        try {
          await axios.delete(`${fileApiUrl}/uploads/${anexo.nome_arquivo}`);


        } catch (error) {
          console.error(`Erro ao excluir o arquivo ${anexo.nome_arquivo} do servidor:`, error);
        }
      }
  
      setMensagemLoading('Excluindo anexos do banco de dados...');
  
      // Exclua todos os anexos do banco de dados
      await axios.delete(`${apiUrl}/card/${cardData.card_id}/delete-all-anexos`);
  
      setMensagemLoading('Excluindo card...');
  
      // Exclua o card
      await axios.delete(`${apiUrl}/card/${cardData.card_id}`);
      setCards(prevCards => prevCards.filter(card => card.card_id !== cardData.card_id));
  
      window.alert(`Card excluído com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir o card:', error);
      window.alert(`Erro ao excluir o card!`);
    } finally {
      setModalLoading(false);
      setMensagemLoading('');
    }
  };
  




  function getBackgroundColor(days) {
    if (days <= 3) {
      return '#4eafff';
    } else if (days > 3 && days <= 6) {
      return '#FFD700';
    } else if (days > 6 && days <= 10) {
      return 'orange';
    } else {
      return 'rgb(255, 20, 98)';
    }
  }





  return (


    <Draggable draggableId={JSON.stringify({ cardData, block_column: blockColumnCard })} index={index}>
      {(provided) => (
        <div
          className='card-container'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => viewCard(e)}
        >

          <div className='rotulo-container' style={{ backgroundColor: getEtiquetaColorById(cardData.etiqueta_id) }}></div>

          {
            modalLoading &&
            <>
              <div className='card-loading'>{mensagemLoading}<button onClick={() => setModalLoading(false)} className='btn-close-loading-card'>x</button></div>
            </>
          }

          {
            openCloseEditStatusModal && (
              <div className='edit-status-footer-container'>
                <div className='update-card-status-container'>

                  <div onClick={(event) => updateCardStatus(cardData.card_id, null, event)} className='icon-edit-status-card-container' >
                    <Md360 style={{ color: statusCard === null || statusCard === '' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatus(cardData.card_id, 'Vendido', event)} className='icon-edit-status-card-container' >
                    <MdThumbUp style={{ color: statusCard === 'Vendido' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatusPerdido(cardData.card_id, 'Perdido', event)} className='icon-edit-status-card-container' >
                    <MdThumbDown style={{ color: statusCard === 'Perdido' ? '' : '#9c9c9c' }} className='icon-status-card-perdido' />
                  </div>
                </div>
              </div>
            )
          }
          <div className='card-header'>
            <label className='card-title'>{cardData.name.toUpperCase().substring(0, 28)}</label>
            <MdShare className='icons-shared-card' onClick={(event) => shareCard(cardData.card_id, event)} />

          </div>
          <div className='card-body'>

            {
              showCard && (
                <>

                  <label className='card-body-item-select-column'>
                    <MdBookmark className='card-icon-item' />
                    <select
                      className="select-etiqueta-card"
                      value={cardData.etiqueta_id ? cardData.etiqueta_id : null}
                      onChange={(e) => {
                        setSelectedEtiquetaId(e.target.value);
                        updateCardEtiqueta(e.target.value);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{ backgroundColor: getEtiquetaColorById(cardData.etiqueta_id) }}
                      disabled={!getAccessLevel('etiqueta')} // Adiciona o atributo disabled

                    >
                      <option value={0}>Sem Etiqueta</option>
                      {sortedEtiquetas.map(etiqueta => (
                        <option key={etiqueta.id} value={etiqueta.id}>
                          {etiqueta.description}
                        </option>
                      ))}
                    </select>
                  </label>


                  <label className='card-body-item'>
                    <MdArticle className='card-icon-item' />{cardData.document_number}
                  </label>
                  <label className='card-body-item'>
                    <MdAssignment className='card-icon-item' />{cardData.second_document_number ? cardData.second_document_number : 'Não Informado'}
                  </label>
                  <label className='card-body-item'>
                    <MdAssignmentTurnedIn className='card-icon-item' />{cardData.pedido_number ? cardData.pedido_number : 'Sem Pedido'}
                  </label>
                  {cardData && cardData.nome_obra && cardData.nome_obra != '' &&
                    <label className='card-body-item'>
                      <MdHome className='card-icon-item' />{cardData.nome_obra}
                    </label>
                  }


                  {getAccessLevel('contato') &&
                    <label className='card-body-item-fone'>
                      <div className='card-body-item-fone-number'>
                        <MdWhatsapp className='icons-whatsapp' onClick={() => abrirWhatsApp(cardData.fone)} />{cardData.fone ? cardData.fone : 'Sem Fone'}
                      </div>
                    </label>
                  }

                  {getAccessLevel('contato') &&
                    <label className='card-body-item'>
                      <MdAlternateEmail className='card-icon-item' />{getAccessLevel('contato') && cardData.email ? cardData.email : "Sem Email"}
                    </label>
                  }

                  <label className='card-body-item'>
                    <MdAccountBox className='card-icon-item' />{getUsernameById(cardData.entity_id).substring(0, 28)}
                  </label>
                  <label className='card-body-item'>
                    <MdRoom className='card-icon-item' /> {cardData.city + '/' + cardData.state}
                  </label>

                  <label className='card-body-item'>
                    <MdAccountBalance className='card-icon-item' />
                    <label className='card-valor-item'>{getAccessLevel('valor') && cardData.cost_value ? parseFloat(cardData.cost_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ ******'}</label>
                  </label>
                  <label className='card-body-item'>
                    <MdShoppingCart className='card-icon-item' />
                    <label className='card-valor-item'>{getAccessLevel('valor') && cardData.sale_value ? parseFloat(cardData.sale_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ ******'}</label>
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



                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdAdsClick className='card-icon-item' />{cardData.origem ? cardData.origem : 'Não informado'}
                    </label>

                    <MdOutlineSendToMobile
                      className='lock-column' style={{ display: user.access_level === 5 ? '' : 'none' }}

                      onClick={(e) => {
                        enviarMensagemPotencialCliente();
                        e.stopPropagation();
                      }}
                    />

                  </label>



                  <label className='card-body-item'>
                    <GiWindow className='card-icon-item' />{cardData.produto ? cardData.produto : 'Não informado'}
                  </label>



                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdAutoAwesomeMotion className='card-icon-item' />Etapa: {cardData.etapa_producao === 0 ? 1 : cardData.etapa_producao + 1}
                    </label>
                    <MdLibraryAdd
                      className='lock-column'

                      onClick={(e) => {
                        criarEtapaDeProducao();
                        e.stopPropagation();
                      }}
                    />

                  </label>





                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdCreditCard className='card-icon-item' />ID: {cardData.card_id}
                    </label>
                    <MdDeleteForever
                      className='btn-delete-card'

                      onClick={(e) => {
                        excluirCard();
                        e.stopPropagation();
                      }}
                    />

                  </label>




                  <label style={{ display: 'none' }} className='card-body-item'>
                    <MdViewColumn className='card-icon-item' />{cardData.column_id ? getNameColumnCard(cardData.column_id) : '---'}
                  </label>



                  <label className='row-column-container'>
                    <MdViewColumn className='card-icon-item' />
                    <select
                      className="select-column-card"
                      value={selectedColumnId}
                      onChange={(e) => {
                        if (!blockColumnCard) {
                          setSelectedColumnId(e.target.value);
                          updateCardColumn(e.target.value);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      disabled={blockColumnCard || !getAccessLevel('coluna')} // Adiciona o atributo disabled
                    >
                      {canEditCurrentColumn
                        ? columnsUser
                          .filter(column => editableColumnIds.includes(column.id)) // Filtro aplicado aqui
                          .map(column => (
                            <option key={column.id} value={column.id}>
                              {column.name}
                            </option>
                          ))
                        : (
                          <option >
                            {getNameColumnCard(cardData.column_id)}
                          </option>
                        )
                      }
                    </select>

                    {
                      blockColumnCard &&
                      <MdLockOutline
                        style={{ backgroundColor: 'red' }}
                        className='lock-column'
                        onClick={(e) => {
                          updateBlockColumnCard(false);
                          e.stopPropagation();
                        }}
                      />
                    }
                    {
                      (!blockColumnCard || blockColumnCard == null) &&
                      <MdLockOpen
                        className='lock-column'
                        onClick={(e) => {
                          updateBlockColumnCard(true);
                          e.stopPropagation();
                        }}
                      />
                    }

                  </label>


                  <div className='btns-card-container'>

                    {getAccessLevel('editar') &&
                      <button onClick={(e) => getCardData(e)} className='btn-update-card'>
                        <MdEdit className='icons-btns-update-card' />
                      </button>
                    }

                    {getAccessLevel('historico') &&
                      <button onClick={openHistoricModal} className='btn-update-card'>
                        <MdOutlineHistory className='icons-btns-update-card' />
                      </button>
                    }

                    {getAccessLevel('tarefas') &&
                      <button onClick={openTarefasModal} className='btn-update-card'>
                        <GrTask className='icons-btns-update-card' />
                      </button>
                    }

                    {getAccessLevel('compartilhar') &&
                      <button onClick={openCompartilharModal} className='btn-update-card'>
                        <MdShare className='icons-btns-update-card' />
                      </button>
                    }

                    {getAccessLevel('producao') &&
                      <button onClick={openModuloEsquadriasModal} className='btn-update-card'>
                        <MdWindow className='icons-btns-update-card' />
                      </button>
                    }

                    {getAccessLevel('anexos') &&
                      <button onClick={openAnexosModal} className='btn-update-card'>
                        <MdAttachFile className='icons-btns-update-card' />
                      </button>
                    }

                  </div>
                </>
              )
            }

            {
              true && !showCard && (
                <>
                  <label className='card-body-item-separate-container'>

                    {getAccessLevel('valor') &&
                      <label className='card-body-item-separate-value'>
                        <label style={{ fontSize: '15px' }} className='card-valor-item'>
                          {cardData.cost_value ? parseFloat(cardData.cost_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'}
                        </label>
                      </label>
                    }

                    {!getAccessLevel('valor') &&
                      <label className='card-body-item-separate-value'>
                        <label style={{ fontSize: '15px' }} className='card-valor-item'>
                          {'R$ ******'}
                        </label>
                      </label>
                    }


                    <label className='card-body-item-separate'>
                      {cardData.city + '/' + cardData.state}
                    </label>

                    <label style={{ display: 'none' }} className='card-id-item-separate'>ID: {cardData.card_id}</label>


                  </label>
                </>
              )
            }

          </div>
          <div className='card-footer'>

            <label style={{ backgroundColor: getBackgroundColor(getDaysSinceUpdate(cardData.updated_at)) }} className='card-n-dias'>{getDaysSinceUpdate(cardData.updated_at)}</label>
            <label style={{ backgroundColor: cardData.etapa_producao + 1 > 1 ? '' : 'transparent' }} className='etapa-producao'>Parte: {cardData.etapa_producao + 1}</label>

            {true &&
              <label className='card-star-container'>
                <MdGrade
                  onClick={(event) => updatePotencialVenda(event, 1)}
                  className='card-icon-star'
                  style={{ color: getAccessLevel('estrelas') && (potencialVenda > 1 || potencialVenda === 1) ? 'gold' : '' }}
                />
                <MdGrade
                  onClick={(event) => updatePotencialVenda(event, 2)}
                  className='card-icon-star'
                  style={{ color: getAccessLevel('estrelas') && (potencialVenda > 2 || potencialVenda === 2) ? 'gold' : '' }}
                />
                <MdGrade
                  onClick={(event) => updatePotencialVenda(event, 3)}
                  className='card-icon-star'
                  style={{ color: getAccessLevel('estrelas') && (potencialVenda > 3 || potencialVenda === 3) ? 'gold' : '' }}
                />
                <MdGrade
                  onClick={(event) => updatePotencialVenda(event, 4)}
                  className='card-icon-star'
                  style={{ color: getAccessLevel('estrelas') && (potencialVenda > 4 || potencialVenda === 4) ? 'gold' : '' }}
                />
                <MdGrade
                  onClick={(event) => updatePotencialVenda(event, 5)}
                  className='card-icon-star'
                  style={{ color: getAccessLevel('estrelas') && (potencialVenda > 5 || potencialVenda === 5) ? 'gold' : '' }}
                />
              </label>
            }

            <label style={{ backgroundColor: 'white' }} className='etapa-producao'>Etapa: {cardData.etapa_producao + 1}</label>



            <div className='card-icons-status-container'>
              <Md360 onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === null || statusCard === '' ? '' : 'none' }} className='card-icon-em-andamento' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Vendido' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbDown onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Perdido' ? '' : 'none' }} className='card-icon-perdido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Entregue' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'InstalacaoExt' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Assistencia' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'AssistenciaExt' ? '' : 'none' }} className='card-icon-vendido' />

            </div>

          </div>
          {
            openCloseModalVendaPerdida &&
            <VendaPerdida cardData={cardData} closeModal={closeVendaPerdidaModal} />
          }
        </div>


      )}
    </Draggable>
  );
}

export default Card;

