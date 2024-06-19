import React, { useState, useEffect, useRef } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

import { MdCheckCircle, MdOutlineSend, Md360, MdWindow, MdBuild, MdLocalShipping, MdThumbDown, MdRestoreFromTrash, MdThumbUp, MdGrade, MdWhatsapp, MdOutlineEmail, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { format, parseISO } from 'date-fns';

// STYLE
import './style.css';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'
import Logo from '../../../assets/logo-suite-flow.ico'

function Tarefas() {

  // CONTEXT API
  const { user, listAllUsers } = useUser();
  const { columnsUser } = useColumns();

  const { setOpenCloseUpdateCard, setCurrentCardData,
    setCards, setPreviewSearchCards,
    setListNotifications,
    setOpenCloseHistoricModal,
    setOpenCloseTarefasModal,
    setOpenCloseCompartilharModal,
    currentCardData,
    tarefas, setTarefas
  } = useCard();

  // ESTADOS LOCAL
  const [currentTarefa, setCurrentTarefa] = useState('');

  const [dueDate, setDueDate] = useState(''); // Estado para armazenar a data de vencimento

  useEffect(() => {
    const fetchTarefas = async () => {

      try {
        // console.log('buscando historico')
        const response = await axios.get(`${apiUrl}/card/tarefas/${user.id}/${currentCardData.card_id}`);
        setTarefas(response.data);
        //console.log('tarefas:', response.data);

      } catch (error) {
        console.error('Error fetching tarefas:', error);
      }
    };

    fetchTarefas();
  }, [currentCardData.card_id, user.id]);

  // Historic Component in React

  const handleTarefas = async (event) => {
    event.preventDefault();

    // Verifica se a descrição ou a data de vencimento estão vazias
    if (!currentTarefa.trim() || !dueDate) {
      console.error('A descrição e a data de conclusão são obrigatórias.');
      return; // Interrompe a função se a descrição ou data não forem fornecidas
    }

    try {
      const payload = {
        user_id: user.id, // from useUser context
        card_id: currentCardData.card_id, // or any other type depending on the context
        description: currentTarefa,
        task_type: 'Card',
        due_date: dueDate,
        completed: false,
        empresa_id: user.empresa_id
      };

      const response = await axios.post(`${apiUrl}/card/add-tarefa`, payload);
      setTarefas([...tarefas, response.data]);
      setCurrentTarefa('');

    } catch (error) {
      console.error('Error adding card tarefa:', error);
    }
  };


  const updateTarefas = async (event, task_id, newStatus) => {
    event.preventDefault();
    event.stopPropagation();
  
    try {
      const payload = {
        task_id: task_id,
        completed: newStatus,
        card_id: currentCardData.id,
      };
  
      const response = await axios.post(`${apiUrl}/card/update-tarefa`, payload);
  
      if (response.data) {
        setTarefas(prevTarefas =>
          prevTarefas.map(tarefa =>
            tarefa.task_id === task_id ? { ...tarefa, ...response.data } : tarefa
          )
        );
        setCurrentTarefa('');
      }
  
    } catch (error) {
      console.error('Error updating card tarefa:', error);
    }
  };
  

  useEffect(() => {
  }, [tarefas]);


  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm:ss');
  }

  function formatDateSimple(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  }


  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      // Ajusta a posição de rolagem para o final do contêiner
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [tarefas]);

  const getUserData = (userId) => {
    return listAllUsers.find(u => u.id === userId);
  };


  return (
    <div className='tarefa-card-modal'>
      <div className='tarefa-card-container'>
        <div className='tarefa-card-footer'>
        <div className='header-update-card-container'>
          <label>Tarefas</label>
        </div>
          <button className="tarefa-card-close-button" onClick={() => setOpenCloseTarefasModal(false)}>X</button>
        </div>
        <div className="tarefa-card-form-container">

          <div ref={containerRef} className='tarefa-card-list-container'>


            {tarefas.map((item) => (
              <div className='tarefa-item-container' key={item.task_id}>
                <div className='tarefa-mensagem-container'>
                  <div className='user-logo-tarefa-container'>
                    {/* <img className='user-logo-history' src={getUserData(item.user_id)?.avatar || Logo} /> */}

                    <img
                      className='user-logo-history'
                      src={user && user.avatar ? (getUserData(item.user_id)?.avatar?.includes('syncs-avatar') ? require(`../../../assets/avatares/${getUserData(item.user_id).avatar}`) : getUserData(item.user_id).avatar) : Logo}
                    />

                  </div>
                  <p className='tarefa-description'>
                    <label className='tarefa-description-title'>{item.description}</label>
                    <label className='tarefa-description-date'>{formatDateSimple(item.due_date)}</label>
                  </p>
                  <MdCheckCircle style={{ color: item.completed === true ? 'dodgerblue' : '' }} className='btn-completed-task' onClick={(e) => updateTarefas(e, item.task_id, !item.completed)} />
                </div>
                <p className='tarefa-date'>
                  {getUserData(item.user_id)?.username || ''} - {formatDate(item.created_at)}   /   {item.complete_date ? formatDate(item.complete_date) : 'Aguardando'}
                </p>
              </div>
            ))}

          </div>

          <form className="tarefa-card-form" >

            <input id="username" className="tarefa-card-input" type="text" placeholder="Descrição da Tarefa" value={currentTarefa} onChange={(e) => setCurrentTarefa(e.target.value)} />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="tarefa-card-input"
            />


          </form>
          <div className='tarefa-card-footer'>
            <button style={{ backgroundColor: !currentTarefa.trim() || !dueDate ? '' : 'dodgerblue' }} disabled={!currentTarefa.trim() || !dueDate} type="submit" className="tarefa-card-button" onClick={(e) => {
              e.stopPropagation();
              handleTarefas(e);
            }} >
              Adicionar Tarefa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tarefas; 
