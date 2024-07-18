import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import Logo from '../../../assets/logo-suite-flow.ico';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="header-container-landing-page">
        <div className="header-logo-center-landing-page" onClick={() => navigate('/')}>
          <img src={Logo} alt="SyncsCRM Logo" className="header-logo-center-logo-landing-page" />
          <label className="header-logo-center-label-landing-page">SyncsCRM</label>
        </div>
        <div className="header-menu-right-landing-page">
          <button className="button" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>
      <main className="landing-main">
        <section className="intro-section">
          <h1>Bem-vindo ao SyncsCRM</h1>
          <p>Transforme a gestão do seu negócio com uma ferramenta completa e intuitiva. SyncsCRM integra funcionalidades de CRM, PCP e dashboard para otimizar a gestão e a produção da sua empresa.</p>
        </section>
        <section className="video-section">
          <iframe 
            width="100%" 
            height="500px" 
            src="https://www.youtube.com/embed/lncZzc9f1gY" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </section>
        <section className="features">
          <h2>Principais Funcionalidades</h2>
          <div className="cards">
            <div className="card">
              <h3>Gestão de Vendas</h3>
              <p>Gerencie suas vendas e clientes de forma integrada, com comunicação eficiente e acompanhamento em tempo real.</p>
            </div>
            <div className="card">
              <h3>Gestão de Processos</h3>
              <p>Garanta eficiência e organização em todos os processos do seu negócio</p>
            </div>
            <div className="card">
              <h3>Dashboards</h3>
              <p>Dashboards em tempo real para tomar decisões informadas e estratégicas</p>
            </div>
          </div>
        </section>
        <section className="benefits">
          <h2>Benefícios do SyncsCRM</h2>
          <div className="cards">
            <div className="card benefit-card">
              <h3>Organização</h3>
              <p>Integração completa de processos e dados</p>
            </div>
            <div className="card benefit-card">
              <h3>Produtividade</h3>
              <p>Ferramentas para aumentar a eficiência operacional</p>
            </div>
            <div className="card benefit-card">
              <h3>Tomada de Decisão</h3>
              <p>Dados em tempo real para decisões informadas</p>
            </div>
            <div className="card benefit-card">
              <h3>Experiência de Usuário</h3>
              <p>Interface intuitiva e fácil de usar</p>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <h2>Pronto para transformar seu negócio?</h2>
          <p>Experimente o SyncsCRM e veja como podemos ajudar sua empresa a crescer.</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>Cadastre-se agora</button>
        </section>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2024 SyncsCRM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
