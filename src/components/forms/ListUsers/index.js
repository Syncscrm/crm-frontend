import React, { useEffect, useState } from 'react';
import axios from 'axios';

// STYLE
import './style.css';

// API
import { apiUrl } from '../../../config/apiConfig';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';

// ASSETS
import Logo from '../../../assets/logo-suite-flow.ico'

// COMPONENTS
import UpdateUser from '../UpdateUser';

const ListUsers = () => {

  // CONTEXT API
  const { user } = useUser();

  // ESTADOS LOCAL
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const { openCloseUpdateUser, openModalUpdateUser } = useUser();

  // BUSCAR USUÁRIOS POR empresa_id
  useEffect(() => {
    const fetchUsers = async () => {
      setFilteredUsers(users);
      if (user && user.empresa_id) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          };
          const response = await axios.get(`${apiUrl}/users/list-by-company?empresa_id=${user.empresa_id}`, config);
          setUsers(response.data);
          setFilteredUsers(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          setUsers([]);
        }
      }
    };

    fetchUsers();
  }, [user]);

  // ABRIR MODAL COM INFORMAÇÕES DE UM USUÁRIO
  function updateUser(user) {
    setSelectedUser(user);
    openModalUpdateUser();
  }

  // ORDENAR POR username OU state OU is_active
  const orderUsersBy = (key) => {
    setOrderBy(key);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (key === 'username') {
        return a[key].localeCompare(b[key]);
      } else if (key === 'state') {
        return a[key].localeCompare(b[key]);
      } else if (key === 'is_active') {
        return (a[key] === b[key]) ? 0 : a[key] ? -1 : 1;
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  // FILTRAR POR username
  useEffect(() => {
    const filterUsers = (term) => {
      if (term === '') {
        setFilteredUsers(users);
      } else {
        const updatedList = users.filter(user =>
          user.username.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(updatedList);
      }
    };
    filterUsers(searchTerm);
  }, [searchTerm]);

  return (
    <div className='list-users-container-modal'>
      {users.length > 0 ? (
        <div className='list-users-container'>
          <div className='search-user-container'>
            <input
              className='search-user-input'
              placeholder="Buscar usuário pelo nome..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <label className='label-order-by-users'>Ordenar por:</label>
            <button className='btn-order-by-users' onClick={() => orderUsersBy('username')} style={{ backgroundColor: orderBy === 'username' ? 'dodgerblue' : '#aaaaaa' }}>Nome</button>
            <button className='btn-order-by-users' onClick={() => orderUsersBy('is_active')} style={{ backgroundColor: orderBy === 'is_active' ? 'dodgerblue' : '#aaaaaa' }}>Ativos</button>
            <button className='btn-order-by-users' onClick={() => orderUsersBy('state')} style={{ backgroundColor: orderBy === 'state' ? 'dodgerblue' : '#aaaaaa' }}>Estado</button>
          </div>
          <div className='list-user-form-container'>
            {filteredUsers.map((user) => (
              <li key={user.id} className='item-list-users' onClick={() => updateUser(user)}>
                <div className='list-user-logo-container'>
                  <img className='list-users-logo' src={user.avatar ? user.avatar : Logo} alt={`${user.username}'s avatar`} style={{ height: 50 }} />
                </div>
                <label className='list-user-label-username'>{user.username} - {user.state}</label>
                <div className='list-user-logo-container'>
                  <label className='label-is-active' style={{ background: user.is_active === true ? '#8EC045' : '#aaaaaa' }}>{user.is_active == true ? 'Ativo' : 'Inativo'}</label>
                </div>
              </li>
            ))}
          </div>

        </div>
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}

      {openCloseUpdateUser && (
        <UpdateUser user={selectedUser} />
      )}

    </div>
  );
};

export default ListUsers;
