import React, { useState, useEffect } from 'react';
import './style.css';
import { useUser } from '../../contexts/userContext';

// API
import { apiUrl } from '../../config/apiConfig';
import axios from 'axios';

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../../assets/avatares', false, /\.(JPG|jpeg)$/));




function Avatar() {
  const { setOpenCloseModalAvatar, setUserAvatar, user } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState(null);


  const updateAvatar = async (avatar) => {

    try {
      const userData = {
        avatar: avatar,
      };
      const response = await axios.put(`${apiUrl}/users/${user.id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserAvatar(avatar)

    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
    }
  };


  const handleAvatarClick = (avatarName) => {
    setSelectedAvatar(avatarName);
    updateAvatar(avatarName)
    // Aqui você pode adicionar lógica para atualizar a variável que precisa do nome do avatar
    console.log("Avatar selecionado:", avatarName);
    setOpenCloseModalAvatar(false)
  };

  return (
    <div className="avatar-modal">
      <div className="avatar-container">
      <div className="avatar-body">
        <button className='btn-close-modal-avatar' onClick={() => setOpenCloseModalAvatar(false)}>x</button>
        <div className="avatar-list">
          {Object.keys(images).map((key) => (
            <img
              key={key}
              src={images[key]}
              alt={key}
              className={`avatar-item ${selectedAvatar === key ? 'selected' : ''}`}
              onClick={() => handleAvatarClick(key)}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avatar;
