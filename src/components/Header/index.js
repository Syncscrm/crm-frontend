import React, { useState, useEffect, useRef } from 'react';

// STYLE
import './style.css';

// REACT ICONS
import { FaBars } from 'react-icons/fa';
import { MdOutlineCalendarMonth, MdLens, MdNotifications, MdDateRange, MdAddTask, } from 'react-icons/md';
import { TbMessageDots } from "react-icons/tb";


import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo-suite-flow.ico';

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
import Loading from '../Loading';
import Messenger from '../Messenger';
import Anexos from '../Anexos';
import Avatar from '../Avatar';
import Calendario from '../Calendario';
import CustomModule from '../DynamicForm/CustomModule';
import ModuloPedidos from '../ModuloPedido';


function Header() {

  const { user, clearUserContext, setOpenCloseImportExcelEntidades, setOpenCloseImportExcelSuiteFlow, themeDark, getAccessLevel, openCloseModalAvatar, setOpenCloseModalAvatar, userAvatar, setUserAvatar, openCloseCustomModule, setOpenCloseCustomModule } = useUser();
  const { setColumns, setColumnsUser, setSelectedAfilhados, dataInicial, setDataInicial, dataFinal, setDataFinal } = useColumns();

  const { setCurrentCardData, openCloseUpdateCard,
    setOpenCloseUpdateCard, listNotifications,
    setListNotifications, currentCardData,
    openCloseHistoricModal, setOpenCloseHistoricModal,
    openCloseTarefasModal, setOpenCloseTarefasModal,
    openCloseCompartilharModal, setOpenCloseCompartilharModal,
    tarefas, setTarefas,
    openCloseModuloEsquadriasModal, setCards, setPreviewSearchCards, setOpenCloseModalVendaPerdida,
    openCloseModalMessenger, setOpenCloseModalMessenger,
    openCloseAnexosModal, setOpenCloseAnexosModal,
    openClosePedidosModal, setOpenClosePedidosModal
  } = useCard();

  const [showMenuUser, setShowMenuUser] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalVendasGrupo, setTotalVendasGrupo] = useState(0);
  const [metaUser, setMetaUser] = useState(0);
  const [metaUserGrupo, setMetaUserGrupo] = useState(0);
  const [numberNotifications, setNumberNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [renderedNotifications, setRenderedNotifications] = useState([]);
  const [itemsToRender, setItemsToRender] = useState(15);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();










  /// ---------------- messenger ----------------

  // Adicione um estado para armazenar a quantidade de mensagens não lidas
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);


  const fetchUnreadMessagesCount = async () => {
    //console.log('Header - Buscando mensagens não lidas')
    try {
      const response = await axios.get(`${apiUrl}/card/total-unread-messages-count/${user.id}`);
      setUnreadMessagesCount(response.data);
    } catch (error) {
      console.error('Erro ao buscar contagem de mensagens não lidas', error);
    }
  };

  useEffect(() => {

    if (user) {
      setUserAvatar(user.avatar);
    }

  }, [user]);


  useEffect(() => {

    if (!user)
      return

    let interval;
    if (!openCloseModalMessenger) {
      fetchUnreadMessagesCount();
      interval = setInterval(() => {
        fetchUnreadMessagesCount();
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [user, openCloseModalMessenger]);









  const closeModal = () => {
    setOpenCloseModalMessenger(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUserContext();
    setCards([]);
    setColumns([]);
    setPreviewSearchCards([]);
    localStorage.clear();
    sessionStorage.clear();
    setColumnsUser([]);
    setSelectedAfilhados([]);
    navigate('/');
    setDataInicial(null)
    setDataFinal(null);
  };

  function openLeftMenu() {
    setShowLeftMenu(!showLeftMenu);
  }

  function usersPage() {
    navigate('/users');
  }

  function dashboardPage() {
    navigate('/dashboard');
  }

  function pipelinePage() {
    navigate('/home');
  }

  function processColumnsPage() {
    navigate('/process');
  }

  function PCP() {
    navigate('/pcp');
  }

  function openCloseInfosUser() {
    setShowMenuUser(!showMenuUser);
  }

  const getVendasDoMesAtual = async () => {
    try {
      const entityId = user.id;
      const response = await axios.get(`${apiUrl}/card/sales/total/${entityId}`);
      setTotalVendas(response.data);
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

  useEffect(() => {
    if (user) {
      setMetaUser(user.meta_user);
      setMetaUserGrupo(user.meta_grupo);
    }
    if (showMenuUser) {
      getVendasDoMesAtual();
      getVendasDosAfilhadosDoMesAtual();
    }
  }, [showMenuUser, user]);

  const percentualProgresso = (totalVendas / metaUser) * 100;
  const percentualProgressoGrupo = (totalVendasGrupo / metaUserGrupo) * 100;

  const fetchOverdueTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/tasks/overdue/${user.id}`);
      setNumberNotifications(response.data.length);
      setListNotifications(response.data);
      setAllNotifications(response.data);
      setRenderedNotifications(response.data.slice(0, itemsToRender));
    } catch (error) {
      console.error('Erro ao buscar tarefas vencidas', error);
      setNumberNotifications(0);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchOverdueTasks();
    }
  }, [user, tarefas]);

  function getCardData(card) {
    setCurrentCardData(card);
    setOpenCloseUpdateCard(!openCloseUpdateCard);
  }

  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yy');
  }

  const loadMoreNotifications = () => {
    const nextItemsToRender = itemsToRender + 15;
    const newRenderedNotifications = allNotifications.slice(0, nextItemsToRender);
    setRenderedNotifications(newRenderedNotifications);
    setItemsToRender(nextItemsToRender);
  };

  const handleScroll = () => {
    const container = notificationsRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
      loadMoreNotifications();
    }
  };

  useEffect(() => {
    const container = notificationsRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [renderedNotifications]);

  useEffect(() => {
    if (showNotifications) {
      setRenderedNotifications(allNotifications.slice(0, itemsToRender));
    }
  }, [showNotifications, allNotifications, itemsToRender]);




  const [showCalendar, setShowCalendar] = useState(false);


  return (

    <header className="header-container" >

      {openCloseModalAvatar &&
        <Avatar />
      }


      <div className='header-menu-left' onClick={() => openLeftMenu()}>
        <FaBars />
      </div>
      <div className='header-logo-center' onClick={() => pipelinePage()}>
        <label className='header-logo-center-label'>SyncsCRM</label>
      </div>
      <div className='header-menu-right'>
        <MdNotifications className='icon-notification-header' onClick={() => setShowNotifications(!showNotifications)} />
        <div style={{ display: listNotifications.length > 0 ? 'none' : 'none' }} className='number-notifications-header' >{numberNotifications}</div>
        <MdLens style={{ display: listNotifications.length > 0 ? '' : 'none' }} className='icons-number-notifications-header' onClick={() => setShowNotifications(!showNotifications)} />
      </div>

      {showLeftMenu && (

        <div onClick={() => setShowLeftMenu(false)} className='modal-left-menu-container'>

          <div className='left-menu-container'>

            <div className='left-menu-title'>Menu</div>

            <button className='left-menu-button' onClick={() => pipelinePage()}>Home</button>
            {getAccessLevel('dashboard') &&
              <button className='left-menu-button' onClick={() => dashboardPage()}>Dashboard</button>
            }

            <button className='left-menu-button' onClick={() => PCP()}>PCP</button>

            {getAccessLevel('adm') &&
              <button className='left-menu-button' onClick={() => usersPage()}>Usuários</button>
            }

            {getAccessLevel('adm') &&
              <button className='left-menu-button' onClick={() => processColumnsPage()}>Configurações</button>
            }

            {getAccessLevel('adm') &&
              <button className='left-menu-button' onClick={() => setOpenCloseImportExcelEntidades(true)}>Import Excel</button>
            }

            {getAccessLevel('adm') &&
              <button className='left-menu-button' onClick={() => setOpenCloseImportExcelSuiteFlow(true)}>Import SuiteFlow</button>
            }

          </div>
        </div>
      )}

      <div className='header-user-logo-container' onClick={() => openCloseInfosUser()}>


        <img
          onClick={() => openCloseInfosUser()}
          className='header-users-logo'
          src={user && user.avatar ? (userAvatar?.includes('syncs-avatar') ? require(`../../assets/avatares/${userAvatar}`) : user.avatar) : Logo}
          alt={`${user && user.username}'s avatar`}
        />


      </div>

      {showMenuUser && (
        <div className='user-infors-container'>

          <button className='btn-close-metas-user' onClick={() => openCloseInfosUser()}>x</button>

          <div className='user-infors-logo-container' onClick={() => openCloseInfosUser()}>
            {/* <img onClick={() => openCloseInfosUser()} className='user-infors-logo' src={user && user.avatar ? user.avatar : Logo} /> */}

            <img
              onClick={() => setOpenCloseModalAvatar(true)}
              className='header-users-logo'
              src={user && user.avatar ? (userAvatar?.includes('syncs-avatar') ? require(`../../assets/avatares/${userAvatar}`) : user.avatar) : Logo}
              alt={`${user && user.username}'s avatar`}
            />

            <button className='btn-edit-avatar-user' onClick={() => setOpenCloseModalAvatar(true)}>editar</button>

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
      )}

      {showNotifications && (
        <div className='menu-notification-container'>
          <div className='menu-notification-header'>
            <button className='btn-close-notifications-menu' onClick={() => setShowNotifications(!showNotifications)}>X</button>


            <MdOutlineCalendarMonth className='btn-icon-calendario' onClick={() => setShowCalendar(true)} />


            <div className='total-mensagens-text' > {numberNotifications} Mensagens</div>

          </div>
          <div className='menu-notification-body' ref={notificationsRef} style={{ overflowY: 'auto' }}>
            {renderedNotifications.map((item) => (
              <div key={item.task_id} className='item-notifications'>
                <label className='label-notifications-header'><MdAddTask className='icon-notifications-card' />{item.description}</label>
                <label className='label-notifications-header'><MdDateRange className='icon-notifications-card' />{formatDate(item.due_date)}</label>
                <PreviewCard key={item.card_id} cardData={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {openCloseUpdateCard && (
        <UpdateCard idCard={currentCardData.card_id} cardData={currentCardData} />
      )}

      {openCloseHistoricModal && (
        <Historic idCard={currentCardData.card_id} cardData={currentCardData} closeModal={() => setOpenCloseHistoricModal(true)} />
      )}

      {openCloseTarefasModal && (
        <Tarefas idCard={currentCardData.card_id} cardData={currentCardData} closeModal={() => setOpenCloseTarefasModal(true)} />
      )}

      {openCloseCompartilharModal && (
        <Compartilhar idCard={currentCardData.card_id} cardData={currentCardData} closeModal={() => setOpenCloseCompartilharModal(true)} />
      )}

      {openCloseModuloEsquadriasModal && (
        <ModuloEsquadrias idCard={currentCardData.card_id} />
      )}

      {openCloseAnexosModal && (
        <Anexos idCard={currentCardData.card_id} cardData={currentCardData} />
      )}

      {openCloseCustomModule && (
        <CustomModule idCard={currentCardData.card_id} />
      )}


      {openClosePedidosModal && (
        <ModuloPedidos idCard={currentCardData.card_id} />
      )}




      <Loading />

      <TbMessageDots onClick={() => setOpenCloseModalMessenger(true)} className='icon-messenger-flutuante' />

      {openCloseModalMessenger &&
        <Messenger closeModal={closeModal} />
      }

      {unreadMessagesCount > 0 && <span className="badge">{unreadMessagesCount}</span>}
      {openCloseModalMessenger && <Messenger closeModal={closeModal} />}


      {showCalendar && <Calendario userId={user.id} closeModal={() => setShowCalendar(false)} />}

    </header>
  );
}

export default Header;
