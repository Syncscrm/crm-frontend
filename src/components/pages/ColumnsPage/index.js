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
  const { user, empresa, setEmpresa } = useUser();
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
  const [colunaStatusPedido, setColunaStatusPedido] = useState('');



  const [editingCor, setEditingCor] = useState(null);
  const [newColorName, setNewColorName] = useState('');
  const [selectedColorForEdit, setSelectedColorForEdit] = useState('');
  const [newColor, setNewColor] = useState(null);
  //const [newSelectedColor, setNewSelectedColor] = useState('');



  



  // ----------- BTNS TOOLS --------------
  // const showModalStatus = () => {

  //   setColunaStatusVendido(empresa.coluna_vendido ? empresa.coluna_vendido : 'Não definido!')
  //   setColunaStatusPerdido(empresa.coluna_perdido ? empresa.coluna_perdido : 'Não definido!')
  //   setColunaStatusArquivado(empresa.coluna_arquivado ? empresa.coluna_arquivado : 'Não definido!')

  //   setModalStatus(!modalStatus);

  // };

  const showModalStatus = () => {
    setColunaStatusVendido(empresa.coluna_vendido ? empresa.coluna_vendido : 'Não definido!');
    setColunaStatusPerdido(empresa.coluna_perdido ? empresa.coluna_perdido : 'Não definido!');
    setColunaStatusArquivado(empresa.coluna_arquivado ? empresa.coluna_arquivado : 'Não definido!');
    setColunaStatusPedido(empresa.pedido_coluna ? empresa.pedido_coluna : 'Não definido!'); // Novo estado
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

  // const showModalColunas = () => {
  //   getColumns();
  //   setModalColunas(!modalColunas);
  // };

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


  // const getEtiquetas = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/users/getEtiquetas/${user.empresa_id}`);
  //     setListaEtiquetas(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar Etiquetas:', error);
  //   }
  // };

  const getColumns = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getColumns/${user.empresa_id}`);
      const orderedColumns = response.data.sort((a, b) => a.display_order - b.display_order);
      setListaColunas(orderedColumns);
    } catch (error) {
      console.error('Erro ao buscar Colunas:', error);
    }
  };


  const getEtiquetas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getEtiquetas/${user.empresa_id}`);
      const orderedEtiquetas = response.data.sort((a, b) => a.order - b.order);
      setListaEtiquetas(orderedEtiquetas);
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

  // const getColumns = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/users/getColumns/${user.empresa_id}`);
  //     setListaColunas(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar Colunas:', error);
  //   }
  // };

  const getProdutos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/getProdutos/${user.empresa_id}`);
      setListaProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar Produtos:', error);
    }
  };





  // const createCor = async () => {
  //   const newName = prompt('Novo nome da cor:', '');
  //   const descricao = prompt('Descrição da cor:', '');

  //   if (newName && descricao) {
  //     try {
  //       const itemData = {
  //         name: newName,
  //         descricao: descricao,
  //         empresa_id: user.empresa_id,
  //       };

  //       await axios.post(`${apiUrl}/users/createCor`, itemData);
  //       showModalCores();
  //     } catch (error) {
  //       console.error('Erro ao criar Cor:', error);
  //     }
  //   }
  // };


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


  const editeColunaStatusPedido = async () => {
    const newName = prompt('Novo nome:', colunaStatusPedido);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/users/updateColunaPedido/${user.empresa_id}`, { pedido_coluna: newName });
        setColunaStatusPedido(newName);

        // Atualizar o contexto da empresa
        setEmpresa((prevEmpresa) => ({
          ...prevEmpresa,
          pedido_coluna: newName, // Atualiza o pedido_coluna no estado da empresa
        }));


      } catch (error) {
        console.error('Erro ao editar coluna pedido:', error);
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



  // const editeCor = async (item) => {
  //   const newName = prompt('Novo nome:', item.name);
  //   if (newName) {
  //     try {
  //       await axios.put(`${apiUrl}/users/updateCor/${item.id}`, { name: newName });

  //       setListaCores(listaCores.map(itemList => itemList.id === item.id ? { ...itemList, name: newName } : itemList));
  //     } catch (error) {
  //       console.error('Erro ao editar Cor:', error);
  //     }
  //   }
  // };

  const editeCor = (item) => {
    setEditingCor(item);
    setNewColorName(item.name);
    setSelectedColorForEdit(item.color_code); // Mudança aqui para color_code
  };
  
  const saveCorEdits = async () => {
    if (editingCor) {
      try {
        await axios.put(`${apiUrl}/users/updateCor/${editingCor.id}`, {
          name: newColorName,
          color_code: selectedColorForEdit, // Mudança aqui para color_code
        });
  
        setListaCores(listaCores.map(itemList =>
          itemList.id === editingCor.id ? { ...itemList, name: newColorName, color_code: selectedColorForEdit } : itemList
        ));
        setEditingCor(null); // Fechar o modal de edição
      } catch (error) {
        console.error('Erro ao editar Cor:', error);
      }
    }
  };
  
  
  const createCor = () => {
    setNewColor(true);
    setNewColorName('');
    setNewSelectedColor('');
  };
  
  const saveNewCor = async () => {
    if (newColorName && newSelectedColor) {
      try {
        const itemData = {
          name: newColorName,
          color_code: newSelectedColor, // Mudança aqui para color_code
          empresa_id: user.empresa_id,
        };
  
        await axios.post(`${apiUrl}/users/createCor`, itemData);
  
        const response = await axios.get(`${apiUrl}/users/getCores/${user.empresa_id}`);
        setListaCores(response.data);
  
        setNewColor(null); // Fechar o modal de criação
      } catch (error) {
        console.error('Erro ao criar Cor:', error);
      }
    }
  };
  


  // const editeEtiqueta = async (item) => {
  //   const newName = prompt('Novo nome:', item.description);
  //   if (newName) {
  //     try {
  //       await axios.put(`${apiUrl}/users/updateEtiqueta/${item.id}`, { description: newName });

  //       setListaEtiquetas(listaEtiquetas.map(itemList => itemList.id === item.id ? { ...itemList, description: newName } : itemList));
  //     } catch (error) {
  //       console.error('Erro ao editar Etiqueta:', error);
  //     }
  //   }
  // };

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

    // if (isBlocked) {
    //   alert('Bloqueado pelo ADM');
    //   return;
    // }

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

  // const removeColuna = async (id) => {
  //   try {
  //     await axios.delete(`${apiUrl}/users/deleteColuna/${id}`);
  //     setListaColunas(listaColunas.filter(itemList => itemList.id !== id));
  //   } catch (error) {
  //     console.error('Erro ao excluir Coluna:', error);
  //   }
  // };

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




  const [editingEtiqueta, setEditingEtiqueta] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [newOrder, setNewOrder] = useState('');


  const [availableColors, setAvailableColors] = useState([
    // Tons em vermelho (pastéis)
    "#FFB3B3", "#FFCCCC", "#FFE6E6", "#FF9999", "#FF8080", "#FF6666", "#FF4D4D", "#FF3333", "#FF1A1A", "#FF9999", "#FFB3B3",
    // Tons em azul (pastéis)
    "#B3D9FF", "#CCE6FF", "#E6F2FF", "#99CCFF", "#80BFFF", "#66B3FF", "#4DA6FF", "#3399FF", "#1A8CFF", "#99CCFF", "#B3D9FF",
    // Tons em verde (pastéis)
    "#B3FFB3", "#CCFFCC", "#E6FFE6", "#99FF99", "#80FF80", "#66FF66", "#4DFF4D", "#33FF33", "#1AFF1A", "#99FF99", "#B3FFB3",
    // Tons em laranja (pastéis)
    "#FFD9B3", "#FFE6CC", "#FFF2E6", "#FFCC99", "#FFB380", "#FF9966", "#FF804D", "#FF6633", "#FF4D1A", "#FFCC99", "#FFD9B3",
    // Tons em rosa (pastéis)
    "#FFCCE6", "#FFE6F2", "#FFF2F8", "#FF99CC", "#FF80B2", "#FF6699", "#FF4D80", "#FF3366", "#FF1A4D", "#FF99CC", "#FFCCE6",
    // Tons em roxo (pastéis)
    "#D9B3FF", "#E6CCFF", "#F2E6FF", "#CC99FF", "#B380FF", "#9966FF", "#804DFF", "#6633FF", "#4D1AFF", "#CC99FF", "#D9B3FF",
    // Tons em amarelo (pastéis)
    "#FFFFB3", "#FFFFCC", "#FFFFE6", "#FFFF99", "#FFFF80", "#FFFF66", "#FFFF4D", "#FFFF33", "#FFFF1A", "#FFFF99", "#FFFFB3",
    // Tons variados (pastéis)
    "#FFCEB3", "#FFD1B2", "#FFDB99", "#DBFFB3", "#B3FF99", "#99FFD1", "#B2E6FF", "#DBB3FF", "#FFB3D9", "#FFB2CE", "#FFDAB9",
    // Preto, Bronze, Amadeirado, Pirita, Cinza
    "#000000", "#CD7F32", "#8B4513", "#B8860B", "#808080"
  ]);









  const editeEtiqueta = (item) => {
    setEditingEtiqueta(item);
    setNewDescription(item.description);
    setSelectedColor(item.color);
    setNewOrder(item.order);
  };



  const saveEtiquetaEdits = async () => {
    if (editingEtiqueta) {
      try {
        await axios.put(`${apiUrl}/users/updateEtiqueta/${editingEtiqueta.id}`, {
          description: newDescription,
          color: selectedColor,
          order: newOrder
        });

        setListaEtiquetas(listaEtiquetas.map(itemList =>
          itemList.id === editingEtiqueta.id ? { ...itemList, description: newDescription, color: selectedColor, order: newOrder } : itemList
        ));
        setEditingEtiqueta(null); // Fechar o modal de edição
      } catch (error) {
        console.error('Erro ao editar Etiqueta:', error);
      }
    }
  };






  const [newEtiqueta, setNewEtiqueta] = useState(null);
  const [newSelectedColor, setNewSelectedColor] = useState('');

  const showCreateEtiquetaModal = () => {
    setNewEtiqueta(true);
    setNewDescription('');
    setNewSelectedColor('');
    setNewOrder('');
  };

  const hideCreateEtiquetaModal = () => {
    setNewEtiqueta(null);
  };


  const saveNewEtiqueta = async () => {
    if (newDescription && newSelectedColor && newOrder) {
      try {
        const itemData = {
          description: newDescription,
          color: newSelectedColor,
          order: parseInt(newOrder, 10),
          empresa_id: user.empresa_id,
        };

        await axios.post(`${apiUrl}/users/createEtiqueta`, itemData);

        const response = await axios.get(`${apiUrl}/users/getEtiquetas/${user.empresa_id}`);
        const orderedEtiquetas = response.data.sort((a, b) => a.order - b.order);
        setListaEtiquetas(orderedEtiquetas);

        hideCreateEtiquetaModal(); // Fechar o modal de criação
      } catch (error) {
        console.error('Erro ao criar Etiqueta:', error);
      }
    }
  };




  const [editingColumn, setEditingColumn] = useState(null);
  const [newName, setNewName] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState('');
  const [newSetor, setNewSetor] = useState('');

  const showModalColunas = () => {
    getColumns();
    setModalColunas(!modalColunas);
  };

  // const getColumns = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/users/getColumns/${user.empresa_id}`);
  //     setListaColunas(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar Colunas:', error);
  //   }
  // };

  const editColumn = (column) => {
    setEditingColumn(column);
    setNewName(column.name);
    setNewDisplayOrder(column.display_order);
    setNewDescription(column.description);
    setNewSetor(column.setor);
  };

  const saveColumnEdits = async () => {
    if (editingColumn) {
      try {
        const updatedColumn = {
          name: newName,
          display_order: newDisplayOrder,
          description: newDescription,
          setor: newSetor
        };
        await axios.put(`${apiUrl}/users/updateColuna/${editingColumn.id}`, updatedColumn);
        setListaColunas(listaColunas.map(col => col.id === editingColumn.id ? { ...col, ...updatedColumn } : col));
        setEditingColumn(null); // Fechar o modal de edição
      } catch (error) {
        console.error('Erro ao editar Coluna:', error);
      }
    }
  };

  const removeColuna = async (id) => {
    try {
      await axios.delete(`${apiUrl}/users/deleteColuna/${id}`);
      setListaColunas(listaColunas.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Coluna:', error);
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




      {editingColumn && (
        <div className="parameter-modal-etiqueta">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Editar Coluna</label>
            </div>
            <div className="parameter-body">
              <label>Nome:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <label>Ordem de Exibição:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="number"
                value={newDisplayOrder}
                onChange={(e) => setNewDisplayOrder(e.target.value)}
              />

              <label>Descrição:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <label>Setor:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="text"
                value={newSetor}
                onChange={(e) => setNewSetor(e.target.value)}
              />
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={() => setEditingColumn(null)}>Cancelar</button>
              <button className="btn-add-parameter" onClick={saveColumnEdits}>Salvar</button>
            </div>
          </div>
        </div>
      )}




      {editingEtiqueta && (
        <div className="parameter-modal-etiqueta">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Editar Etiqueta</label>
            </div>
            <div className="parameter-body">
              <label className='title-select-color-etiqueta-selector'>Descrição:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <label className='title-select-color-etiqueta-selector'>Ordem:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
              />

              <label className='title-select-color-etiqueta-selector'>Selecione a Cor:</label>
              <div className="color-options">
                {availableColors.map((color) => (
                  <div
                    key={color}
                    className={`color-option ${color === selectedColor ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={() => setEditingEtiqueta(null)}>Cancelar</button>
              <button className="btn-add-parameter" onClick={saveEtiquetaEdits}>Salvar</button>
            </div>
          </div>
        </div>
      )}







{modalCores && (
  <div className="parameter-modal">
    <div className="parameter-container">
      <div className="parameter-header">
        <label className="parameter-title">Cores</label>
      </div>
      <div className="parameter-body">
        {listaCores?.map((item) => (
          <div className="item-list-parameter" key={item.id} style={{ borderLeft: `10px solid ${item.color_code}` }}>
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





{editingCor && (
  <div className="parameter-modal">
    <div className="parameter-container">
      <div className="parameter-header">
        <label className="parameter-title">Editar Cor</label>
      </div>
      <div className="parameter-body">
        <label>Nome:</label>
        <input
          type="text"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
        />

        <label>Selecione a Cor:</label>
        <div className="color-options">
          {availableColors.map((color) => (
            <div
              key={color}
              className={`color-option ${color === selectedColorForEdit ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColorForEdit(color)}
            ></div>
          ))}
        </div>
      </div>
      <div className="parameter-footer">
        <button className="btn-close-parameter" onClick={() => setEditingCor(null)}>Cancelar</button>
        <button className="btn-add-parameter" onClick={saveCorEdits}>Salvar</button>
      </div>
    </div>
  </div>
)}









{newColor && (
  <div className="parameter-modal">
    <div className="parameter-container">
      <div className="parameter-header">
        <label className="parameter-title">Criar Nova Cor</label>
      </div>
      <div className="parameter-body">
        <label>Nome:</label>
        <input
          type="text"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
        />

        <label>Selecione a Cor:</label>
        <div className="color-options">
          {availableColors.map((color) => (
            <div
              key={color}
              className={`color-option ${color === newSelectedColor ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setNewSelectedColor(color)}
            ></div>
          ))}
        </div>
      </div>
      <div className="parameter-footer">
        <button className="btn-close-parameter" onClick={() => setNewColor(null)}>Cancelar</button>
        <button className="btn-add-parameter" onClick={saveNewCor}>Salvar</button>
      </div>
    </div>
  </div>
)}




      {/* 
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
      )} */}

      {newEtiqueta && (
        <div className="parameter-modal-etiqueta">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Criar Nova Etiqueta</label>
            </div>
            <div className="parameter-body">
              <label className='title-select-color-etiqueta-selector'>Descrição:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              <label className='title-select-color-etiqueta-selector'>Ordem:</label>
              <input
                className='input-select-color-etiqueta-selector'
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
              />

              <label className='title-select-color-etiqueta-selector'>Selecione a Cor:</label>
              <div className="color-options">
                {availableColors.map((color) => (
                  <div
                    key={color}
                    className={`color-option ${color === newSelectedColor ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={hideCreateEtiquetaModal}>Cancelar</button>
              <button className="btn-add-parameter" onClick={saveNewEtiqueta}>Salvar</button>
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
                <div className="item-list-parameter" key={item.id} style={{ borderLeft: `10px solid ${item.color}` }}>
                  <label className="label-item-parameter">{item.order} - {item.description}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeEtiqueta(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editeEtiqueta(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalEtiquetas}>Fechar</button>
              <button className="btn-add-parameter" onClick={showCreateEtiquetaModal}>Adicionar</button>

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
      {/* 
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
      )} */}

      {modalColunas && (
        <div className="parameter-modal">
          <div className="parameter-container">
            <div className="parameter-header">
              <label className="parameter-title">Colunas</label>
            </div>
            <div className="parameter-body">
              {listaColunas?.map((item) => (
                <div className="item-list-parameter" key={item.id}>
                  <label className="label-item-parameter">{item.display_order} - {item.name}</label>
                  <div className="btns-item-list">
                    <button className="btn-remove-item-list" onClick={() => removeColuna(item.id)}>Remover</button>
                    <button className="btn-edite-item-list" onClick={() => editColumn(item)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="parameter-footer">
              <button className="btn-close-parameter" onClick={showModalColunas}>Fechar</button>
              <button className="btn-add-parameter" onClick={openModalCreateColumn}>Adicionar</button>
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


              <label className="label-item-parameter-description">Quando Criar Pedido ir para a Coluna com seguinte nome:</label>
              <div className="item-list-parameter" >
                <label className="label-item-parameter">{colunaStatusPedido}</label>
                <div className="btns-item-list">
                  <button className="btn-edite-item-list" onClick={() => editeColunaStatusPedido()}>Editar</button>
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
