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

function Compartilhar() {

  // CONTEXT API
  const { user } = useUser();
  const { columnsUser } = useColumns();
  const { 
    currentCardData,
    setOpenCloseCompartilharModal,
    addHistoricoCardContext
  } = useCard();



  // ESTADOS LOCAL
  const [currentTarefa, setCurrentTarefa] = useState('');

  const [emails, setEmails] = useState([]);

  const [email, setEmail] = useState(''); // Estado para armazenar a data de vencimento

  useEffect(() => {
    const fetchCompartilhar = async () => {

      try {
        // console.log('buscando historico')
        const response = await axios.get(`${apiUrl}/card/compartilhar/${currentCardData.card_id}`);
        setEmails(response.data);
        //console.log('History:', response.data);

      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchCompartilhar();
  }, [currentCardData.card_id, user.id]);


  const getEmailById = (idShared) => {
    const emailData = emails.find(item => item.id === idShared);
    return emailData ? emailData.email : 'E-mail não encontrado';
  }

  const handleCompartilhar = async (event) => {
    event.preventDefault();

    // Verifica se o e-mail está vazio
    if (!email.trim()) {
      console.error('Email não informado');
      return; // Interrompe a função se o e-mail não for fornecido
    }

    try {
      const payload = {
        owner_user_id: user.id, // ID do usuário logado, obtido do contexto
        card_id: currentCardData.card_id,       // ID do card atual
        email: email,           // E-mail para o qual o card será compartilhado
        empresa_id: user.empresa_id
      };
      const response = await axios.post(`${apiUrl}/card/add-compartilhar`, payload);
      // Verifica se a resposta inclui os dados corretos e atualiza o estado
      const emailsData = response.data[0]; // Atualiza o item 0 do array
      console.log(response.data)
      setEmails(prevEmails => [...prevEmails, emailsData]); // Atualiza a lista usando callback
      setEmail(''); // Limpa o campo de entrada após o envio

      addHistoricoCardContext(`Card Compartilhado com ${email}`, currentCardData.card_id, user.id)


    } catch (error) {
      console.error('Error adding compartilhamento:', error);
    }
  };


  const deleteCompartilhamento = async (event, idShared) => {
    event.preventDefault();
    try {
      await axios.delete(`${apiUrl}/card/delete-compartilhar/${idShared}`);
      setEmails(prevEmails => prevEmails.filter(item => item.id !== idShared));
      
      const emailToRemove = getEmailById(idShared);  // Pega o e-mail antes de ser removido
      addHistoricoCardContext(`Compartilhamento Removido! ${emailToRemove}`, currentCardData.card_id, user.id);
    } catch (error) {
      console.error('Error deleting compartilhamento:', error);
    }
  };


  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      // Ajusta a posição de rolagem para o final do contêiner
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [email]);


  return (
    <div className='compartilhar-card-modal'>
      <div className='compartilhar-card-container'>
        <div className='compartilhar-card-footer'>
        <div className='header-update-card-container'>
          <label>Compartilhamento</label>
        </div>
          <button className="compartilhar-card-close-button" onClick={() => setOpenCloseCompartilharModal(false)}>X</button>
        </div>
        <div className="compartilhar-card-form-container">

          <div ref={containerRef} className='compartilhar-card-list-container'>


            {emails.map((item) => (
              <div className='compartilhar-item-container' key={item.id}>
                <div className='compartilhar-mensagem-container'>
                  <div className='user-logo-compartilhar-container'>
                    <img className='user-logo-compartilhar' src={Logo} alt={`${user && user.username}'s avatar`} />
                  </div>
                  <p className='compartilhar-description'>{item.email}</p>
                  <button className='btn-delete-compartilhamento' onClick={(event) => deleteCompartilhamento(event, item.id)}>X</button>
                </div>
              </div>
            ))}

          </div>

          <form className="compartilhar-card-form" >

            <input id="email" className="compartilhar-card-input" type="email" placeholder="Digite o Email" value={email} onChange={(e) => setEmail(e.target.value)} />


          </form>
          <div className='compartilhar-card-footer'>
            <button style={{ backgroundColor: !email.trim() ? '' : 'dodgerblue' }} disabled={!email.trim()} type="submit" className="compartilhar-card-button" onClick={(e) => {
              e.stopPropagation();
              handleCompartilhar(e);
            }} >
              Verificar Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compartilhar; 
