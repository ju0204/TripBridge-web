import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
// import { ThemeProvider } from 'styled-components';
import axios from 'axios';

import './chatbot.css'

const BASE_URL = 'http://3.35.115.71:8080';

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

    //보내는 함수 
    const sendRequest1 = async (choicePlace) => {
      console.log('sendRequest1 함수가 호출되었습니다. 선택된 장소:', choicePlace);
      try {
        const response = await axios.post(`${BASE_URL}/chatBot/question1`, {
          choicePlace: choicePlace
        });
        const data = response.data;
        console.log('Data from backend:', data);
        return data;
      } catch (error) {
        console.error('Error sending data to backend:', error);
        throw error;
      }
    };

    const Answer = ({ previousStep, triggerNextStep }) => {
      const [message1, setMessage1] = useState(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchData = async () => {
          console.log("ANSWER ", previousStep.value)
          const previousValue = previousStep.value;
          try {
            const response = await axios.post(`${BASE_URL}/chatBot/question1`, {
              choicePlace: previousValue
            });
            const data = response.data;
            console.log('Data from backend:', data);
            setMessage1(data);
            setLoading(false);
            // 다음 단계로 진행
            triggerNextStep();
          } catch (error) {
            console.error('Error sending data to backend:', error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [previousStep.value, triggerNextStep]);
    
      if (loading) {
        return <p>Loading...</p>;
      }
    
      if (message1 !== null) {
        return <p>{message1}</p>;
      }
    
      return null;
    }
    
  
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
        trigger: '선택옵션1',
        action: () => sendRequest1(location.place) // 옵션 선택 시 서버로 요청 보내기
      })),
    },
    {
      id: '선택옵션1',
      component: <Answer />,
      waitAction: true, // 서버 응답을 기다립니다.
      trigger: '2',
    },
    {
      id: '4',
      options: locations.map(location => ({
        value: location.place,
        label: location.place,
        trigger: '선택옵션2' // trigger를 logSelectedOption으로 설정
      })),
    },
    {
      id: '선택옵션2', // logSelectedOption 이벤트 핸들러 정의
      message: ({ steps, previousValue }) => {
        const messageOfStep1 = steps['1'].message;
        console.log('Selected option2:', messageOfStep1); // 선택된 옵션을 콘솔에 출력
        return '{previousValue}를 선택했습니다'; // 메시지 반환
      },
      trigger: '2' // 다음 단계로 이동
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
    <>
      {locations.length > 0 && (
        <ChatBot
          steps={steps}
          className="custom-chatbot"
          botAvatar="/bot.png"
          style={{
            width: '400px', // 원하는 너비로 지정
            height: 'auto', // 원하는 높이로 지정
          }}
        />

      )}
    </>
  );
};

export default Chatbot;