import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import axios from 'axios';

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
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const userToken = sessionStorage.getItem('accessToken');
        if (!userToken) {
          throw new Error('유저를 찾을 수 없습니다');
        }
        const response = await axios.get('http://3.35.115.71:8080/scrap', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        setLocations(response.data);
      } catch (error) {
        console.error('위치 데이터를 불러오는데 오류가 발생했습니다:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    console.log('옵션:', locations.map(location => ({
      value: location.place,
      label: location.place,
      trigger: '3',
    })));
  }, [locations]);

  const steps = [
    {
      id: '1',
      message: 'Select an option:',
      trigger: '2',
    },
    {
      id: '2',
      options: [
        { value: '1', label: '1. 주변 관광지 추천해줘', trigger: '4' },
        { value: '2', label: '2. 장소 상세 정보 알려줘', trigger: '4' },
      ],
    },
    {
      id: '3',
      message: 'You selected {{previousValue}}',
      end: true,
    },
    {
      id: '4',
      options: locations.map(location => ({
        value: location.place,
        label: location.place,
        trigger: '3',
      })),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      {locations.length > 0 && (
        <ChatBot steps={steps} />
      )}
    </ThemeProvider>
  );
};

export default Chatbot;