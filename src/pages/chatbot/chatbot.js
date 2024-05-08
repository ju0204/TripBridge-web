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

    // const handleChat = async () => {
    //   try {
    //     // 질문을 서버로 POST 요청으로 보냄
    //     const questionResponse = await axios.post('YOUR_QUESTION_API_ENDPOINT', {
    //       location.place
    //     });
    
    //     // 서버에서 받은 질문에 대한 답변을 가져오기 위해 질문 ID를 추출
    //     const questionId = questionResponse.data.questionId;
    
    //     // 질문 ID를 사용하여 답변을 서버로 GET 요청으로 보냄
    //     const answerResponse = await axios.get(`YOUR_ANSWER_API_ENDPOINT/${questionId}`);
    
    //     const answer = answerResponse.data.answer;
    //     console.log('답변:', answer);
    //   } catch (error) {
    //     console.error('API와의 통신 중 에러가 발생했습니다:', error);
    //   }
    // };
    

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
      message: '환영합니다! (첫 멘트)',
      trigger: '2',
    },
    {
      id: '2',
      options: [
        { value: '1', label: '1. 주변 관광지 추천해줘', trigger: '3' },
        { value: '2', label: '2. 장소 상세 정보 알려줘', trigger: '4' },
        { value: '4', label: '4. 자유 질문', trigger: '7' },
        { value: '5', label: '5. 질문끝내기', trigger: 'end' },
      ],
    },
    {
      id: '3',
      options: locations.map(location => ({
        value: location.place,
        label: location.place,
        trigger: '5',
      })),
    },
    {
      id: '4',
      options: locations.map(location => ({
        value: location.place,
        label: location.place,
        trigger: '6',
      })),
    },
    {
      id: '5',
      message: '1번 질문 답: You selsect place {previousValue}',
      trigger:'2'
    },
    {
      id: '6',
      message: '2번 질문 답: You selsect place {previousValue}',
      trigger:'2'
    },
    {id: '7',
          user: true,
          trigger:'8',
    },
    {
      id: '8',
      message: 'You qusetion {previousValue}',
      trigger:'2'
    },
    {
      id: 'end',
      message: '질문을 마치겠습니다. ',
      end:true
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