import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Logo from '../../../assets/logo-suite-flow.ico';
import screenshot1 from '../../../assets/carrossel/DASHBOARD.jpg';
import screenshot2 from '../../../assets/carrossel/AFILHADOS.jpg';
import screenshot3 from '../../../assets/carrossel/MESSENGER.jpg';
import screenshot4 from '../../../assets/carrossel/PCP.jpg';
import screenshot5 from '../../../assets/carrossel/TAREFAS2.jpg';
import screenshot6 from '../../../assets/carrossel/GERAL.jpg';
import screenshot7 from '../../../assets/carrossel/PIPELINE.jpg';
import screenshot8 from '../../../assets/carrossel/CARD.jpg';
import screenshot9 from '../../../assets/carrossel/BUSCA.jpg';
import screenshot10 from '../../../assets/carrossel/TAREFAS.jpg';

const images = [
  screenshot1, screenshot2, screenshot3, screenshot4, screenshot5,
  screenshot6, screenshot7, screenshot8, screenshot9, screenshot10
];

function LandingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      <header className="header-container-landing-page">
        <div className="header-logo-center-landing-page" onClick={() => navigate('/')}>
          <img style={{display: 'none'}} src={Logo} alt="SyncsCRM Logo" className="header-logo-center-logo-landing-page" />
          <label className="header-logo-center-label-landing-page">SyncsCRM</label>
        </div>
        <div className="header-menu-right-landing-page">
          <button className="button" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>
      <main className="landing-main">
        <section className="intro-section">
          <h1>Bem-vindo ao SyncsCRM</h1>
          <p>Transforme a gestão do seu negócio com uma ferramenta completa e intuitiva voltada para o setor de esquadrias. SyncsCRM integra funcionalidades de CRM, PCP e dashboard para otimizar a gestão e a produção da sua empresa.</p>
        </section>
        <section className="video-section">
          <iframe 
            width="100%" 
            height="500px" 
            src="https://www.youtube.com/embed/lncZzc9f1gY" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </section>
        <section className="features">
          <h2>Principais Funcionalidades</h2>
          <div className="cards">
            <div className="card">
              <h3>Gestão de Vendas</h3>
              <p>Gerencie suas vendas e clientes de forma simples, com comunicação eficiente e acompanhamento em tempo real.</p>
            </div>
            <div className="card">
              <h3>Gestão de Processos</h3>
              <p>Acompanhe todo o processo desde a negociação até a produção.</p>
            </div>
            <div className="card">
              <h3>Dashboards</h3>
              <p>Dados importantes em tempo real para tomar decisões.</p>
            </div>
            <div className="card">
              <h3>Messenger</h3>
              <p>Comunicação interna dedicada.</p>
            </div>
          </div>
        </section>


      

        <section className="benefits">
          <h2>Principais Ferramentas Integradas</h2>
          <div className="cards">
            <div className="card benefit-card">
              <h3>Módulo de Esquadrias</h3>
              <p>Armazene informações importantes dedicadas à fabricação de esquadrias.</p>
            </div>
            <div className="card benefit-card">
              <h3>Tarefas</h3>
              <p>Crie tarefas para todas as suas atividades direto nos cards.</p>
            </div>
            <div className="card benefit-card">
              <h3>Sino de Vendas</h3>
              <p>Receba notificações em tempo real a cada venda da sua equipe.</p>
            </div>
            <div className="card benefit-card">
              <h3>Histórico</h3>
              <p>Acompanhe tudo, desde a prospecção até o pós-venda.</p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="carousel">
            {images.map((image, index) => (
              <div
                key={index}
                className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                style={{ display: index === currentIndex ? 'block' : 'none' }}
              >
                <img src={image} alt={`Screenshot ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="benefits">
          <h2>Benefícios do SyncsCRM</h2>
          <div className="cards">
            <div className="card benefit-card">
              <h3>Organização</h3>
              <p>Integração completa de processos e dados para uma gestão eficiente.</p>
            </div>
            <div className="card benefit-card">
              <h3>Produtividade</h3>
              <p>Ferramentas para aumentar a eficiência operacional.</p>
            </div>
            <div className="card benefit-card">
              <h3>Tomada de Decisão</h3>
              <p>Dados em tempo real para decisões informadas.</p>
            </div>
            <div className="card benefit-card">
              <h3>Experiência de Usuário</h3>
              <p>Interface intuitiva e fácil de usar.</p>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <h2>Pronto para transformar seu negócio?</h2>
          <p>Experimente o SyncsCRM e veja como podemos ajudar sua empresa a crescer, especialmente no setor de esquadrias.</p>
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
