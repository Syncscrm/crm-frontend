import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/userContext'
import { useCard } from '../../contexts/cardContext'
import { useColumns } from '../../contexts/columnsContext';
import { format, parseISO } from 'date-fns';

// ICONS
import { GrTask } from "react-icons/gr";
import { MdEmail, MdFolder, MdDeleteForever, MdCreditCard, MdLibraryAdd, MdAutoAwesomeMotion, MdOutlineSendToMobile, MdLockOpen, MdLockOutline, MdBookmark, MdAssignment, MdAssignmentTurnedIn, MdAdsClick, MdAddShoppingCart, MdAttachFile, MdViewColumn, MdWhatsapp, MdEdit, MdOutlineHistory, MdAnalytics, MdCreate, MdOutlineUpdate, Md360, MdWindow, MdRoom, MdShoppingCart, MdThumbDown, MdThumbUp, MdShare, MdHome, MdAccountBox, MdAlternateEmail, MdGrade, MdAccountBalance, MdArticle } from "react-icons/md";


import './style.css';

// API
import axios from 'axios';
import { apiUrl, fileApiUrl } from '../../config/apiConfig';

import { differenceInCalendarDays } from 'date-fns';

import { Draggable } from 'react-beautiful-dnd';
import VendaPerdida from '../VendaPerdida';

import EmailConversation from '../forms/EmailConversation';

import PedidoPedido from '../ModuloPedido';


