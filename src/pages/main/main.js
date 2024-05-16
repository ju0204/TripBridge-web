import React from "react";
import styled, { keyframes } from 'styled-components';
import './main.css'
import { useState, useEffect } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const handleClickPrev = () => {
    setCurrentSlide((prev) => (prev === 1 ? 3 : prev - 1));
  };

  const handleClickNext = () => {
    setCurrentSlide((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const Container = styled.div`
  margin-top: 30px;
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

  const LeftIcon = styled(MdKeyboardArrowLeft)`
    position: absolute;
    top: 40%;
    left: 3%;
    transform: translateY(-50%);
  `;

  const RightIcon = styled(MdKeyboardArrowRight)`
    position: absolute;
    top: 40%;
    right: 3%;
    transform: translateY(-50%);
  `;
  const slideAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;
const Img = styled.img`
animation: ${slideAnimation} 0.5s ease-in-out;
width: 100%;
height: 50vh;
`;

  return (
    <div className="main">
    <div style={{ overflow: 'hidden' }}>
      <Container>
        <div className="inner">
          <Img src="./banner2.jpg" alt="배너1" />
        </div>
        <div className="inner">
          <Img src="./banner.jpg" alt="배너2" />
        </div>
        <div className="inner">
          <Img src="./suwon.jpg" alt="배너3" />
        </div>
      </Container>
      <LeftIcon size={45} className="icon" onClick={handleClickNext} />
      <RightIcon size={45} className="icon" onClick={handleClickPrev} />
    </div>

    <div className="func-container">
      <div className="func1">여행지 추천
        <div className="func1-1">fdafdafdsafds</div>
      </div>
      <div className="func2">동선 추천</div>
      <div className="func3">여행 게시판</div>
      <div className="func4">여행 메이트 게시판</div>
    </div>
    </div>
  );
};


export default Main;