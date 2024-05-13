import React, { useState } from 'react';

import Header from '../../Header'
import CreateNewUser from '../../forms/CreateUser'

import './style.css';
import ListUsers from '../../forms/ListUsers';
import UpdateUser from '../../forms/UpdateUser';
import { useUser } from '../../../contexts/userContext';

function UsersPage() {

  const { user } = useUser(); // Acesso ao estado global do usuário

  const { openCloseCreateUser, openModalCreateUser } = useUser();

  function createNewUser() {
    //openModalUpdateUser();
  }

  return (
    <div className='users-page-container'>
      <Header />
      <div className='tools-container'></div>
      <div className='users-body-container'>
        <ListUsers />
        {openCloseCreateUser && (
          <CreateNewUser />
        )}

      </div>

      <button className='users-page-floating-button' onClick={openModalCreateUser}>+</button>


    </div>

  );
}

export default UsersPage;
