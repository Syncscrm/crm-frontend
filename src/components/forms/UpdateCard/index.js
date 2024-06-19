import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { useCard } from '../../../contexts/cardContext';
import './style.css';

// API URL for IBGE
const apiUrlIbge = 'https://servicodados.ibge.gov.br/api/v1/localidades';

function UpdateCard({ idCard, cardData }) {
  const { user, listAllUsers } = useUser();
  const { columnsUser, columns } = useColumns();
  const { addHistoricoCardContext, setOpenCloseUpdateCard, cards, setCards, setPreviewSearchCards, setListNotifications, listaEtiquetas} = useCard();

  const [statusCard, setStatusCard] = useState('');
  const [statusDateCard, setStatusDateCard] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [secondDocumentoNumber, setSecondDocumentNumber] = useState('');
  const [pedidoNumber, setPedidoNumber] = useState('');

  const [entityId, setEntityId] = useState();
  const [name, setName] = useState('');
  const [saleValue, setSaleValue] = useState();
  const [costValue, setCostValue] = useState();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [fone, setFone] = useState('');
  const [columnId, setColumnId] = useState();
  const [error, setError] = useState('');
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [count, setCount] = useState(0);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentIdColumn, setCurrentIdColumn] = useState();
  const [origemCard, setOrigemCard] = useState('');
  const [produtoCard, setProdutoCard] = useState('');

  const [listOrigens, setListOrigens] = useState([]);
  const [listProdutos, setListProdutos] = useState([]);

  const [idEtiqueta, setIdEtiqueta] = useState(0);


  useEffect(() => {
    setCount(count + 1);
    if (count > 1) {
      setIsUpdatingCard(true);
    }
  }, [statusCard, documentNumber, entityId, name, saleValue, costValue, email, state, city, fone, columnId, origemCard]);

  useEffect(() => {
    if (cardData) {
      setDocumentNumber(cardData.document_number || '');
      setSaleValue(cardData.sale_value);
      setCostValue(cardData.cost_value);
      setName(cardData.name);
      setEmail(cardData.email);
      setState(cardData.state);
      setCity(cardData.city);
      setFone(cardData.fone);
      setColumnId(cardData.column_id);
      setEntityId(cardData.entity_id);
      setStatusCard(cardData.status);
      setOrigemCard(cardData.origem ? cardData.origem : 'Sem Origem');
      setProdutoCard(cardData.produto);
      setStatusDateCard(cardData.status_date ? new Date(cardData.status_date).toISOString().split('T')[0] : ''); // Formate a data aqui
      setSecondDocumentNumber(cardData.second_document_number);
      setPedidoNumber(cardData.pedido_number);
      setIdEtiqueta(cardData.etiqueta_id || 0); // Garantir que idEtiqueta seja configurado corretamente

    }
    buscarOrigens()
    buscarProdutos()
  }, [cardData]);

  useEffect(() => {
    axios.get(`${apiUrlIbge}/estados?orderBy=nome`).then(response => {
      const stateOptions = response.data.map(state => ({
        sigla: state.sigla,
        nome: state.nome,
      }));
      setStates(stateOptions);
    });
  }, []);

  useEffect(() => {
    if (state) {
      axios.get(`${apiUrlIbge}/estados/${state}/municipios?orderBy=nome`).then(response => {
        const cityOptions = response.data.map(city => ({
          id: city.id,
          nome: city.nome,
        }));
        setCities(cityOptions);

        // Seleciona a cidade atual se estiver definida
        if (cardData && cardData.city) {
          const selectedCity = response.data.find(city => city.nome === cardData.city);
          if (selectedCity) {
            setCity(selectedCity.id.toString());
          }
        }
      });
    } else {
      setCities([]);
    }
  }, [state, cardData]);

  const getNameColumnCard = (idColumn) => {
    if (!columnsUser) {
      return 'Dados ainda estão carregando...';
    }
    const nameColumn = columnsUser.find((item) => item.id === idColumn);
    return nameColumn ? nameColumn.name : 'Nome não encontrado';
  };

  // const handleUpdateCard = async (e) => {
  //   e.preventDefault();
  //   setIsUpdatingCard(true);
  //   setError('');

  //   const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
  //   if (!userConfirmed) {
  //     return;
  //   }


  //   const selectedState = states.find((st) => st.sigla === state);
  //   const selectedCity = cities.find((ct) => ct.id === parseInt(city));

  //   const cardData = {
  //     id: idCard,
  //     name,
  //     state: selectedState ? selectedState.sigla : '',
  //     city: selectedCity ? selectedCity.nome : '',
  //     fone,
  //     email,
  //     column_id: columnId,
  //     entity_id: entityId,
  //     empresa_id: user.empresa_id,
  //     document_number: documentNumber ? documentNumber : '',
  //     cost_value: costValue,
  //     sale_value: saleValue,
  //     status: statusCard ? statusCard : '',
  //     origem: origemCard ? origemCard : 'Não informado',
  //     produto: produtoCard ? produtoCard : 'Não informado',
  //     status_date: statusDateCard ? statusDateCard : null, // Envie sempre o status_date no formato correto
  //   };

  //   try {
  //     const response = await axios.post(`${apiUrl}/card/update`, cardData);
  //     const updatedCardData = response.data[0];

  //     setCards(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));
  //     setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));
  //     setListNotifications(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));

  //     setOpenCloseUpdateCard(false);
  //     setIsUpdatingCard(false);

  //     if (columnId !== currentIdColumn) {
  //       addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(columnId)}`, idCard, user.id);
  //     }
  //   } catch (error) {
  //     setIsUpdatingCard(false);
  //     setError('Erro ao atualizar o Card.');
  //   }
  // };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    setIsUpdatingCard(true);
    setError('');

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }

    const selectedState = states.find((st) => st.sigla === state);
    const selectedCity = cities.find((ct) => ct.id === parseInt(city));

    const cardData = {
      id: idCard,
      name,
      state: selectedState ? selectedState.sigla : '',
      city: selectedCity ? selectedCity.nome : '',
      fone,
      email,
      column_id: columnId,
      entity_id: entityId,
      empresa_id: user.empresa_id,
      document_number: documentNumber ? documentNumber : '',
      cost_value: costValue,
      sale_value: saleValue,
      status: statusCard ? statusCard : '',
      origem: origemCard ? origemCard : 'Sem Origem',
      produto: produtoCard ? produtoCard : 'Não informado',
      status_date: statusDateCard ? statusDateCard : null, // Envie sempre o status_date no formato correto
      second_document_number: secondDocumentoNumber ? secondDocumentoNumber : '',
      pedido_number: pedidoNumber ? pedidoNumber : '',
      etiqueta_id: idEtiqueta ? idEtiqueta : null,
    };

    try {
      const response = await axios.post(`${apiUrl}/card/update`, cardData);
      const updatedCardData = response.data[0];

      setCards(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));
      setListNotifications(prevCards => prevCards.map(card => card.card_id === idCard ? { ...card, ...updatedCardData } : card));

      setOpenCloseUpdateCard(false);
      setIsUpdatingCard(false);

      if (columnId !== currentIdColumn) {
        addHistoricoCardContext(`Coluna alterada para ${getNameColumnCard(columnId)}`, idCard, user.id);
      }
    } catch (error) {
      setIsUpdatingCard(false);
      setError('Erro ao atualizar o Card.');
    }
};


  useEffect(() => {
    if (cardData) {
      setCurrentIdColumn(cardData.column_id);
    }
  }, [cardData]);



  const arquivarCard = async (id, event) => {
    event.stopPropagation();

    const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
    if (!userConfirmed) {
      return;
    }


    const arquivadosColumn = columns.find(column => column.name === 'Arquivados');
    if (!arquivadosColumn) {
      console.error("Coluna 'Arquivados' não encontrada");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/card/update-arquivados`, {
        id,
        status: 'Arquivado',
        columnId: arquivadosColumn.id,
      });
      setCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      setListNotifications(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
      addHistoricoCardContext(`Card Arquivado!`, cardData.card_id, user.id);
      setOpenCloseUpdateCard(false);
    } catch (error) {
      console.error('Erro ao arquivar o cartão:', error);
    }
  };



  const buscarOrigens = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/origens/${user.empresa_id}`);
      setListOrigens(response.data);
    } catch (error) {
      console.error('Erro ao buscar origens:', error);
    }
  };

  const buscarProdutos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/produtos/${user.empresa_id}`);
      setListProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };


  const sortedEtiquetas = [...listaEtiquetas].sort((a, b) => a.order - b.order);


  return (
    <div className='update-card-modal'>
      <div className='update-card-container-update'>
        <div className='header-update-card-container'>
          <label>Oportunidade</label>
        </div>
        <div className="update-card-form-container">
          <form className="update-card-form" onSubmit={handleUpdateCard}>
            <label htmlFor="username" className='update-card-label-input'>Nome do Cliente:</label>
            <input id="username" className="update-card-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="city-state" className='update-card-label-input'>Estado:</label>
            <div className='select-cidade-estado-container'>
              <select id="state" className="select-estado-cidade" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Selecione o estado</option>
                {states.map(state => (
                  <option key={state.sigla} value={state.sigla}>{state.nome}</option>
                ))}
              </select>
            </div>


            <label htmlFor="city-state" className='update-card-label-input'>Cidade:</label>

            <div className='select-cidade-estado-container'>

              <select id="city" className="select-estado-cidade" value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.nome}</option>
                ))}
              </select>
            </div>

            <label htmlFor="fone" className='update-card-label-input'>Fone:</label>
            <input id="fone" className="update-card-input" type="text" value={fone} onChange={(e) => setFone(e.target.value)} />

            <label htmlFor="email" className='update-card-label-input'>Email:</label>
            <input id="email" className="update-card-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="documentNumber" className='update-card-label-input'>PrefWeb:</label>
            <input id="documentNumber" className="update-card-input" type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />

            <label htmlFor="documentNumber" className='update-card-label-input'>PrefSuite:</label>
            <input id="documentNumber" className="update-card-input" type="text" value={secondDocumentoNumber} onChange={(e) => setSecondDocumentNumber(e.target.value)} />

            <label htmlFor="documentNumber" className='update-card-label-input'>Faktory:</label>
            <input id="documentNumber" className="update-card-input" type="text" value={pedidoNumber} onChange={(e) => setPedidoNumber(e.target.value)} />

            <label htmlFor="costValue" className='update-card-label-input'>Valor de Custo:</label>
            <input id="costValue" className="update-card-input" type="text" value={costValue} onChange={(e) => setCostValue(e.target.value)} />

            <label htmlFor="saleValue" className='update-card-label-input'>Valor de Venda:</label>
            <input id="saleValue" className="update-card-input" type="text" value={saleValue} onChange={(e) => setSaleValue(e.target.value)} />




            {/* <label htmlFor="city-state" className='update-card-label-input'>Etiqueta:</label>
            <div className='select-cidade-estado-container'>
              <select id="etiqueta" className="select-estado-cidade" value={idEtiqueta} onChange={(e) => setIdEtiqueta(e.target.value)}  >
                <option value="">Selecione uma Etiqueta</option>
                {sortedEtiquetas.map(etiqueta => (
                  <option key={etiqueta.id} value={etiqueta.id}>{etiqueta.description}</option>
                ))}
              </select>
            </div> */}


            <label htmlFor="city-state" className='update-card-label-input'>Origem:</label>
            <div className='select-cidade-estado-container'>
              <select id="origem" className="select-estado-cidade" value={origemCard} onChange={(e) => setOrigemCard(e.target.value)}  >
                <option value="">Selecione a origem</option>
                {listOrigens.map(origem => (
                  <option key={origem.id} value={origem.name}>{origem.name}</option>
                ))}
              </select>
            </div>

            <label htmlFor="city-state" className='update-card-label-input'>Produto:</label>

            <div className='select-cidade-estado-container'>
              <select id="produto" className="select-estado-cidade" value={produtoCard} onChange={(e) => setProdutoCard(e.target.value)}  >
                <option value="">Selecione o produto</option>
                {listProdutos.map(produto => (
                  <option key={produto.id} value={produto.name}>{produto.name}</option>
                ))}
              </select>
            </div>


            <label htmlFor="city-state" className='update-card-label-input'>Entidade:</label>


            <div className='select-cidade-estado-container'>
              <select id="produto" className="select-estado-cidade" value={entityId} onChange={(e) => setEntityId(e.target.value)}  >
                <option value="">Alterar Entidade</option>
                {listAllUsers.map(produto => (
                  <option key={produto.id} value={produto.id}>{produto.username}</option>
                ))}
              </select>
            </div>

            <div className='module-esquadrias-column'>
              <label htmlFor="previsaoVistoriaPos" className='modulo-esquadrias-label-input'>Alterar a Data de Status manualmente:</label>
              <input id="previsaoVistoriaPos" className="modulo-esquadrias-input" type="date" name="previsaoVistoriaPos" value={statusDateCard} onChange={(e) => setStatusDateCard(e.target.value)} />
            </div>


            <label htmlFor="columnId" className='update-card-label-input'>Column ID: {columnId}</label>
            <label htmlFor="idCard" className='update-card-label-input'>Card ID: {idCard}</label>
          </form>
        </div>
        {error && <div className="update-card-error-message">{error}</div>}

        <div className='update-card-footer'>
          <button className="update-card-close-button" onClick={(event) => arquivarCard(cardData.card_id, event)}>Arquivar</button>
          <button className="update-card-close-button" onClick={() => setOpenCloseUpdateCard(false)}>Cancelar</button>
          <button style={{ backgroundColor: !isUpdatingCard ? '' : 'dodgerblue' }} type="submit" className="update-card-button" onClick={handleUpdateCard} disabled={!isUpdatingCard}>Atualizar Card</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateCard;
