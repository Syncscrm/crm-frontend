import React, { useContext, useEffect, useState } from 'react'
import './style.css'

// CONTEXT API
import { useUser } from '../../contexts/userContext'
import { useCard } from '../../contexts/cardContext'
import { useColumns } from '../../contexts/columnsContext';

// API
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

function VendaPerdida({ cardData, closeModal }) {

    const { user } = useUser();
    const { setCards, setPreviewSearchCards, setListNotifications, addHistoricoCardContext } = useCard();
    const { columns } = useColumns();


    const motivos = [
        { id: '1', name: 'Prazo de entrega' },
        { id: '2', name: 'Mudança de prioridades' },
        { id: '3', name: 'Preço elevado' },
        { id: '4', name: 'Concorrência mais atraente' },
        { id: '5', name: 'Recomendação do arquiteto' },
        { id: '6', name: 'Necessidades não atendidas' },
        { id: '7', name: 'Comprou Madeira/Alumínio' },
        { id: '8', name: 'Prazo de Final de Ano' },
        { id: '9', name: 'Sem Retorno do Cliente' },
    ]

    const [motivoVendaPerdida, setMotivoVendaPerdida] = useState('');

    useEffect(() => {
        setMotivoVendaPerdida(cardData.motivo_venda_perdida)
    }, [])

    
    const updateCardStatusPerdido = async (id, status, motivo, event) => {
        event.stopPropagation();

        const userConfirmed = window.confirm(`Você tem certeza que deseja alterar?`);
        if (!userConfirmed) {
          return;
        }
    
    
        // Verificar se existe uma coluna com o nome 'Perdidos' e obter seu ID
        const perdidosColumn = columns.find(column => column.name === 'Perdidos');
        if (!perdidosColumn) {
          console.error("Coluna 'Perdidos' não encontrada");
          return;
        }
    
        try {
          const response = await axios.post(`${apiUrl}/card/update-status-venda-perdida`, {
            id,
            status,
            motivo,
            columnId: perdidosColumn.id,
          });
          setCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
          setPreviewSearchCards(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
          setListNotifications(prevCards => prevCards.map(card => card.card_id === id ? { ...card, ...response.data } : card));
          addHistoricoCardContext(`Status alterado de ${cardData.status} para 'Perdido' com motivo: ${motivo}`, cardData.card_id, user.id);
          closeModal();
        } catch (error) {
          console.error('Erro ao atualizar o cartão:', error);
        }
      };

      
    return (
        <div className='modal-venda-perdida-container'>

            <div className='venda-perdida-container'>

                <div className='venda-perdida-header'>
                    <div className='title-venda-perdida'>Motivo da Venda Perdida</div>
                    <div className='btn-close-container'> </div>
                </div>
                <div className='venda-perdida-body'>

                    <label className='title'>Motivo</label>
                    <input onClick={(event) => { event.stopPropagation(); }} className='input-venda-perdida' type='text' value={motivoVendaPerdida} onChange={(e) => setMotivoVendaPerdida(e.target.value)} placeholder={'Selecione o motivo...'}></input>
                    {
                        motivos.map((item) =>
                            <button
                                key={item.id}
                                className='btn-motivos'
                                onClick={(event) => {
                                    setMotivoVendaPerdida(item.name);
                                    event.stopPropagation();
                                }}
                            >
                                {item.name}
                            </button>
                        )
                    }

                </div>
                <div className='venda-perdida-footer'>
                    <div>
                    </div>
                    <div className='footer-rigth'>
                        <button
                            className='btn-save'
                            onClick={(event) => {
                                event.stopPropagation();
                                closeModal();
                            }}
                        >
                            Cancelar
                        </button>

                        <button className='btn-save' onClick={(event) => updateCardStatusPerdido(cardData.card_id, 'Perdido', motivoVendaPerdida, event)} disabled={motivoVendaPerdida == ''} >Confirmar</button>

                    </div>
                </div>
            </div>
        </div>
    );
}


export default VendaPerdida;