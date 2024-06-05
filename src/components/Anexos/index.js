import React, { useState, useEffect } from 'react';
import api, { findFile } from '../api/api'; // Certifique-se de que o caminho está correto

// STYLE
import './style.css';

const Anexos = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState('');
  const [foundFile, setFoundFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/upload/list');
      setFiles(response.data);
      setLoading(false);
      console.log('Files fetched:', response.data);
    } catch (error) {
      console.error('Error fetching files', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFindFile = async () => {
    try {
      const result = await findFile(fileName);
      setFoundFile(result.filePath);
      console.log('File found:', result);
    } catch (error) {
      console.error('Error finding file', error);
      setFoundFile(null);
    }
  };

  return (
    <div className='anexos-modal'>
      <div className='anexos-container'>
        <h2>Anexos</h2>
        <div>
          {loading ? (
            <p>Carregando anexos...</p>
          ) : (
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <a href={`http://localhost:3002/upload/${file}`} download>{file}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Enviar</button>
        </div>
        <div>
          <input 
            type="text" 
            value={fileName} 
            onChange={handleFileNameChange} 
            placeholder="Digite o nome do arquivo" 
          />
          <button onClick={handleFindFile}>Buscar</button>
        </div>
        {foundFile && (
          <div>
            <p>Arquivo encontrado:</p>
            <a href={`http://localhost:3002/upload/${foundFile}`} download>{fileName}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anexos;
