import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { sendRequest, sendScrap, deleteScrap, fetchScrap } from '../../api/filter';
import { ThemeProvider } from 'styled-components';
import './chatbot.css';

// 커스터마이징
const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#8F7CEE',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#8F7CEE',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };


const Chatbot = () => {

    return (
        <ThemeProvider theme={theme}>
    <ChatBot 
        steps={[
            {
                id: '1',
                message: 'What number I am thinking?',
                trigger: '2',
              },
            {
            id: '2',
            
            options: [
                { value: 1, label: 'Number 1', trigger: '4', options:[{value:4, label:'옵션안의 옵션1', trigger:'4',}] },
                { value: 2, label: 'Number 2', trigger: '3' },
                { value: 3, label: 'Number 3', trigger: '3' },
              ],
             
            },
            {
                id: '3',
                message: 'Wrong answer, try again.',
                trigger: '2',
              },
              {
                id: '4',
                message: 'Awesome! You are a telepath!',
                end: true,
              },
        ]}
        
        />;
        </ThemeProvider>
    );
};

export default Chatbot;