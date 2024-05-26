import React, { useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';

// STYLE
import './style.css';

// CONTEXT API
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext'

function ModuloEsquadrias({ idCard }) {

  // CONTEXT API
  const { user } = useUser();
  const { columnsUser } = useColumns();
  const { setOpenCloseModuloEsquadriasModal, setCards, addHistoricoCardContext } = useCard();

  // ESTADOS LOCAL
  const [nomeObra, setNomeObra] = useState('');
  const [contatoObra, setContatoObra] = useState('');

  const [previsaoMedicao, setPrevisaoMedicao] = useState(null);
  const [statusMedicao, setStatusMedicao] = useState('Parado');
  const [previsaoProducao, setPrevisaoProducao] = useState(null);
  const [statusProducao, setStatusProducao] = useState('Parado');
  const [previsaoEntregaVidro, setPrevisaoEntregaVidro] = useState(null);
  const [statusEntregaVidro, setStatusEntregaVidro] = useState('Parado');
  const [previsaoVistoriaPre, setPrevisaoVistoriaPre] = useState(null);
  const [statusVistoriaPre, setStatusVistoriaPre] = useState('Parado');
  const [previsaoEntregaObra, setPrevisaoEntregaObra] = useState(null);
  const [statusEntregaObra, setStatusEntregaObra] = useState('Parado');
  const [previsaoInstalacao, setPrevisaoInstalacao] = useState(null);
  const [statusInstalacao, setIstatusInstalacao] = useState('Parado');
  const [previsaoVistoriaPos, setPrevisaoVistoriaPos] = useState(null);
  const [statusVistoriaPos, setStatusVistoriaPos] = useState('Parado');
  const [previsaoAssistencia, setPrevisaoAssistencia] = useState(null);
  const [statusAssistencia, setStatusAssistencia] = useState('Parado');

  const [horasProducao, setHorasProducao] = useState(0);
  const [quantidadeEsquadrias, setQuantidadeEsquadrias] = useState(0);
  const [quantidadeQuadros, setQuantidadeQuadros] = useState(0);
  const [metrosQuadrados, setMetrosQuadrados] = useState(0);

  const [cor, setCor] = useState('');


  const handleSaveEsquadrias = async (e) => {
    e.preventDefault();

    const esquadriaData = {
      card_id: idCard,
      nome_obra: nomeObra,
      contato_obra: contatoObra,
      previsao_medicao: previsaoMedicao,
      status_medicao: statusMedicao,
      previsao_producao: previsaoProducao,
      status_producao: statusProducao,
      previsao_entrega_vidro: previsaoEntregaVidro,
      status_entrega_vidro: statusEntregaVidro,
      previsao_vistoria_pre: previsaoVistoriaPre,
      status_vistoria_pre: statusVistoriaPre,
      previsao_entrega_obra: previsaoEntregaObra,
      status_entrega_obra: statusEntregaObra,
      previsao_instalacao: previsaoInstalacao,
      status_instalacao: statusInstalacao,
      previsao_vistoria_pos: previsaoVistoriaPos,
      status_vistoria_pos: statusVistoriaPos,
      previsao_assistencia: previsaoAssistencia,
      status_assistencia: statusAssistencia,
      horas_producao: horasProducao,
      quantidade_esquadrias: quantidadeEsquadrias,
      quantidade_quadros: quantidadeQuadros,
      metros_quadrados: metrosQuadrados,
      cor: cor,
    };

    try {
      const response = await axios.post(`${apiUrl}/card/upsert`, esquadriaData);
      if (response.data) {
        // Atualiza o card no estado global

        setCards((prevCards) => prevCards.map(card => {
          if (card.card_id === idCard) {
            return { ...card, nome_obra: response.data[0].nome_obra };
          }
          return card;
        }));

        // Supondo que você tem uma função para fechar o modal
        setOpenCloseModuloEsquadriasModal(false);
        alert('Dados salvos com sucesso!');
      }

      addHistoricoCardContext(`Atualização de informações no Módulo de Esquadrias! `, idCard, user.id)

    } catch (error) {
      console.error('Erro ao salvar as informações do módulo de esquadrias:', error);
      alert('Erro ao salvar as informações. Por favor, tente novamente.');
    }
  };

  const [esquadriasData, setEsquadriasData] = useState(null);

  useEffect(() => {
    if (!esquadriasData)
      return;

    // Função para converter o formato da data
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Retorna a data no formato 'YYYY-MM-DD'
    };


    setNomeObra(esquadriasData.nome_obra);
    setContatoObra(esquadriasData.contato_obra);
    setPrevisaoMedicao(formatDate(esquadriasData.previsao_medicao));
    setStatusMedicao(esquadriasData.status_medicao);
    setPrevisaoProducao(formatDate(esquadriasData.previsao_producao));
    setStatusProducao(esquadriasData.status_producao);
    setPrevisaoEntregaVidro(formatDate(esquadriasData.previsao_entrega_vidro));
    setStatusEntregaVidro(esquadriasData.status_entrega_vidro);
    setPrevisaoVistoriaPre(formatDate(esquadriasData.previsao_vistoria_pre));
    setStatusVistoriaPre(esquadriasData.status_vistoria_pre);
    setPrevisaoEntregaObra(formatDate(esquadriasData.previsao_entrega_obra));
    setStatusEntregaObra(esquadriasData.status_entrega_obra);
    setPrevisaoInstalacao(formatDate(esquadriasData.previsao_instalacao));
    setIstatusInstalacao(esquadriasData.status_instalacao);
    setPrevisaoVistoriaPos(formatDate(esquadriasData.previsao_vistoria_pos));
    setStatusVistoriaPos(esquadriasData.status_vistoria_pos);
    setPrevisaoAssistencia(formatDate(esquadriasData.previsao_assistencia));
    setStatusAssistencia(esquadriasData.status_assistencia);
    setHorasProducao(esquadriasData.horas_producao);
    setQuantidadeEsquadrias(esquadriasData.quantidade_esquadrias);
    setQuantidadeQuadros(esquadriasData.quantidade_quadros);
    setMetrosQuadrados(esquadriasData.metros_quadrados);
    setCor(esquadriasData.cor ? esquadriasData.cor : "");
  }, [esquadriasData]);


  useEffect(() => {
    const fetchEsquadriasData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/card/${idCard}/esquadrias`);
        setEsquadriasData(response.data[0]);
       // console.log(response.data[0]);
      } catch (error) {
        console.error('Erro ao buscar as informações do módulo de esquadrias:', error);
      }
    };

    fetchEsquadriasData();
  }, [idCard]);



  return (
    <div className='modulo-esquadrias-modal'>
      <div className='modulo-esquadrias-container'>
        <div className='header-update-card-container'>
          <label>Módulo de Produção</label>
        </div>
        <div className="modulo-esquadrias-form-container">
          <form className="modulo-esquadrias-form">

            <label htmlFor="nomeObra" className='modulo-esquadrias-label-input'>Nome da Obra:</label>
            <input id="nomeObra" className="modulo-esquadrias-input" type="text" name="nomeObra" value={nomeObra} onChange={(e) => setNomeObra(e.target.value)} />

            <label htmlFor="contatoObra" className='modulo-esquadrias-label-input'>Contato da Obra:</label>
            <input id="contatoObra" className="modulo-esquadrias-input" type="tel" name="contatoObra" value={contatoObra} onChange={(e) => setContatoObra(e.target.value)} />

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoMedicao" className='modulo-esquadrias-label-input'>Previsão de Medição:</label>
                <input id="previsaoMedicao" className="modulo-esquadrias-input" type="date" name="previsaoMedicao" value={previsaoMedicao} onChange={(e) => setPrevisaoMedicao(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusMedicao" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusMedicao" className="modulo-esquadrias-input" name="statusMedicao" value={statusMedicao} onChange={(e) => setStatusMedicao(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoProducao" className='modulo-esquadrias-label-input'>Previsão de Produção:</label>
                <input id="previsaoProducao" className="modulo-esquadrias-input" type="date" name="previsaoProducao" value={previsaoProducao} onChange={(e) => setPrevisaoProducao(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusProducao" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusProducao" className="modulo-esquadrias-input" name="statusProducao" value={statusProducao} onChange={(e) => setStatusProducao(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoEntregaVidro" className='modulo-esquadrias-label-input'>Previsão de Entrega de Vidros:</label>
                <input id="previsaoEntregaVidro" className="modulo-esquadrias-input" type="date" name="previsaoEntregaVidro" value={previsaoEntregaVidro} onChange={(e) => setPrevisaoEntregaVidro(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusEntregaVidro" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusEntregaVidro" className="modulo-esquadrias-input" name="statusEntregaVidro" value={statusEntregaVidro} onChange={(e) => setStatusEntregaVidro(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoVistoriaPre" className='modulo-esquadrias-label-input'>Previsão de Vistoria Pré:</label>
                <input id="previsaoVistoriaPre" className="modulo-esquadrias-input" type="date" name="previsaoVistoriaPre" value={previsaoVistoriaPre} onChange={(e) => setPrevisaoVistoriaPre(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusVistoriaPre" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusVistoriaPre" className="modulo-esquadrias-input" name="statusVistoriaPre" value={statusVistoriaPre} onChange={(e) => setStatusVistoriaPre(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoEntregaObra" className='modulo-esquadrias-label-input'>Previsão de Entrega de Obra:</label>
                <input id="previsaoEntregaObra" className="modulo-esquadrias-input" type="date" name="previsaoEntregaObra" value={previsaoEntregaObra} onChange={(e) => setPrevisaoEntregaObra(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusEntregaObra" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusEntregaObra" className="modulo-esquadrias-input" name="statusEntregaObra" value={statusEntregaObra} onChange={(e) => setStatusEntregaObra(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoInstalacao" className='modulo-esquadrias-label-input'>Previsão de Instalação:</label>
                <input id="previsaoInstalacao" className="modulo-esquadrias-input" type="date" name="previsaoInstalacao" value={previsaoInstalacao} onChange={(e) => setPrevisaoInstalacao(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusInstalacao" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusInstalacao" className="modulo-esquadrias-input" name="statusInstalacao" value={statusInstalacao} onChange={(e) => setIstatusInstalacao(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoVistoriaPos" className='modulo-esquadrias-label-input'>Previsão de Vistoria Pós:</label>
                <input id="previsaoVistoriaPos" className="modulo-esquadrias-input" type="date" name="previsaoVistoriaPos" value={previsaoVistoriaPos} onChange={(e) => setPrevisaoVistoriaPos(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusVistoriaPos" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusVistoriaPos" className="modulo-esquadrias-input" name="statusVistoriaPos" value={statusVistoriaPos} onChange={(e) => setStatusVistoriaPos(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>

            <div className='module-esquadrias-row-container'>
              <div className='module-esquadrias-column'>
                <label htmlFor="previsaoAssistencia" className='modulo-esquadrias-label-input'>Previsão de Assistência:</label>
                <input id="previsaoAssistencia" className="modulo-esquadrias-input" type="date" name="previsaoAssistencia" value={previsaoAssistencia} onChange={(e) => setPrevisaoAssistencia(e.target.value)} />
              </div>
              <div className='module-esquadrias-column'>
                <label htmlFor="statusAssistencia" className='modulo-esquadrias-label-input'>Status:</label>
                <select id="statusAssistencia" className="modulo-esquadrias-input" name="statusAssistencia" value={statusAssistencia} onChange={(e) => setStatusAssistencia(e.target.value)}>
                  <option value="Parado">Parado</option>
                  <option value="EmAndamento">Em Andamento</option>
                  <option value="Pronto">Pronto</option>
                </select>
              </div>
            </div>


            <label htmlFor="address" className='modulo-esquadrias-label-input'>Total em Horas necessárias para Produção:</label>
            <input id="username" className="modulo-esquadrias-input" type="text" placeholder="" value={horasProducao} onChange={(e) => setHorasProducao(e.target.value)} />

            <label htmlFor="address" className='modulo-esquadrias-label-input'>Quantidade de Esquadrias:</label>
            <input id="username" className="modulo-esquadrias-input" type="text" placeholder="" value={quantidadeEsquadrias} onChange={(e) => setQuantidadeEsquadrias(e.target.value)} />

            <label htmlFor="address" className='modulo-esquadrias-label-input'>Quantidade de Quadros:</label>
            <input id="username" className="modulo-esquadrias-input" type="text" placeholder="" value={quantidadeQuadros} onChange={(e) => setQuantidadeQuadros(e.target.value)} />

            <label htmlFor="address" className='modulo-esquadrias-label-input'>Quantidade de Metros Quadrados:</label>
            <input id="username" className="modulo-esquadrias-input" type="text" placeholder="" value={metrosQuadrados} onChange={(e) => setMetrosQuadrados(e.target.value)} />

          </form>
        </div>

        <div className='update-card-footer'>
          <button className="update-card-close-button" onClick={(e) => { setOpenCloseModuloEsquadriasModal(false) }}>Cancelar</button>
          <button type="submit" className="update-card-button" onClick={(e) => handleSaveEsquadrias(e)}>Salvar</button>
        </div>
      </div>
    </div>

  );
}

export default ModuloEsquadrias; 
