import React, { useState, useContext, useEffect } from 'react';
import './style.css';

import { ExcelRenderer } from 'react-excel-renderer';

// CONTEXT API
import { useUser } from '../../contexts/userContext'
import { useColumns } from '../../contexts/columnsContext';

import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

// IDs ÚNICOS
import { v4 as uuidv4 } from 'uuid';

// DATE
import { format, addDays, subDays } from 'date-fns';

function ImportExcel() {

  const { columns } = useColumns();

  const {user, listAllUsers, setOpenCloseImportExcelEntidades } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(listAllUsers)
  }, [listAllUsers])

  useEffect(() => {

    console.log(columns)
  }, [columns])


  // PEGAR ID CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarIdReferencia(entidade) {
    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
    const id = listaFiltrada.map((item) => item.id);

    return id.toString();
  }

  // PEGAR NOME CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarNameReferencia(entidade) {
    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
    const name = listaFiltrada.map((item) => item.username);

    return name.toString();
  }


  // PEGAR FONE CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarFoneReferencia(entidade) {

    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);

    //console.log(listaFiltrada)
    const fone = listaFiltrada.map((item) => item.fone);

    return fone.toString();
  }

  {loading && <label className='infos-import-excel'>Carregando...</label>}

  // PEGAR NOME CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarEstadoReferencia(entidade) {


    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
    const estado = listaFiltrada.map((item) => item.state);

    return estado.toString();
  }

  // PEGAR NOME CORRESPONDENTE PREFWEB / SUITEFLOW
  function buscarCidadeReferencia(entidade) {
    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
    const city = listaFiltrada.map((item) => item.city);

    return city.toString();
  }

  const [numRowsLoaded, setNumRowsLoaded] = useState(0);
  const [numCardsLoaded, setNumCardsLoaded] = useState(0);

  const handleFileUpload = (event) => {

    setLoading(true);

    const fileObj = event.target.files[0];

    // IMPORTAÇÃO PADRÃO PREFWEB
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.error(err);
        setLoading(false);
        return;
      }

      // Acessando os dados do arquivo Excel
      const rows = resp.rows;

      if (rows.length <= 1) {
        console.error('Nenhuma linha encontrada no arquivo Excel.');
        setLoading(false);
        return;
      }

      // Remove a primeira linha (cabeçalho)
      const dataRows = rows.slice(1);

      setNumRowsLoaded(dataRows.length);


      // FUNÇÃO PARA PEGAR AS INFORMAÇÕES DO EXCEL E JÁ SALVAR NO FIREBASE
      const addCardFirestore = async (row, currentNumCardsLoaded) => {

        const [
          documento_card,
          versao,
          name,
          date,
          valor,
          entidade,
        ] = row;

        // Função para converter o número de série de data para o formato 'dd/mm/aaaa'
        function convertExcelDate(serialDate) {
          // Número de série de data base do Excel (1º de janeiro de 1900)
          const excelBaseDate = new Date(1900, 0, 1);

          // Adiciona o número de dias do número de série de data ao Excel base date
          let date = addDays(excelBaseDate, serialDate);

          // Subtrai 2 dias para corrigir o deslocamento
          date = subDays(date, 2);

          // Formata a data no formato 'dd/mm/aaaa'
          const dateTexto = format(date, 'dd/MM/yyyy');

          // formatar data do tipo texto em Date()
          const partesData = dateTexto.split('/');
          const formattedDate = new Date(partesData[2], partesData[1] - 1, partesData[0]);

          return formattedDate;
        }

        const columnFinalizados = columns.find(item => item.name === 'Import'); // Use "find" em vez de "filter"
        const idColumnFinalizados = columnFinalizados.id;

        if (!idColumnFinalizados || idColumnFinalizados == '') {
          console.log('Coluna Import não Ativa');
          return;
        }

        if (versao != 'Versão 1' && versao != 1) {
          console.log('A versão do documento não corresponde a Versão 1');
          return;
        }

        if (entidade === '') {
          console.log('Referência da Entidade Vazia');
          return;
        }

        if (buscarIdReferencia(entidade) === "") {
          console.log('Não existem entidade!!!');
          return;
        }



        try {

          const cardData = {
            name: name ? name : '',
            state: '',
            city: '',
            fone: '',
            email: '',
            column_id: idColumnFinalizados,
            entity_id: buscarIdReferencia(entidade),
            empresa_id: user.empresa_id,
            document_number: documento_card ? documento_card : '',
            cost_value:valor ? valor : 0,
          };

          await axios.post(`${apiUrl}/card/import`, cardData);

          setNumCardsLoaded(currentNumCardsLoaded + 1);

          setOpenCloseImportExcelEntidades(false)

        } catch (error) {
          console.error(error);
          console.error('ERRO AO IMPORTAR');
        }

      };

      // Iterar sobre as linhas de dados e criar documentos no Firestore
      for (const row of dataRows) {
        addCardFirestore(row, numCardsLoaded);
      }

      setLoading(false);

    });

  };

  const [infoImport, setInfoImport] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadButtonClick = () => {
    if (selectedFile) {
      const fakeEvent = {
        target: {
          files: [selectedFile]
        }
      };
      handleFileUpload(fakeEvent);
    } else {
      console.error('Nenhum arquivo selecionado.');
    }
  };

  const storageUrl = 'https://firebasestorage.googleapis.com/v0/b/suiteflow-1c751.appspot.com/o/Planilha%20de%20importa%C3%A7%C3%A3o%20SuiteFlow.xlsx?alt=media';

  const handleDownload = () => {
    window.open(storageUrl, '_blank');
  };



  return (
    <div className='modal-import-container'>
      <div className='import-container'>
        <div className='import-header'>
          <label className='title'>Importar informações do Excel</label>
        </div>
        <div className='import-body'>
          <input className='input-import-file' type='file' onChange={handleInputChange} />

          <div className='tabela-padrao'>
            <label className='title-table'>Referência de tabela</label>
            <label className='title-table' style={{ color: 'red' }}>{infoImport}</label>
            <div className='tabela'>

              <label className='column-table'>Número do orçamento</label>
              <label className='column-table'>Versão</label>
              <label className='column-table'>Nome do Cliente</label>
              <label className='column-table'>Data</label>
              <label className='column-table'>Valor</label>
              <label className='column-table'>Nome da Entidade</label>
            </div>

          </div>

          {loading && <label className='infos-import-excel'>Carregando...</label>}

          {
            numRowsLoaded > 0 ? <label className='infos-import-excel'>Linhas no arquivo: {numRowsLoaded}</label> : <></>
          }

          {
            numCardsLoaded > 1000000000 ? <label className='title-table'>Cards carregados: {numCardsLoaded}</label> : <></>
          }

          <label className='planilha-excel-exemplo' onClick={handleDownload}>Baixar planilha de exemplo...</label>

        </div>

        <div className='import-footer'>
          <button className='btn-close-import' disabled={loading} style={{ background: loading ? "rgba(0, 0, 0, 0.05)" : '' }} onClick={() => setOpenCloseImportExcelEntidades(false)} >
            Fechar
          </button>
          <button className='btn-send-import' disabled={loading} style={{ background: loading ? "rgba(0, 0, 0, 0.05)" : '' }} onClick={handleUploadButtonClick}>
            Enviar
          </button>

        </div>
      </div>
    </div>
  );
}

export default ImportExcel;
