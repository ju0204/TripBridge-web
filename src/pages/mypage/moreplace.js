import React, { useEffect, useState } from 'react';
import { fetchLocations, deleteScrap } from '../../api/kakaomap';
import { BsBookmarkStar } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

import './moreplace.css';

function MorePlace() {

  useEffect(() => {
    // Check if the script is already loaded
    if (window.kakao && window.kakao.maps) {
      initMap(); // Initialize the map if the script is already loaded
    } else {
      // Dynamically load the Kakao Maps API script
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=29f03c7b54622c8d9a8c60c20cd7e7e0`;
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initMap(); // Initialize the map after the script is loaded
      };
    }
  }, []);

  const initMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };
    const map = new window.kakao.maps.Map(container, options);

    const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    marker.setMap(map);
  };

  /*스크랩*/
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [nickname, setNickname] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
      // sessionStorage에서 사용자 설정 가져오기
      const sessionStorageValue = sessionStorage.getItem(`doNotShowGuide_${storedNickname}`);
      if (sessionStorageValue !== 'true') {
        setShowGuide(true); // 닉네임이 있는 경우만 모달을 엽니다.
      }
    }
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (error) {
        console.error('위치 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteLocation = async (location) => {
    try {
      await deleteScrap(location.id);
      setLocations(prevLocations => prevLocations.filter(prevLocation => prevLocation.id !== location.id));
      setSelectedLocations(prevLocations => prevLocations.filter(prevLocation => prevLocation.id !== location.id));
      setSelectedMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== location.id));
      console.log('스크랩이 삭제되었습니다.');
    } catch (error) {
      console.error('스크랩 삭제 중 오류 발생:', error);
    }
  };




  

  


  

  return (
    <div className="moreplace-container">
      <div className="place-boxes">
        <div className="place1-box">
          <div id="map" className="map"></div>
        </div>
        <div className="place2-box">
        <div className="more-scrap-container">
          <div className="more-scrap-title">
            <BsBookmarkStar />&nbsp;스크랩 목록
          </div>
          <ul className="more-scrap-list">
            {locations.map((location, index) => (
              <li
                key={index}
                className={selectedLocations.includes(location) ? 'more-selected' : ''}
              >
                <strong>{location.place}</strong>
                <p>{location.address}</p>
                
                <CgClose
                  className="more-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocation(location);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        </div>
      </div>
    </div>
  );
}

export default MorePlace;
