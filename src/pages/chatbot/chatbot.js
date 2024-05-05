import React from 'react';
import ChatBot from 'react-simple-chatbot';
import './chatbot.css';

const Chatbot = () => {

    return (
        <ChatBot
            botDelay={1000} // 예시로 추가한 속성입니다. 필요에 따라 조정하십시오.
            userDelay={1000} // 예시로 추가한 속성입니다. 필요에 따라 조정하십시오.
            headerTitle="Custom Chatbot" // 챗봇 헤더 타이틀을 설정합니다.
            steps={[
                {
                    id: 'hello-world',
                    message: 'Hello World!',
                    end: true,
                },
            ]}
        />
    );
};

export default Chatbot;