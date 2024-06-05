import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext';

import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

import './style.css';
import Column from '../../Column';
import Card from '../../Card';

import { DragDropContext } from 'react-beautiful-dnd';
import PreviewCard from '../../PreviewCard';
import Select from '../../Select';

import { MdGroups, MdOutlineSearch } from "react-icons/md";
import ImportExcel from '../../ImportExcel';
import ImportExcelSuiteFlow from '../../ImportExcelSuiteFlow';

import { BsCalendarDate } from "react-icons/bs";

import logoDefault from '../../../assets/logo-suite-flow.ico'
import Vendas from '../../Vendas';

function HomePage() {

  const { user, openCloseImportExcelEntidades, openCloseImportExcelSuiteFlow, afilhadosList } = useUser();
  const { columnsUser, setLoadingResult, setLoadingModal, selectedAfilhados, setSelectedAfilhados, dataInicial, setDataInicial, dataFinal, setDataFinal } = useColumns();
  const { addHistoricoCardContext, cards, setCards, previewSearchCards, setPreviewSearchCards, searchTerm, setSearchTerm, setCurrentCardData, setOpenCloseUpdateCard, openCloseModalVendaPerdida, setOpenCloseModalVendaPerdida, currentCardData } = useCard();

  const [openCloseSearchModal, setOpenCloseSearchModal] = useState(false);
  const [openCloseSelectAfilhadosModal, setOpenCloseSelectAfilhadosModal] = useState(false);
  const [openCloseSelectDateModal, setOpenCloseSelectDateModal] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Estados temporários para dataInicial e dataFinal
  const [tempDataInicial, setTempDataInicial] = useState('');
  const [tempDataFinal, setTempDataFinal] = useState('');


  const fetchCardsByName = async () => {
    setLoadingSearch(true);
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`${apiUrl}/card/search?name=${encodeURIComponent(searchTerm)}&entityId=${user.id}&empresaId=${user.empresa_id}`);
        setPreviewSearchCards(response.data);
        setLoadingSearch(false);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    } else {
      setPreviewSearchCards([]);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.length < 3) return;
    setPreviewSearchCards([]);
    fetchCardsByName();
  };

  function getCardData(card) {
    setCurrentCardData(card);
    setOpenCloseUpdateCard(true);
    setSearchTerm('');
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

    const startCards = [...cards];

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return; // Não faz nada se não há destino ou se o card foi largado na mesma posição
    }

    const currentCardId = parseInt(draggableId, 10);
    const newColumnId = parseInt(destination.droppableId, 10);

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }


    try {
      setLoadingModal(true);
      setLoadingResult('Alterando Coluna...');
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

      // Atualização otimista: Atualiza o estado imediatamente
      const newCards = cards.map(card => {
        if (card.card_id === currentCardId) {
          return { ...card, column_id: newColumnId }; // Assume que a propriedade que define a coluna é `column_id`
        }
        return card;
      });
      setCards(newCards);

      setLoadingModal(false);
      setLoadingResult('');
    } catch (error) {
      setLoadingResult('Erro ao alterar Card de Coluna!');
      console.error('Failed to update card column:', error);
      // Reverte a mudança otimista em caso de erro
      setCards(startCards);
      alert('Failed to move card, please try again.');
    }
  };

  useEffect(() => {
    //setPreviewSearchCards([])
  }, [searchTerm]);

  function clearSearchTerm() {
    setSearchTerm('');
    setPreviewSearchCards([]);
  }

  const handleSelectChange = (id) => {
    setSelectedAfilhados(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(afilhadoId => afilhadoId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAfilhados.length === afilhadosList.length + 1) {
      setSelectedAfilhados([]);
    } else {
      setSelectedAfilhados([user.id, ...afilhadosList.map(afilhado => afilhado.id)]);
    }
  };

  useEffect(() => {
    if (user && !selectedAfilhados.includes(user.id)) {
      setSelectedAfilhados([user.id]);
    }
  }, [user]);

  const handleTempDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tempDataInicial') {
      setTempDataInicial(value);
    } else {
      setTempDataFinal(value);
    }
  };

  const handleUpdateDates = () => {
    setDataInicial(tempDataInicial);
    setDataFinal(tempDataFinal);
  };

  useEffect(() => {
    const today = new Date();
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // Final do dia de hoje
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    setTempDataInicial(lastYear.toISOString().split('T')[0]);
    setTempDataFinal(endOfToday.toISOString().split('T')[0]);
    setDataInicial(lastYear.toISOString().split('T')[0]);
    setDataFinal(endOfToday.toISOString().split('T')[0]);
  }, []);






  return (
    <div className='home-page-container'>
      <Header />
      <Vendas />
      <div className='tools-container'>
        <MdOutlineSearch onClick={() => setOpenCloseSearchModal(true)} style={{ display: !openCloseSearchModal ? '' : 'none', cursor: 'pointer' }} className='search-icon-open-close' />

        <div style={{ display: openCloseSearchModal ? '' : 'none' }} className='search-card-container'>
          <input
            style={{ backgroundColor: searchTerm.trim() ? '#e0e0e0' : '', color: searchTerm.trim() ? 'rgb(83, 83, 83)' : '' }}
            className='search-card-input'
            placeholder="Buscar Cards..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <MdOutlineSearch style={{ cursor: 'pointer' }} className='search-icon' onClick={handleSearchClick} />
          <button
            style={{ display: openCloseSearchModal ? '' : 'none' }}
            className='btn-clear-search'
            onClick={() => {
              clearSearchTerm();
              setOpenCloseSearchModal(false);
            }}
          >
            X
          </button>
        </div>

        <MdGroups style={{ background: openCloseSelectAfilhadosModal ? 'dodgerblue' : '' }} onClick={() => setOpenCloseSelectAfilhadosModal(!openCloseSelectAfilhadosModal)} className='afilhados-icon-open-close' />

        {openCloseSelectAfilhadosModal && (
          <div id="afilhadosSelect" className="select-filter">
            <label className="title-label-afilhados">Afilhados</label>
            <div className="list-afilhados-container">
              <div
                key="select-all"
                className={`select-filter-option ${selectedAfilhados.length === afilhadosList.length + 1 ? 'selected' : ''}`}
                style={{ backgroundColor: selectedAfilhados.length === afilhadosList.length + 1 ? 'dodgerblue' : '' }}
                onClick={handleSelectAll}
              >
                {selectedAfilhados.length === afilhadosList.length + 1 ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </div>
              <div
                key={user.id}
                className={`select-filter-option ${selectedAfilhados.includes(user.id) ? 'selected' : ''}`}
                style={{ backgroundColor: selectedAfilhados.includes(user.id) ? 'dodgerblue' : '' }}
                onClick={() => handleSelectChange(user.id)}
              >
                <img className='logo-afilhado-lista' src={user.avatar ? user.avatar : logoDefault} />
                <label className='label-afilhados-lista'>{user.username}</label>
              </div>
              {afilhadosList
                .sort((a, b) => a.username.localeCompare(b.username))
                .map(afilhado => (
                  <div
                    key={afilhado.id}
                    className={`select-filter-option ${selectedAfilhados.includes(afilhado.id) ? 'selected' : ''}`}
                    style={{ backgroundColor: selectedAfilhados.includes(afilhado.id) ? 'dodgerblue' : '' }}
                    onClick={() => handleSelectChange(afilhado.id)}
                  >
                    <img className='logo-afilhado-lista' src={afilhado.avatar ? afilhado.avatar : logoDefault} />
                    <label className='label-afilhados-lista'>{afilhado.username}</label>
                  </div>
                ))}

            </div>
          </div>
        )}

        <BsCalendarDate style={{ background: openCloseSelectDateModal ? 'dodgerblue' : '' }} onClick={() => setOpenCloseSelectDateModal(!openCloseSelectDateModal)} className='afilhados-icon-open-close' />
        {openCloseSelectDateModal && (
          <div className='date-filter-container'>
            <div className='date-filter-row'>
              <div className='date-filter-column'>
                <label htmlFor="tempDataInicial" className='date-filter-label'>Data Inicial</label>
                <input
                  className='date-filter-date'
                  type="date"
                  name="tempDataInicial"
                  value={tempDataInicial}
                  onChange={handleTempDateChange}
                />
              </div>

              <div className='date-filter-column'>
                <label htmlFor="tempDataFinal" className='date-filter-label'>Data Final</label>
                <input
                  className='date-filter-date'
                  type="date"
                  name="tempDataFinal"
                  value={tempDataFinal}
                  onChange={handleTempDateChange}
                />
              </div>
            </div>
            <button className='btn-update-date-filter' onClick={handleUpdateDates}>Atualizar Datas</button>
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='home-container'>
          {columnsUser ? (
            columnsUser.map(column => (
              <Column key={column.id} columnData={column} />
            ))
          ) : (
            <>sem colunas</>
          )}
        </div>
      </DragDropContext>

      {(previewSearchCards.length > 0 || loadingSearch) && (
        <div className='search-result-container'>
          {loadingSearch && (
            <div className='loading-container-search'>
              Loading...
            </div>
          )}

          {previewSearchCards.map((item) => (
            <div className='item-search-result-card' key={item.card_id} onClick={() => getCardData(item)}>
              <PreviewCard key={item.card_id} cardData={item} />
            </div>
          ))}
        </div>
      )}

      {openCloseImportExcelEntidades && <ImportExcel />}
      {openCloseImportExcelSuiteFlow && <ImportExcelSuiteFlow />}


    </div>
  );
}

export default HomePage;
