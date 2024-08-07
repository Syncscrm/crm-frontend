import React, { useState, useRef } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

// NAVIGATE
import { useNavigate } from 'react-router-dom';

// STYLE
import './style.css';

// ASSETS
import Logo from '../../../assets/logo-suite-flow.ico';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';

function CreateUser() {

  // CONTEXT API
  const { openModalCreateUser,user } = useUser();

  // ESTADOS LOCAL
  const [userEmail, setUserEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(Logo);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [fone, setFone] = useState('');
  const [metaUser, setMetaUser] = useState('');
  const [metaGrupo, setMetaGrupo] = useState('');
  const [entity, setEntity] = useState('');
  const [listProcess, setListProcess] = useState('');
  const [listEditProcess, setListEditProcess] = useState('');
  const [listGodchildren, setListGodchildren] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // CARREGAR AVATAR
  const handleAvatarChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > 100 * 1024) {
        setError('O arquivo deve ser menor que 100 KB.');
        return;
      } else {
        setError('');
      }
      setAvatar(file);

      const base64 = await convertToBase64(file);
      setAvatarPreview(base64); // Atualiza o preview do avatar
    }
  };

  const alterarAvatar = () => {
    // Aciona o input de arquivo
    fileInputRef.current.click();
  };

  // Função para converter o arquivo em Base64 (opcional)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      setError('A senha deve conter pelo menos 8 caracteres.');
      return false;
    }
    if (!password.match(/[a-z]/g) || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g)) {
      setError('A senha deve conter letras maiúsculas, minúsculas e números.');
      return false;
    }
    return true;
  };



  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreatingAccount(true);
    setError('');
  
    let avatarBase64 = null;
    if (avatar) {
      avatarBase64 = await convertToBase64(avatar);
    }
  
    const userData = {
      userEmail,
      username,
      email,
      password,
      address,
      state,
      city,
      cep,
      fone,
      avatar: avatarBase64,
      empresa_id: user.empresa_id // Inclua empresa_id aqui
    };
  
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsCreatingAccount(false);
      return;
    }
  
    if (!validatePassword(password)) {
      setIsCreatingAccount(false);
      return;
    }
  
    try {
      await axios.post(`${apiUrl}/users/create`, userData);
      openModalCreateUser();
    } catch (error) {
      setIsCreatingAccount(false);
      if (error.response && error.response.status === 409) {
        setError('Email já está em uso.');
      } else {
        setError('Erro ao criar usuário.');
      }
    }
  };
  

  // const handleCreateUser = async (e) => {
  //   e.preventDefault();
  //   setIsCreatingAccount(true);
  //   setError('');

  //   let avatarBase64 = null;
  //   if (avatar) {
  //     avatarBase64 = await convertToBase64(avatar);
  //   }

  //   const userData = {
  //     userEmail,
  //     username,
  //     email,
  //     password,
  //     address,
  //     state,
  //     city,
  //     cep,
  //     fone,
  //     avatar: avatarBase64,
  //   };

  //   if (password !== confirmPassword) {
  //     setError('As senhas não coincidem.');
  //     setIsCreatingAccount(false);
  //     return;
  //   }

  //   if (!validatePassword(password)) {
  //     setIsCreatingAccount(false);
  //     return;
  //   }

  //   try {
  //     await axios.post(`${apiUrl}/users/create`, { userEmail, username, email, password, address, state, city, cep, fone, metaUser, metaGrupo, entity, avatar: avatarBase64 });
  //     openModalCreateUser();
  //   } catch (error) {
  //     setIsCreatingAccount(false);
  //     if (error.response && error.response.status === 409) {
  //       setError('Email já está em uso.');
  //     } else {
  //       setError('Erro ao criar usuário.');
  //     }
  //   }
  // };

  return (
    <div className='create-user-container'>
      <div className="create-user-form-container">
        <div className="create-user-logo-container">
          <img src={avatarPreview} alt="Avatar ou Logo" className="login-logo" />
          <label className='edit-avatar-user-icon' onClick={alterarAvatar}>Alterar a logo</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: 'none' }} // Esconde o input de arquivo
            accept="image/*" // Aceita apenas imagens
          />
        </div>
        <form className="create-user-form" onSubmit={handleCreateUser}>
          {/* Atualizei cada campo de entrada para usar o estado apropriado. */}
          <label htmlFor="address" className='create-user-label-input'>Nome:</label>
          <input id="username" className="create-user-input" type="text" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Email:</label>
          <input id="email" className="create-user-input" type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Senha:</label>
          <input id="password" className="create-user-input" type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Confirme a Senha:</label>
          <input id="confirmPassword" className="create-user-input" type="password" placeholder="" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Endereço:</label>
          <input id="address" className="create-user-input" type="text" placeholder="" value={address} onChange={(e) => setAddress(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Estado:</label>
          <input id="state" className="create-user-input" type="text" placeholder="" value={state} onChange={(e) => setState(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Cidade:</label>
          <input id="city" className="create-user-input" type="text" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>CEP:</label>
          <input id="cep" className="create-user-input" type="text" placeholder="" value={cep} onChange={(e) => setCep(e.target.value)} />
          <label htmlFor="address" className='create-user-label-input'>Fone:</label>
          <input id="fone" className="create-user-input" type="text" placeholder="" value={fone} onChange={(e) => setFone(e.target.value)} />
        </form>
      </div>
      {error && <div className="create-user-error-message">{error}</div>}

      <div className='create-user-footer'>
        <button className="create-user-close-button" onClick={openModalCreateUser}>Cancelar</button>
        <button type="submit" className="create-user-button" onClick={handleCreateUser} disabled={isCreatingAccount}>Criar Usuário</button>
      </div>
    </div>
  );
}

export default CreateUser;
