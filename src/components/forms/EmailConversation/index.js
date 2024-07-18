import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config/apiConfig';
import './style.css';

const EmailConversation = ({ clientEmail }) => {
  const [emails, setEmails] = useState([]);


  




  useEffect(() => {
    const fetchEmails = async () => {
      if (!clientEmail) {
        console.log('Email do cliente não definido');
        return;
      }
  
      console.log('Buscando emails...');
      try {
        const response = await axios.get(`${apiUrl}/users/conversation?email=${clientEmail}`);
        setEmails(response.data);
        console.log('Emails recebidos:', response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
      console.log('Emails carregados...');
    };
  
    fetchEmails();
  }, [clientEmail]);

  

  
  


  return (
    <div className='email-conversation-container'>
      <h2>Conversation with {clientEmail}</h2>
      {emails.map((email, index) => (
        <div key={index} className="email">
          <p><strong>From:</strong> {email.from}</p>
          <p><strong>To:</strong> {email.to}</p>
          <p><strong>Subject:</strong> {email.subject}</p>
          <p><strong>Date:</strong> {new Date(email.date).toLocaleString()}</p>
          <p>{email.text}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EmailConversation;
