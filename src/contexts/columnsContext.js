import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './userContext';
import { apiUrl } from '../config/apiConfig';
import axios from 'axios';

const ColumnsContext = createContext();

export const useColumns = () => useContext(ColumnsContext);

export const ColumnsProvider = ({ children }) => {
  const { user } = useUser();
  
  const [columns, setColumns] = useState([]);
  const [openCloseCreateColumn, setOpenCloseCreateColumn] = useState(false);
  const [columnsUser, setColumnsUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingResult, setLoadingResult] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedAfilhados, setSelectedAfilhados] = useState([]);


  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);

  const [orderBy, setOrderBy] = useState(null);
  const [isAscending, setIsAscending] = useState(true);


  useEffect(() => {
    const fetchColumns = async () => {
      if (user && user.empresa_id) {
        const empresaId = user.empresa_id;

        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          };
          const response = await axios.get(`${apiUrl}/process-columns/by-company/${empresaId}`, config);

          if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            setColumns([response.data]);
          } else {
            setColumns(response.data);
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
      if (user && user.id) {
        setIsLoading(true);

        try {
          const response = await axios.get(`${apiUrl}/users/${user.id}/columns-info`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          setColumnsUser(response.data);
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
    openModalCreateColumn: () => setOpenCloseCreateColumn(!openCloseCreateColumn),
    columnsUser,
    isLoading,
    setColumnsUser,
    loadingResult,
    setLoadingResult,
    loadingModal,
    setLoadingModal,
    selectedAfilhados,
    setSelectedAfilhados,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
    orderBy, setOrderBy,
    isAscending, setIsAscending,
    
  };


  return (
    <ColumnsContext.Provider value={contextValue}>
      {children}
    </ColumnsContext.Provider>
  );
};
