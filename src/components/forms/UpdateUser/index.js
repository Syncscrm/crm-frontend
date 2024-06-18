import React, { useEffect, useState, useRef } from 'react';

// STYLE
import './style.css';

// API
import { apiUrl } from '../../../config/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// ASSETS
import Logo from '../../../assets/logo-suite-flow.ico';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'


// COMPONENTS

function UpdateUser({ user: propUser }) {

  // CONTEXT API
  const { user, updateUser, openModalUpdateUser } = useUser(); // Acesso ao estado global do usuário
  const { columns } = useColumns();
  const { listaEtiquetas } = useCard();


  // ESTADOS LOCAL
  const [selectedColumnsContainer, setSelectedColumnsContainer] = useState(false);
  const [selectedAfilhadosContainer, setSelectedAfilhadosContainer] = useState(false);
  const [selectedColumnsPermissionsContainer, setSelectedColumnsPermissionsContainer] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(Logo);
  const [id, setUserId] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [fone, setFone] = useState('');
  const [metaUser, setMetaUser] = useState();
  const [metaGrupo, setMetaGrupo] = useState();
  const [entidade, setEntidade] = useState('');
  const [accessLevel, setAccessLevel] = useState(0);
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [error, setError] = useState('');
  const [afilhadosList, setAfilhadosList] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);


  // SET
  useEffect(() => {
    if (propUser && propUser.id) {
      setUserId(propUser.id);
      setAvatarPreview(propUser.avatar || Logo);
      setAvatar(propUser.avatar || Logo);
      setUsername(propUser.username);
      setEmail(propUser.email);
      setIsActive(propUser.is_active);
      setAddress(propUser.address);
      setState(propUser.state);
      setCity(propUser.city);
      setCep(propUser.cep);
      setFone(propUser.fone);
      setMetaUser(propUser.meta_user);
      setMetaGrupo(propUser.meta_grupo);
      setEntidade(propUser.entidade);
      setAccessLevel(propUser.access_level ? propUser.access_level : 0);
    }
  }, [propUser]);

  // BUSCAR COLUNAS ASSOCIADAS AO USUÁRIO
  const toggleColumnContainer = async () => {
    setSelectedColumnsContainer(!selectedColumnsContainer);
    if (!selectedColumnsContainer) {
      try {
        const response = await axios.get(`${apiUrl}/users/${id}/columns`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSelectedColumns(response.data); // Atualize o estado com as colunas recebidas
      } catch (error) {
        console.error('Erro ao buscar colunas:', error);
        setError('Falha ao carregar colunas.');
      }
    }
  };

  // ADICIONAR OU EXCLUIR COLUNAS ASSOCIADAS
  const handleColumnToggle = async (event, columnId) => {
    event.preventDefault();
    const isSelected = selectedColumns.includes(columnId);

    if (isSelected) {
      // Remover coluna
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
      await axios.delete(`${apiUrl}/users/${id}/columns/${columnId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

    } else {
      // Adicionar coluna
      setSelectedColumns([...selectedColumns, columnId]);
      await axios.post(`${apiUrl}/users/${id}/columns`, { columnId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    }
  };

  // BUSCAR TODOS OS USUÁRIOS DA EMPRESA
  // BUSCAR AFILHADOS ASSOCIADOS AO USUÁRIO ATUAL
  const toggleAfilhadosContainer = async () => {
    setSelectedAfilhadosContainer(!selectedAfilhadosContainer);
    if (!selectedAfilhadosContainer) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        };
        const allUsersResponse = await axios.get(`${apiUrl}/users/list-by-company?empresa_id=${user.empresa_id}`, config);
        const afilhadosResponse = await axios.get(`${apiUrl}/users/${id}/afilhados`, config);
        const afilhadosIds = new Set(afilhadosResponse.data.map(afilhado => afilhado.id));
        setAfilhadosList(allUsersResponse.data.map(user => ({
          id: user.id,
          name: user.username,
          isAfilhado: afilhadosIds.has(user.id)
        })));
      } catch (error) {
        console.error('Erro ao buscar usuários ou afilhados:', error);
        setAfilhadosList([]);
      }
    }
  };

  // ADICIONAR OU EXCLUIR AFILHADOS ASSOCIADOS
  const handleAfilhadosToggle = async (event, afilhadoId) => {
    event.preventDefault();
    const isSelected = afilhadosList.some(afilhado => afilhado.id === afilhadoId && afilhado.isAfilhado);
    try {
      if (isSelected) {
        await axios.delete(`${apiUrl}/users/${id}/afilhados/${afilhadoId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${apiUrl}/users/${id}/afilhados`, { afilhadoId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setAfilhadosList(afilhadosList.map(afilhado => afilhado.id === afilhadoId ? { ...afilhado, isAfilhado: !isSelected } : afilhado));
    } catch (error) {
      console.error('Erro ao atualizar afilhados:', error);
    }
  };

  // CARREGAR UM AVATAR
  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ATUALIZAR INFORMAÇÕES DO USUÁRIO
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const avatarBase64 = avatar instanceof File ? await convertToBase64(avatar) : avatar;
      const userData = {
        username,
        fone,
        avatar: avatarBase64,
        is_active: isActive,
        meta_user: metaUser,
        meta_grupo: metaGrupo,
        entidade: entidade,
        access_level: accessLevel,
        address,
        city,
        state,
        cep
      };
      const response = await axios.put(`${apiUrl}/users/${id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      updateUser(response.data);
      openModalUpdateUser();
      setError('');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError('Falha ao atualizar o usuário.');
    }
  };

  // CONVERTER IMAGEM EM DADOS
  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });




  const [accessibleColumns, setAccessibleColumns] = useState([]);
  const [editableColumns, setEditableColumns] = useState([]);



  const toggleEditableColumnsContainer = async () => {
    setSelectedColumnsPermissionsContainer(!selectedColumnsPermissionsContainer);
    if (!selectedColumnsPermissionsContainer) {
      try {
        const response = await axios.get(`${apiUrl}/users/${id}/permissions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEditableColumns(response.data); // Atualize o estado com as permissões recebidas

        console.log('Colunas Editaveis: ', response.data, 'User id:' , id)
      } catch (error) {
        console.error('Erro ao buscar permissões de edição:', error);
        setError('Falha ao carregar permissões.');
      }
    }
  };

  const handlePermissionToggle = async (event, columnId) => {
    event.preventDefault();
    const isSelected = editableColumns.some(col => col.columnId === columnId);

    if (isSelected) {
      // Remover permissão de edição
      setEditableColumns(editableColumns.filter(col => col.columnId !== columnId));
      await axios.delete(`${apiUrl}/users/${id}/permissions/${columnId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      //console.log(editableColumns)
    } else {
      // Adicionar permissão de edição
      setEditableColumns([...editableColumns, { columnId, canEdit: true }]);
      await axios.post(`${apiUrl}/users/${id}/permissions`, { columnId, canEdit: true, empresaId: user.empresa_id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      //console.log(editableColumns)
    }
  };


  return (


    <div className='update-user-container'>

      <div className="update-user-form-container">

        {error && <div className="error-message">{error}</div>}

        <div className="update-user-header">
          <img src={avatarPreview} alt="Preview" className="update-user-avatar" onClick={() => fileInputRef.current.click()} />
          <input ref={fileInputRef} id="avatar" type="file" onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
        </div>

        <form className="update-user-form">

          <label htmlFor="username" className='update-user-label-input'>Nome:</label>
          <input id="username" className="update-user-input" type="text" placeholder="Nome" value={username} onChange={(e) => setUsername(e.target.value)} />

          <label htmlFor="email" className='update-user-label-input'>Email:</label>
          <input id="email" className="update-user-input" type="text" placeholder="Email" value={email} style={{ color: 'red' }} />

          <label htmlFor="fone" className='update-user-label-input'>Fone:</label>
          <input id="fone" className="update-user-input" type="text" placeholder="Fone" value={fone} onChange={(e) => setFone(e.target.value)} />

          <label htmlFor="address" className='update-user-label-input'>Endereço:</label>
          <input id="address" className="update-user-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

          <label htmlFor="state" className='update-user-label-input'>Estado:</label>
          <input id="state" className="update-user-input" type="text" value={state} onChange={(e) => setState(e.target.value)} />

          <label htmlFor="city" className='update-user-label-input'>Cidade:</label>
          <input id="city" className="update-user-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} />

          <label htmlFor="cep" className='update-user-label-input'>CEP:</label>
          <input id="cep" className="update-user-input" type="text" value={cep} onChange={(e) => setCep(e.target.value)} />

          <label htmlFor="address" className='update-user-label-input'>Meta Individual:</label>
          <input id="address" className="update-user-input" type="text" value={metaUser} onChange={(e) => setMetaUser(e.target.value)} />

          <label htmlFor="state" className='update-user-label-input'>Meta do Grupo:</label>
          <input id="state" className="update-user-input" type="text" value={metaGrupo} onChange={(e) => setMetaGrupo(e.target.value)} />

          <label htmlFor="city" className='update-user-label-input'>Entidade</label>
          <input id="city" className="update-user-input" type="text" value={entidade} onChange={(e) => setEntidade(e.target.value)} />




          <label htmlFor="state" className='update-user-label-input'>Afilhados</label>
          <input readOnly id="address" className="update-user-input" placeholder='Selecione os afilhados' onClick={toggleAfilhadosContainer} />
          {selectedAfilhadosContainer && (
            <div className='select-columns-container'>
              {
                afilhadosList.map((afilhado) => (

                  <button
                    key={afilhado.id}
                    onClick={(event) => handleAfilhadosToggle(event, afilhado.id)}
                    className={`afilhado-item ${afilhado.isAfilhado ? 'selected' : ''}`}
                  >
                    {afilhado.name}
                  </button>
                ))
              }
            </div>
          )}

          <label htmlFor="state" className='update-user-label-input'>Colunas / Processos</label>
          <input readOnly id="address" className="update-user-input" placeholder='Selecione as colunas' onClick={toggleColumnContainer} />
          {selectedColumnsContainer && (
            <div className='select-columns-container'>
              {
                columns.map((column) => (
                  <button
                    key={column.id}
                    onClick={(event) => handleColumnToggle(event, column.id)}
                    className={`column-item ${selectedColumns.includes(column.id) ? 'selected' : ''}`}
                  >
                    {column.name}
                  </button>
                ))
              }
            </div>
          )}


          <label htmlFor="editableColumns" className='update-user-label-input'>Permissões de Edição</label>
          <input readOnly id="editableColumns" className="update-user-input" placeholder='Selecione as colunas para editar' onClick={toggleEditableColumnsContainer} />
          {selectedColumnsPermissionsContainer && (
            <div className='select-columns-container'>
              {
                columns.map((column) => (
                  <div key={column.id} className="column-item-container">
                    <button
                      onClick={(event) => handlePermissionToggle(event, column.id)}
                      className={`column-item ${editableColumns.some(col => col.columnId === column.id) ? 'selected' : ''}`}
                    >
                      {column.name}
                    </button>
                  </div>
                ))
              }
            </div>
          )}




          <label htmlFor="address" className='update-user-label-input'>Nível de Acesso:</label>

          <div className='btns-acess-nivel-container'>
            <div onClick={() => setAccessLevel(1)} className="btn-nivel-acess" style={{ background: accessLevel === 1 ? 'dodgerblue' : '#aaaaaa' }}>Nível 1</div>
            <div onClick={() => setAccessLevel(2)} className="btn-nivel-acess" style={{ background: accessLevel === 2 ? 'dodgerblue' : '#aaaaaa' }}>Nível 2</div>
            <div onClick={() => setAccessLevel(3)} className="btn-nivel-acess" style={{ background: accessLevel === 3 ? 'dodgerblue' : '#aaaaaa' }}>Nível 3</div>
            <div onClick={() => setAccessLevel(4)} className="btn-nivel-acess" style={{ background: accessLevel === 4 ? 'dodgerblue' : '#aaaaaa' }}>Nível 4</div>
            <div onClick={() => setAccessLevel(5)} className="btn-nivel-acess" style={{ background: accessLevel === 5 ? 'dodgerblue' : '#aaaaaa' }}>ADM</div>
          </div>

          <label htmlFor="address" className='update-user-label-input'>Status:</label>

          <div onClick={() => setIsActive(!isActive)} className="btn-is-active" style={{ background: isActive === true ? 'dodgerblue' : '#aaaaaa' }}>{isActive === true ? 'Ativo' : 'Inativo'}</div>

        </form>

        <div className="update-user-footer">
          <button onClick={openModalUpdateUser} className="update-user-close-button">Fechar</button>
          <button onClick={handleUpdateUser} className="update-user-update-button">Salvar Alterações</button>
        </div>

      </div>

    </div>

  );
}

export default UpdateUser;
