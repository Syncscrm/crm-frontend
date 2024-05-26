import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext';
import { useColumns } from '../../contexts/columnsContext';
import { format, parseISO } from 'date-fns';
import { MdOutlineArrowBackIos, MdSend } from "react-icons/md";
import PreviewCard from '../PreviewCard';
import './style.css';
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

function Messenger({ closeModal }) {
  const { user, listAllUsers } = useUser();
  const { currentCardIdMessage, setCurrentCardIdMessage } = useCard();
  const { columnsUser, columns } = useColumns();
  const [openCloseModalMessage, setOpenCloseModalMessage] = useState(false);
  const [destinatarioName, setDestinatarioName] = useState('');
  const [destinatarioAvatar, setDestinatarioAvatar] = useState(null);
  const [destinatarioId, setDestinatarioId] = useState(null);
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [listMessages, openCloseModalMessage]);

  useEffect(() => {
    if (currentCardIdMessage && destinatarioId) {
      const cardMessage = `card_id:${currentCardIdMessage}`;
      sendMessage(cardMessage);
    }
  }, [currentCardIdMessage, destinatarioId]);

  async function openMessage(item) {
    setDestinatarioName(item.username);
    setDestinatarioAvatar(item.avatar);
    setDestinatarioId(item.id);
    setOpenCloseModalMessage(true);
    await fetchMessages(item.id);
  }

  const sendMessage = async (mensagem) => {
    if (mensagem.trim() === '') return;
  
    const isCardMessage = mensagem.includes('card_id:');
    let cardData = null;
  
    if (isCardMessage) {
      const cardId = mensagem.split('card_id:')[1].trim();
      cardData = await fetchCardById(cardId);
    }
  
    // Atualização otimista da interface do usuário
    const tempMessage = {
      id: `temp-${new Date().getTime()}`,
      message: mensagem,
      id_remetente: user.id,
      id_destinatario: destinatarioId,
      created_at: new Date().toISOString(),
      read: false,
      cardData: isCardMessage ? cardData : null,
    };
    setListMessages(prev => [...prev, tempMessage]);
    setMessage('');

    try {
      const dados = {
        id_remetente: user.id,
        id_destinatario: destinatarioId,
        message: mensagem,
        read: false,
        card_id: isCardMessage ? cardData.card_id : null,
      };
  
      const response = await axios.post(`${apiUrl}/card/add-messenger`, dados);
  
      // Atualiza a mensagem otimista com os dados reais do servidor
      setListMessages(prev => prev.map(msg => msg.id === tempMessage.id ? {
        ...msg,
        id: response.data.id,
        created_at: response.data.created_at,
      } : msg));
  
      setCurrentCardIdMessage(null);
  
    } catch (error) {
      console.error('Erro', error);
      // Remove a mensagem otimista em caso de erro
      setListMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      sendMessage(message);
    }
  }

  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm:ss');
  }

  const fetchMessages = async (destinoId) => {
    if (destinoId) {
      try {
        const response = await axios.get(`${apiUrl}/card/fetch-messages/${user.id}/${destinoId}`);
        const messagesWithCards = await Promise.all(
          response.data.map(async (msg) => {
            if (msg.message.includes('card_id:')) {
              const cardId = msg.message.split('card_id:')[1].trim();
              const cardData = await fetchCardById(cardId);
              return { ...msg, cardData };
            }
            return msg;
          })
        );
        setListMessages(messagesWithCards);
      } catch (error) {
        console.error('Erro', error);
      }
    }
  };

  const fetchCardById = async (cardId) => {
    try {
      const response = await axios.get(`${apiUrl}/card/search-card-id`, {
        params: {
          card_id: cardId,
          entityId: user.id,
          empresaId: user.empresa_id,
        },
      });
      return response.data[0];
    } catch (error) {
      console.error('Erro ao buscar card:', error);
    }
  };

  const clearIdCardMessage = () => {
    setCurrentCardIdMessage(null);
    closeModal();
  };

  useEffect(() => {
    let interval;
    if (destinatarioId) {
      interval = setInterval(() => {
        fetchMessages(destinatarioId);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [destinatarioId]);

  return (
    <div className='messenger-container'>
      <div className='header-messenger'>
        <label>Messenger</label>
        <button onClick={clearIdCardMessage} className='close-messenger-modal'>X</button>
      </div>
      <div className='messenger-body'>
        {listAllUsers &&
          listAllUsers.map((item) => (
            <div key={item.id} className='item-list-messenger' onClick={() => openMessage(item)}>
              <div className='user-logo-messenger-container'>
                <img src={item.avatar} className='messenger-logo-user' alt={`${item.username}'s avatar`} />
              </div>
              <label className='messenger-username-label'>{item.username}</label>
            </div>
          ))}
      </div>

      {user != null && openCloseModalMessage && (
        <div className='message-container'>
          <div className='message-header'>
            <MdOutlineArrowBackIos
              className='icons-back-message'
              onClick={() => {
                setOpenCloseModalMessage(false);
                setListMessages([]);
              }}
            />
            <div className='user-logo-message-container'>
              <img src={destinatarioAvatar} className='message-logo-user' alt={`${destinatarioName}'s avatar`} />
            </div>
            <label className='messenger-username-label'>{destinatarioName}</label>
          </div>
          <div className='message-body'>
            {listMessages.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: item.id_remetente === user.id ? 'flex-end' : 'flex-start' }} className='item-list-message'>
                {!item.cardData &&
                  <label style={{ backgroundColor: item.id_remetente === user.id ? 'deepskyblue' : '' }} className='message-label'>
                    {item.message}
                  </label>
                }

                {item.cardData && <PreviewCard cardData={item.cardData} />}
                <label className='date-message-label'>{formatDate(item.created_at)}</label>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className='message-footer'>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className='message-input'
              placeholder='Mensagem'
            />
            <MdSend className='icon-send-message' onClick={() => sendMessage(message)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Messenger;
