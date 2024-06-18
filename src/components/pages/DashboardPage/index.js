import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/userContext';
import { useCard } from '../../../contexts/cardContext';
import { useColumns } from '../../../contexts/columnsContext';

import Header from '../../../components/Header';
import Mapa from '../../../components/Mapa';
import './style.css';
import Logo from '../../../assets/logo-suite-flow.ico';

import { MdThumbDown, MdThumbUp, MdFilterAltOff } from "react-icons/md";

function DashboardPage() {
  const { user, afilhadosList } = useUser();
  const { cards } = useCard();
  const { columns } = useColumns();
  const [selectedAfilhados, setSelectedAfilhados] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Vendido'); // Estado para armazenar o status selecionado
  const [selectedStates, setSelectedStates] = useState([]); // Estado para armazenar os estados selecionados
  const [selectedCities, setSelectedCities] = useState([]); // Estado para armazenar as cidades selecionadas

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const formatDate = (date) => date.toISOString().split('T')[0];
  
    setStartDate(formatDate(startOfMonth));
    setEndDate(formatDate(endOfMonth));
  }, []);
  

  const formatName = (name) => {
    return name.toUpperCase().substring(0, 22);
  };

  const filterCardsByDate = (cards) => {
    if (!startDate && !endDate) return cards;
    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    return cards.filter((card) => {
      const cardDate = new Date(card.status_date);
      return cardDate >= start && cardDate <= end;
    });
  };

  const calculateTotalSales = () => {
    const filteredCards = filterCardsByDate(cards.filter(card => card.status === selectedStatus));
    const salesData = [...afilhadosList, user].map((afilhado) => {
      const totalSales = filteredCards
        .filter((card) => card.entity_id === afilhado.id)
        .reduce((acc, card) => acc + parseFloat(card.cost_value), 0);

      return {
        ...afilhado,
        totalSales,
      };
    });

    return salesData
      .filter((afilhado) => afilhado.totalSales > 0)
      .sort((a, b) => b.totalSales - a.totalSales);
  };

  const calculateTotalSalesByState = (selectedAfilhados) => {
    const filteredCards = filterCardsByDate(cards.filter(card => card.status === selectedStatus && (selectedAfilhados.length === 0 || selectedAfilhados.includes(card.entity_id))));
    const stateSales = {};

    filteredCards.forEach((card) => {
      if (!stateSales[card.state]) {
        stateSales[card.state] = {
          state: card.state,
          totalSales: 0,
          percentageSold: 0,
        };
      }
      stateSales[card.state].totalSales += parseFloat(card.cost_value);
    });

    const totalStateSales = Object.values(stateSales);
    const grandTotal = totalStateSales.reduce((acc, state) => acc + state.totalSales, 0);

    totalStateSales.forEach((state) => {
      state.percentageSold = (state.totalSales / grandTotal) * 100;
    });

    return totalStateSales.sort((a, b) => b.totalSales - a.totalSales);
  };

  const calculateTotalSalesByCity = (selectedAfilhados, selectedStates) => {
    const filteredCards = filterCardsByDate(cards.filter(card => card.status === selectedStatus &&
      (selectedAfilhados.length === 0 || selectedAfilhados.includes(card.entity_id)) &&
      (selectedStates.length === 0 || selectedStates.includes(card.state))));

    const citySales = {};

    filteredCards.forEach((card) => {
      if (!citySales[card.city]) {
        citySales[card.city] = {
          city: card.city,
          totalSales: 0,
          percentageSold: 0,
        };
      }
      citySales[card.city].totalSales += parseFloat(card.cost_value);
    });

    const totalCitySales = Object.values(citySales);
    const grandTotal = totalCitySales.reduce((acc, city) => acc + city.totalSales, 0);

    totalCitySales.forEach((city) => {
      city.percentageSold = (city.totalSales / grandTotal) * 100;
    });

    return totalCitySales.sort((a, b) => b.totalSales - a.totalSales);
  };

  const calculateTotalSalesByOrigin = (selectedAfilhados, selectedStates, selectedCities) => {
    const filteredCards = filterCardsByDate(cards.filter(card => card.status === selectedStatus &&
      (selectedAfilhados.length === 0 || selectedAfilhados.includes(card.entity_id)) &&
      (selectedStates.length === 0 || selectedStates.includes(card.state)) &&
      (selectedCities.length === 0 || selectedCities.includes(card.city))));

    const originSales = {};

    filteredCards.forEach((card) => {
      const origem = card.origem ? card.origem : 'Não informado';
      if (!originSales[origem]) {
        originSales[origem] = {
          origem: origem,
          totalSales: 0,
          percentageSold: 0,
        };
      }
      originSales[origem].totalSales += parseFloat(card.cost_value);
    });

    const totalOriginSales = Object.values(originSales);
    const grandTotal = totalOriginSales.reduce((acc, origem) => acc + origem.totalSales, 0);

    totalOriginSales.forEach((origem) => {
      origem.percentageSold = (origem.totalSales / grandTotal) * 100;
    });

    return totalOriginSales.sort((a, b) => b.totalSales - a.totalSales);
  };

  const totalSalesData = calculateTotalSales();

  const calculateTotal = (data) => {
    return data.reduce((acc, afilhado) => acc + afilhado.totalSales, 0);
  };

  const handleAfilhadoClick = (afilhado) => {
    setSelectedAfilhados(prevSelected => {
      if (prevSelected.includes(afilhado.id)) {
        return prevSelected.filter(id => id !== afilhado.id);
      } else {
        return [...prevSelected, afilhado.id];
      }
    });
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const clearListas = () => {
    setSelectedAfilhados([]);
    setSelectedStates([]);
    setSelectedCities([]);
  }

  const handleStateClick = (state) => {
    setSelectedStates(prevSelected => {
      if (prevSelected.includes(state)) {
        return prevSelected.filter(s => s !== state);
      } else {
        return [...prevSelected, state];
      }
    });
  };

  const handleCityClick = (city) => {
    setSelectedCities(prevSelected => {
      if (prevSelected.includes(city)) {
        return prevSelected.filter(c => c !== city);
      } else {
        return [...prevSelected, city];
      }
    });
  };

  const filteredTotalSalesData = selectedAfilhados.length > 0
    ? totalSalesData.filter(data => selectedAfilhados.includes(data.id))
    : totalSalesData;

  const filteredTotal = calculateTotal(filteredTotalSalesData);

  const filteredTotalSalesDataByState = calculateTotalSalesByState(selectedAfilhados);

  const filteredTotalSalesDataByCity = calculateTotalSalesByCity(selectedAfilhados, selectedStates);

  const filteredTotalSalesDataByOrigin = calculateTotalSalesByOrigin(selectedAfilhados, selectedStates, selectedCities);

  filteredTotalSalesData.forEach(afilhado => {
    afilhado.percentageSold = (afilhado.totalSales / filteredTotal) * 100;
  });

  const maxPercentage = Math.max(...filteredTotalSalesData.map(afilhado => afilhado.percentageSold || 0));


  return (
    <div className='dashboard-container'>
      <Header />
      <div className='dashboard-header'>
        <img className='logo-dashboard' src={user && user.avatar ? user.avatar : Logo} alt='Logo' />
        <div className='dashboard-total-sales'>
          <h2>Total</h2>
          <h2>{filteredTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
        </div>

        <div className='date-filters-dashboard'>
          <label className='date-column-dashboard'>
            <label className='label-date-dashboard'>Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='input-date-dashboard'
            />
          </label>
          <label className='date-column-dashboard'>
            <label className='label-date-dashboard'>Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='input-date-dashboard'
            />
          </label>
        </div>

        <div className='status-container-dashboard'>
          <MdThumbUp
            className={`icon-perdido-dashboard ${selectedStatus === 'Vendido' ? 'active' : ''}`}
            onClick={() => handleStatusClick('Vendido')}
            style={{ color: selectedStatus === 'Vendido' ? 'dodgerblue' : 'gray' }}
          />
          <MdThumbDown
            className={`icon-vendido-dashboard ${selectedStatus === 'Perdido' ? 'active' : ''}`}
            onClick={() => handleStatusClick('Perdido')}
            style={{ color: selectedStatus === 'Perdido' ? '#ff2a4e' : 'gray' }}
          />
        </div>

        <div className='status-container-dashboard'>
          <MdFilterAltOff
            className={`icon-perdido-dashboard `}
            onClick={() => clearListas()}
            style={{ color: 'gray' }}
          />

          <div style={{ backgroundColor: 'transparent' }} className="icon-vendido-dashboard"></div>


        </div>
      </div>
      <div className='dashboard-body'>


        <div className='dashboard-afilhados-list'>
          <table className='table-dashboard'>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Proporção</th>
                <th>Valor Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {totalSalesData.map((afilhado, index) => (
                <tr
                  key={afilhado.id}
                  onClick={() => handleAfilhadoClick(afilhado)}
                  style={{
                    backgroundColor: selectedAfilhados.includes(afilhado.id) ? '#b6dcff' : (index % 2 === 0 ? '#f0f0f0' : '#ffffff')
                  }}
                >
                  <td className='td-dashboard' width={'200px'} style={{ maxWidth: '200px' }}>{formatName(afilhado.username)}</td>
                  <td className='bar-container'>


                    <div className='bar' style={{
                      backgroundColor: selectedStatus === 'Perdido' ? '#ff2a4e' : 'dodgerblue',
                      width: `${(afilhado.percentageSold / maxPercentage) * 100 || 0}%`
                    }}></div>


                  </td>
                  <td className='td-dashboard'>{afilhado.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className='td-dashboard'>{(afilhado.percentageSold || 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table >
        </div>

        <div className='dashboard-states-list'>
          <table className='table-dashboard'>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Valor Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {filteredTotalSalesDataByState.map((state, index) => (
                <tr
                  key={state.state}
                  onClick={() => handleStateClick(state.state)}
                  style={{
                    backgroundColor: selectedStates.includes(state.state) ? '#b6dcff' : (index % 2 === 0 ? '#f0f0f0' : '#ffffff')
                  }}
                >
                  <td className='td-dashboard' width={'80px'}>{state.state}</td>
                  <td className='td-dashboard' >{state.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className='td-dashboard'>{(state.percentageSold || 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='dashboard-cities-list'>
          <table className='table-dashboard'>
            <thead>
              <tr>
                <th>Cidade</th>
                <th>Valor Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {filteredTotalSalesDataByCity.map((city, index) => (
                <tr
                  key={city.city}
                  onClick={() => handleCityClick(city.city)}
                  style={{
                    backgroundColor: selectedCities.includes(city.city) ? '#b6dcff' : (index % 2 === 0 ? '#f0f0f0' : '#ffffff')
                  }}
                >
                  <td className='td-dashboard' width={'200px'}>{city.city}</td>
                  <td className='td-dashboard'>{city.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className='td-dashboard'>{(city.percentageSold || 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='dashboard-origins-list'>
          <table className='table-dashboard'>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Valor Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {filteredTotalSalesDataByOrigin.map((origem, index) => (
                <tr
                  key={origem.origem}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff'
                  }}
                >
                  <td className='td-dashboard' width={'200px'}>{origem.origem}</td>
                  <td className='td-dashboard' >{origem.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className='td-dashboard' >{(origem.percentageSold || 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
