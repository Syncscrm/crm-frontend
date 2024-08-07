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

import { MdOutlineFilterList, MdGroups, MdOutlineSearch, MdOutlineUpdate } from "react-icons/md";
import ImportExcel from '../../ImportExcel';
import ImportExcelSuiteFlow from '../../ImportExcelSuiteFlow';
import { RiFileExcel2Line } from "react-icons/ri";

import { BsCalendarDate } from "react-icons/bs";

import logoDefault from '../../../assets/logo-suite-flow.ico'
import Vendas from '../../Vendas';

import ExcelJS from 'exceljs';




function HomePage() {

  const { user, openCloseImportExcelEntidades, openCloseImportExcelSuiteFlow, afilhadosList, editableColumns, getAccessLevel, userAvatar, empresa } = useUser();
  const { columnsUser, setLoadingResult, setLoadingModal, selectedAfilhados, setSelectedAfilhados, dataInicial, setDataInicial, dataFinal, setDataFinal, orderBy, setOrderBy, isAscending, setIsAscending, localSearchTerm, handleLocalSearch, setores, selectedSetores, setSelectedSetores, handleSetorChange } = useColumns();
  const { fetchCards, addHistoricoCardContext, cards, setCards, previewSearchCards, setPreviewSearchCards, searchTerm, setSearchTerm, setCurrentCardData, setOpenCloseUpdateCard, openCloseModalVendaPerdida, setOpenCloseModalVendaPerdida, currentCardData } = useCard();

  const [openCloseSearchModal, setOpenCloseSearchModal] = useState(false);
  const [openCloseSelectAfilhadosModal, setOpenCloseSelectAfilhadosModal] = useState(false);
  const [openCloseSelectDateModal, setOpenCloseSelectDateModal] = useState(false);
  const [openCloseFilterModal, setOpenCloseFilterModal] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);


  const [searchType, setSearchType] = useState('name'); // Estado para armazenar o tipo de pesquisa selecionado


  const fetchCardsByName = async () => {
    setLoadingSearch(true);
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`${apiUrl}/card/search`, {
          params: {
            searchType, // Passa o tipo de pesquisa selecionado
            searchTerm, // Termo de busca
            entityId: user.id,
            empresaId: user.empresa_id,
          }
        });
        setPreviewSearchCards(response.data);
        setLoadingSearch(false);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
        setLoadingSearch(false);
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

    const { cardData, block_column } = JSON.parse(draggableId);
    const currentCardId = cardData.card_id;
    const currentColumnId = parseInt(source.droppableId, 10);
    const newColumnId = parseInt(destination.droppableId, 10);

    // Nova verificação adicionada
    if (!cardData.city || !cardData.state) {
      alert('Não é possível mover o card. Cidade e/ou Estado não preenchidos.');
      return;
    }

    if (!getAccessLevel('coluna')) {
      const confirmDelete = window.alert('Não autorizado pelo Administrador!');
      return
    }

    if (block_column) {
      alert('Você não pode mover este card.');
      return;
    }

    // Verifica se a coluna de destino está na lista de colunas editáveis
    const editableColumnIds = editableColumns.map(column => column.columnId);

    //console.log('colunas inclusas', editableColumns)
    // Verifica se a coluna atual do card está na lista de colunas editáveis
    if (!editableColumnIds.includes(currentColumnId)) {
      alert('Você não tem permissão para mover o card a partir desta coluna.');
      return;
    }

    // Verifica se a coluna de destino está na lista de colunas editáveis
    if (!editableColumnIds.includes(newColumnId)) {
      alert('Você não tem permissão para mover o card para esta coluna.');
      return;
    }

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
    setOpenCloseSearchModal(!openCloseSearchModal)
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
    if (name === "tempDataInicial") {
      setDataInicial(value);
    } else if (name === "tempDataFinal") {
      setDataFinal(value);
    }
  };


  const handleUpdateDates = () => {
    fetchCards(dataInicial, dataFinal)
  };



  const exportarTabelasExcel = async () => {

    const userConfirmed = window.confirm(`Exportar Planilhas?`);
    if (!userConfirmed) {
      return;
    }

    const tables = ['cards', 'users', 'modulo_esquadrias', 'history', 'tasks'];

    for (const table of tables) {
      try {
        const response = await axios.post(`${apiUrl}/users/${table}`, {
          empresa_id: user.empresa_id,
        });
        const data = response.data;

        if (data.length > 0) {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet(table);

          worksheet.columns = Object.keys(data[0]).map((key) => ({
            header: key,
            key: key,
            width: 20,
          }));

          data.forEach((row) => {
            worksheet.addRow(row);
          });

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${table}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
      } catch (error) {
        console.error(`Erro ao exportar tabela ${table}:`, error);
      }
    }
  };



  function reloadPage() {
    window.location.reload();
  }



  const [localSearchInput, setLocalSearchInput] = useState('');

  // Função para atualizar o termo de busca local
  const onLocalSearch = () => {
    handleLocalSearch(localSearchInput);
  };


  const [isLocalSearchVisible, setIsLocalSearchVisible] = useState(true);




  const [afilhadoSearchTerm, setAfilhadoSearchTerm] = useState('');

  const handleAfilhadoSearch = (searchTerm) => {
    setAfilhadoSearchTerm(searchTerm);
  };

  const filteredAfilhadosList = afilhadosList.filter(afilhado =>
    afilhado.username.toLowerCase().includes(afilhadoSearchTerm.toLowerCase())
  );






  const handleSelectAllSetores = () => {
    setSelectedSetores(setores);
  };

  const handleDeselectAllSetores = () => {
    setSelectedSetores([]);
  };



  const selectAllAfilhados = () => {
    setSelectedAfilhados([user.id, ...afilhadosList.map(afilhado => afilhado.id)]);
  };


  useEffect(() => {
    if (user && afilhadosList.length > 0) {
      selectAllAfilhados();
    }
  }, [user, afilhadosList]);









//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//----------------- ENVIAR EMAIL ----------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------

  const handleSendEmail = async () => {


    // Dados do e-mail
    const emailData = {
      to: empresa.email_solicitacao_pedidos, // Alterar para o e-mail do destinatário
      subject: 'Novo Pedido Criado',
      text: 'Um novo pedido foi criado.',
    };

    try {
      const response = await axios.post(`${apiUrl}/users/send-email/${empresa.id}`, emailData);

    } catch (err) {

    } finally {

    }
  };




  return (
    <div className='home-page-container'>



      <Header />
      <Vendas />
      <div className='tools-container'>



        <div>
          <button style={{display: 'none'}} onClick={handleSendEmail} >
            Send Email
          </button>
        </div>


        <MdOutlineSearch onClick={() => clearSearchTerm()} style={{ display: openCloseFilterModal || openCloseSelectAfilhadosModal || openCloseSelectDateModal ? 'none' : '', background: openCloseSearchModal ? 'dodgerblue' : '', cursor: 'pointer' }} className='search-icon-open-close' />


        {openCloseSearchModal &&

          <div

            className='modal-date-filter-container'
          >




            <div className='select-search'>


              <div className='serach-imput-container'>
                <input
                  style={{ backgroundColor: searchTerm.trim() ? '#e0e0e0' : '', color: searchTerm.trim() ? 'rgb(83, 83, 83)' : '' }}
                  className='search-card-input'
                  placeholder="Buscar Cards..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation(); // Previne a propagação do clique
                  }}
                />
                <MdOutlineSearch style={{ cursor: 'pointer' }} className='search-icon' onClick={(e) => {
                  e.stopPropagation(); handleSearchClick()
                }} />

              </div>


              <div className='search-type-container'>
                <label className='label-search-radio'>
                  <input
                    type="radio"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={() => setSearchType('name')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Nome
                </label>

                <label className='label-search-radio'>
                  <input
                    type="radio"
                    value="nome_obra"
                    checked={searchType === 'nome_obra'}
                    onChange={() => setSearchType('nome_obra')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Nome da Obra
                </label>

                <label style={{ display: 'none' }} className='label-search-radio'>
                  <input
                    style={{ display: 'none' }}
                    type="radio"
                    value="state"
                    checked={searchType === 'state'}
                    onChange={() => setSearchType('state')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Estado
                </label>
                <label className='label-search-radio'>
                  <input
                    type="radio"
                    value="document_number"
                    checked={searchType === 'document_number'}
                    onChange={() => setSearchType('document_number')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Número do Documento
                </label>
                <label style={{ display: 'none' }} className='label-search-radio'>
                  <input
                    type="radio"
                    value="origem"
                    checked={searchType === 'origem'}
                    onChange={() => setSearchType('origem')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Origem
                </label>
                <label style={{ display: 'none' }} className='label-search-radio'>
                  <input
                    type="radio"
                    value="produto"
                    checked={searchType === 'produto'}
                    onChange={() => setSearchType('produto')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Produto
                </label>
                <label className='label-search-radio'>
                  <input
                    type="radio"
                    value="pedido_number"
                    checked={searchType === 'pedido_number'}
                    onChange={() => setSearchType('pedido_number')}
                    className='input-radio-container'
                    onClick={(e) => {
                      e.stopPropagation(); // Previne a propagação do clique
                    }}
                  />
                  Número do Pedido
                </label>
              </div>
            </div>
          </div>
        }






        <MdGroups style={{ display: openCloseFilterModal || openCloseSearchModal || openCloseSelectDateModal ? 'none' : '', background: openCloseSelectAfilhadosModal ? 'dodgerblue' : '' }} onClick={() => setOpenCloseSelectAfilhadosModal(!openCloseSelectAfilhadosModal)} className='afilhados-icon-open-close' />














        {openCloseSelectAfilhadosModal && (
          <div className='modal-date-filter-container'>
            <div id="afilhadosSelect" className="select-filter">
              <label className="title-label-afilhados">Afilhados</label>
              <input
                className='input-search-afilhado-filter-afilhados'
                type="text"
                placeholder="Buscar Afilhado..."
                value={afilhadoSearchTerm}
                onChange={(e) => handleAfilhadoSearch(e.target.value)}
              />
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
                  style={{ backgroundColor: selectedAfilhados.includes(user.id) ? '#85DB42' : '' }}
                  onClick={() => handleSelectChange(user.id)}
                >
                  <img
                    className='logo-afilhado-lista'
                    src={user.avatar ? (userAvatar?.includes('syncs-avatar') ? require(`../../../assets/avatares/${userAvatar}`) : user.avatar) : logoDefault}
                  />
                  <label className='label-afilhados-lista'>
                    {user.username}
                    <label className='label-user-type' style={{ background: user.user_type == 'Administrador' ? 'red' : user.user_type == 'Supervisor' ? '#49c5ff' : '' }}>{user.user_type}</label>
                  </label>
                </div>

                {Object.entries(
                  filteredAfilhadosList.reduce((acc, afilhado) => {
                    const state = afilhado.state || 'Sem Estado'; // Adicione um fallback caso não haja estado
                    if (!acc[state]) {
                      acc[state] = [];
                    }
                    acc[state].push(afilhado);
                    return acc;
                  }, {})
                ).map(([state, afilhados]) => (
                  <React.Fragment key={state}>
                    <div className='state-divider'>{state}</div>
                    {afilhados.sort((a, b) => a.username.localeCompare(b.username)).map(afilhado => (
                      <div
                        key={afilhado.id}
                        className={`select-filter-option ${selectedAfilhados.includes(afilhado.id) ? 'selected' : ''}`}
                        style={{ backgroundColor: selectedAfilhados.includes(afilhado.id) ? '#85DB42' : '' }}
                        onClick={() => handleSelectChange(afilhado.id)}
                      >
                        <img
                          className='logo-afilhado-lista'
                          src={afilhado.avatar ? (afilhado.avatar.includes('syncs-avatar') ? require(`../../../assets/avatares/${afilhado.avatar}`) : afilhado.avatar) : logoDefault}
                        />
                        <label className='label-afilhados-lista'>
                          {afilhado.username}

                          <label
                            className='label-user-type'
                            style={{
                              background: afilhado.user_type === 'Administrador' ? 'red' : afilhado.user_type === 'Supervisor' ? '#49c5ff' : ''
                            }}
                          >
                            {afilhado.user_type}
                          </label>
                        </label>

                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}




























        <BsCalendarDate style={{ display: openCloseSearchModal || openCloseFilterModal || openCloseSelectAfilhadosModal ? 'none' : '', background: openCloseSelectDateModal ? 'dodgerblue' : '' }} onClick={() => setOpenCloseSelectDateModal(!openCloseSelectDateModal)} className='afilhados-icon-open-close' />
        {openCloseSelectDateModal && (
          <div className='modal-date-filter-container'>
            <div className='date-filter-container'>
              <div className='date-filter-row'>
                <div className='date-filter-column'>
                  <label htmlFor="tempDataInicial" className='date-filter-label'>Data Inicial</label>
                  <input
                    className='date-filter-date'
                    type="date"
                    name="tempDataInicial"
                    value={dataInicial}
                    onChange={handleTempDateChange}
                  />
                </div>

                <div className='date-filter-column'>
                  <label htmlFor="tempDataFinal" className='date-filter-label'>Data Final</label>
                  <input
                    className='date-filter-date'
                    type="date"
                    name="tempDataFinal"
                    value={dataFinal}
                    onChange={handleTempDateChange}
                  />
                </div>
              </div>
              <button className='btn-update-date-filter' onClick={handleUpdateDates}>Atualizar Datas</button>
            </div>
          </div>
        )}




        <MdOutlineFilterList style={{ display: openCloseSelectAfilhadosModal || openCloseSelectDateModal || openCloseSearchModal ? 'none' : '', background: openCloseFilterModal ? 'dodgerblue' : '' }} onClick={() => setOpenCloseFilterModal(!openCloseFilterModal)} className='afilhados-icon-open-close' />
        {openCloseFilterModal && (

          <div className='modal-date-filter-container'>
            <div className='filter-filter-container'>

              <div className='date-filter-row'>

                <div className='date-filter-column'>

                  <label htmlFor="tempDataInicial" className='date-filter-label'>Ordenar</label>

                  <div className='order-by-order'>
                    <button style={{ backgroundColor: isAscending ? 'dodgerblue' : '' }} className='btn-filter-tools-order' onClick={() => setIsAscending(!isAscending)}>
                      Crescente
                    </button>

                    <button style={{ backgroundColor: !isAscending ? 'dodgerblue' : '' }} className='btn-filter-tools-order' onClick={() => setIsAscending(!isAscending)}>
                      Decrescente
                    </button>
                  </div>



                  <button style={{ backgroundColor: orderBy === 'nome' ? 'dodgerblue' : '' }} className='btn-filter-tools' onClick={() => setOrderBy('nome')}>Nome</button>
                  <button style={{ backgroundColor: orderBy === 'dataStatus' ? 'dodgerblue' : '' }} className='btn-filter-tools' onClick={() => setOrderBy('dataStatus')}>Data de status</button>
                  <button style={{ backgroundColor: orderBy === 'dataCreate' ? 'dodgerblue' : '' }} className='btn-filter-tools' onClick={() => setOrderBy('dataCreate')}>Data de criação</button>
                  <button style={{ backgroundColor: orderBy === 'dataUpdate' ? 'dodgerblue' : '' }} className='btn-filter-tools' onClick={() => setOrderBy('dataUpdate')}>Data de atualização</button>
                  <button style={{ backgroundColor: orderBy === 'value' ? 'dodgerblue' : '' }} className='btn-filter-tools' onClick={() => setOrderBy('value')}>Valor</button>


                </div>

              </div>

              <label htmlFor="tempDataInicial" className='date-filter-label'>Setores</label>


              <div className='filter-select-columns'>

                <button
                  className='btns-filter-select-columns'
                  onClick={handleSelectAllSetores}

                >
                  Selecionar Todos
                </button>
                <button
                  className='btns-filter-select-columns'
                  onClick={handleDeselectAllSetores}

                >
                  Deselecionar Todos
                </button>


                {setores.map((setor, index) => (
                  <button
                    className='btns-filter-select-columns'

                    key={index}
                    style={{
                      backgroundColor: selectedSetores.includes(setor) ? 'dodgerblue' : '#f0f0f0',
                      color: selectedSetores.includes(setor) ? 'white' : '#333',
                      transition: 'background-color 0.3s, color 0.3s',
                    }}
                    onClick={() => handleSetorChange(setor)}
                  >
                    {setor}
                  </button>
                ))}
              </div>

            </div>



          </div>
        )}



        {user && getAccessLevel('exportExcel') &&
          <RiFileExcel2Line style={{ display: openCloseFilterModal || openCloseSelectAfilhadosModal || openCloseSelectDateModal || openCloseSearchModal ? 'none' : '' }} onClick={() => exportarTabelasExcel()} className='afilhados-icon-open-close' />
        }


        <MdOutlineUpdate style={{ display: openCloseFilterModal || openCloseSelectAfilhadosModal || openCloseSelectDateModal || openCloseSearchModal ? 'none' : '' }} onClick={() => reloadPage()} className='afilhados-icon-open-close' />


        {isLocalSearchVisible && (
          <div className='buscar-localmente-container'>
            <input
              className='search-card-input-local'
              style={{ marginLeft: '4px' }}
              type="text"
              value={localSearchInput}
              onChange={(e) => {
                setLocalSearchInput(e.target.value);
                handleLocalSearch(e.target.value);
              }}
              placeholder="Busca Local..."
            />
            <MdOutlineSearch className='search-icon' />
          </div>
        )}





      </div>





      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='home-container'>
          {columnsUser ? (
            columnsUser
              .filter(column => selectedSetores.includes(column.setor))
              .map(column => (
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
