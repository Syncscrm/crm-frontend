import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import { ExcelRenderer } from 'react-excel-renderer';

// CONTEXT API
import { useUser } from '../../contexts/userContext';

import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import { fromZonedTime } from 'date-fns-tz';

import { parseISO, formatISO } from 'date-fns';

function ImportExcelSuiteFlow() {
  const { user, listAllUsers, setOpenCloseImportExcelSuiteFlow } = useUser();

  const [loading, setLoading] = useState(false);
  const [numRowsLoaded, setNumRowsLoaded] = useState(0);
  const [numCardsLoaded, setNumCardsLoaded] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const intervalRef = useRef(null);


  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [loading]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (numCardsLoaded > 0 && numRowsLoaded > 0) {
        const remainingCards = numRowsLoaded - numCardsLoaded;
        const averageTimePerCard = elapsedTime / numCardsLoaded;
        const estimatedTimeRemaining = Math.round(averageTimePerCard * remainingCards);
        setEstimatedTime(estimatedTimeRemaining);
      }
    }, 500); // Delay para debouncing

    return () => clearTimeout(debounce);
  }, [numCardsLoaded, numRowsLoaded, elapsedTime]);




  function buscarIdReferencia(entidade) {
    const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
    const id = listaFiltrada.map((item) => item.id);

    if (entidade == user.username) {
      id.push(user.id);
    }

    return id.toString();
  }

  // function buscarIdReferencia(entidade) {
  //   const listaFiltrada = listAllUsers.filter((item) => item.entidade === entidade);
  //   const id = listaFiltrada.map((item) => item.id);

  //   // Adiciona o ID do usuário atual se não estiver já na lista
  //   if (!id.includes(user.id)) {
  //     id.push(user.id);
  //   }

  //   return id.toString();
  // }


  const handleFileUpload = (event) => {
    setLoading(true);
    setElapsedTime(0);

    const fileObj = event.target.files[0];

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.error(err);
        setLoading(false);
        return;
      }

      const rows = resp.rows;

      if (rows.length <= 1) {
        console.error('Nenhuma linha encontrada no arquivo Excel.');
        setLoading(false);
        return;
      }

      const dataRows = rows.slice(1);
      setNumRowsLoaded(dataRows.length);

      const batchSize = 990; // Tamanho do lote
      let currentNumCardsLoaded = 0;

      const processBatch = async (batch) => {
        for (const row of batch) {
          await addCardFirestore(row, currentNumCardsLoaded);
          currentNumCardsLoaded++;
        }
        setNumCardsLoaded(currentNumCardsLoaded);
      };

      const processAllBatches = async () => {
        for (let i = 0; i < dataRows.length; i += batchSize) {
          const batch = dataRows.slice(i, i + batchSize);
          await processBatch(batch);
          await new Promise((resolve) => setTimeout(resolve, 20)); /////  ajustar aqui <<<<<<<<<<
        }
        setLoading(false);
      };

      processAllBatches();
    });
  };

  const columnMapping = {
    42414: 9,
    42453: 29,
    42415: 6,
    42416: 7,
    42417: 30,
    42418: 16,
    42419: 17,
    42430: 28,
    42431: 27,
    42432: 22,
    42433: 31,
    42434: 21,
    42442: 32,
    42441: 14,
    42444: 33,
    42445: 13,
    42457: 34,
    42452: 25,
    42421: 23,
    42420: 20
  };

  const getMappedColumnId = (excelColumnId) => {
    return columnMapping[excelColumnId] || null;
  };


  const addCardFirestore = async (row, currentNumCardsLoaded) => {
    const [
      numero_orcamento_1,
      versao,
      nome_cliente_1,
      createDate,
      valor,
      entidade,
      origem,
      id_card,
      id_column,
      pedido_orcamento_2,
      nome_cliente_2,
      nome_obra,
      valor_2,
      valor_venda,
      cidade,
      estado,
      fone,
      email,
      previsao_de_venda,
      origem_2,
      date_2,
      potencial_de_venda,
      etiqueta,
      status_date,
      lista_de_tarefas,
      lista_historico,
      produto,
      status,
      id_create_by,
      name_create_by,
      parceiro_indicador_2,
      contato_responsavel,
      motivo_venda_perdida,
      lista_anexos,
      previsao_entrega,
      horas_producao,
      previsao_instalacao,
      previsao_assistencia,
      etapa_producao,
      lista_compartilhamento,
      cor,
      updateDate,
      prioridade,
      previsao_producao,
      recebimento_medidas,
      prazo_entrega,
      numero_pedido,
      numero_quadros,
      metros_quadrados,
      quantidade_esquadrias,
      entrega_vidro,
      status_vidro,
      fornecedor_vidro,
      conclusao_producao
    ] = row;

    const mappedColumnId = getMappedColumnId(id_column);

    if (!mappedColumnId) {
      console.log('Coluna do Excel não corresponde a nenhuma coluna do sistema!');
      return;
    }

    if (entidade === '') {
      console.log('Referência da Entidade Vazia - name_create_by', name_create_by, nome_cliente_1, id_create_by);
      return;
    }

    if (buscarIdReferencia(entidade) === "") {
      console.log('Não existem entidade!!!', entidade);
      return;
    }

    try {
      function parseCurrency(value) {
        let numericString = value.replace('R$', '').replace(/\s/g, '');
        numericString = numericString.replace(',', '.');

        const parts = numericString.split('.');
        if (parts.length > 2) {
          numericString = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }

        return parseFloat(numericString);
      }






      // Função para converter a data no formato YYYY-MM-DD para um objeto Date
      function convertISOToJavaScriptDate(isoDateString, nome_cliente_1) {
        if (typeof isoDateString !== 'string' || isoDateString.trim() === '') {
          console.error('Entrada fornecida não é uma string válida:', isoDateString);
          console.error('Entrada fornecida não é uma string válida:', isoDateString, 'nome:', nome_cliente_1);
          return null;
        }

        const dateObject = new Date(isoDateString);
        if (isNaN(dateObject.getTime())) {
          console.error('A string ISO fornecida não é uma data válida:', isoDateString);
          console.error('A string ISO fornecida não é uma data válida:', isoDateString, 'nome:', nome_cliente_1);
          return null;
        }

        return dateObject;
      }




      function convertBRDateToJavaScriptDate(brDateString, nome_cliente_1) {
        // if (typeof brDateString !== 'string' || brDateString.trim() === '') {
        //   console.error('Entrada fornecida não é uma string válida:', brDateString);
        //   console.error('Entrada fornecida não é uma string válida:', brDateString, 'nome:', nome_cliente_1);
        //   return null;
        // }

        // Remove todos os espaços em branco extras
        brDateString = brDateString.trim();

        // Verifica se a string resultante está vazia
        if (brDateString === '') {
          return null;
        }

        // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
        const dateParts = brDateString.split('/').map(part => part.trim());
        if (dateParts.length !== 3) {
          console.error('Formato de data inválido:', brDateString);
          console.error('Formato de data inválido:', brDateString, 'nome:', nome_cliente_1);
          return null;
        }

        const isoDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const dateObject = new Date(isoDateString);
        if (isNaN(dateObject.getTime())) {
          console.error('A string ISO fornecida não é uma data válida:', isoDateString);
          console.error('A string ISO fornecida não é uma data válida:', isoDateString, 'nome:', nome_cliente_1);
          return null;
        }

        return dateObject;
      }



      function convertBRDateToISO(brDateString, nome_cliente_1) {
        // Remove espaços em branco extras
        brDateString = brDateString.trim();

        // Verifica se a string resultante está vazia
        if (brDateString === '') {
          return null;
        }

        // Separa a data e a hora
        const [datePart, timePart] = brDateString.split(' ').filter(part => part.trim() !== '');

        if (!datePart || !timePart) {
          console.error('Formato de data e hora inválido:', brDateString, 'nome:', nome_cliente_1);
          return null;
        }

        // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
        const dateParts = datePart.split('/').map(part => part.trim());
        if (dateParts.length !== 3) {
          console.error('Formato de data inválido:', brDateString, 'nome:', nome_cliente_1);
          return null;
        }

        // Formata a data e a hora em ISO 8601 com timezone (UTC)
        const isoDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}.000Z`;
        const dateObject = new Date(isoDateString);
        if (isNaN(dateObject.getTime())) {
          console.error('A string ISO fornecida não é uma data válida:', isoDateString, 'nome:', nome_cliente_1);
          return null;
        }

        return isoDateString;
      }


      // Função para converter ISO date string para timestamp com timezone
      function convertISOToTimestampWithTZ(isoDateString) {
        if (typeof isoDateString !== 'string' || isoDateString.trim() === '') {
          console.error('Entrada fornecida não é uma string válida:', isoDateString);
          return null;
        }

        try {
          const date = parseISO(isoDateString);
          return formatISO(date);
        } catch (error) {
          console.error('Erro ao converter ISO date string:', error);
          return null;
        }
      }




      function excelDateToJSDate(serial) {
        var days = Math.floor(serial - 25569); // 25569 é o número de dias de 30/12/1899 até 01/01/1970
        var value = serial - days - 25569;
        var seconds = Math.floor(86400 * value);
        var date = new Date(days * 86400000 + (seconds * 1000));
        return date;
      }


      const cardData = {
        created_at: convertISOToTimestampWithTZ(createDate),
        name: nome_cliente_1 ? nome_cliente_1 : '',
        document_number: numero_orcamento_1 ? numero_orcamento_1 : '',
        cost_value: valor ? parseCurrency(valor) : 0,
        column_id: mappedColumnId,
        entity_id: buscarIdReferencia(entidade),
        empresa_id: user.empresa_id,
        origem: origem,
        sale_value: valor_venda ? parseCurrency(valor_venda) : 0,
        potencial_venda: potencial_de_venda,
        produto: produto,
        status: status,
        motivo_venda_perdida: motivo_venda_perdida,
        nivel_prioridade: prioridade === 'Média' ? 5 : prioridade === 'Alta' ? 4 : prioridade === 'Aguardando Informação' ? 2 : prioridade === 'Recusado' ? 6 : prioridade === 'Alteração de Pedido' ? 3 : prioridade === 'Normal' ? 1 : 1,
        status_date: convertISOToTimestampWithTZ(status_date),
        updated_at: convertISOToTimestampWithTZ(updateDate),
        email: email ? email : '',
        fone: fone ? fone : '',
        state: estado ? estado : '',
        city: cidade ? cidade : '',
        pedido_number: numero_pedido ? numero_pedido : '',
        etapa_producao: etapa_producao ? etapa_producao : 0,
        etiqueta_id: prioridade === 'Média' ? 5 : prioridade === 'Alta' ? 4 : prioridade === 'Aguardando Informação' ? 2 : prioridade === 'Recusado' ? 6 : prioridade === 'Alteração de Pedido' ? 3 : prioridade === 'Normal' ? 1 : 1,
      };

      const response = await axios.post(`${apiUrl}/card/import-suiteflow`, cardData);
      const cardId = response.data.card_id;

      setNumCardsLoaded(currentNumCardsLoaded + 1);

      try {

        const esquadriaData = {
          card_id: cardId,
          nome_obra: nome_obra ? nome_obra : '',
          contato_obra: contato_responsavel ? contato_responsavel : '',
          previsao_medicao: recebimento_medidas ? convertBRDateToJavaScriptDate(recebimento_medidas) : null,
          status_medicao: recebimento_medidas ? 'EmAndamento' : 'Parado',
          previsao_producao: previsao_producao ? convertBRDateToJavaScriptDate(previsao_producao) : null,
          status_producao: (previsao_producao && conclusao_producao) ? 'Pronto' : (previsao_producao && !conclusao_producao) ? 'EmAndamento' : 'Parado',
          previsao_entrega_vidro: entrega_vidro ? convertBRDateToJavaScriptDate(entrega_vidro) : null,
          status_entrega_vidro: status_vidro
            ? (status_vidro === 'Entregue'
              ? 'Pronto'
              : status_vidro === 'Solicitado'
                ? 'Em Andamento'
                : status_vidro === 'Aguardando a Compra'
                  ? 'Parado'
                  : status_vidro === 'Entrega Parcial'
                    ? 'Em Andamento'
                    : 'Parado')
            : 'Parado',
          previsao_vistoria_pre: null,
          status_vistoria_pre: 'Parado',
          previsao_entrega_obra: previsao_entrega ? convertBRDateToJavaScriptDate(previsao_entrega) : null,
          status_entrega_obra: previsao_entrega ? 'EmAndamento' : 'Parado',
          previsao_instalacao: previsao_instalacao ? convertBRDateToJavaScriptDate(previsao_instalacao) : null,
          status_instalacao: previsao_instalacao ? 'EmAndamento' : 'Parado',
          previsao_vistoria_pos: null,
          status_vistoria_pos: 'Parado',
          previsao_assistencia: previsao_assistencia ? convertBRDateToJavaScriptDate(previsao_assistencia) : null,
          status_assistencia: previsao_assistencia ? 'EmAndamento' : 'Parado',
          horas_producao: horas_producao ? horas_producao : 0,
          quantidade_esquadrias: quantidade_esquadrias ? quantidade_esquadrias : 0,
          quantidade_quadros: numero_quadros ? numero_quadros : 0,
          metros_quadrados: metros_quadrados ? metros_quadrados : 0,
          cor: cor ? cor : '',
          obs: fornecedor_vidro ? fornecedor_vidro : '',
          empresa_id: user.empresa_id,
          prazo_entrega: prazo_entrega ? convertBRDateToJavaScriptDate(prazo_entrega.trim(), nome_cliente_1) : null,
          status_prazo_entrega: 'EmAndamento',
        };

        const response = await axios.post(`${apiUrl}/card/upsert`, esquadriaData);

        try {
          const historicos = JSON.parse(lista_historico);

          function parseDateString(dateStr) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const formattedDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
              return new Date(formattedDateStr).toISOString();
            }
            throw new Error('Data inválida: ' + dateStr);
          }

          for (const historico of historicos) {
            const historyData = {
              card_id: cardId,
              user_id: buscarIdReferencia(entidade),
              action_type: 'Update',
              description: historico.title ? historico.title : '',
              card_status: status ? status : false,
              create_at: parseDateString(historico.date) ? parseDateString(historico.date) : null,
              empresa_id: user.empresa_id,
            };

            const response = await axios.post(`${apiUrl}/card/add-history-import-suiteflow`, historyData);
          }

          try {
            const tarefas = JSON.parse(lista_de_tarefas);



            for (const tarefa of tarefas) {
              const tasksData = {
                user_id: buscarIdReferencia(entidade),
                card_id: cardId,
                description: tarefa.title ? tarefa.title : '',
                task_type: 'Card',
                due_date: parseDateString(tarefa.date),
                completed: tarefa.status ? tarefa.status : false,
                empresa_id: user.empresa_id,
              };

              const response = await axios.post(`${apiUrl}/card/add-tarefa`, tasksData);
            }


            try {
              const anexos = JSON.parse(lista_anexos);

              for (const anexo of anexos) {

                const newAnexo = {
                  empresa_id: user.empresa_id,
                  url: anexo.link,
                  nome_arquivo: anexo.name,
                  tamanho: 0,
                  tipo_arquivo: '',
                  created_at: new Date().toISOString()
                };

                const response = await axios.post(`${apiUrl}/card/${cardId}/add-anexo`, newAnexo);

              }
            } catch (error) {
              console.error('Erro anexos', error);
            }


          } catch (error) {
            console.error('Erro tarefas', error);
          }
        } catch (error) {
          console.error('Erro history', error);
        }
      } catch (error) {
        console.error('Erro módulo de esquadrias:', error);
      }
    } catch (error) {
      console.error('Erro Card');
    }
  };


  const handleInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadButtonClick = () => {
    if (selectedFile) {
      const fakeEvent = {
        target: {
          files: [selectedFile],
        },
      };
      handleFileUpload(fakeEvent);
    } else {
      console.error('Nenhum arquivo selecionado.');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className='modal-import-container'>
      <div className='import-container'>
        <div className='import-header'>
          <label className='title'>Importar informações do Excel</label>
        </div>
        <div className='import-body'>
          <input className='input-import-file' type='file' onChange={handleInputChange} />
          {/* <input
            className='input-id-coluna-excel'
            placeholder='ID da Coluna do Excel'
            value={idColunaExcel}
            onChange={handleIdColunaExcelChange}
          />
          <input
            className='input-id-coluna-sistema'
            placeholder='ID da Coluna do Sistema'
            value={idColunaSistema}
            onChange={handleIdColunaSistemaChange}
          /> */}

          {loading && <label className='infos-import-excel'>Carregando...</label>}
          {numRowsLoaded > 0 && <label className='infos-import-excel'>Linhas no arquivo: {numRowsLoaded}</label>}
          {numCardsLoaded > 0 && <label className='title-table'>Cards carregados: {numCardsLoaded}</label>}
        </div>

        <div className='import-footer'>
          <button className='btn-close-import' disabled={loading} style={{ background: loading ? "rgba(0, 0, 0, 0.05)" : '' }} onClick={() => setOpenCloseImportExcelSuiteFlow(false)}>
            Fechar
          </button>
          <button className='btn-send-import' disabled={loading} style={{ background: loading ? "rgba(0, 0, 0, 0.05)" : '' }} onClick={handleUploadButtonClick}>
            Enviar
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-modal">
          <div className="loading-content">
            <label className="infos-import-excel">Carregando...</label>
            <p style={{ color: 'white' }}>Tempo decorrido: {formatTime(elapsedTime)}</p>
            {numCardsLoaded > 0 && (
              <p style={{ color: 'white' }}>Estimativa de tempo restante: {formatTime(estimatedTime)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportExcelSuiteFlow;
