import React, { useState, useEffect, useRef } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

import { MdOutlineSend, Md360, MdWindow, MdBuild, MdLocalShipping, MdThumbDown, MdRestoreFromTrash, MdThumbUp, MdGrade, MdWhatsapp, MdOutlineEmail, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { format, parseISO } from 'date-fns';

// STYLE
import './style.css';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'
import Logo from '../../../assets/logo-suite-flow.ico'

function Historic() {

  // CONTEXT API
  const { user, listAllUsers } = useUser();
  const { columnsUser } = useColumns();

  const { setOpenCloseUpdateCard, setCurrentCardData,
    setCards, setPreviewSearchCards,
    setListNotifications,
    setOpenCloseHistoricModal,
    setOpenCloseTarefasModal,
    setOpenCloseCompartilharModal,
    currentCardData
  } = useCard();


  // ESTADOS LOCAL
  const [currentHistoric, setCurrentHistoric] = useState('');

  const [history, setHistory] = useState([]);




  useEffect(() => {
    const fetchHistory = async () => {

      try {
        // console.log('buscando historico')
        const response = await axios.get(`${apiUrl}/card/history/${currentCardData.id}`);
        setHistory(response.data);
        //console.log('History:', response.data);

      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [currentCardData.id, user.id]);

  // Historic Component in React

  const handleHistoric = async (event) => {
    event.preventDefault();
    if (!currentHistoric && currentHistoric == '')
      return;

    try {
      const payload = {
        card_id: currentCardData.id, // assuming idCard is available in the component's props
        user_id: user.id, // from useUser context
        action_type: 'Update', // or any other type depending on the context
        description: currentHistoric,
        card_status: currentCardData.status // assuming cardData has a status field
      };
      const response = await axios.post(`${apiUrl}/card/add-history`, payload);
      //console.log('History added:', response.data);
      setHistory(prevHistory => [...prevHistory, response.data]);
      setCurrentHistoric(''); // Reset input after submission

      //closeModal(e); // Close modal if needed
    } catch (error) {
      console.error('Error adding card history:', error);
    }
  };


  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm:ss');
  }


  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      // Ajusta a posição de rolagem para o final do contêiner
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [history]);

  const getUserData = (userId) => {
    return listAllUsers.find(u => u.id === userId);
  };


  return (
    <div className='history-card-modal'>
      <div className='history-card-container'>
        <div className='history-card-footer'>
          <button className="history-card-close-button" onClick={() => { setOpenCloseHistoricModal(false) }}>X</button>
        </div>
        <div className="history-card-form-container">

          <div ref={containerRef} className='history-card-list-container'>


            {history.map((item) => (
              <div className='history-item-container' key={item.hitory_id}>
                <div className='history-mensagem-container'>
                  <div className='user-logo-history-container'>
                    <img src={getUserData(item.user_id)?.avatar || Logo} alt={getUserData(item.user_id)?.username || 'User'} className='user-logo-history' />
                  </div>
                  <p className='history-description'>{item.description}</p>
                </div>
                <p className='history-date'>{getUserData(item.user_id)?.username || ''}  -  {formatDate(item.create_at)}</p>
              </div>
            ))}

          </div>

          <form className="history-card-form" >

            <input id="username" className="history-card-input" type="text" placeholder="Adicionar Histórico" value={currentHistoric} onChange={(e) => setCurrentHistoric(e.target.value)} />
            <button style={{ backgroundColor: !currentHistoric.trim() ? '' : 'dodgerblue' }} type="submit" className="history-card-button" onClick={(event) => handleHistoric(event)} >
              <MdOutlineSend />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Historic; 
