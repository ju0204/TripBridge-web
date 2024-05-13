import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
// import { ThemeProvider } from 'styled-components';
import axios from 'axios';

import './chatbot.css'
const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'http://3.35.115.71:8080';

const Chatbot = () => {
  const [locations, setLocations] = useState([]);
  // const [route, setRoute] = useState([]);



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

    // console.log("유저 동선",route);

  }, [locations]);

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

    const Answer2 = ({ previousStep, triggerNextStep }) => {
      const [message2, setMessage2] = useState(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchData = async () => {
          console.log("ANSWER 2", previousStep.value)
          const previousValue = previousStep.value;
          try {
            // Send request to backend with previous value
            const response = await axios.post(`${BASE_URL}/chatBot/question2`, {
              choicePlace: previousValue
            });
            const data = response.data;
            console.log('Data from backend:', data);
            setMessage2(data);
            setLoading(false);
            // Move to next step
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
    
      if (message2 !== null) {
        return <p>{message2}</p>;
      }
    
      return null;
    }
    
    const Answer4 = ({ previousStep, triggerNextStep }) => {
      const [message4, setMessage4] = useState(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchData = async () => {
          console.log("ANSWER4 ", previousStep.value)
          const previousValue = previousStep.value;
              }
            });
            const data = response.data;
            console.log('Data from backend:', data);
            setMessage4(data);
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
    
      if (message4 !== null) {
        return <p>{message4}</p>;
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
        { value: '3', label: '3. 동선들의 이동 수단과 예상 비용 알려줘', trigger: '5' },
        { value: '4', label: '4. 동선을 방문할때 일정표 알려줘', trigger: '6' },
        { value: '5', label: '5. 질문끝내기', trigger: 'end' },
      ],
    },
    {
      id: '3',
      options: locations.map(location => ({
        value: location.place,
        label: location.place,
        trigger: '선택옵션1',
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
        trigger: '선택옵션2' // trigger를 선택옵션2로 설정
      })),
    },
    {
      id: '선택옵션2', // 선택옵션2 이벤트 핸들러 정의
      component: <Answer2 />, // Answer2 컴포넌트로 변경
      waitAction: true, // 서버 응답을 기다립니다.
      trigger: '2', // 다음 단계로 이동
    },
    {
      id: '5',
      component: <Answer3 />, 
      waitAction: true, 
      trigger: '2', 
    },
    {
      id: '6',
      options: [
        { value: '1박 2일', label: '1박 2일', trigger:'선택옵션4' },
        { value: '2박 3일', label: '2박 3일', trigger:'선택옵션4' },
        { value: '3박 4일', label: '3박 4일', trigger:'선택옵션4' },
      ],
    },
    {id: '선택옵션4',
    component: <Answer4 />, 
      waitAction: true, 
    trigger: '2', // 다음 단계로 이동
      
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