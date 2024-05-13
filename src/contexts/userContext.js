import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config/apiConfig';
import axios from 'axios';
import { useProcessColumns } from './columnsContext'

// Criação do contexto
const UserContext = createContext();

// Hook personalizado para facilitar o acesso ao contexto
export const useUser = () => useContext(UserContext);

// Provedor do contexto que gerencia o estado do usuário e as operações de login e logout
export const UserProvider = ({ children }) => {


  const [user, setUser] = useState(null);

  const [listAllUsers, setListAllUsers] = useState([]); // Estado para armazenar todos os usuários

  const fetchUsersByCompany = async () => {
    if (user && user.empresa_id) {
      try {
        const response = await axios.get(`${apiUrl}/users/list-by-company`, {
          params: { empresa_id: user.empresa_id }
        });
        setListAllUsers(response.data);
        //console.log('lista de users?', response.data)
      } catch (error) {
        console.error('Erro ao buscar usuários da empresa:', error);
        setListAllUsers([]);
      }
    }
  };

  useEffect(() => {
    fetchUsersByCompany();
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(current => ({
      ...current,
      ...updates
    }));
  };

  const [openCloseUpdateUser, setOpenCloseUpdateUser] = useState(false)
  const openModalUpdateUser = () => setOpenCloseUpdateUser(!openCloseUpdateUser);

  const [openCloseCreateUser, setOpenCloseCreateUser] = useState(false)
  const openModalCreateUser = () => setOpenCloseCreateUser(!openCloseCreateUser);

  const [openCloseImportExcelEntidades, setOpenCloseImportExcelEntidades] = useState(false)
  const [openCloseImportExcelSuiteFlow, setOpenCloseImportExcelSuiteFlow] = useState(false)


  
  const clearUserContext = () => {
    setUser(null);
  };

  const [afilhadosList, setAfilhadosList] = useState([]);

  const getAfilhados = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };
      const afilhadosResponse = await axios.get(`${apiUrl}/users/${user.id}/afilhados`, config);
      setAfilhadosList(afilhadosResponse.data);
    } catch (error) {
      console.error('Erro ao buscar usuários ou afilhados:', error);
      setAfilhadosList([]);
    }
  }

  useEffect(() => {
    if(user){
      getAfilhados();
    }
  },[user])


  const contextValue = {
    user,
    loginUser,
    logoutUser,
    updateUser,
    openCloseUpdateUser,
    openModalUpdateUser,
    openCloseCreateUser,
    openModalCreateUser,
    clearUserContext,
    afilhadosList,
    listAllUsers,
    openCloseImportExcelEntidades, setOpenCloseImportExcelEntidades,
    openCloseImportExcelSuiteFlow, setOpenCloseImportExcelSuiteFlow
  };

  useEffect(() => {
    //console.log(user)
  }, [user])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
