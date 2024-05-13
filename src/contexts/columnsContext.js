import React, { createContext, useContext, useState, useEffect } from 'react';

import { useUser } from './userContext';

import { apiUrl } from '../config/apiConfig'
import axios from 'axios';

const ColumnsContext = createContext();

export const useColumns = () => useContext(ColumnsContext);

export const ColumnsProvider = ({ children }) => {

  const { user, } = useUser();
  // Aqui você pode adicionar estados e funções relevantes para manipular as colunas de processo
  const [columns, setColumns] = useState([]);


  // Funções para manipular as colunas podem ser adicionadas aqui

  const [openCloseCreateColumn, setOpenCloseCreateColumn] = useState(false)
  const openModalCreateColumn = () => setOpenCloseCreateColumn(!openCloseCreateColumn);

  const [columnsUser, setColumnsUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchColumns = async () => {
      if (user && user.empresa_id) {
        const empresaId = user.empresa_id;

        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          };
          const response = await axios.get(`${apiUrl}/process-columns/by-company/${empresaId}`, config);

          // Se o resultado é um objeto, coloque-o dentro de um array
          if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            setColumns([response.data]); // Colocando o objeto dentro de um array
          } else {
            setColumns(response.data); // Se já for um array, apenas defina como estado
          }
        } catch (error) {
          console.error('Erro ao buscar colunas:', error);
          setColumns([]);
        }
      }
    };

    fetchColumns();
  }, [user]);

  useEffect(() => {
    const fetchUserColumnsInfo = async () => {
      //console.log('Buscando colunas...')
      if (user && user.id) {
        setIsLoading(true);
  
        try {
          const response = await axios.get(`${apiUrl}/users/${user.id}/columns-info`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
  
          setColumnsUser(response.data);
          //console.log('Data: ', response.data)

        } catch (error) {
          console.error('Erro ao buscar informações das colunas do usuário:', error);
        }
  
        setIsLoading(false);
      }
    };
  
    fetchUserColumnsInfo();
  }, [user]);
  

  const contextValue = {
    columns,
    setColumns,
    openCloseCreateColumn,
    openModalCreateColumn,
    columnsUser, 
    isLoading,
    setColumnsUser
    // Incluir quaisquer outras funções ou estados relevantes
  };


  useEffect(() => {
    //console.log("Colunas carregadas:", columnsUser);
  }, [columnsUser]);

  return (
    <ColumnsContext.Provider value={contextValue}>
      {children}
    </ColumnsContext.Provider>
  );
};
