import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext';
import { useColumns } from '../../contexts/columnsContext';
import { format, parseISO } from 'date-fns';
import { MdOutlineArrowBackIos, MdSend, MdCheck } from "react-icons/md";
import PreviewCard from '../PreviewCard';
import './style.css';
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import { TbCheck, TbChecks } from "react-icons/tb";

import logo from '../../assets/logo-suite-flow.ico'


function Messenger({ closeModal }) {
  const { user, listAllUsers } = useUser();
  const { currentCardIdMessage, setCurrentCardIdMessage, openCloseModalMessenger } = useCard();
  const { columnsUser, columns } = useColumns();
  const [openCloseModalMessage, setOpenCloseModalMessage] = useState(false);
  const [destinatarioName, setDestinatarioName] = useState('');
  const [destinatarioAvatar, setDestinatarioAvatar] = useState(null);
  const [destinatarioId, setDestinatarioId] = useState(null);
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [loadingMessage, setLoadingMessage] = useState(false);


  function rolagemAutomatica() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const [currentListaCount, setCurrentListaCount] = useState(0);


  useEffect(() => {

    let lista = listMessages.length;

    if (currentListaCount != lista) {
      setCurrentListaCount(lista);
      rolagemAutomatica();

    }


  }, [listMessages]);













  useEffect(() => {
    if (currentCardIdMessage && destinatarioId) {
      const cardMessage = `card_id:${currentCardIdMessage}`;
      sendMessage(cardMessage);
    }
  }, [currentCardIdMessage, destinatarioId]);


  async function openMessage(item) {
    setListMessages([]);
    setDestinatarioName(item.username);
    setDestinatarioAvatar(item.avatar);
    setDestinatarioId(item.id);
    setOpenCloseModalMessage(true);
    await fetchMessages(item.id);
    await markMessagesAsRead(user.id, item.id); // Mover esta linha para o final de fetchMessages
  }


  const sendMessage = async (mensagem) => {
    if (mensagem.trim() === '') return;

    if (containsForbiddenWords(mensagem)) {
      alert('Sua mensagem contém palavras proibidas e não pode ser enviada.');
      return;
    }

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
    setLoadingMessage(true)
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
        setLoadingMessage(false)
        await markMessagesAsRead(user.id, destinoId);
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
      fetchMessages(destinatarioId);
      interval = setInterval(() => {
        fetchMessages(destinatarioId);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [destinatarioId]);



  // ---------------- mensagens não lidas -----------

  const markMessagesAsRead = async (userId, destinatarioId) => {
    //console.log('userId',userId,'destinatarioId',destinatarioId)
    // if (user.id === destinatarioId)
    // return
    if (openCloseModalMessage) {
      try {
        await axios.put(`${apiUrl}/card/mark-messages-as-read/${userId}/${destinatarioId}`);
      } catch (error) {
        console.error('Erro ao marcar mensagens como lidas', error);
      }
    }
  };


  const [userUnreadMessages, setUserUnreadMessages] = useState({});


  useEffect(() => {
    let intervalMessage;
    if (openCloseModalMessenger) {
      fetchUnreadMessagesForUsers();
      intervalMessage = setInterval(() => {
        fetchUnreadMessagesForUsers();
      }, 3000);
    }

    return () => clearInterval(intervalMessage);
  }, [openCloseModalMessenger]);



  const fetchUnreadMessagesForUsers = async () => {
    if (openCloseModalMessenger) {

      console.log('fetchUnreadMessagesForUsers')
      try {
        const responses = await Promise.all(
          listAllUsers.map(async (item) => {
            const response = await axios.get(`${apiUrl}/card/unread-messages-count/${user.id}/${item.id}`);
            return { userId: item.id, unreadCount: response.data };
          })
        );
        const unreadMessagesMap = {};
        responses.forEach(res => {
          unreadMessagesMap[res.userId] = res.unreadCount;
        });
        setUserUnreadMessages(unreadMessagesMap);
      } catch (error) {
        console.error('Erro ao buscar contagem de mensagens não lidas por usuário', error);
      }
    }
  };













  function getUserName(userId) {
    const user = listAllUsers.find(user => user.id === userId);
    return user ? user.username : 'Unknown';
  }

  async function closeMessageContainer() {
    setCurrentCardIdMessage(null);
    await markMessagesAsRead(user.id, destinatarioId);
    setListMessages([]);
    setOpenCloseModalMessage(false);
  }



  const sortedUsers = [...listAllUsers].sort((a, b) => {
    const unreadA = userUnreadMessages[a.id] || 0;
    const unreadB = userUnreadMessages[b.id] || 0;
    return unreadB - unreadA;
  });






  const forbiddenWords = [
    'merda', 'porra', 'caralho', 'filha da puta', 'foda-se', 'cu', 'arrombado',
    'desgraça', 'buceta', 'corno', 'viado', 'puta', 'babaca', 'bosta', 'cacete',
    'escroto', 'otário', 'piroca', 'pau no cu', 'safado', 'chupa', 'piranha',
    'arrombada', 'vagabunda', 'trouxa', 'infeliz', 'imbecil', 'burro',
    'ignorante', 'canalha', 'cuzão', 'bicha', 'sapatão', 'trouxa', 'meretriz',
    'nojento', 'moleque', 'vadia', 'escória', 'delinquente', 'debilóide',
    'pau no cu', 'cornudo', 'peido', 'imbecil', 'retardado', 'cretino',
    'mimado', 'bostinha', 'pilantra', 'miserável', 'fedido', 'pustema',
    'paspalho', 'palerma', 'panaca', 'pervertido', 'otária', 'peidorreiro',
    'boçal', 'bronco', 'estúpido', 'idiota', 'malcriado', 'desmiolado',
    'filho da mãe', 'desnaturado', 'desgraçado', 'demente', 'debilóide',
    'esquisito', 'feio', 'grosseiro', 'idiotinha', 'imbeciloide', 'insensato',
    'lerdo', 'mal educado', 'malandro', 'miserável', 'nojento', 'pentelho',
    'pistoleiro', 'preguiçoso', 'prostituta', 'puta que pariu', 'puta merda',
    'safado', 'safada', 'sem vergonha', 'tarado', 'tonto', 'trouxa', 'vagabundo',
    'vagabunda', 'vadio', 'velhaco', 'verme', 'xexelento', 'xereta', 'xoxo'
  ];
  
  function containsForbiddenWords(message) {
    return forbiddenWords.some(word => message.toLowerCase().includes(word));
  }
  

  return (
    <div className='messenger-container'>
      <div className='header-messenger'>
        <label>Messenger</label>
        <button onClick={clearIdCardMessage} className='close-messenger-modal'>X</button>
      </div>
      <div className='messenger-body'>
        {sortedUsers &&
          sortedUsers.map((item) => (
            <div key={item.id} className='item-list-messenger' onClick={() => { openMessage(item) }}>
              <div className='user-logo-messenger-container'>
                <img src={item.avatar ? item.avatar : logo} className='messenger-logo-user' alt={`${item.username}'s avatar`} />
              </div>
              <label className='messenger-username-label'>
                {item.username}
                {userUnreadMessages[item.id] > 0 && (
                  <span className="mensagens-nao-lidas">{userUnreadMessages[item.id]}</span>
                )}
              </label>
            </div>
          ))}
      </div>

      {user != null && openCloseModalMessage && (
        <div className='message-container'>
          <div className='message-header'>
            <MdOutlineArrowBackIos
              className='icons-back-message'
              onClick={() => {
                closeMessageContainer()
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


                {!item.cardData && !item.message.includes('card_id:') &&
                  <label style={{ backgroundColor: item.id_remetente === user.id ? 'rgb(78, 78, 78)' : 'white', color: item.id_remetente === user.id ? 'white' : 'rgb(78, 78, 78)' }} className='message-label'>
                    {item.message}
                  </label>
                }

                {!item.cardData && item.message.includes('card_id:') &&
                  <label style={{ backgroundColor: item.id_remetente === user.id ? 'rgb(78, 78, 78)' : 'white', color: item.id_remetente === user.id ? 'white' : 'rgb(78, 78, 78)' }} className='message-label'>
                    ⛔ Mensagem Bloqueada pelo ADM ⛔ 
                  </label>
                }


                {item.cardData &&
                  <label style={{ backgroundColor: item.id_remetente === user.id ? 'rgb(78, 78, 78)' : 'white', color: item.id_remetente === user.id ? 'white' : 'rgb(78, 78, 78)' }} className='message-label'>

                    <PreviewCard cardData={item.cardData} />

                  </label>


                }

                <label className='date-message-label'>
                  {getUserName(item.id_remetente)} - {formatDate(item.created_at)}
                  {item.read ? (
                    user.id === item.id_remetente && <TbChecks className='icone-check-message' />
                  ) : (
                    user.id === item.id_remetente && <TbCheck className='icone-check-message' />
                  )}
                </label>
              </div>
            ))}

            {loadingMessage &&
              <label style={{ display: 'none' }}>Carregando...</label>
            }

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
