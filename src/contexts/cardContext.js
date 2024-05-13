import React, { createContext, useContext, useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../config/apiConfig';

const CardContext = createContext();

export const useCard = () => useContext(CardContext);

export const CardProvider = ({ children }) => {

  const [openCloseCreateCard, setOpenCloseCreateCard] = useState(false)
  const openModalCreateCard = () => setOpenCloseCreateCard(!openCloseCreateCard);
  const [ listCardsFiltereds, setListCardsFiltereds ] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [openCloseUpdateUserModal, setOpenCloseUpdateUserModal] = useState(false)
  const [currentCardData, setCurrentCardData] = useState()

  const [openCloseUpdateCard, setOpenCloseUpdateCard] = useState(false)

  const [cards, setCards] = useState([]);

  const [previewSearchCards, setPreviewSearchCards] = useState([]);

  const [listNotifications, setListNotifications] = useState([]);

  const [openCloseHistoricModal, setOpenCloseHistoricModal] = useState(false)
  const [openCloseTarefasModal, setOpenCloseTarefasModal] = useState(false)
  const [openCloseCompartilharModal, setOpenCloseCompartilharModal] = useState(false)
  const [openCloseModuloEsquadriasModal, setOpenCloseModuloEsquadriasModal] = useState(false)


  const [tarefas, setTarefas] = useState([]);

  const addHistoricoCardContext = async (currentHistoric, cardId, userId) => {

    if (!currentHistoric && currentHistoric == '')
      return;

    try {
      const payload = {
        card_id: cardId, // assuming idCard is available in the component's props
        user_id: userId, // from useUser context
        action_type: 'Update', // or any other type depending on the context
        description: currentHistoric,
        //card_status: currentCardData.status // assuming cardData has a status field
      };
      const response = await axios.post(`${apiUrl}/card/add-history`, payload);

    } catch (error) {
      console.error('Error adding card history:', error);
    }
  };




  useEffect(() => {
   // console.log(listCardsFiltereds)
  }, [listCardsFiltereds])

  const contextValue = {
    openCloseCreateCard,
    openModalCreateCard,
    listCardsFiltereds, setListCardsFiltereds,
    searchTerm, setSearchTerm,
    currentCardData, setCurrentCardData,
    openCloseUpdateCard, setOpenCloseUpdateCard,
    cards, setCards,
    previewSearchCards, setPreviewSearchCards,
    listNotifications, setListNotifications,
    openCloseHistoricModal, setOpenCloseHistoricModal,
    openCloseTarefasModal, setOpenCloseTarefasModal,
    openCloseCompartilharModal, setOpenCloseCompartilharModal,
    tarefas, setTarefas,
    openCloseModuloEsquadriasModal, setOpenCloseModuloEsquadriasModal,
    addHistoricoCardContext
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};
