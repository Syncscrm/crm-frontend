import React, { useState, useEffect } from 'react';

import { useColumns } from '../../contexts/columnsContext';

// STYLE
import './style.css'

function Loading() {

  const { loadingResult, loadingModal, setLoadingModal } = useColumns();

  return (
    <>
      {
        loadingModal &&
        <div className='loading-modal'>

          <div className='loading-container'>
            <div className='footer-loading-container'>
              <button onClick={() => setLoadingModal(false)} className='btn-close-loading-component'>x</button>
            </div>
            <label className='label-loading'>{loadingResult}</label>

          </div>


        </div>
      }
    </>

  );
}

export default Loading;