function PreviewCard({ cardData, index }) {

  const { user, afilhadosList, listAllUsers, editableColumns, getAccessLevel, empresa, openCloseCustomModule, setOpenCloseCustomModule } = useUser();
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
    listaEtiquetas,
    currentModuleCard, setCurrentModuleCard,
    openClosePedidosModal, setOpenClosePedidosModal
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
    if (!user.is_premium) {
      alert("Você não é Premium");
      return; // Adicione este return para evitar a abertura do modal
    }
    setCurrentCardData(cardData);
    setOpenCloseAnexosModal(true);
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


  const openClosePedidos = (e) => {
    e.stopPropagation();
    setCurrentCardData(cardData)
    setOpenClosePedidosModal(true)
  };


  const viewCard = (e) => {
    e.stopPropagation();
    if(!showCard){
      fetchCardDetails(cardData.card_id);
      fetchModules(); 
    }

    setShowCard(!showCard);
  };



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
      return;
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
      // Atualiza os cards
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
    event.stopPropagation();
    if (!getAccessLevel('status')) {
      const confirmDelete = window.alert('Não autorizado pelo Administrador!');
      return
    }

    setStatusCard(cardData.status)

    setOpenCloseEditStatusModal(true)
  }



  const updateCardStatus = async (id, status, event) => {
    event.stopPropagation();
  
    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }
  
    const vendidosColumn = columns.find(column => column.name === empresa.coluna_vendido);
    let columnId = vendidosColumn && status != null ? vendidosColumn.id : cardData.column_id;
  
    try {
      setModalLoading(true);
      const response = await axios.post(`${apiUrl}/card/update-status`, { id, status, columnId });
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
  const [mensagemLoading, setMensagemLoading] = useState('Atualizando...')


  const updateCardColumn = async (newColumnId) => {
    const currentCardId = cardData.card_id;
  
    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }
  
    if (!cardData.city || !cardData.state) {
      alert('Não é possível mover o card. Cidade e/ou Estado não preenchidos.');
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
      addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(newColumnId)}`, currentCardId, user.id);
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




  useEffect(() => {
    setBlockColumnCard(cardData.block_column);
  }, [cardData.block_column]);






  // ---------------- Enviar whatsapp CHATBOT--------------------

  function enviarMensagemPotencialCliente() {

    const userConfirmed = window.confirm(`Emviar mensagem para Parceiro?`);
    if (!userConfirmed) {
      return;
    }


    enviarMensagemParaBotConversa(
      user.empresa_id,
      buscarFoneReferencia(cardData.entity_id),
      '',
      `${getUsernameById(cardData.entity_id)}\n \nCard com Link Patrocinado criado com sucesso no CRM! \n \nCliente: ${cardData.name} \nNúmero do orçamento: ${cardData.document_number} \nValor: ${cardData.sale_value ? parseFloat(cardData.sale_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'}\n\n Verifique as informações fornecidas!\n\nBazze PVC`
    );
  }


  const enviarMensagemParaBotConversa = async (empresaId, numero, contato, mensagem) => {
    try {
      await axios.post(`${apiUrl}/card/enviarMensagemParaBotConversa`, null, {
        params: {
          empresaId,
          numero,
          contato,
          mensagem,
        },
      });

      const userConfirmed = window.confirm('Mensagem enviada!');

      console.log('Mensagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar mensagem para o BotConversa:', error.message);
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
      return '#72D419'; //#72D419#00C7E2
    } else if (days > 3 && days <= 6) {
      return '#F7B304';
    } else if (days > 6) {
      return '#F51148';
    } else {
      return 'rgb(255, 20, 98)';
    }
  }



  const fetchCardDetails = async (cardId) => {
    try {
      setModalLoading(true)
      const response = await axios.get(`${apiUrl}/card/find-by-id/${cardId}`);
      const updatedCard = response.data;
      setCards(prevCards =>
        prevCards.map(card =>
          card.card_id === updatedCard.card_id ? { ...card, ...updatedCard } : card
        )
      );
      setModalLoading(false)
    } catch (error) {
      console.error('Erro ao buscar detalhes do card:', error);
    }
  };
  

  const [showEmails, setShowEmails] = useState(false);

  const handleEmailButtonClick = () => {
    setShowEmails(!showEmails);
  };



  const [showPedidos, setShowPedidos] = useState(false);

  const handlePedidosButtonClick = (openClose) => {
    setShowPedidos(openClose)
  };


  const handleCustomModuleButtonClick = (event, Module) => {
    setCurrentModuleCard(Module);
    event.stopPropagation();
    setCurrentCardData(cardData)

    setOpenCloseCustomModule(true);
  };







  const [modules, setModules] = useState([]);


  const fetchModules = async () => {
    try {
      const response = await axios.get(`${apiUrl}/custom-modules/list-modules`, {
        params: { empresa_id: user.empresa_id }
      });
      setModules(response.data);
    } catch (error) {
      console.error('Erro ao listar módulos:', error);
      setModules([]);
    }
  };

  const createNewModule = async () => {
    const moduleData = {
      name: newModuleName,
      empresa_id: user.empresa_id,
      // outros dados do módulo
    };

    try {
      await axios.post(`${apiUrl}/custom-modules/create-module`, moduleData);
      fetchModules();
      setShowNewModuleContainer(false);
      setNewModuleName('');
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
    }
  };




  const [showNewModuleContainer, setShowNewModuleContainer] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');




  return (

        <div
          className='card-container'

          onClick={(e) => { viewCard(e) ; e.stopPropagation()}}
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

                  <div style={{ display: user.access_level != '5' ? 'none' : '' }} onClick={(event) => updateCardStatus(cardData.card_id, null, event)} className='icon-edit-status-card-container' >
                    <Md360 style={{ color: statusCard === null || statusCard === '' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatus(cardData.card_id, 'Vendido', event)} className='icon-edit-status-card-container' >
                    <MdThumbUp style={{ color: statusCard === 'Vendido' ? '' : '#9c9c9c' }} className='icon-status-card-vendido' />
                  </div>
                  <div onClick={(event) => updateCardStatusPerdido(cardData.card_id, 'Perdido', event)} className='icon-edit-status-card-container' >
                    <MdThumbDown style={{ color: statusCard === 'Perdido' ? '' : '#9c9c9c' }} className='icon-status-card-perdido' />
                  </div>

                  <button onClick={(e) => {
                    setOpenCloseEditStatusModal(false);
                    e.stopPropagation();
                  }} className='btn-close-select-status'>x</button>

                </div>
              </div>
            )
          }
          <div className='card-header'>
            <label className='card-title'>{cardData.name.toUpperCase().substring(0, 26)}</label>
            <MdShare className='icons-shared-card' onClick={(event) => shareCard(cardData.card_id, event)} />

          </div>
          <div className='card-body'>

            {
              showCard && (
                <>
                  <label className='card-body-item'>
                    <MdBookmark className='card-icon-item' />
                    Etiqueta:
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
                      disabled={!getAccessLevel('etiqueta')}
                    >
                      <option value={0}>Sem Etiqueta</option>
                      {sortedEtiquetas.map(etiqueta => (
                        <option
                          style={{ /*backgroundColor: getEtiquetaColorById(etiqueta.id)*/ }}
                          key={etiqueta.id}
                          value={etiqueta.id}
                        >
                          <label className='item-select-etiqueta-card'>{etiqueta.description}</label>
                        </option>
                      ))}
                    </select>
                  </label>








                  <label className='card-body-item-column'>
                    <MdViewColumn className='card-icon-item' />
                    Coluna:
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

                    {blockColumnCard ? (
                      <MdLockOutline
                        style={{ backgroundColor: 'red' }}
                        className='lock-column'
                        onClick={(e) => {
                          updateBlockColumnCard(false);
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <MdLockOpen
                        className='lock-column'
                        onClick={(e) => {
                          updateBlockColumnCard(true);
                          e.stopPropagation();
                        }}
                      />
                    )}

                  </label>











                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdArticle className='card-icon-item' />

                      <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.document_number ? cardData.document_number.substring(0, 35) : 'Não informado'}</label>
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
                    <MdAssignment className='card-icon-item' />Orçamento: {cardData.second_document_number ? cardData.second_document_number.substring(0, 35) : 'Não Informado'}
                  </label>
                  <label className='card-body-item'>
                    <MdAssignmentTurnedIn className='card-icon-item' />

                    <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.pedido_number ? cardData.pedido_number.substring(0, 35) : 'Não Informado'}</label>
                  </label>

                  <label className='card-body-item'>
                    <MdHome className='card-icon-item' />

                    <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.nome_obra && cardData.nome_obra != '' ? cardData.nome_obra.substring(0, 35) : 'Não informado'}</label>
                  </label>



                  {getAccessLevel('contato') &&
                    <label className='card-body-item-fone'>
                      <div className='card-body-item-fone-number'>
                        <MdWhatsapp className='icons-whatsapp' onClick={() => abrirWhatsApp(cardData.fone)} />

                        <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.fone ? cardData.fone : 'Não informado'}</label>
                      </div>
                    </label>
                  }

                  {getAccessLevel('contato') &&
                    <label className='card-body-item'>
                      <MdAlternateEmail className='card-icon-item' />

                      <label style={{ marginLeft: '0px', fontWeight: '500' }} >{getAccessLevel('contato') && cardData.email ? cardData.email.substring(0, 35) : "Não informado"}</label>
                    </label>
                  }



                  <label className='card-body-item'>
                    <MdRoom className='card-icon-item' />

                    <label style={{ marginLeft: '0px', fontWeight: '500' }} >{(cardData.city ? cardData.city : 'Cidade') + '/' + (cardData.state ? cardData.state : 'UF')} </label>
                  </label>


                  <label className='card-body-item'>
                    <MdAccountBalance className='card-icon-item' />

                    <label className='card-valor-item'>{getAccessLevel('valor') && cardData.cost_value ? parseFloat(cardData.cost_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</label>
                  </label>
                  <label className='card-body-item'>
                    <MdShoppingCart className='card-icon-item' />

                    <label className='card-valor-item'>{getAccessLevel('valor') && cardData.sale_value ? parseFloat(cardData.sale_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</label>
                  </label>


                  <label className='card-body-item'>
                    <MdAccountBox className='card-icon-item' />

                    <label style={{ marginLeft: '0px', fontWeight: '500' }} >{getUsernameById(cardData.entity_id).substring(0, 28)}</label>
                  </label>


                  <label style={{ display: 'none' }} className='card-body-item'>
                    <MdCreate className='card-icon-item' />{formatDate(cardData.created_at)}
                  </label>
                  <label style={{ display: 'none' }} className='card-body-item'>
                    <MdOutlineUpdate className='card-icon-item' />{formatDate(cardData.updated_at)}
                  </label>
                  <label style={{ display: 'none' }} className='card-body-item'>
                    <MdAnalytics className='card-icon-item' />{cardData.status_date ? formatDate(cardData.status_date) : ''}
                  </label>







                  <label className='card-body-item'>
                    <MdAddShoppingCart className='card-icon-item' />

                    <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.produto ? cardData.produto : 'Não informado'}</label>
                  </label>




                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdAdsClick className='card-icon-item' />

                      <label style={{ marginLeft: '0px', fontWeight: '500' }} >{cardData.origem ? cardData.origem : 'Não informado'}</label>
                    </label>

                    <MdOutlineSendToMobile
                      className='lock-column' style={{ display: user.access_level === 5 ? '' : 'none' }}

                      onClick={(e) => {
                        enviarMensagemPotencialCliente();
                        e.stopPropagation();
                      }}
                    />

                  </label>



                  <label className='row-column-container'>

                    <label className='card-body-item-chat-bot'>
                      <MdAutoAwesomeMotion className='card-icon-item' />
                      Etapa de Produção:
                      <label style={{ marginLeft: '5px', fontWeight: '700' }} >{cardData.etapa_producao === 0 ? 1 : cardData.etapa_producao + 1}</label>
                    </label>
                    <MdLibraryAdd
                      className='lock-column'

                      onClick={(e) => {
                        criarEtapaDeProducao();
                        e.stopPropagation();
                      }}
                    />

                  </label>







                  <label style={{ display: 'none' }} className='row-column-container'>

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






                  <div className='modulos-card-container'>


                    <div className='modulos-card-column-container'>

                    </div>
                    <label className='label-modulos-title'>
                      Módulos
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





                    </div>





                    <label style={{ display: '' }} className='label-modulos-title'>
                      Módulos Extas
                    </label>
                    <div style={{ display: '' }} className='btns-card-container'>

                      {getAccessLevel('producao') &&
                        <button onClick={openModuloEsquadriasModal} className='btn-update-card'>
                          <MdWindow className='icons-btns-update-card' />
                        </button>
                      }

                      {getAccessLevel('anexos')  &&
                        <button onClick={openAnexosModal} className='btn-update-card'>
                          <MdAttachFile className='icons-btns-update-card' />
                        </button>
                      }

                      {false &&
                        <button onClick={(e) => { handleEmailButtonClick(); e.stopPropagation(); }} className='btn-update-card'>
                          <MdEmail className='icons-btns-update-card' />
                          {showEmails && <EmailConversation clientEmail={cardData.email} />}
                        </button>

                      }

                      {true && (
                        <button onClick={(e) =>  openClosePedidos(e)} className='btn-update-card'>
                          <MdAssignment className='icons-btns-update-card' />
                          
                        </button>
                      )}

                      {false && (
                        <button onClick={(e) => { handleCustomModuleButtonClick(e); e.stopPropagation(); }} className='btn-update-card'>
                          <MdEdit className='icons-btns-update-card' />
                        </button>
                      )}







                      {Array.isArray(modules) && modules.map((module, index) => (

                        <button style={{display: 'none'}} key={index} onClick={(e) => { handleCustomModuleButtonClick(e, module); e.stopPropagation(); }} className='btn-update-card'>
                          <MdEdit className='icons-btns-update-card' />
                        </button>
                      ))}



                      {showNewModuleContainer ? (
                        <div className='create-new-module-container'>
                          <input
                            type="text"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                            placeholder="Nome do Módulo"
                            onClick={(e) => { e.stopPropagation(); }}
                            className='create-new-module-input'
                          />

                          <div className='create-new-module-btns-container'>

                            <button className='btn-create-new-module-cancel' onClick={(e) => { e.stopPropagation(); setShowNewModuleContainer(false) }}>Cancelar</button>
                            <button className='btn-create-new-module-create' onClick={(e) => { e.stopPropagation(); createNewModule() }}>Criar Módulo</button>


                          </div>

                        </div>
                      ) : (
                        <div style={{ display: 'none' }} className='btn-create-new-module-container'>
                          <button className='btn-create-new-module' onClick={(e) => { e.stopPropagation(); setShowNewModuleContainer(true) }}>+</button>
                        </div>
                      )}




                    </div>


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
                      {(cardData.city ? cardData.city : 'Cidade') + '/' + (cardData.state ? cardData.state : 'Estado')}
                    </label>

                    <label style={{ display: 'none' }} className='card-id-item-separate'>ID: {cardData.card_id}</label>


                  </label>
                </>
              )
            }

          </div>
          <div className='card-footer'>

            <div className='card-icons-status-container'>
              <button style={{ display: statusCard === null || statusCard === '' ? '' : 'none' }} onClick={(event) => openCloseEditEstatusCard(event)} className='btn-open-status-container'>
                <MdThumbUp />
                <MdThumbDown />

              </button>
              {/* <Md360 onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === null || statusCard === '' ? '' : 'none' }} className='card-icon-em-andamento' /> */}
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Vendido' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbDown onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Perdido' ? '' : 'none' }} className='card-icon-perdido' />
              <MdFolder onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Arquivado' ? '' : 'none', color: '#82839E' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'InstalacaoExt' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'Assistencia' ? '' : 'none' }} className='card-icon-vendido' />
              <MdThumbUp onClick={(event) => openCloseEditEstatusCard(event)} style={{ display: statusCard === 'AssistenciaExt' ? '' : 'none' }} className='card-icon-vendido' />
              <label style={{ backgroundColor: cardData.etapa_producao + 1 > 1 ? '' : 'transparent' }} className='etapa-producao'>Parte: {cardData.etapa_producao + 1}</label>

            </div>

            {/* <label style={{ backgroundColor: getBackgroundColor(getDaysSinceUpdate(cardData.updated_at)) }} className='card-n-dias'>{getDaysSinceUpdate(cardData.updated_at)}</label> */}

            {/* <label className='card-n-dias'>{getDaysSinceUpdate(cardData.updated_at)}</label> */}



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


            <label style={{ display: '', backgroundColor: getBackgroundColor(getDaysSinceUpdate(cardData.updated_at)) }} className='card-n-dias'>{getDaysSinceUpdate(cardData.updated_at)}</label>
            <label style={{ display: 'none', backgroundColor: getBackgroundColor(getDaysSinceUpdate(cardData.updated_at)) }} className='card-n-dias-expanded'>{`${getDaysSinceUpdate(cardData.updated_at)} dias sem atualização `}</label>



          </div>
          {
            openCloseModalVendaPerdida &&
            <VendaPerdida cardData={cardData} closeModal={closeVendaPerdidaModal} />
          }
        </div>


      

  );
}

export default PreviewCard;

