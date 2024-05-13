import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import { useColumns } from '../../../contexts/columnsContext';
import { useUser } from '../../../contexts/userContext';

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

  return (
    <div className='list-columns-container'>
      {columns.length > 0 ? (
        <div className='list-columns'>
          {columns.map((column) => (
            <li key={column.id} className='item-list-users'>  
              <label className='list-user-label-username'>{column.name}</label>
              <div className='list-user-logo-container'>
                <label className='label-is-active' >Order: {column.display_order}</label>
              </div>
            </li>
          ))}
        </div>
      ) : (
        <p>Nenhuma coluna de processo encontrada.</p>
      )}
    </div>
  );
};

export default ListColumns;
