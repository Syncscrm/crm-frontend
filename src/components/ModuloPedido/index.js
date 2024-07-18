import React, { useState, useEffect } from 'react';

// API
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';
import './style.css';

import { useUser } from '../../contexts/userContext'

const PedidoPedido = ({ cardData, onClose }) => {

  const { user, listAllUsers, getAccessLevel } = useUser();

  const [numeroPedido, setNumeroPedido] = useState('');
  const [statusPedido, setStatusPedido] = useState('Parado');
  const [dataStatus, setDataStatus] = useState(null);
  const [nomeObra, setNomeObra] = useState('');
  const [representante, setRepresentante] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [nomeContato, setNomeContato] = useState('');
  const [emailNotaFiscal, setEmailNotaFiscal] = useState('');
  const [representanteLegalNome, setRepresentanteLegalNome] = useState('');
  const [representanteLegalEmail, setRepresentanteLegalEmail] = useState('');
  const [representanteLegalCpf, setRepresentanteLegalCpf] = useState('');
  const [enderecoCobrancaResponsavel, setEnderecoCobrancaResponsavel] = useState('');
  const [enderecoCobrancaTelefone, setEnderecoCobrancaTelefone] = useState('');
  const [enderecoCobrancaEmail, setEnderecoCobrancaEmail] = useState('');
  const [enderecoCobrancaLogradouro, setEnderecoCobrancaLogradouro] = useState('');
  const [enderecoCobrancaNumero, setEnderecoCobrancaNumero] = useState('');
  const [enderecoCobrancaComplemento, setEnderecoCobrancaComplemento] = useState('');
  const [enderecoCobrancaBairro, setEnderecoCobrancaBairro] = useState('');
  const [enderecoCobrancaCidade, setEnderecoCobrancaCidade] = useState('');
  const [enderecoCobrancaUf, setEnderecoCobrancaUf] = useState('');
  const [enderecoCobrancaCep, setEnderecoCobrancaCep] = useState('');
  const [enderecoCobrancaCondominio, setEnderecoCobrancaCondominio] = useState('');
  const [enderecoEntregaLogradouro, setEnderecoEntregaLogradouro] = useState('');
  const [enderecoEntregaNumero, setEnderecoEntregaNumero] = useState('');
  const [enderecoEntregaComplemento, setEnderecoEntregaComplemento] = useState('');
  const [enderecoEntregaBairro, setEnderecoEntregaBairro] = useState('');
  const [enderecoEntregaCidade, setEnderecoEntregaCidade] = useState('');
  const [enderecoEntregaUf, setEnderecoEntregaUf] = useState('');
  const [enderecoEntregaCep, setEnderecoEntregaCep] = useState('');
  const [enderecoEntregaCondominio, setEnderecoEntregaCondominio] = useState('');
  const [gestorObraNome, setGestorObraNome] = useState('');
  const [gestorObraTelefone, setGestorObraTelefone] = useState('');
  const [gestorObraEmail, setGestorObraEmail] = useState('');
  const [condicoesPagamento, setCondicoesPagamento] = useState('');
  const [condicoesPagamentoTerceiro, setCondicoesPagamentoTerceiro] = useState('');
  const [previsaoMedicao, setPrevisaoMedicao] = useState(null);
  const [previsaoEntrega, setPrevisaoEntrega] = useState(null);
  const [observacoes, setObservacoes] = useState('');

  const [valorInstalacao, setValorInstalacao] = useState(0);
  const [valorFrete, setValorFrete] = useState(0);
  const [valorAbatimentoShowroom, setValorAbatimentoShowroom] = useState(0);

  const [valorFreteEsquadrias, setValorFreteEsquadrias] = useState(0);
  const [valorProjeto, setValorProjeto] = useState(0);
  const [valorVidrosSeparados, setValorVidrosSeparados] = useState(0);

  const [valorExternasEsquadrias, setValorExternasEsquadrias] = useState(cardData.cost_value || 0);
  const [descontoExternas, setDescontoExternas] = useState(0);
  const [valorFinalExternas, setValorFinalExternas] = useState(0);

  const [valorOutrosEsquadrias, setValorOutrosEsquadrias] = useState(0);
  const [descontoOutros, setDescontoOutros] = useState(0);
  const [valorFinalOutros, setValorFinalOutros] = useState(0);

  const [valorInstalacaoPVC, setValorInstalacaoPVC] = useState(0);

  const [estados, setEstados] = useState([]);
  const [cidadesCobranca, setCidadesCobranca] = useState([]);
  const [cidadesEntrega, setCidadesEntrega] = useState([]);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        setEstados(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
      });
  }, []);

  useEffect(() => {
    const fetchPedidoData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/pedido/${cardData.card_id}`);
        if (response.data) {

          const pedido = response.data;
          setNumeroPedido(pedido.numero_pedido);
          setStatusPedido(pedido.status_pedido || pedido.status_pedido !== '' ? pedido.status_pedido : 'Parado');
          setDataStatus(formatDate(pedido.data_status));
          setNomeObra(pedido.nome_obra && pedido.nome_obra !== '' ? pedido.nome_obra : cardData.name);
          setRepresentante(pedido.representante ? pedido.representante : (cardData.entity_id ? cardData.entity_id : ''));
          setNomeCliente(pedido.nome_cliente);
          setCpfCnpj(pedido.cpf_cnpj);
          setTelefoneCliente(pedido.telefone_cliente);
          setNomeContato(pedido.nome_contato);
          setEmailNotaFiscal(pedido.email_nota_fiscal);
          setRepresentanteLegalNome(pedido.representante_legal_nome);
          setRepresentanteLegalEmail(pedido.representante_legal_email);
          setRepresentanteLegalCpf(pedido.representante_legal_cpf);
          setEnderecoCobrancaResponsavel(pedido.endereco_cobranca_responsavel);
          setEnderecoCobrancaTelefone(pedido.endereco_cobranca_telefone);
          setEnderecoCobrancaEmail(pedido.endereco_cobranca_email);
          setEnderecoCobrancaLogradouro(pedido.endereco_cobranca_logradouro);
          setEnderecoCobrancaNumero(pedido.endereco_cobranca_numero);
          setEnderecoCobrancaComplemento(pedido.endereco_cobranca_complemento);
          setEnderecoCobrancaBairro(pedido.endereco_cobranca_bairro);
          setEnderecoCobrancaCidade(pedido.endereco_cobranca_cidade);
          setEnderecoCobrancaUf(pedido.endereco_cobranca_uf);
          setEnderecoCobrancaCep(pedido.endereco_cobranca_cep);
          setEnderecoCobrancaCondominio(pedido.endereco_cobranca_condominio);
          setEnderecoEntregaLogradouro(pedido.endereco_entrega_logradouro);
          setEnderecoEntregaNumero(pedido.endereco_entrega_numero);
          setEnderecoEntregaComplemento(pedido.endereco_entrega_complemento);
          setEnderecoEntregaBairro(pedido.endereco_entrega_bairro);
          setEnderecoEntregaCidade(pedido.endereco_entrega_cidade);
          setEnderecoEntregaUf(pedido.endereco_entrega_uf);
          setEnderecoEntregaCep(pedido.endereco_entrega_cep);
          setEnderecoEntregaCondominio(pedido.endereco_entrega_condominio);
          setGestorObraNome(pedido.gestor_obra_nome);
          setGestorObraTelefone(pedido.gestor_obra_telefone);
          setGestorObraEmail(pedido.gestor_obra_email);
          setCondicoesPagamento(pedido.condicoes_pagamento);
          setCondicoesPagamentoTerceiro(pedido.condicoes_pagamento_terceiro);
          setPrevisaoMedicao(pedido.previsao_medicao ? formatDate(pedido.previsao_medicao) : null);
          setPrevisaoEntrega(pedido.previsao_entrega ? formatDate(pedido.previsao_entrega) : null);
          setObservacoes(pedido.observacoes);
          setValorInstalacao(pedido.valor_instalacao || 0);
          setValorFrete(pedido.valor_frete || 0);
          setValorAbatimentoShowroom(pedido.valor_abatimento_showroom || 0);
          setValorInstalacaoPVC(pedido.valor_instalacao_pvc || 0);
          setValorFreteEsquadrias(pedido.valor_frete_esquadrias || 0);
          setValorProjeto(pedido.valor_projeto || 0);
          setValorVidrosSeparados(pedido.valor_vidros_separados || 0);
          setValorExternasEsquadrias(pedido.valor_externas_esquadrias || 0);
          setDescontoExternas(pedido.desconto_externas || 0);
          setValorOutrosEsquadrias(pedido.valor_outros_esquadrias || 0);
          setDescontoOutros(pedido.desconto_outros || 0);

        }

        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar as informações do pedido:', error);
      }
    };

    fetchPedidoData();
  }, [cardData]);

  const handleSavePedido = async (e) => {
    e.preventDefault();



    if (statusPedido !== 'Parado') {
      alert(statusPedido);

      alert('Solicite ao ADM alterar o status do pedido para Parado!');
      return
    }

    if (cardData.status !== 'Vendido') {
      alert('Necessário alterar o Status para Vendido!');
      return
    }

    const pedidoData = {
      card_id: cardData.card_id,
      numero_pedido: numeroPedido,
      status_pedido: statusPedido === 'Parado' && user.access_level !== 5 ? 'Em Andamento' : statusPedido,
      data_status: dataStatus,
      nome_obra: nomeObra,
      representante: representante ? representante : cardData.entity_id,
      nome_cliente: nomeCliente,
      cpf_cnpj: cpfCnpj,
      telefone_cliente: telefoneCliente,
      nome_contato: nomeContato,
      email_nota_fiscal: emailNotaFiscal,
      representante_legal_nome: representanteLegalNome,
      representante_legal_email: representanteLegalEmail,
      representante_legal_cpf: representanteLegalCpf,
      endereco_cobranca_responsavel: enderecoCobrancaResponsavel,
      endereco_cobranca_telefone: enderecoCobrancaTelefone,
      endereco_cobranca_email: enderecoCobrancaEmail,
      endereco_cobranca_logradouro: enderecoCobrancaLogradouro,
      endereco_cobranca_numero: enderecoCobrancaNumero,
      endereco_cobranca_complemento: enderecoCobrancaComplemento,
      endereco_cobranca_bairro: enderecoCobrancaBairro,
      endereco_cobranca_cidade: enderecoCobrancaCidade,
      endereco_cobranca_uf: enderecoCobrancaUf,
      endereco_cobranca_cep: enderecoCobrancaCep,
      endereco_cobranca_condominio: enderecoCobrancaCondominio,
      endereco_entrega_logradouro: enderecoEntregaLogradouro,
      endereco_entrega_numero: enderecoEntregaNumero,
      endereco_entrega_complemento: enderecoEntregaComplemento,
      endereco_entrega_bairro: enderecoEntregaBairro,
      endereco_entrega_cidade: enderecoEntregaCidade,
      endereco_entrega_uf: enderecoEntregaUf,
      endereco_entrega_cep: enderecoEntregaCep,
      endereco_entrega_condominio: enderecoEntregaCondominio,
      gestor_obra_nome: gestorObraNome,
      gestor_obra_telefone: gestorObraTelefone,
      gestor_obra_email: gestorObraEmail,
      condicoes_pagamento: condicoesPagamento,
      condicoes_pagamento_terceiro: condicoesPagamentoTerceiro,
      previsao_medicao: previsaoMedicao,
      previsao_entrega: previsaoEntrega,
      observacoes: observacoes,
      empresa_id: user.empresa_id,

      valor_instalacao: valorInstalacao,
      valor_frete: valorFrete,
      valor_abatimento_showroom: valorAbatimentoShowroom,

      valor_instalacao_pvc: valorInstalacaoPVC,
      valor_frete_esquadrias: valorFreteEsquadrias,
      valor_projeto: valorProjeto,
      valor_vidros_separados: valorVidrosSeparados,

      valor_externas_esquadrias: valorExternasEsquadrias,
      desconto_externas: descontoExternas,
      valor_outros_esquadrias: valorOutrosEsquadrias,
      desconto_outros: descontoOutros,

    };

    try {
      const response = await axios.post(`${apiUrl}/users/upsert-pedido`, pedidoData);
      if (response.data) {
        alert('Pedido salvo com sucesso!');
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar o pedido:', error);
      alert('Erro ao salvar o pedido. Por favor, tente novamente.');
    }
  };

  const handleEstadoChange = (e, tipo) => {
    const { value } = e.target;
    if (tipo === 'cobranca') {
      setEnderecoCobrancaUf(value);
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`)
        .then(response => {
          setCidadesCobranca(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
        });
    } else {
      setEnderecoEntregaUf(value);
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`)
        .then(response => {
          setCidadesEntrega(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
        });
    }
  };

  const getUsernameById = (entityId) => {

    let convertEntityId = parseInt(entityId)
    if (!user) {
      return 'Erro: Dados necessários não estão disponíveis.';
    }

    const entidade = listAllUsers.find(afilhado => afilhado.id === convertEntityId);
    if (entidade && entidade.username) {
      return entidade.username;
    }

    if (convertEntityId === user.id) {
      return user.username;
    }

    return 'id não encontrado';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Retorna a data no formato 'YYYY-MM-DD'
  };

  const calculateTotalProdutos = () => {
    return (
      parseFloat(valorFinalExternas || 0) +
      parseFloat(valorFinalOutros || 0)
    );
  };

  const calculateTotalServicos = () => {
    return (
      parseFloat(valorInstalacao || 0) +
      parseFloat(valorFrete || 0) +
      parseFloat(valorAbatimentoShowroom || 0)
    );
  };

  const calculateTotalTerceiros = () => {
    return (
      parseFloat(valorInstalacaoPVC || 0) +
      parseFloat(valorFreteEsquadrias || 0) +
      parseFloat(valorProjeto || 0) +
      parseFloat(valorVidrosSeparados || 0)
    );
  };

  useEffect(() => {
    setValorFinalExternas((parseFloat(valorExternasEsquadrias) - (parseFloat(valorExternasEsquadrias) * parseFloat(descontoExternas) / 100)).toFixed(2));
  }, [valorExternasEsquadrias, descontoExternas]);

  useEffect(() => {
    setValorFinalOutros((parseFloat(valorOutrosEsquadrias) - (parseFloat(valorOutrosEsquadrias) * parseFloat(descontoOutros) / 100)).toFixed(2));
  }, [valorOutrosEsquadrias, descontoOutros]);

  const formatCurrency = (value) => {
    // Converte o valor para número se estiver em formato string
    const numericValue = parseFloat(value);
    // Retorna o valor formatado como moeda brasileira
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };



  return (

    <div className='modal-pedidos'>

      <div className="pedido-form-container" onClick={(e) => e.stopPropagation()}>

        <button className="close-button" onClick={onClose}>X</button>

        <form className="pedido-form" onSubmit={handleSavePedido}>
          <h3>Informações do Pedido</h3>
          <label>Número do Pedido</label>
          <input type="text" name="numero_pedido" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} />
          <label>Status do Pedido - {dataStatus ? dataStatus : ''}</label>
          <select disabled={!getAccessLevel('editePedido')} name="status_pedido" value={statusPedido} onChange={(e) => setStatusPedido(e.target.value)}>
            <option value="Parado">Parado</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Pronto">Pronto</option>
          </select>
          <label>Nome da Obra</label>
          <input type="text" name="nome_obra" value={nomeObra} onChange={(e) => setNomeObra(e.target.value)} />
          <label>Representante</label>
          <input type="int" name="representante" value={getUsernameById(representante)} onChange={(e) => setRepresentante(e.target.value)} />

          <h3>Dados do Faturamento</h3>
          <label>Nome do Cliente</label>
          <input type="text" name="nome_cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
          <label>CPF/CNPJ</label>
          <input type="text" name="cpf_cnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
          <label>Telefone</label>
          <input type="text" name="telefone_cliente" value={telefoneCliente} onChange={(e) => setTelefoneCliente(e.target.value)} />
          <label>Nome para Contato</label>
          <input type="text" name="nome_contato" value={nomeContato} onChange={(e) => setNomeContato(e.target.value)} />
          <label>Email para Nota Fiscal</label>
          <input type="email" name="email_nota_fiscal" value={emailNotaFiscal} onChange={(e) => setEmailNotaFiscal(e.target.value)} />

          <h3>Dados do Representante Legal</h3>
          <label>Nome</label>
          <input type="text" name="representante_legal_nome" value={representanteLegalNome} onChange={(e) => setRepresentanteLegalNome(e.target.value)} />
          <label>Email</label>
          <input type="email" name="representante_legal_email" value={representanteLegalEmail} onChange={(e) => setRepresentanteLegalEmail(e.target.value)} />
          <label>CPF</label>
          <input type="text" name="representante_legal_cpf" value={representanteLegalCpf} onChange={(e) => setRepresentanteLegalCpf(e.target.value)} />

          <h3>Endereço de Cobrança</h3>
          <label>Responsável</label>
          <input type="text" name="endereco_cobranca_responsavel" value={enderecoCobrancaResponsavel} onChange={(e) => setEnderecoCobrancaResponsavel(e.target.value)} />
          <label>Telefone</label>
          <input type="text" name="endereco_cobranca_telefone" value={enderecoCobrancaTelefone} onChange={(e) => setEnderecoCobrancaTelefone(e.target.value)} />
          <label>Email</label>
          <input type="email" name="endereco_cobranca_email" value={enderecoCobrancaEmail} onChange={(e) => setEnderecoCobrancaEmail(e.target.value)} />
          <label>Logradouro</label>
          <input type="text" name="endereco_cobranca_logradouro" value={enderecoCobrancaLogradouro} onChange={(e) => setEnderecoCobrancaLogradouro(e.target.value)} />
          <label>Número</label>
          <input type="text" name="endereco_cobranca_numero" value={enderecoCobrancaNumero} onChange={(e) => setEnderecoCobrancaNumero(e.target.value)} />
          <label>Complemento</label>
          <input type="text" name="endereco_cobranca_complemento" value={enderecoCobrancaComplemento} onChange={(e) => setEnderecoCobrancaComplemento(e.target.value)} />
          <label>Bairro</label>
          <input type="text" name="endereco_cobranca_bairro" value={enderecoCobrancaBairro} onChange={(e) => setEnderecoCobrancaBairro(e.target.value)} />
          <label>Estado</label>
          <select name="endereco_cobranca_uf" value={enderecoCobrancaUf} onChange={(e) => handleEstadoChange(e, 'cobranca')} className="select-input">
            <option value="">Selecione o Estado</option>
            {estados.map(estado => (
              <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
            ))}
          </select>
          <label>Cidade</label>
          <select name="endereco_cobranca_cidade" value={enderecoCobrancaCidade} onChange={(e) => setEnderecoCobrancaCidade(e.target.value)} className="select-input">
            <option value="">Selecione a Cidade</option>
            {cidadesCobranca.map(cidade => (
              <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
            ))}
          </select>
          <label>CEP</label>
          <input type="text" name="endereco_cobranca_cep" value={enderecoCobrancaCep} onChange={(e) => setEnderecoCobrancaCep(e.target.value)} />
          <label>Endereço dentro do condomínio</label>
          <input type="text" name="endereco_cobranca_condominio" value={enderecoCobrancaCondominio} onChange={(e) => setEnderecoCobrancaCondominio(e.target.value)} />

          <h3>Endereço de Entrega</h3>
          <label>Logradouro</label>
          <input type="text" name="endereco_entrega_logradouro" value={enderecoEntregaLogradouro} onChange={(e) => setEnderecoEntregaLogradouro(e.target.value)} />
          <label>Número</label>
          <input type="text" name="endereco_entrega_numero" value={enderecoEntregaNumero} onChange={(e) => setEnderecoEntregaNumero(e.target.value)} />
          <label>Complemento</label>
          <input type="text" name="endereco_entrega_complemento" value={enderecoEntregaComplemento} onChange={(e) => setEnderecoEntregaComplemento(e.target.value)} />
          <label>Bairro</label>
          <input type="text" name="endereco_entrega_bairro" value={enderecoEntregaBairro} onChange={(e) => setEnderecoEntregaBairro(e.target.value)} />
          <label>Estado</label>
          <select name="endereco_entrega_uf" value={enderecoEntregaUf} onChange={(e) => handleEstadoChange(e, 'entrega')} className="select-input">
            <option value="">Selecione o Estado</option>
            {estados.map(estado => (
              <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
            ))}
          </select>
          <label>Cidade</label>
          <select name="endereco_entrega_cidade" value={enderecoEntregaCidade} onChange={(e) => setEnderecoEntregaCidade(e.target.value)} className="select-input">
            <option value="">Selecione a Cidade</option>
            {cidadesEntrega.map(cidade => (
              <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
            ))}
          </select>
          <label>CEP</label>
          <input type="text" name="endereco_entrega_cep" value={enderecoEntregaCep} onChange={(e) => setEnderecoEntregaCep(e.target.value)} />
          <label>Endereço dentro do condomínio</label>
          <input type="text" name="endereco_entrega_condominio" value={enderecoEntregaCondominio} onChange={(e) => setEnderecoEntregaCondominio(e.target.value)} />

          <h3>Gestores da Obra</h3>
          <label>Nome</label>
          <input type="text" name="gestor_obra_nome" value={gestorObraNome} onChange={(e) => setGestorObraNome(e.target.value)} />
          <label>Telefone</label>
          <input type="text" name="gestor_obra_telefone" value={gestorObraTelefone} onChange={(e) => setGestorObraTelefone(e.target.value)} />
          <label>Email</label>
          <input type="email" name="gestor_obra_email" value={gestorObraEmail} onChange={(e) => setGestorObraEmail(e.target.value)} />

          <h3>Valores dos Produtos</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th></th>
                <th>Valor Esquadrias (R$)</th>
                <th>Desconto (%)</th>
                <th>Valor Final (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><label>Externas</label></td>
                <td><input type="text" name="esquadrias" value={valorExternasEsquadrias} onChange={(e) => setValorExternasEsquadrias(e.target.value)} /></td>
                <td><input type="text" name="desconto" value={descontoExternas} onChange={(e) => setDescontoExternas(e.target.value)} /></td>
                <td><input type="text" name="valor_final" value={formatCurrency(valorFinalExternas)} readOnly /></td>
              </tr>
              <tr>
                <td><label>Outros</label></td>
                <td><input type="text" name="esquadrias" value={valorOutrosEsquadrias} onChange={(e) => setValorOutrosEsquadrias(e.target.value)} /></td>
                <td><input type="text" name="desconto" value={descontoOutros} onChange={(e) => setDescontoOutros(e.target.value)} /></td>
                <td><input type="text" name="valor_final" value={formatCurrency(valorFinalOutros)} readOnly /></td>
              </tr>
            </tbody>
          </table>

          <h3>Valores dos Serviços Cobrados pela Bazze</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Valor(R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><label>Instalação</label></td>
                <td><input type="text" name="valor_instalacao" value={valorInstalacao} onChange={(e) => setValorInstalacao(e.target.value)} /></td>
              </tr>
              <tr>
                <td><label>Frete</label></td>
                <td><input type="text" name="valor_frete" value={valorFrete} onChange={(e) => setValorFrete(e.target.value)} /></td>
              </tr>
              <tr>
                <td><label>Abatimento Showroom</label></td>
                <td><input type="text" name="valor_abatimento_showroom" value={valorAbatimentoShowroom} onChange={(e) => setValorAbatimentoShowroom(e.target.value)} /></td>
              </tr>
            </tbody>
          </table>

          <h3>Valores Pagos pelo Cliente Diretamente ao Terceiro</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Serviço / Produto</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><label>Instalação esquadrias pvc</label></td>
                <td><input type="text" name="valor_instalacao_pvc" value={valorInstalacaoPVC} onChange={(e) => setValorInstalacaoPVC(e.target.value)} /></td>
              </tr>
              <tr>
                <td><label>Frete das esquadrias</label></td>
                <td><input type="text" name="valor_frete_esquadrias" value={valorFreteEsquadrias} onChange={(e) => setValorFreteEsquadrias(e.target.value)} /></td>
              </tr>
              <tr>
                <td><label>Projeto, Gerenciamento e acompanhamento técnico</label></td>
                <td><input type="text" name="valor_projeto" value={valorProjeto} onChange={(e) => setValorProjeto(e.target.value)} /></td>
              </tr>
              <tr>
                <td><label>Vidros separados</label></td>
                <td><input type="text" name="valor_vidros_separados" value={valorVidrosSeparados} onChange={(e) => setValorVidrosSeparados(e.target.value)} /></td>
              </tr>
            </tbody>
          </table>




          <div className="valor-total-container">
            <h3 style={{ width: '240px' }}>Valor Total Bazze</h3>
            <input type="text" name="valor_total_bazze" value={formatCurrency(calculateTotalProdutos() + calculateTotalServicos())} readOnly className="valor-total-input" />
          </div>

          <div className="valor-total-container">
            <h3 style={{ width: '300px' }}>Valor Total de Terceiros</h3>
            <input type="text" name="valor_total_terceiros" value={formatCurrency(calculateTotalTerceiros())} readOnly className="valor-total-input" />
          </div>

          <div className="valor-total-container">
            <h3 style={{ width: '300px' }}>Valor Total do Contrato</h3>
            <input type="text" name="valor_total_contrato" value={formatCurrency(calculateTotalProdutos() + calculateTotalServicos() + calculateTotalTerceiros())} readOnly className="valor-total-input" />
          </div>









          <h3>Condições de Pagamento</h3>
          <textarea name="condicoes_pagamento" value={condicoesPagamento} onChange={(e) => setCondicoesPagamento(e.target.value)} />

          <h3>Condições de Pagamento Terceiro</h3>
          <textarea name="condicoes_pagamento_terceiro" value={condicoesPagamentoTerceiro} onChange={(e) => setCondicoesPagamentoTerceiro(e.target.value)} />

          <h3>Previsão de Medição</h3>
          <input type="date" name="previsao_medicao" value={previsaoMedicao} onChange={(e) => setPrevisaoMedicao(e.target.value)} />

          <h3>Previsão de Entrega</h3>
          <input type="date" name="previsao_entrega" value={previsaoEntrega} onChange={(e) => setPrevisaoEntrega(e.target.value)} />

          <h3>Observações</h3>
          <textarea name="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

          <button onClick={handleSavePedido}>Enviar Pedido</button>
        </form>
      </div>

    </div>
  );
};

export default PedidoPedido;
