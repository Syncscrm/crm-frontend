import React, { useState } from 'react';

import Header from '../../Header'
import CreateColumns from '../../forms/CreateColumns'

import './style.css';
import ListUsers from '../../forms/ListUsers';
import UpdateUser from '../../forms/UpdateUser';
import { useUser } from '../../../contexts/userContext';
import { useColumns } from  '../../../contexts/columnsContext';
import ListColumns from '../../forms/ListColumns';

function ColumnsPage() {

  const { user } = useUser(); // Acesso ao estado global do usuário

  const { openCloseCreateColumn, openModalCreateColumn } = useColumns();

  function createNewUser() {
    //openModalUpdateUser();
  }

  return (
    <div className='users-page-container'>
      <Header />
      <div className='users-body-container'>
        <ListColumns />
        {openCloseCreateColumn && (
          <CreateColumns />
        )}

      </div>

      <button className='admin-floating-button' onClick={openModalCreateColumn}>+</button>


    </div>

  );
}

export default ColumnsPage;
