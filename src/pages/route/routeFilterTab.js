import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import backgroundImage from './routeImage/tourRoute.jpg'; // 경로에 있는 이미지를 불러옵니다
import './routeFilterTab.css'; // 스타일링을 위한 CSS 파일

const RouteFilterTab = () => {
    const [selectedDistance, setSelectedDistance] = useState('전체');
    const [selectedDifficulty, setSelectedDifficulty] = useState('전체');

    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 객체를 가져옵니다.

    const handleDistanceClick = (value) => {
        setSelectedDistance(value);
    };

    const handleDifficultyClick = (value) => {
        setSelectedDifficulty(value);
    };

    const handleSearchClick = () => {
        navigate('/route/result'); // 버튼 클릭 시 /new-page로 이동
    };

    return (
        <div>
            <div className='route-filter-banner'>
                <img src={backgroundImage} alt="트레킹 코스 배경 이미지" />
                <div className="route-filter-main-title">트레킹 코스</div>
            </div>
            <div className="search-box">
                <div className="search-box-header">
                    <h3 className="search-title">트레킹 코스 검색</h3>
                    <hr className="divider" />
                </div>
                <div className="search-options">
                    <div className="filter-group">
                        <label>코스 선택</label>
                        <div className="button-group">
                            {['전체', '걷기', '자전거'].map((item) => (
                                <button
                                    key={item}
                                    className={selectedDistance === item ? 'selected' : ''}
                                    onClick={() => handleDistanceClick(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>난이도</label>
                        <div className="button-group">
                            {['전체', '하', '중', '상'].map((item) => (
                                <button
                                    key={item}
                                    className={selectedDifficulty === item ? 'selected' : ''}
                                    onClick={() => handleDifficultyClick(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="search-button" onClick={handleSearchClick}>검색하기</button>
                </div>
            </div>
        </div>
    );
};

export default RouteFilterTab;
