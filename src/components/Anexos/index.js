
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/userContext';
import { useCard } from '../../contexts/cardContext';
import { apiUrl, fileApiUrl } from '../../config/apiConfig';

import { MdCameraAlt, MdAutorenew } from "react-icons/md";


// STYLE
import './style.css';

// Defina os setores e a função getSetorColor fora do componente
const setores = ['Comercial', 'Pedidos', 'Projetos', 'Vistoria', 'Assistência'];

const getSetorColor = (setor) => {
  const cores = {
    'Comercial': '#FF5733',
    'Pedidos': '#33FF57',
    'Projetos': '#3357FF',
    'Vistoria': '#FF33A6',
    'Assistência': '#A633FF'
  };

  return cores[setor] || '#000'; // Retorna preto se o setor não for encontrado
};

const sortAnexosBySetor = (anexos) => {
  return anexos.sort((a, b) => setores.indexOf(a.setor) - setores.indexOf(b.setor));
};

const Anexos = ({ idCard }) => {
  const { user } = useUser();
  const { setOpenCloseAnexosModal } = useCard();

  const [fileLinksCard, setFileLinksCard] = useState([]);
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  const [infoUpload, setInfoUpload] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exigirSalvar, setExigirSalvar] = useState(false);
  const [comment, setComment] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  const [selectedSetor, setSelectedSetor] = useState('');




  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);







  useEffect(() => {
    if (!idCard) return;

    const fetchAnexos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/card/${idCard}/anexos`);
        console.log("Anexos carregados:", response.data);

        const fileLinks = response.data.map(anexo => ({
          id: anexo.id,
          name: anexo.nome_arquivo,
          link: `${fileApiUrl}/uploads/${anexo.nome_arquivo}`,
          tamanho: anexo.tamanho,
          tipo: anexo.tipo_arquivo,
          createdAt: anexo.created_at,
          url: anexo.url,
          comment: anexo.comment,
          setor: anexo.setor,
        }));

        setFileLinksCard(sortAnexosBySetor(fileLinks));
      } catch (error) {
        console.error("Erro ao carregar anexos:", error);
      }
      setIsLoading(false);
    };

    fetchAnexos();
  }, [idCard]);












  const handleFileUpload = async (e) => {
    setIsLoading(true);
    if (!user || !user.empresa_id) {
      console.error("User or empresa_id is not defined.");
      return;
    }

    if (!selectedSetor) {
      window.alert('Por favor, selecione um setor antes de fazer o upload.');
      setIsLoading(false);
      return;
    }

    const files = e.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= MAX_FILE_SIZE_BYTES) {
          setIsSaving(true);
          setExigirSalvar(true);

          const fileParts = file.name.split('.');
          const extension = fileParts.pop();
          const fileName = fileParts.join('.');

          const timestamp = Date.now();
          const newFileName = `${fileName}_C${idCard}_U${user.id}_T${timestamp}.${extension}`;
          const renamedFile = new File([file], newFileName, { type: file.type });

          const formData = new FormData();
          formData.append('file', renamedFile);
          formData.append('empresa_id', user.empresa_id);
          formData.append('idCard', idCard);
          formData.append('comment', comment);
          formData.append('setor', selectedSetor);

          try {
            const response = await axios.post(`${fileApiUrl}/uploads`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            const newAnexo = {
              empresa_id: user.empresa_id,
              url: response.data.filePath,
              nome_arquivo: newFileName,
              tamanho: file.size,
              tipo_arquivo: file.type,
              created_at: new Date().toISOString(),
              comment: comment,
              setor: selectedSetor
            };

            console.log("Enviando anexo:", newAnexo);

            const dbResponse = await axios.post(`${apiUrl}/card/${idCard}/add-anexo`, newAnexo);

            setFileLinksCard((prevLinks) => {
              if (Array.isArray(prevLinks)) {
                return sortAnexosBySetor([...prevLinks, {
                  id: dbResponse.data.id,
                  name: dbResponse.data.nome_arquivo,
                  link: `${fileApiUrl}/uploads/${newFileName}`, // Atualize o link para apontar para o servidor de arquivos
                  tamanho: dbResponse.data.tamanho,
                  tipo_arquivo: dbResponse.data.tipo_arquivo,
                  createdAt: dbResponse.data.created_at,
                  comment: dbResponse.data.comment,
                  setor: dbResponse.data.setor
                }]);
              } else {
                return sortAnexosBySetor([{
                  id: dbResponse.data.id,
                  name: dbResponse.data.nome_arquivo,
                  link: `${fileApiUrl}/uploads/${newFileName}`, // Atualize o link para apontar para o servidor de arquivos
                  tamanho: dbResponse.data.tamanho,
                  tipo_arquivo: dbResponse.data.tipo_arquivo,
                  createdAt: dbResponse.data.created_at,
                  comment: dbResponse.data.comment,
                  setor: dbResponse.data.setor
                }]);
              }
            });

            setIsLoading(false);

          } catch (error) {
            console.error("Erro ao enviar o arquivo:", error);
            window.alert('Erro ao incluir anexo!');
            setIsLoading(false);
          }
          setIsSaving(false);
          setExigirSalvar(false);
        }
      }
    }
  };










  const handleDeleteFile = async (fileId) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este arquivo?');
    if (confirmDelete) {
      setExigirSalvar(true);
      setIsLoading(true);
      const file = fileLinksCard.find(item => item.id === fileId);
      if (file) {
        try {
          console.log("Buscando anexo pelo ID:", file.id);
          const anexoResponse = await axios.get(`${apiUrl}/card/buscar-por-id?id=${file.id}`);
          console.log("Resposta da busca de anexo:", anexoResponse.data);

          if (anexoResponse.data && anexoResponse.data.id) {
            console.log("Deletando anexo do banco de dados:", anexoResponse.data.id);
            const deletedAnexo = await axios.delete(`${apiUrl}/card/${anexoResponse.data.id}/delete-anexo`);
            console.log("Resposta da exclusão do anexo no banco de dados:", deletedAnexo.data);

            if (deletedAnexo.data) {
              console.log("Deletando arquivo do servidor:", file.name);
              const response = await axios.delete(`${fileApiUrl}/uploads/${file.name}`);
              console.log("Resposta da exclusão do arquivo no servidor:", response.data);

              if (response.data.message === 'File deleted successfully') {
                console.log("Arquivo excluído com sucesso:", file.name);
                const updatedFileLinks = fileLinksCard.filter(item => item.id !== fileId);
                setFileLinksCard(updatedFileLinks);
                window.alert('Anexo excluído com sucesso!');
              } else {
                console.log("Erro ao excluir o arquivo no servidor:", response.data);
              }
            } else {
              console.log("Erro ao excluir o anexo no banco de dados:", deletedAnexo.data);
            }
          } else {
            console.log("Anexo não encontrado no banco de dados:", anexoResponse.data);
          }
        } catch (error) {
          console.error("Erro ao excluir o arquivo do servidor ou do banco de dados:", error);
          window.alert('Erro ao excluir anexo!');
        }
      }
      setIsLoading(false);
      setExigirSalvar(false);
    }
  };



  const fileInputRef = useRef(null);







  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // const openCamera = () => {
  //   setIsCameraOpen(true);
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then((stream) => {
  //       videoRef.current.srcObject = stream;
  //       videoRef.current.play();
  //     })
  //     .catch((error) => {
  //       console.error("Erro ao acessar a câmera:", error);
  //       setIsCameraOpen(false);
  //     });
  // };

  const openCamera = () => {
    setIsCameraOpen(true);
    const constraints = {
      video: {
        facingMode: isUsingFrontCamera ? 'user' : 'environment'
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.error("Erro ao acessar a câmera:", error);
        setIsCameraOpen(false);
      });
  };


  const switchCamera = () => {
    setIsUsingFrontCamera((prevState) => !prevState);
    openCamera();
  };



  const capturePhoto = () => {
    setIsSavingPhoto(true);
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const photo = canvasRef.current.toDataURL('image/png');

    // Convert data URL to file and handle upload
    handleUploadCapturedPhoto(photo);
  };



  // const handleUploadCapturedPhoto = async (photo) => {


  const handleUploadCapturedPhoto = async (photo) => {
    const blob = await (await fetch(photo)).blob();
    const file = new File([blob], `captured_image_C${idCard}_U${user.id}_T${Date.now()}.png`, { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('empresa_id', user.empresa_id);
    formData.append('idCard', idCard);
    formData.append('comment', comment);
    formData.append('setor', selectedSetor);

    try {
      const response = await axios.post(`${fileApiUrl}/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newAnexo = {
        empresa_id: user.empresa_id,
        url: response.data.filePath,
        nome_arquivo: file.name,
        tamanho: file.size,
        tipo_arquivo: file.type,
        created_at: new Date().toISOString(),
        comment: comment,
        setor: selectedSetor
      };

      const dbResponse = await axios.post(`${apiUrl}/card/${idCard}/add-anexo`, newAnexo);

      setFileLinksCard((prevLinks) => sortAnexosBySetor([...prevLinks, {
        id: dbResponse.data.id,
        name: dbResponse.data.nome_arquivo,
        link: `${fileApiUrl}/uploads/${file.name}`,
        tamanho: dbResponse.data.tamanho,
        tipo_arquivo: dbResponse.data.tipo_arquivo,
        createdAt: dbResponse.data.created_at,
        comment: dbResponse.data.comment,
        setor: dbResponse.data.setor
      }]));

      setIsCameraOpen(false); // Close the camera modal
    } catch (error) {
      console.error("Erro ao enviar a foto capturada:", error);
      window.alert('Erro ao incluir anexo!');
    } finally {
      // Ensure camera is closed
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setIsSavingPhoto(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };


  const handleDownloadFile = (fileUrl, fileName) => {
    const cacheBustingParam = `?t=${new Date().getTime()}`;
    const downloadUrl = `${fileUrl}${cacheBustingParam}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };







  return (
    <div className='geral-modal'>
      {isLoading && <div className="loading-overlay">Aguarde...</div>}
      <div className={`geral-container ${isLoading || isSaving ? 'loading' : ''}`}>
        <div className='geral-header'>
          <div className='geral-header-title'>
            <label>Anexos</label>
          </div>
          <button className="geral-header-close-button" onClick={() => setOpenCloseAnexosModal(false)}>X</button>
        </div>
        <label className='info-upload-arquivo'>{infoUpload}</label>
        <ul className='geral-body-container'>





          {fileLinksCard && fileLinksCard.length > 0 && (
            fileLinksCard.map((file, index) => {
              const displayName = file.name ? file.name.replace(/_\d+$/, '') : 'Nome não disponível';
              const isFirebaseStorageLink = file.url && file.url.includes('firebasestorage');
              const setorColor = getSetorColor(file.setor);

              return (
                <li className='item-arquivo' key={index}>
                  <div className='file-info'>
                    {isFirebaseStorageLink ? (
                      <a className='link-anexo' href={`${file.url}`} target="_blank" rel="noopener noreferrer">
                        {index + 1}
                      </a>
                    ) : (
                      <a className='link-anexo' href={`${file.link}`} target="_blank" rel="noopener noreferrer">
                        {index + 1}
                      </a>
                    )}

                    <div className='descricao-anexos'>
                      Setor:
                      <span style={{ backgroundColor: setorColor, marginLeft: '5px', padding: '1px 5px', borderRadius: '3px', color: '#fff' }}>
                        {file.setor ? file.setor : ''}
                      </span>
                    </div>
                    <div className='descricao-anexos'>Nome: {displayName || 'Desconhecido'}</div>
                    <div className='descricao-anexos'>Tipo: {file.tipo || 'Desconhecido'}</div>
                    <div className='descricao-anexos'>Tamanho: {file.tamanho ? (file.tamanho / 1024).toFixed(2) + ' KB' : 'Desconhecido'}</div>
                    <div className='descricao-anexos'>Criado em: {file.createdAt ? new Date(file.createdAt).toLocaleString() : 'Desconhecido'}</div>
                    <div className='descricao-anexos'>Comentários: {file.comment ? file.comment : ''}</div>
                    <div className='container-btns-anexo-item'>
                      <button className='btn-delete-anexo' onClick={() => handleDeleteFile(file.id)}>Excluir</button>
                      <button className='btn-download-anexo' onClick={() => handleDownloadFile(file.link, file.name)}>Baixar</button>
                    </div>

                  </div>
                </li>
              );
            })
          )}






        </ul>

        <div className="geral-footer">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Adicionar comentário"
            className="input-comentario"
          />
          <select
            value={selectedSetor}
            onChange={(e) => setSelectedSetor(e.target.value)}
            className="select-setor"
          >
            <option value="">Selecione um setor</option>
            {setores.map((setor, index) => (
              <option key={index} value={setor}>{setor}</option>
            ))}
          </select>


          <input
            type="file"
            ref={fileInputRef}
            className="input-anexos"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="geral-footer-btn-add"
            onClick={() => fileInputRef.current.click()}
          >
            Adicionar
          </button>
          <button
            type="button"
            className="btn-camera"
            onClick={openCamera}
          >
            <MdCameraAlt />
          </button>


          {isCameraOpen && (
            <div className="camera-modal">
              <video ref={videoRef} className="video-stream"></video>
              <div className='btns-cam-anexos'>
                <button onClick={closeCamera} className="capture-button" disabled={isSavingPhoto}>
                  Cancelar
                </button>
                <button onClick={switchCamera} className="switch-camera-button" disabled={isSavingPhoto}><MdAutorenew /></button>
                <button onClick={capturePhoto} className="capture-button" disabled={isSavingPhoto}>
                  {isSavingPhoto ? 'Salvando...' : 'Capturar'}
                </button>

              </div>
            </div>
          )}



          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>




        </div>
      </div>
    </div>
  );
};

export default Anexos;
