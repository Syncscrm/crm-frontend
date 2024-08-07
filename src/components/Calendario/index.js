import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { apiUrl } from '../../config/apiConfig';

import PreviewCard from '../../components/PreviewCard';

import { MdMessage, MdLens, MdNotifications, MdDateRange, MdAddTask, } from 'react-icons/md';

import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';


import './style.css';

const Calendario = ({ userId, closeModal }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasksForDate(selectedDate);
  }, [userId]);

  const fetchTasksForDate = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd'); // Formatar a data para YYYY-MM-DD
      const response = await axios.get(`${apiUrl}/card/tasks/date/${formattedDate}/${userId}`);
      setTasks(response.data);
      console.log(response.data)
      setSelectedTasks(response.data.filter(task => new Date(task.due_date).toDateString() === date.toDateString()));
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchTasksForDate(date);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = tasks.filter(task => new Date(task.due_date).toDateString() === date.toDateString());
      if (dayTasks.length > 0) {
        return <div className="task-dot"></div>;
      }
    }
    return null;
  };

  function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yy');
  }

  return (
    <div className="calendar-modal">
      <div className="calendar-modal-content">
        <button className="close-button-calendario" onClick={closeModal}>X</button>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={renderTileContent}
          className={'calendario'}
        />
        <div>
        </div>
      </div>



      <div className="calendar-modal-container">
        {tasks.map((item) => (
          <div key={item.task_id} className='item-notifications-calendario' >
            <label className='label-notifications-calendario'><MdAddTask className='icon-notifications-calendario' />{item.description}</label>
            <label className='label-notifications-calendario'><MdDateRange className='icon-notifications-calendario' />{formatDate(item.due_date)}</label>
            <PreviewCard key={item.card_id} cardData={item} />
          </div>
        ))}
      </div>




    </div>
  );
};

export default Calendario;
