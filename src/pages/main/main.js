import React from "react";
import styled  from 'styled-components';
import { Link } from 'react-router-dom';
import './main.css'
import { useState, useEffect } from 'react';
import { GrFormNext,GrFormPrevious } from "react-icons/gr";

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const handleClickPrev = () => {
    setCurrentSlide((prev) => (prev === 1 ? 3 : prev - 1));
  };

  const handleClickNext = () => {
    setCurrentSlide((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const Container = styled.div`
  width: 300vw;
  height: 500px;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${(currentSlide - 1) * 100}vw);
  overflow: hidden;
  div.inner {
  width: 100vw;
  float: left;
  }
`;


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 3 ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);




  return (
    <div className="main">
      <div className="banner-text">TRIP BRIDGE</div>
      <div className="banner-text2">이 페이지에 대한 문구?...가튼거 .. <br/>여러가지 설명 등등</div>
      <div style={{ overflow: 'hidden' }}>
        <Container currentSlide={currentSlide}>
          <div className="inner">
            <img src="./main/jj.jpg" alt="배너1" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/gyeongju.jpg" alt="배너2" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/suwon.jpg" alt="배너3" className="Img" />
          </div>
        </Container>
        <GrFormPrevious size={45} className="left-icon" onClick={handleClickNext} />
        <GrFormNext size={45} className="right-icon" onClick={handleClickPrev} />
      </div>

      <div className="func-container">
        <Link to = '/filter' className="func1">여행지 추천
          <div className="detail">설명ㅁㄹㅇㄴㄴㄴㄴㄴㄴㄴㄻㄻㄴㅇㅁㄹㅇㅁㅇㄻㄴㄹㄴㅁㅇㄹ</div>
        </Link>
        <Link to = '/map' className="func2">동선 추천
          <div className="detail">설명ㅁㄹㅇㄴㄴㄴㄴㄴㄴㄴㄻㄻㄴㅇㅁㄹㅇㅁㅇㄻㄴㄹㄴㅁㅇㄹ</div>
        </Link>
        <Link to = '/tripboard' className="func3">여행 게시판
          <div className="detail">설명ㅁㄹㅇㄴㄴㄴㄴㄴㄴㄴㄻㄻㄴㅇㅁㄹㅇㅁㅇㄻㄴㄹㄴㅁㅇㄹ</div>
        </Link>
        <Link to = '/mateboard' className="func4">여행 메이트 게시판
          <div className="detail">설명ㅁㄹㅇㄴㄴㄴㄴㄴㄴㄴㄻㄻㄴㅇㅁㄹㅇㅁㅇㄻㄴㄹㄴㅁㅇㄹ</div>
        </Link>
      </div>
    </div>
  );
};

export default Main;