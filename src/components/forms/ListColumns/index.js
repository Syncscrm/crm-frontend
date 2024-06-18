import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import { useColumns } from '../../../contexts/columnsContext';
import { useUser } from '../../../contexts/userContext';

// STYLE
import './style.css';

const ListColumns = () => {
  const { columns, setColumns } = useColumns();
  const { user } = useUser();

  useEffect(() => {
    const fetchColumns = async () => {
      if (user && user.empresa_id) {
        const empresaId = user.empresa_id;

        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          };
          const response = await axios.get(`${apiUrl}/process-columns/by-company/${empresaId}`, config);
          console.log("API response:", response.data);

          // Se o resultado é um objeto, coloque-o dentro de um array
          if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            setColumns([response.data]); // Colocando o objeto dentro de um array
          } else {
            setColumns(response.data); // Se já for um array, apenas defina como estado
          }
        } catch (error) {
          console.error('Erro ao buscar colunas:', error);
          setColumns([]);
        }
      }
    };

    fetchColumns();
  }, [user?.empresa_id]);

  useEffect(() => {
    console.log('Columns:', columns);
  }, [columns]);



  const handleEdit = async (column) => {
    const newName = prompt('Novo nome:', column.name);
    if (newName) {
      try {
        await axios.put(`${apiUrl}/process-columns/${column.id}`, { name: newName }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Atualize a lista de colunas após a edição
        setColumns(columns.map(col => col.id === column.id ? { ...col, name: newName } : col));
      } catch (error) {
        console.error('Erro ao editar coluna:', error);
      }
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/process-columns/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Atualize a lista de colunas após a exclusão
      setColumns(columns.filter(col => col.id !== id));
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
    }
  };



  return (
    <div className='list-columns-container'>
      {columns.map((column) => (
        <li key={column.id} className='item-list-columns'>
          <label className='list-column-label-name'>{column.name}</label>
          <div className='list-column-actions-container'>
            <button className='btn-edite-column' onClick={() => handleEdit(column)}>Editar</button>
            <button className='btn-delete-column'onClick={() => handleDelete(column.id)}>Excluir</button>
          </div>
        </li>
      ))}

    </div>
  );
};

export default ListColumns;
