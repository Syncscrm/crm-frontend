import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import './style.css';
import Logo from '../../../assets/logo-suite-flow.ico';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fone, setFone] = useState('');
  const [segment, setSegment] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post(`${apiUrl}/users/create-user-and-company`, {
        username, password, email, fone, segment
      });
      navigate('/login');
    } catch (error) {
      setError('Erro ao criar usuário e empresa.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="logo-container">
          <img src={Logo} alt="SyncsCRM Logo" className="signup-logo" />
          <h3 className="logo-label">SyncsCRM</h3>
        </div>
        <form className="signup-form" onSubmit={handleCreateUser}>
          <input
            id="username"
            className="signup-input"
            type="text"
            placeholder="Nome Completo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id="email"
            className="signup-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            className="signup-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            id="confirmPassword"
            className="signup-input"
            type="password"
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            id="fone"
            className="signup-input"
            type="text"
            placeholder="Telefone"
            value={fone}
            onChange={(e) => setFone(e.target.value)}
          />
          <select
            id="segment"
            className="signup-input"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
          >
            <option value="" disabled>Selecione o Segmento</option>
            <option value="CRM">CRM</option>
            <option value="Tarefas">Tarefas</option>
            <option value="Suporte Técnico">Suporte Técnico</option>
            <option value="Gestão de Projetos">Gestão de Projetos</option>
            <option value="Vendas e Marketing">Vendas e Marketing</option>
          </select>

          {error && <div className="error-message">{error}</div>}
          <button className="signup-button" type="submit">Criar Conta</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
