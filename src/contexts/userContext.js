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

  const [userAvatar, setUserAvatar] = useState(null);

  const [listAllUsers, setListAllUsers] = useState([]); // Estado para armazenar todos os usuários

  const [theme, setTheme] = useState({
    primaryColor: '#3e3e42',
    secondaryColor: '#007acc',
    backgroundColor: '#1e1e1e',
    textColor: 'white'
  });


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

  const [openCloseModalAvatar, setOpenCloseModalAvatar] = useState(false)

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


  const [editableColumns, setEditableColumns] = useState([]);

  const toggleEditableColumnsContainer = async () => {

    try {
      const response = await axios.get(`${apiUrl}/users/${user.id}/permissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditableColumns(response.data); // Atualize o estado com as permissões recebidas

      console.log('context user', response.data)
    } catch (error) {
      console.error('Erro ao buscar permissões de edição:', error);
      
    }
  }


  useEffect(() => {
    if (user) {
      getAfilhados();
      toggleEditableColumnsContainer();
    }
  }, [user])




  const getAccessLevel = (tipo) => {

    if (user.access_level == 1) {
      if (tipo == 'editar') return false;
      if (tipo == 'historico') return false;
      if (tipo == 'tarefas') return true;
      if (tipo == 'compartilhar') return false;
      if (tipo == 'producao') return false;
      if (tipo == 'anexos') return false;
      if (tipo == 'valor') return false;
      if (tipo == 'contato') return false;
      if (tipo == 'coluna') return false;
      if (tipo == 'etiqueta') return false;
      if (tipo == 'estrelas') return false;
      if (tipo == 'status') return false;
      if (tipo == 'dashboard') return false;
      if (tipo == 'adm') return false;
      if (tipo == 'etapaProducao') return false;
      if (tipo == 'excluir') return false;
      if (tipo == 'exportExcel') return false;
    }

    if (user.access_level == 2) {
      if (tipo == 'editar') return false;
      if (tipo == 'historico') return false;
      if (tipo == 'tarefas') return true;
      if (tipo == 'compartilhar') return false;
      if (tipo == 'producao') return false;
      if (tipo == 'anexos') return false;
      if (tipo == 'valor') return false;
      if (tipo == 'contato') return false;
      if (tipo == 'coluna') return true;
      if (tipo == 'etiqueta') return false;
      if (tipo == 'estrelas') return false;
      if (tipo == 'status') return false;
      if (tipo == 'dashboard') return false;
      if (tipo == 'adm') return false;
      if (tipo == 'etapaProducao') return false;
      if (tipo == 'excluir') return false;
      if (tipo == 'exportExcel') return false;
    }

    if (user.access_level == 3) {
      if (tipo == 'editar') return true;
      if (tipo == 'historico') return true;
      if (tipo == 'tarefas') return true;
      if (tipo == 'compartilhar') return true;
      if (tipo == 'producao') return true;
      if (tipo == 'anexos') return true;
      if (tipo == 'valor') return false;
      if (tipo == 'contato') return true;
      if (tipo == 'coluna') return true;
      if (tipo == 'etiqueta') return true;
      if (tipo == 'estrelas') return false;
      if (tipo == 'status') return true;
      if (tipo == 'dashboard') return false;
      if (tipo == 'adm') return false;
      if (tipo == 'etapaProducao') return true;
      if (tipo == 'excluir') return false;
      if (tipo == 'exportExcel') return false;
    }

    if (user.access_level == 4) {
      if (tipo == 'editar') return true;
      if (tipo == 'historico') return true;
      if (tipo == 'tarefas') return true;
      if (tipo == 'compartilhar') return true;
      if (tipo == 'producao') return true;
      if (tipo == 'anexos') return true;
      if (tipo == 'valor') return true;
      if (tipo == 'contato') return true;
      if (tipo == 'coluna') return true;
      if (tipo == 'etiqueta') return true;
      if (tipo == 'estrelas') return true;
      if (tipo == 'status') return true;
      if (tipo == 'dashboard') return true;
      if (tipo == 'adm') return false;
      if (tipo == 'etapaProducao') return false;
      if (tipo == 'excluir') return false;
      if (tipo == 'exportExcel') return false;
    }

    if (user.access_level == 5) {
      if (tipo == 'editar') return true;
      if (tipo == 'historico') return true;
      if (tipo == 'tarefas') return true;
      if (tipo == 'compartilhar') return true;
      if (tipo == 'producao') return true;
      if (tipo == 'anexos') return true;
      if (tipo == 'valor') return true;
      if (tipo == 'contato') return true;
      if (tipo == 'coluna') return true;
      if (tipo == 'etiqueta') return true;
      if (tipo == 'estrelas') return true;
      if (tipo == 'status') return true;
      if (tipo == 'dashboard') return true;
      if (tipo == 'adm') return true;
      if (tipo == 'etapaProducao') return true;
      if (tipo == 'excluir') return true;
      if (tipo == 'exportExcel') return true;
    }

    return false;
  };


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
    openCloseImportExcelSuiteFlow, setOpenCloseImportExcelSuiteFlow,
    theme, setTheme,
    editableColumns,
    getAccessLevel,
    openCloseModalAvatar, setOpenCloseModalAvatar,
    userAvatar, setUserAvatar
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
