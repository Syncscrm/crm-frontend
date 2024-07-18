import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../contexts/userContext';
import { useColumns } from '../../../contexts/columnsContext';
import { apiUrl } from '../../../config/apiConfig';

import Header from '../../Header';
import './style.css';
import ListColumns from '../../forms/ListColumns';
import CreateColumns from '../../forms/CreateColumns';

function ColumnsPage() {
  const { user, empresa } = useUser();
  const { openCloseCreateColumn, openModalCreateColumn } = useColumns();

  const [modalEtiquetas, setModalEtiquetas] = useState(false);
  const [modalOrigens, setModalOrigens] = useState(false);
  const [modalColunas, setModalColunas] = useState(false);
  const [modalProdutos, setModalProdutos] = useState(false);
  const [modalCores, setModalCores] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);



  const [listaEtiquetas, setListaEtiquetas] = useState([]);
  const [listaOrigens, setListaOrigens] = useState([]);
  const [listaColunas, setListaColunas] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [listaCores, setListaCores] = useState([]);

  const [listaStatusDeColuna, setListaStatusDeColuna] = useState([]);

  const [colunaStatusVendido, setColunaStatusVendido] = useState('');
  const [colunaStatusPerdido, setColunaStatusPerdido] = useState('');
  const [colunaStatusArquivado, setColunaStatusArquivado] = useState('');



  // ----------- BTNS TOOLS --------------
  const showModalStatus = () => {

    setColunaStatusVendido(empresa.coluna_vendido ? empresa.coluna_vendido : 'Não definido!')
    setColunaStatusPerdido(empresa.coluna_perdido ? empresa.coluna_perdido : 'Não definido!')
    setColunaStatusArquivado(empresa.coluna_arquivado ? empresa.coluna_arquivado : 'Não definido!')

    setModalStatus(!modalStatus);

  };

  const showModalCores = () => {
    getCores();
    setModalCores(!modalCores);
  };


  const showModalEtiquetas = () => {
    getEtiquetas();
    setModalEtiquetas(!modalEtiquetas);
  };

  const showModalOrigens = () => {
    getOrigens();
    setModalOrigens(!modalOrigens);
  };

  const showModalColunas = () => {
    getColumns();
    setModalColunas(!modalColunas);
  };

  const showModalProdutos = () => {
    getProdutos();
    setModalProdutos(!modalProdutos);
  };

  // ----------- Get --------------




  const getCores = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getCores/${user.empresa_id}`);
      setListaCores(response.data);
    } catch (error) {
      console.error('Erro ao buscar Cores:', error);
    }
  };


  const getEtiquetas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getEtiquetas/${user.empresa_id}`);
      setListaEtiquetas(response.data);
    } catch (error) {
      console.error('Erro ao buscar Etiquetas:', error);
    }
  };

  const getOrigens = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getOrigens/${user.empresa_id}`);
      setListaOrigens(response.data);
    } catch (error) {
      console.error('Erro ao buscar Origens:', error);
    }
  };

  const getColumns = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getColumns/${user.empresa_id}`);
      setListaColunas(response.data);
    } catch (error) {
      console.error('Erro ao buscar Colunas:', error);
    }
  };

  const getProdutos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getProdutos/${user.empresa_id}`);
      setListaProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar Produtos:', error);
    }
  };





  const createCor = async () => {
    const newName = prompt('Novo nome da cor:', '');
    const descricao = prompt('Descrição da cor:', '');

    if (newName && descricao) {
      try {
        const itemData = {
          name: newName,
          descricao: descricao,
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createCor`, itemData);
        showModalCores();
      } catch (error) {
        console.error('Erro ao criar Cor:', error);
      }
    }
  };


  const createEtiqueta = async () => {
    const newName = prompt('Novo nome:', '');
    const newOrder = prompt('Ordem:', '');
    const newColor = prompt('Cor:', '');


    if (newName && newOrder, newColor) {

      try {
        const itemData = {
          description: newName,
          color: newColor,
          order: parseInt(newOrder, 10),
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createEtiqueta`, itemData);
        showModalEtiquetas();
      } catch (error) {
        console.error('Erro ao criar Etiqueta:', error);
      }

    };
  }



  const createOrigem = async () => {
    const newName = prompt('Novo nome da origem:', '');
    const descricao = prompt('Descrição da origem:', '');

    if (newName && descricao) {
      try {
        const itemData = {
          name: newName,
          descricao: descricao,
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createOrigem`, itemData);
        showModalOrigens();
      } catch (error) {
        console.error('Erro ao criar Origem:', error);
      }
    }
  };

  const createColuna = async () => {
    const newName = prompt('Novo nome da coluna:', '');
    const displayOrder = prompt('Ordem de exibição:', '');
    const description = prompt('Descrição da coluna:', '');

    if (newName && displayOrder && description) {
      try {
        const itemData = {
          name: newName,
          display_order: parseInt(displayOrder, 10),
          description: description,
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createColuna`, itemData);
        showModalColunas();
      } catch (error) {
        console.error('Erro ao criar Coluna:', error);
      }
    }
  };

  const createProduto = async () => {
    const newName = prompt('Novo nome do produto:', '');
    const descricao = prompt('Descrição do produto:', '');

    if (newName && descricao) {
      try {
        const itemData = {
          name: newName,
          descricao: descricao,
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createProduto`, itemData);
        showModalProdutos();
      } catch (error) {
        console.error('Erro ao criar Produto:', error);
      }
    }
  };

  // ----------- Edite --------------


  const editeColunaStatusVendido = async () => {
    const newName = prompt('Novo nome:', colunaStatusVendido);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateColunaVendido/${user.empresa_id}`, { coluna_vendido: newName });
        setColunaStatusVendido(newName);
      } catch (error) {
        console.error('Erro ao editar coluna vendido:', error);
      }
    }
  };
  
  const editeColunaStatusPerdido = async () => {
    const newName = prompt('Novo nome:', colunaStatusPerdido);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateColunaPerdido/${user.empresa_id}`, { coluna_perdido: newName });
        setColunaStatusPerdido(newName);
      } catch (error) {
        console.error('Erro ao editar coluna perdido:', error);
      }
    }
  };
  
  const editeColunaStatusArquivado = async () => {
    const newName = prompt('Novo nome:', colunaStatusArquivado);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateColunaArquivado/${user.empresa_id}`, { coluna_arquivado: newName });
        setColunaStatusArquivado(newName);
      } catch (error) {
        console.error('Erro ao editar coluna arquivado:', error);
      }
    }
  };
  


  const editeCor = async (item) => {
    const newName = prompt('Novo nome:', item.name);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateCor/${item.id}`, { name: newName });

        setListaCores(listaCores.map(itemList => itemList.id === item.id ? { ...itemList, name: newName } : itemList));
      } catch (error) {
        console.error('Erro ao editar Cor:', error);
      }
    }
  };



  const editeEtiqueta = async (item) => {
    const newName = prompt('Novo nome:', item.description);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateEtiqueta/${item.id}`, { description: newName });

        setListaEtiquetas(listaEtiquetas.map(itemList => itemList.id === item.id ? { ...itemList, description: newName } : itemList));
      } catch (error) {
        console.error('Erro ao editar Etiqueta:', error);
      }
    }
  };

  const editeOrigem = async (item) => {
    const newName = prompt('Novo nome:', item.name);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateOrigem/${item.id}`, { name: newName });

        setListaOrigens(listaOrigens.map(itemList => itemList.id === item.id ? { ...itemList, name: newName } : itemList));
      } catch (error) {
        console.error('Erro ao editar Origens:', error);
      }
    }
  };

  const editeColuna = async (item) => {
    const newName = prompt('Novo nome:', item.name);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateColuna/${item.id}`, { name: newName });

        setListaColunas(listaColunas.map(itemList => itemList.id === item.id ? { ...itemList, name: newName } : itemList));
      } catch (error) {
        console.error('Erro ao editar Coluna:', error);
      }
    }
  };

  const editeProduto = async (item) => {
    const newName = prompt('Novo nome:', item.name);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateProduto/${item.id}`, { name: newName });

        setListaProdutos(listaProdutos.map(itemList => itemList.id === item.id ? { ...itemList, name: newName } : itemList));
      } catch (error) {
        console.error('Erro ao editar Produto:', error);
      }
    }
  };

  // ----------- Remove --------------

  const removeCor = async (id) => {
    const isBlocked = true;

    if (isBlocked) {
      alert('Bloqueado pelo ADM');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/users/deleteCor/${id}`);
      setListaCores(listaCores.filter(itemList => itemList.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Cor:', error);
    }
  };

  const removeEtiqueta = async (id) => {
    const isBlocked = true;

    if (isBlocked) {
      alert('Bloqueado pelo ADM');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/users/deleteEtiqueta/${id}`);
      setListaEtiquetas(listaEtiquetas.filter(itemList => itemList.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Etiqueta:', error);
    }
  };

  const removeOrigem = async (id) => {
    const isBlocked = true;

    if (isBlocked) {
      alert('Bloqueado pelo ADM');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/users/deleteOrigem/${id}`);
      setListaOrigens(listaOrigens.filter(itemList => itemList.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Origem:', error);
    }
  };

  const removeColuna = async (id) => {
    try {
      await axios.delete(`${apiUrl}/users/deleteColuna/${id}`);
      setListaColunas(listaColunas.filter(itemList => itemList.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Coluna:', error);
    }
  };

  const removeProduto = async (id) => {
    const isBlocked = true;

    if (isBlocked) {
      alert('Bloqueado pelo ADM');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/users/deleteProduto/${id}`);
      setListaProdutos(listaProdutos.filter(itemList => itemList.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Produto:', error);
    }
  };

  return (
    <div className="users-page-container">
      <Header />


      <div className="tools-parametros-container">
        <button className="btn-select-edit-parameter" onClick={showModalEtiquetas}>Etiquetas</button>
        <button className="btn-select-edit-parameter" onClick={showModalOrigens}>Origens</button>
        <button className="btn-select-edit-parameter" onClick={showModalColunas}>Colunas</button>
        <button className="btn-select-edit-parameter" onClick={showModalProdutos}>Produtos</button>
        <button className="btn-select-edit-parameter" onClick={showModalCores}>Cores</button>
        <button className="btn-select-edit-parameter" onClick={showModalStatus}>Status</button>

      </div>

      {modalCores && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Cores</label>
            </div>
            <div className="parameter-body">
              {listaCores?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.name}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeCor(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeCor(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalCores}>Fechar</button>
              <button className="btn-add-parameter" onClick={createCor}>Adicionar</button>
            </div>
          </div>
        </div>
      )}



      {modalEtiquetas && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Etiquetas</label>
            </div>
            <div className="parameter-body">
              {listaEtiquetas?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.description}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeEtiqueta(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeEtiqueta(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalEtiquetas}>Fechar</button>
              <button className="btn-add-parameter" onClick={createEtiqueta}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {modalOrigens && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Origens</label>
            </div>
            <div className="parameter-body">
              {listaOrigens?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.name}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeOrigem(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeOrigem(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalOrigens}>Fechar</button>
              <button className="btn-add-parameter" onClick={createOrigem}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {modalColunas && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Colunas</label>
            </div>
            <div className="parameter-body">
              {listaColunas?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.name}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeColuna(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeColuna(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalColunas}>Fechar</button>
              <button className="btn-add-parameter" onClick={createColuna}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {modalProdutos && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Produtos</label>
            </div>
            <div className="parameter-body">
              {listaProdutos?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.name}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeProduto(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeProduto(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalProdutos}>Fechar</button>
              <button className="btn-add-parameter" onClick={createProduto}>Adicionar</button>
            </div>
          </div>
        </div>
      )}


      {modalStatus && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Status X Coluna</label>
            </div>
            <div className="parameter-body">

              <label className="label-item-parameter-description">Quando Status Vendido ir para a Coluna com seguinte nome:</label>
              <div className="item-list-parameter" >
                <label className="label-item-parameter">{colunaStatusVendido}</label>
                <div className="btns-item-list">
                  <button className="btn-edite-item-list" onClick={() => editeColunaStatusVendido()}>Editar</button>
                </div>
              </div>

              <label className="label-item-parameter-description">Quando Status Perdido ir para a Coluna com seguinte nome:</label>
              <div className="item-list-parameter" >
                <label className="label-item-parameter">{colunaStatusPerdido}</label>
                <div className="btns-item-list">
                  <button className="btn-edite-item-list" onClick={() => editeColunaStatusPerdido()}>Editar</button>
                </div>
              </div>


              <label className="label-item-parameter-description">Quando Status Arquivado ir para a Coluna com seguinte nome:</label>
              <div className="item-list-parameter" >
                <label className="label-item-parameter">{colunaStatusArquivado}</label>
                <div className="btns-item-list">
                  <button className="btn-edite-item-list" onClick={() => editeColunaStatusArquivado()}>Editar</button>
                </div>
              </div>




            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalStatus}>Fechar</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default ColumnsPage;
