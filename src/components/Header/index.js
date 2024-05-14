import React, { useState, useContext, useEffect } from 'react';

// STYLE
import './style.css';

// REACT ICONS
import { FaRankingStar } from "react-icons/fa6";
import { FaBell, FaBars } from 'react-icons/fa';
import { MdNotifications, MdDateRange, MdAddTask, } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo-suite-flow.ico'

import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext';
import { useColumns } from '../../contexts/columnsContext';

import { format, parseISO } from 'date-fns';

import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';
import PreviewCard from '../../components/PreviewCard';

import UpdateCard from '../forms/UpdateCard';
import Historic from '../forms/Historic';
import Tarefas from '../forms/Tarefas';
import Compartilhar from '../forms/Compartilhar';
import ModuloEsquadrias from '../forms/ModuloEsquadrias';


function Header() {

  const { user, clearUserContext, setOpenCloseImportExcelEntidades, setOpenCloseImportExcelSuiteFlow } = useUser();
  const { setColumns, setColumnsUser } = useColumns();

  const { setCurrentCardData, openCloseUpdateCard,
    setOpenCloseUpdateCard, listNotifications,
    setListNotifications, currentCardData,
    openCloseHistoricModal, setOpenCloseHistoricModal,
    openCloseTarefasModal, setOpenCloseTarefasModal,
    openCloseCompartilharModal, setOpenCloseCompartilharModal, 
    tarefas, setTarefas,
    openCloseModuloEsquadriasModal, setCards, setPreviewSearchCards
  } = useCard();


  const [showMenuUser, setShowMenuUser] = useState(false);

  const [showLeftMenu, setShowLeftMenu] = useState(false);

  const [totalVendas, setTotalVendas] = useState(0);
  const [totalVendasGrupo, setTotalVendasGrupo] = useState(0);


  const [metaUser, setMetaUser] = useState(0);
  const [metaUserGrupo, setMetaUserGrupo] = useState(0);

  const [numberNotifications, setNumberNotifications] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token de autenticação do armazenamento local
    localStorage.removeItem('token');
  
    // Limpa o contexto do usuário e outros contextos relacionados
    clearUserContext();
  
    // Adicionalmente, se você estiver armazenando cartões ou outros dados relacionados ao usuário em um estado global, limpe-os também
    setCards([]);  // Supondo que você tenha uma função 'setCards' para limpar os cartões
    setColumns([]);
    setPreviewSearchCards([]);
    localStorage.clear();
    sessionStorage.clear();
    setColumnsUser([])


  
    // Redireciona para a página de login ou outra página inicial
    navigate('/');
  };

  function openLeftMenu() {
    setShowLeftMenu(!showLeftMenu);
  }

  function usersPage() {
    navigate('/users');
  }

  function pipelinePage() {
    navigate('/home');
  }

  function processColumnsPage() {
    navigate('/process');
  }

  function openCloseInfosUser() {
    setShowMenuUser(!showMenuUser)
  }

  // Função para buscar o total de vendas do mês atual
  const getVendasDoMesAtual = async () => {
    try {
      const entityId = user.id; // Supondo que você tenha essa informação no contexto do usuário
      const response = await axios.get(`${apiUrl}/card/sales/total/${entityId}`);
      setTotalVendas(response.data);
      //console.log('vendas:', response.data)
    } catch (error) {
      console.error('Erro ao buscar total de vendas', error);
    }
  };

  const getVendasDosAfilhadosDoMesAtual = async () => {
    try {
      const entityId = user.id;
      const response = await axios.get(`${apiUrl}/card/sales/total-afilhados/${entityId}`);
      setTotalVendasGrupo(response.data);
    } catch (error) {
      console.error('Erro ao buscar total de vendas dos afilhados', error);
    }
  };



  // Efeito para buscar o total de vendas quando o componente é montado
  useEffect(() => {

    if (user) {
      setMetaUser(user.meta_user)
      setMetaUserGrupo(user.meta_grupo)
    }

    if (showMenuUser) {
      getVendasDoMesAtual();
      getVendasDosAfilhadosDoMesAtual()
    }
  }, [showMenuUser, user]);

  const percentualProgresso = (totalVendas / metaUser) * 100;
  const percentualProgressoGrupo = (totalVendasGrupo / metaUserGrupo) * 100;


  const fetchOverdueTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/tasks/overdue/${user.id}`);
      setNumberNotifications(response.data.length);
      setListNotifications(response.data)
    } catch (error) {
      console.error('Erro ao buscar tarefas vencidas', error);
      setNumberNotifications(0);
    }
  };

  useEffect(() => {

    if (user && user.id) {
      fetchOverdueTasks()
    }

  }, [user, tarefas]);


  function getCardData(card) {
    //console.log('selectc',card)
    setCurrentCardData(card)
    //setOpenCloseUpdateUserModal(true)
    setOpenCloseUpdateCard(!openCloseUpdateCard)
  }

  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yy');
  }

  useEffect(() => {
    //console.log(tarefas.length)
    //console.log(tarefas)
  }, [tarefas]);

  return (

    <header className="header-container">
      <div className='header-menu-left' onClick={() => openLeftMenu()}>
        <FaBars />
      </div>
      <div className='header-logo-center' onClick={() => pipelinePage()}>
        <label className='header-logo-center-label'>SyncsCRM</label>
      </div>
      <div className='header-menu-right'>
        <MdNotifications className='icon-notification-header' onClick={() => setShowNotifications(!showNotifications)} />
        <div style={{display: listNotifications.length > 0 ? '' : 'none'}} className='number-notifications-header' onClick={() => setShowNotifications(!showNotifications)}>{numberNotifications}</div>
      </div>

      {showLeftMenu && (
        <div className='left-menu-container'>
          <div className='left-menu-title'>Menu</div>
          <button className='left-menu-button' onClick={() => pipelinePage()}>Home</button>
          <button className='left-menu-button' onClick={() => usersPage()}>Usuários</button>
          <button className='left-menu-button' onClick={() => processColumnsPage()}>Colunas</button>
          <button className='left-menu-button' onClick={() => setOpenCloseImportExcelEntidades(true)}>Import Excel</button>
          <button className='left-menu-button' onClick={() => setOpenCloseImportExcelSuiteFlow(true)}>Import SuiteFlow</button>

        </div>
      )}

      <div className='header-user-logo-container' onClick={() => openCloseInfosUser()}>
        <img onClick={() => openCloseInfosUser()} className='header-users-logo' src={user && user.avatar ? user.avatar : Logo} alt={`${user && user.username}'s avatar`} />
      </div>

      {
        showMenuUser &&
        <div className='user-infors-container'>
          <div className='user-infors-logo-container' onClick={() => openCloseInfosUser()}>
            <img onClick={() => openCloseInfosUser()} className='user-infors-logo' src={user && user.avatar ? user.avatar : Logo} />
          </div>

          <label className='user-info-name'>{user ? user.username : ''}</label>

          <div className='user-infors-body-container'>

            <label className='title-progress-bar'>{user ? user.username : ''}</label>
            <div className="progress-bar-container">
              <div className="progress-label">
                {`${percentualProgresso.toFixed(0)}%`}
              </div>
              <div className="progress-bar" style={{ width: `${percentualProgresso}%` }}></div>
            </div>

            <label className="value-meta-label">
              {'Vendas: '}
              {parseFloat(totalVendas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              {' / Meta: '}
              {parseFloat(user ? user.meta_user : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </label>

            <label className='title-progress-bar'>Afilhados</label>
            <div className="progress-bar-container">
              <div className="progress-label">
                {`${percentualProgressoGrupo.toFixed(0)}%`}
              </div>
              <div className="progress-bar" style={{ width: `${percentualProgressoGrupo}%` }}></div>
            </div>

            <label className="value-meta-label">
              {'Vendas: '}
              {parseFloat(totalVendasGrupo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              {' / Meta: '}
              {parseFloat(user ? user.meta_grupo : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </label>

          </div>

          <div className='user-infors-footer-container'>
            <button className='btn-close' onClick={handleLogout}>Sair</button>
          </div>


        </div>
      }

      {
        showNotifications && (
          <div className='menu-notification-container'>
            <div className='menu-notification-header'>
              <button className='btn-close-notifications-menu' onClick={() => setShowNotifications(!showNotifications)}>X</button>
            </div>
            <div className='menu-notification-body'>
              {
                listNotifications.map((item) => (
                  <>
                    <div key={item.task_id} className='item-notifications'>
                      <label className='label-notifications-header'><MdAddTask className='icon-notifications-card' />{item.description}</label>
                      <label className='label-notifications-header'><MdDateRange className='icon-notifications-card' />{formatDate(item.due_date)}</label>
                      <PreviewCard key={item.id} cardData={item} />

                    </div>
                  </>

                ))
              }
            </div>

          </div>
        )
      }

      {
        openCloseUpdateCard && (
          <UpdateCard idCard={currentCardData.id} cardData={currentCardData} />
        )
      }

      {
        openCloseHistoricModal && (
          <Historic idCard={currentCardData.id} cardData={currentCardData} closeModal={() => setOpenCloseHistoricModal(true)} />
        )
      }

      {
        openCloseTarefasModal && (
          <Tarefas idCard={currentCardData.id} cardData={currentCardData} closeModal={() => setOpenCloseTarefasModal(true)} />
        )
      }

      {
        openCloseCompartilharModal && (
          <Compartilhar idCard={currentCardData.id} cardData={currentCardData} closeModal={() => setOpenCloseCompartilharModal(true)} />
        )
      }

{
        openCloseModuloEsquadriasModal && (
          <ModuloEsquadrias idCard={currentCardData.id} />
          
        )
      }


    </header >
  );
}

export default Header;
