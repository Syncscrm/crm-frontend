import React, { useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

// STYLE
import './style.css';

// CONTEXT API
import { useUser } from '../../contexts/userContext';

import { FaBell, FaBars } from 'react-icons/fa';

import sinoSound from '../../assets/bell.mp3';

import logoDefault from '../../assets/logo-suite-flow.ico'


function Vendas() {

  // CONTEXT API
  const { user, listAllUsers } = useUser();

  const [vendasAnteriores, setVendasAnteriores] = useState([]);
  const [novosVendidos, setNovosVendidos] = useState([]);
  const [vendaUltimoMinuto, setVendaUltimoMinuto] = useState([
  ]);
  const [exibirSino, setExibirSino] = useState(false);


  useEffect(() => {
    if(!user)
      return
      getVendasDoDia();
    
  }, [user]);

    // Buscar todos os cards com status == "Vendido" && data de modificação == dia de hoje colocar em uma lista
    const getVendasDoDia = async () => {
      try {
        const url = `${apiUrl}/card/sold-last-minute/${user.empresa_id}`;
        const response = await axios.get(url);
        const vendasExistentes = response.data;
  
        setVendasAnteriores(vendasExistentes);
  
      } catch (error) {
        console.error('Erro ao buscar vendas existentes:', error);
      }
    };

  useEffect(() => {

    const primeiraChamada = setTimeout(() => {

      const intervalId = setInterval(getNovasVendas, 15000); // Ajustado para 10 segundos
      return () => clearInterval(intervalId);
    }, 15000);

    return () => clearTimeout(primeiraChamada);

  }, [user]);

  const getNovasVendas = async () => {

    try {
      const url = `${apiUrl}/card/sold-last-minute/${user.empresa_id}`;

      const response = await axios.get(url);
      const vendas = response.data;

      console.log('lista de vendas', vendas)

      setNovosVendidos(vendas);

    } catch (error) {
      console.error('Erro ao buscar novos vendidos:', error);
    }

  };

  useEffect(() => {

    if (novosVendidos.length > vendasAnteriores.length) {
      console.log("Existem novas vendas registradas")

      const vendasNovasCalculadas = novosVendidos.filter((venda) => !vendasAnteriores.some((vendaAnterior) => venda.card_id === vendaAnterior.card_id));

      setVendaUltimoMinuto(vendasNovasCalculadas);
      setExibirSino(true);
      setPlaySino(!playSino);

      setTimeout(() => {
        setExibirSino(false);
        setVendasAnteriores(novosVendidos);
        setVendaUltimoMinuto('');
      }, 10000);



    }

  }, [novosVendidos]);


  


  const [playSino, setPlaySino] = useState(false);

  useEffect(() => {
    if (playSino) {
      const audio = new Audio(sinoSound);
      audio.play();
      audio.onended = () => setPlaySino(false);
    }
  }, [playSino]);

  const getUsernameById = (id) => {
    const user = listAllUsers.find(user => user.id === id);
    return user ? user.username : 'Usuário não encontrado';
  };

  const getAvatarById = (id) => {
    const user = listAllUsers.find(user => user.id === id);
    return user && user.avatar ? user.avatar : logoDefault;
  };

  return (



    <>
      {exibirSino &&
        <div className='notification-admin'>

          <div className='header-notification-adm'>

          </div>

          <div className='novas-vendas-container'>
            {
              vendaUltimoMinuto.map((venda) => (

                <div key={venda.card_id} className='nova-venda-adm-row'>

                  <img className='logo-afilhado-lista-vendas' src={venda.entity_id ? getAvatarById(venda.entity_id) : logoDefault} />

                  <div className='nova-venda-adm'>
                    <label className='nova-venda-name'>{getUsernameById(venda.entity_id).substring(0, 30)}</label>
                    <label className='nova-venda-valor'>{parseFloat(venda.cost_value ? venda.cost_value : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label>
                  </div>

                  <div className='sino-container'>
                    <FaBell className='notification-admin-icon-sino' />
                  </div>

                </div>
              ))
            }
          </div>

        </div>
      }
    </>

  );
}

export default Vendas; 
