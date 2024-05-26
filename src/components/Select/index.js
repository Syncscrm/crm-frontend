import React, { useState } from 'react';
import './style.css';

function Select({ lista }) {
  const [selectedAfilhados, setSelectedAfilhados] = useState([]);

  const handleSelectChange = (id) => {
    setSelectedAfilhados(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(afilhadoId => afilhadoId !== id)
        : [...prevSelected, id]
    );
  };

  const showSelected = () => {
    console.log('Selected IDs:', selectedAfilhados);
  };

  React.useEffect(() => {
    showSelected();
  }, [selectedAfilhados]);

  return (
    <div>

      <div id="afilhadosSelect" className='select-filter'>
        {lista.map(afilhado => (
          <div
            key={afilhado.id}
            className={`select-filter-option ${selectedAfilhados.includes(afilhado.id) ? 'selected' : ''}`}
            style={{backgroundColor: selectedAfilhados.includes(afilhado.id) ? 'red' : ''}}
            onClick={() => handleSelectChange(afilhado.id)}
          >
            {afilhado.username}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;
