import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
// import { ThemeProvider } from 'styled-components';
import axios from 'axios';

import './chatbot.css'

// const theme = {
//   background: '#f5f8fb',
//   fontFamily: 'Helvetica Neue',
//   headerBgColor: '#8F7CEE',
//   headerFontColor: '#fff',
//   headerFontSize: '15px',
//   botBubbleColor: '#8F7CEE',
//   botFontColor: '#fff',
//   userBubbleColor: '#fff',
//   userFontColor: '#4a4a4a',
// };

const BASE_URL = 'http://localhost:8080';

const Chatbot = () => {
  const [locations, setLocations] = useState([]);
  const [message1, setMessage1] = useState('');


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

    const sendRequest1 = async (previousValue) => {
      console.log('sendRequest1 함수가 호출되었습니다. 전달된 값:', previousValue);
      try {
        const response = await axios.post(`${BASE_URL}/chatBot/question1`, {
          choicePlace: previousValue
        });
        
        const data = response.data;
        console.log('Data from backend:', data);
      
        // 상태를 업데이트합니다.
        setMessage1(data);
    
      
      
      } catch (error) {
        console.error('Error sending data to backend:', error);
        throw error;
      }
    };
  //userEffect
  useEffect(() => {
    console.log('Message1:', message1);
  }, [message1]);



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
        trigger: '선택옵션1' 
      })),
    },
    {
      id: '선택옵션1', 
      message: async ({ previousValue }) => {
        console.log('Selected option:', previousValue);
        try {
          await sendRequest1(previousValue);
          console.log('선택옵션1 Send request successfully!');
          // 응답을 받은 후에 적절한 메시지를 반환합니다.
          return `${previousValue}를 선택했습니다.`;
        } catch (error) {
          console.error('Error sending request:', error);
          return '죄송합니다. 서버와의 통신 중 문제가 발생했습니다.';
        }
      },
      trigger:'answer1',
    },
    {
      id: 'answer1',
      message: () => {
        console.log('message1 상태:', message1); // message1 상태 콘솔에 출력
        return message1; // message1 상태를 출력하고, 없으면 빈 문자열 반환
      },
      trigger: '2', // 다음 단계로 넘어가는 트리거를 설정합니다.
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
      message: ({ previousValue }) => {
        console.log('Selected option2:', previousValue); // 선택된 옵션을 콘솔에 출력
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
          className="chatbot"
          // style={{
          //   width: '700px', // 원하는 너비로 지정
          //   height: 'auto', // 원하는 높이로 지정
          // }}
        />
      )}
    </>
  );
};

export default Chatbot;



// import React, { useState, useEffect } from 'react';
// import ChatBot from 'react-simple-chatbot';
// import { ThemeProvider } from 'styled-components';
// import axios from 'axios';

// const theme = {
//   background: '#f5f8fb',
//   fontFamily: 'Helvetica Neue',
//   headerBgColor: '#8F7CEE',
//   headerFontColor: '#fff',
//   headerFontSize: '15px',
//   botBubbleColor: '#8F7CEE',
//   botFontColor: '#fff',
//   userBubbleColor: '#fff',
//   userFontColor: '#4a4a4a',
// };

// const Chatbot = () => {
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const userToken = sessionStorage.getItem('accessToken');
//         if (!userToken) {
//           throw new Error('유저를 찾을 수 없습니다');
//         }
//         const response = await axios.get('http://3.35.115.71:8080/scrap', {
//           headers: {
//             Authorization: `Bearer ${userToken}`
//           }
//         });
//         setLocations(response.data);
//       } catch (error) {
//         console.error('위치 데이터를 불러오는데 오류가 발생했습니다:', error);
//       }
//     };

//     fetchLocations();
//   }, []);

//   const handleQuestion1 = async (selectedOption) => {
//     try {
//       const questionResponse = await axios.post('YOUR_QUESTION_API_ENDPOINT_1', {
//         location: selectedOption,
//       });
//       const questionId = questionResponse.data.questionId;
//       const answerResponse = await axios.get(`YOUR_ANSWER_API_ENDPOINT/${questionId}`);
//       const answer = answerResponse.data.answer;
//       console.log('1번 질문에 대한 답변:', answer);
//     } catch (error) {
//       console.error('1번 질문에 대한 요청 중 에러가 발생했습니다:', error);
//     }
//   };

//   const handleQuestion2 = async (selectedOption) => {
//     try {
//       const questionResponse = await axios.post('YOUR_QUESTION_API_ENDPOINT_2', {
//         location: selectedOption,
//       });
//       const questionId = questionResponse.data.questionId;
//       const answerResponse = await axios.get(`YOUR_ANSWER_API_ENDPOINT/${questionId}`);
//       const answer = answerResponse.data.answer;
//       console.log('2번 질문에 대한 답변:', answer);
//     } catch (error) {
//       console.error('2번 질문에 대한 요청 중 에러가 발생했습니다:', error);
//     }
//   };

//   const handleQuestion4 = async (userInput) => {
//     try {
//       // 4번 질문에 대한 엔드포인트로 직접 입력된 값을 보냅니다.
//       // 예시: const answerResponse = await axios.post('YOUR_QUESTION_API_ENDPOINT_4', { userInput });
//       // 응답 처리 및 상태 업데이트를 여기서 수행합니다.
//     } catch (error) {
//       console.error('4번 질문에 대한 요청 중 에러가 발생했습니다:', error);
//     }
//   };

//   const steps = [
//     {
//       id: '1',
//       message: '환영합니다! (첫 멘트)',
//       trigger: '2',
//     },
//     {
//       id: '2',
//       options: [
//         { value: '1', label: '1. 주변 관광지 추천해줘', trigger: '3' },
//         { value: '2', label: '2. 장소 상세 정보 알려줘', trigger: '4' },
//         { value: '4', label: '4. 자유 질문', trigger: '7' },
//         { value: '5', label: '5. 질문끝내기', trigger: 'end' },
//       ],
//     },
//     {
//       id: '3',
//       options: locations.map(location => ({
//         value: location.place,
//         label: location.place,
//         trigger: '선택옵션'
//       })),
//     },
//     {
//       id: '선택옵션',
//       message: ({ previousValue }) => {
//         console.log('Selected option:', previousValue);
//         return `${previousValue}를 선택했습니다`;
//       },
//       trigger: ({ previousValue, steps }) => {
//         if (steps[2].id === '3') {
//           handleQuestion1(previousValue);
//           return '2';
//         } else if (steps[4].id === '4') {
//           handleQuestion2(previousValue);
//           return '2';
//         } else {
//           handleQuestion4(previousValue);
//           return '2';
//         }
//       },
//     },
//     {
//       id: 'end',
//       message: '질문을 마치겠습니다. ',
//       end:true
//     },
//     {id: '7',
//       user: true,
//       trigger:'8',
//     },
//     {
//       id: '8',
//       message: 'You qusetion {previousValue}',
//       trigger:'2'
//     },
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       {locations.length > 0 && (
//         <ChatBot steps={steps} />
//       )}
//     </ThemeProvider>
//   );
// };

// export default Chatbot;
