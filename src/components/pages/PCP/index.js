import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

// STYLE
import './style.css';
import { format, parseISO } from 'date-fns';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';

import { MdRemoveShoppingCart, MdShoppingCart, MdDoneOutline } from "react-icons/md";

import moment from 'moment';
import Header from '../../Header';
import PreviewCard from '../../PreviewCard';

function PCP() {
  const { user } = useUser();
  const { columns, setLoadingResult, setLoadingModal } = useColumns();

  const [allCards, setAllCards] = useState([]);
  const [renderedCards, setRenderedCards] = useState([]);
  const [itemsToRender, setItemsToRender] = useState(15);
  const containerRef = useRef(null);

  const getColumnName = (id) => {
    const processo = columns.find(processo => processo.id === id);
    return processo ? processo.name : '';
  };

  const getDateColumnFor = (item, controle) => {
    switch (controle) {
      case 'medicao': return item.previsao_medicao;
      case 'producao': return item.previsao_producao;
      case 'vidros': return item.previsao_entrega_vidro;
      case 'vistoriaPre': return item.previsao_vistoria_pre;
      case 'entrega': return item.previsao_entrega_obra;
      case 'instalacao': return item.previsao_instalacao;
      case 'vistoriaPos': return item.previsao_vistoria_pos;
      case 'assistencia': return item.previsao_assistencia;
      default: return null;
    }
  };

  const getStatusFor = (item, controle) => {
    switch (controle) {
      case 'producao': return item.status_producao;
      case 'medicao': return item.status_medicao;
      case 'vidros': return item.status_entrega_vidro;
      case 'vistoriaPre': return item.status_vistoria_pre;
      case 'entrega': return item.status_entrega_obra;
      case 'instalacao': return item.status_instalacao;
      case 'vistoriaPos': return item.status_vistoria_pos;
      case 'assistencia': return item.status_assistencia;
      default: return null;
    }
  };

  const getColorProduct = (color) => {
    let cor = '';
    if (color === 'Branco' || color === 'BRANCO') cor = 'white';
    if (color === 'AMADEIRADO GOLDEN OAK') cor = '#916B4C';
    if (color === 'NOGUEIRA') cor = 'rgb(138, 94, 1)';
    if (color === 'PRETO LISO' || color === 'PRETO TEXTURADO') cor = 'rgb(0, 0, 0)';
    if (color === 'BRONZE') cor = '#C2B5A5';
    if (color === 'GRAFITE') cor = '#727378';
    if (color === 'PIRITA') cor = '#C7BAA2';
    if (color.includes('INTERNO BRANCO E EXTERNO')) {
      if (color.includes('AMADEIRADO GOLDEN OAK')) cor = '#916B4C';
      if (color.includes('AMADEIRADO NOGUEIRA')) cor = 'rgb(138, 94, 1)';
      if (color.includes('PRETO LISO') || color.includes('PRETO TEXTURADO')) cor = 'black';
      if (color.includes('BRONZE')) cor = '#C2B5A5';
      if (color.includes('GRAFITE')) cor = '#727378';
      if (color.includes('PIRITA')) cor = '#C7BAA2';
    }
    if (color === 'ESPECIAL') cor = 'red';
    return cor;
  };

  const calculateDaysUntilDelivery = (deliveryDateStr) => {
    if (!deliveryDateStr) return "Data não fornecida";
    const deliveryDate = new Date(deliveryDateStr);
    if (isNaN(deliveryDate)) return "Data inválida";
    const today = new Date();
    const timeDifference = deliveryDate - today;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  const loadMoreItems = () => {
    const nextItemsToRender = itemsToRender + 20;
    const newRenderedCards = allCards.slice(0, nextItemsToRender);
    setRenderedCards(newRenderedCards);
    setItemsToRender(nextItemsToRender);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
      loadMoreItems();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [itemsToRender]);

  useEffect(() => {
    if (user) {
      const fetchPCP = async () => {
        try {
          setLoadingModal(true);
          setLoadingResult('Carregando...');
          const response = await axios.get(`${apiUrl}/card/pcp/${user.id}/${user.empresa_id}`);
          setAllCards(response.data);
          setRenderedCards(response.data.slice(0, itemsToRender));
          setLoadingResult('');
          setLoadingModal(false);
          //console.log("Fetched cards:", response.data); // Debug line
        } catch (error) {
          console.error('Error fetching history:', error);
          setLoadingResult('Falha ao Carregar!!!');
        }
      };
      fetchPCP();
    }
  }, [user, columns]);

  const [statusFilters, setStatusFilters] = useState({
    producao: 'EmAndamento',
    medicao: 'EmAndamento',
    vidros: 'EmAndamento',
    vistoriaPre: 'EmAndamento',
    entrega: 'EmAndamento',
    instalacao: 'EmAndamento',
    vistoriaPos: 'EmAndamento',
    assistencia: 'EmAndamento'
  });

  const [controlePlanejamento, setControlePlanejamento] = useState('producao');

  const selectPlanejamentoControle = (controle) => {
    //console.log("Selected controle:", controle); // Debug line
    setControlePlanejamento(controle);
    setItemsToRender(15); // Reset item count to re-render based on the new control
  };

  const filteredCards = allCards.filter(card => {
    let dateColumn = getDateColumnFor(card, controlePlanejamento);
    let currentStatus = getStatusFor(card, controlePlanejamento);
    let statusCriteria = statusFilters[controlePlanejamento];
    //console.log(`Card ID: ${card.id}, Status: ${currentStatus}, Expected Status: ${statusCriteria}`); // Debug line
    return dateColumn && (currentStatus === statusCriteria);
  });

  // console.log("Filtered cards:", filteredCards); // Debug line

  const groupDataByWeek = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      let dateColumn = getDateColumnFor(item, controlePlanejamento);
      if (dateColumn) {
        const date = new Date(dateColumn);
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - (dayOfWeek - 1));
        const weekNumber = Math.floor((startOfWeek - new Date(0)) / (7 * 24 * 60 * 60 * 1000));
        if (!groupedData[weekNumber]) {
          groupedData[weekNumber] = [];
        }
        groupedData[weekNumber].push(item);
      }
    });
    //console.log("Grouped data:", groupedData); // Debug line
    return groupedData;
  };

  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, [controlePlanejamento]);

  const calculateWeekNumber = (dateString) => {
    if (!dateString) return { startDate: '', endDate: '' };
    const date = new Date(dateString);
    const startDate = new Date(date);
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');
    return { startDate: formattedStartDate, endDate: formattedEndDate };
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const renderTableRows = (data) => {
    //console.log("Grouped data by week:", data); // Debug line
    const rows = [];
    for (const weekNumber in data) {
      if (data.hasOwnProperty(weekNumber)) {
        let totalHorasProducao = 0;
        let totalValue = 0;
        let totalEsquadrias = 0;
        let totalQuadros = 0;
        let totalMetrosQuadrados = 0;
        let weekInfo = null;
        let headerAdded = false;
        const correctDate = getDateColumnFor(data[weekNumber][0], controlePlanejamento);
        weekInfo = calculateWeekNumber(correctDate);
        if (weekInfo == null) return;
        if (weekInfo.startDate && weekInfo.endDate) {
          rows.push(
            <tr key={`week-header-${weekNumber}`}>
              <td className='semana-container' colSpan="21">
                <label className='semana-label'>{`( ${weekInfo.startDate} - ${weekInfo.endDate} )`}</label>
              </td>
            </tr>
          );
          data[weekNumber].forEach((item) => {
            let previsaoData = getDateColumnFor(item, controlePlanejamento);
            if (previsaoData) {
              totalHorasProducao += item.horas_producao ? parseFloat(item.horas_producao) : 0;
              totalValue += item.valor ? parseFloat(item.cost_value) : 0;
              totalEsquadrias += item.quantidade_esquadrias ? parseFloat(item.quantidade_esquadrias) : 0;
              totalQuadros += item.quantidade_quadros ? parseFloat(item.quantidade_quadros) : 0;
              totalMetrosQuadrados += item.metros_quadrados ? parseFloat(item.metros_quadrados) : 0;
              if (!headerAdded) {
                rows.push(
                  <tr className='header-semana-title'>
                    <th >Card</th>
                    <th>Processo</th>
                    <th>Pedido</th>
                    <th>Produção</th>
                    <th>Representante</th>
                    <th>Cidade/Estado</th>
                    <th>Valor</th>
                    <th>Horas</th>
                    <th>Esquadrias</th>
                    <th>Quadros</th>
                    <th>m2</th>
                    <th>Vidro</th>
                    <th>Prazo</th>
                    <th>Cor</th>
                  </tr>
                );
                headerAdded = true;
              }
              rows.push(
                <tr key={item.id}>
                  <td className='icon-status-controle'><PreviewCard cardData={item} /></td>
                  <td style={{ fontSize: '12px' }}>{getColumnName(item.column_id)}</td>
                  <td style={{ fontSize: '12px' }}>{item.numero_pedido ? item.numero_pedido : ''}</td>
                  <td style={{ fontSize: '12px', color: controlePlanejamento === 'producao' ? 'red' : 'none' }}>{item.previsao_producao ? formatDate(item.previsao_producao) : ''}</td>
                  <td style={{ fontSize: '12px' }}>{item.entity_id}</td>
                  <td style={{ fontSize: '12px' }}>{`${item.city} / ${item.state}`}</td>
                  <td style={{ fontSize: '12px', display: 'none' }}>{item.previsao_medicao ? formatDate(item.previsao_medicao) : ''}</td>
                  <td style={{ fontSize: '12px' }}>{parseFloat(item.cost_value ? item.cost_value : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td style={{ fontSize: '12px' }}>{item.horas_producao ? item.horas_producao : 0}</td>
                  <td style={{ fontSize: '12px' }}>{item.quantidade_esquadrias ? item.quantidade_esquadrias : 0}</td>
                  <td style={{ fontSize: '12px' }}>{item.quantidade_quadros ? item.quantidade_quadros : 0}</td>
                  <td style={{ fontSize: '12px' }}>{item.metros_quadrados ? item.metros_quadrados : 0}</td>
                  <td style={{ fontSize: '12px' }}>
                    <div className='vidro-container'>
                      <div className='status-vidro'>
                        {item.status_entrega_vidro === 'Parado' ? (
                          <MdRemoveShoppingCart className='icon-status-vidro-comprar' />
                        ) : <></>}
                        {item.status_entrega_vidro === 'EmAndamento' ? (
                          <MdShoppingCart className='icon-status-vidro-comprado' />
                        ) : <></>}
                        {item.status_entrega_vidro === 'Pronto' ? (
                          <MdDoneOutline className='icon-status-vidro-entergue' />
                        ) : <></>}
                      </div>
                      {item.entrega_vidro}
                    </div>
                  </td>
                  <td style={{ fontSize: '12px' }}>{item.previsao_entrega_obra ? calculateDaysUntilDelivery(item.previsao_entrega_obra) : 0} dias</td>
                  <td style={{ fontSize: '11px', color: `black` }}><div className='color-container-ref'><div style={{ fontSize: '11px', color: item.cor === 'BRANCO' ? `black` : `white`, background: `${getColorProduct(item.cor)}` }} className='color-ref'></div>{item.cor} </div></td>
                </tr>
              );
            }
          });
          rows.push(
            <tr key={`week-row-total-${weekNumber}`}>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: '#9862FF', color: 'white' }}><label className='horas-totais-label'>{parseFloat(totalValue ? totalValue : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label></td>
              <td style={{ backgroundColor: '#9820FF', color: 'white' }} ><label className='horas-totais-label'>{totalHorasProducao.toFixed(0)}</label></td>
              <td style={{ backgroundColor: '#9862FF', color: 'white' }}><label className='horas-totais-label'>{totalEsquadrias.toFixed(0)}</label></td>
              <td style={{ backgroundColor: '#9820FF', color: 'white' }} ><label className='horas-totais-label'>{totalQuadros.toFixed(0)}</label></td>
              <td style={{ backgroundColor: '#9862FF', color: 'white' }}><label className='horas-totais-label'>{totalMetrosQuadrados.toFixed(0)}</label></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
              <td style={{ backgroundColor: 'white', color: 'white' }} ></td>
            </tr>
          );
          rows.push(
            <div className='linha-vazia-programacao'></div>
          );
        }
      }
    }
    return rows;
  };

  return (
    <div className='pcp-modal'>
      <Header />
      <div className='pcp-tools-container'>
      <select
          className='btn-programacao-producao'
          value={controlePlanejamento}
          onChange={e => selectPlanejamentoControle(e.target.value)}
        >
          <option value="medicao">Medição</option>
          <option value="producao">Produção</option>
          <option value="vidros">Vidros</option>
          <option value="vistoriaPre">Vistoria Pré</option>
          <option value="entrega">Previsão de Entrega</option>
          <option value="instalacao">Instalação</option>
          <option value="vistoriaPos">Vistoria Pós</option>
          <option value="assistencia">Assistência</option>
        </select>

        <select
          className='btn-programacao-producao'
          value={statusFilters[controlePlanejamento]}
          onChange={e => {
            const updatedFilters = { ...statusFilters, [controlePlanejamento]: e.target.value };
            //console.log("Updated filters:", updatedFilters); // Debug line
            setStatusFilters(updatedFilters);
          }}
        >
          <option value="Parado">Parado</option>
          <option value="EmAndamento">Em Andamento</option>
          <option value="Pronto">Pronto</option>
        </select>
      </div>

      <div className="pcp-container" ref={containerRef}>
        <table className="pcp-table" id="table-to-export">
          <tbody key={tableKey}>
            {renderTableRows(groupDataByWeek(filteredCards.slice(0, itemsToRender)))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PCP;
