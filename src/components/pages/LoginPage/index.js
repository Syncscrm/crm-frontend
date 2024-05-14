
import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo-suite-flow.ico';

import { useUser } from '../../../contexts/userContext'

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const { loginUser } = useUser();

  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loginResponse = await axios.post(`${apiUrl}/users/login`, { email, password });
      localStorage.setItem('token', loginResponse.data.access_token);
      navigate('/home');
      
      // Buscar informações do usuário
      const config = {
        headers: { Authorization: `Bearer ${loginResponse.data.access_token}` }
      };
      const userInfoResponse = await axios.get(`${apiUrl}/users/find-by-email?email=${encodeURIComponent(email)}`, config);

      loginUser(userInfoResponse.data);
  
    } catch (error) {
      setError('Falha no login. Verifique suas credenciais.');
      if (error.response) {
        // Você pode querer tratar erros específicos aqui
        console.log(error.response.data);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!validatePassword(password)) return;

    try {
      await axios.post(`${apiUrl}/users/create`, { username, email, password });
      setIsCreatingAccount(false);
      navigate('/home'); // Opcional: navegar para a tela de home ou login
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Email já está em uso.');
      } else {
        setError('Erro ao criar usuário.');
      }
    }
  };

  return (
    <div className="login-container">
      {isCreatingAccount ? (
        <div className="login-form-container">
          <div className="logo-container">
            <img style={{display: 'none'}}  src={Logo} alt="SyncsCRM Logo" className="login-logo" />
            <h3 className="logo-label">SyncsCRM</h3>
          </div>
          <form className="login-form" onSubmit={handleCreateUser}>
            <input
              id="username"
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              id="email"
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              className="login-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              id="confirmPassword"
              className="login-input"
              type="password"
              placeholder="Confirme a Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button className="login-button" type="submit">Criar Usuário</button>
          </form>
          <button className="login-button-new-account" onClick={() => { setIsCreatingAccount(false); setError('') } }>Já tenho uma conta!</button>
        </div>
      ) : (

        <div className="login-form-container">
          <div className="logo-container">
            <img style={{display: ''}} src={Logo} alt="SyncsCRM Logo" className="login-logo" />
            <h3 className="logo-label">SyncsCRM</h3>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {true && <div className="error-message">{error}</div>}
            <button className="login-button" type="submit">LOGIN</button>
          </form>
          <button style={{display: 'none'}} className="login-button-new-account" onClick={() => { setIsCreatingAccount(true); setError('') } }>Não tem uma conta? Inscrever-se</button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

