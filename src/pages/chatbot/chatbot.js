import React, { useState, useEffect  } from 'react';
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
    const [scrapedPosts, setScrapedPosts] = useState([]);

    useEffect(() => {
      const fetchScrapedPosts = async () => {
        try {
          const data = await fetchScrap();
          console.log('스크랩된 게시물 데이터:', data);
          setScrapedPosts(data); // 데이터를 상태에 설정
        } catch (error) {
          console.error('스크랩된 게시물 데이터를 불러오는 중 오류 발생:', error);
        }
      };
  
      fetchScrapedPosts(); // 데이터 불러오기
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행
    
    
    

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
                  { value: 1, label: 'Number 1', trigger: '4', options: [{ value: 4, label: '옵션안의 옵션1', trigger: '4' }] },
                  { value: 2, label: 'Number 2', trigger: '3' },
                  { value: 3, label: 'Number 3', trigger: '3' },
                ],
    
              },
              {
                id: '3',
                message:'hihi',
                trigger: '2',
              },
              {
                id: '4',
                message:'4',
                // component: <Scrap />,
                
              },
            ]}
          />
        </ThemeProvider>
      );
    };
    
    export default Chatbot;