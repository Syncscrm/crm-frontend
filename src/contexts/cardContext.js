import React, { createContext, useContext, useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../config/apiConfig';

import { useUser } from '../contexts/userContext';
import { useColumns } from '../contexts/columnsContext';



const CardContext = createContext();

export const useCard = () => useContext(CardContext);

export const CardProvider = ({ children }) => {

  const { user } = useUser();

  const { setLoadingResult, setLoadingModal, dataInicial, setDataInicial, dataFinal, setDataFinal } = useColumns();


  const [openCloseCreateCard, setOpenCloseCreateCard] = useState(false)
  const openModalCreateCard = () => setOpenCloseCreateCard(!openCloseCreateCard);
  const [listCardsFiltereds, setListCardsFiltereds] = useState([])
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
  const [openCloseAnexosModal, setOpenCloseAnexosModal] = useState(false)


  const [tarefas, setTarefas] = useState([]);

  const [currentCardIdMessage, setCurrentCardIdMessage] = useState(null)
  const [openCloseModalMessenger, setOpenCloseModalMessenger] = useState(false);

  const [listaEtiquetas, setListaEtiquetas] = useState([]);


  const [currentModuleCard, setCurrentModuleCard] = useState()




  const addHistoricoCardContext = async (currentHistoric, cardId, userId) => {

    if (!currentHistoric && currentHistoric == '')
      return;

    try {
      const payload = {
        card_id: cardId, // assuming idCard is available in the component's props
        user_id: userId, // from useUser context
        action_type: 'Update', // or any other type depending on the context
        description: currentHistoric,
        empresa_id: user.empresa_id
        //card_status: currentCardData.status // assuming cardData has a status field
      };
      const response = await axios.post(`${apiUrl}/card/add-history`, payload);

    } catch (error) {
      console.error('Error adding card history:', error);
    }
  };


  const buscarEtiquetas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/etiquetas/${user.empresa_id}`);
      setListaEtiquetas(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error('Erro ao buscar etiquetas:', error);
    }
  };




  useEffect(() => {
    if (!user)
      return
    buscarEtiquetas()
  }, [user])

  useEffect(() => {
    if(!user)
      return
    const today = new Date();
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // Final do dia de hoje
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    setDataInicial(lastYear.toISOString().split('T')[0]);
    setDataFinal(endOfToday.toISOString().split('T')[0]);
    fetchCards(lastYear.toISOString().split('T')[0], endOfToday.toISOString().split('T')[0])
  }, [user]);


  const fetchCards = async (dataInicial, dataFinal) => {
    //console.log('dataInicial', dataInicial)
    //console.log('dataFinal', dataFinal)

    try {
      setLoadingModal(true);
      setLoadingResult('Carregando...');
      const response = await axios.get(`${apiUrl}/card/find/${user.id}/${user.empresa_id}`, {
        params: {
          dataInicial,
          dataFinal,
        },
      });
      //console.log('Cards',response.data)
      setCards(response.data);
      setLoadingModal(false);
      setLoadingResult('');
      
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
      setLoadingResult('Erro ao Carregar Cards!');
    }
  };





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
    addHistoricoCardContext,
    currentCardIdMessage, setCurrentCardIdMessage,
    openCloseModalMessenger, setOpenCloseModalMessenger,
    openCloseAnexosModal, setOpenCloseAnexosModal,
    listaEtiquetas,
    fetchCards,
    currentModuleCard, setCurrentModuleCard,

  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};
