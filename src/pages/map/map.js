import React, { useEffect, useState } from 'react';
import { fetchLocations, searchLocations, sendSelectedLocations, sendRouteDataToDatabase } from '../../api/kakaomap';
import Chatbot from '../chatbot/chatbot';
import './showmap.css';

const ShowMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

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

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const searchResults = await searchLocations(searchQuery);
          setSearchResults(searchResults);
        } catch (error) {
          console.error('위치 검색 중 오류 발생:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [searchQuery]);

  const handleLocationClick = async (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(prevLocations => prevLocations.filter(prevLocation => prevLocation !== location));
      setSelectedMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== location.id));
    } else {
      setSelectedLocations(prevLocations => [...prevLocations, location]);
      setSelectedMarkers(prevMarkers => [...prevMarkers, location]);

      const markerPosition = new window.kakao.maps.LatLng(location.latitude, location.longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });

      window.kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + location.place + '</div>');
        infowindow.open(map, marker);
      });

      marker.setMap(map);
    }
  };

  const handleSearchItemClick = async (location) => {
    try {
      const isAlreadySelected = selectedMarkers.some(marker => marker.id === location.id);
      
      if (!isAlreadySelected) {
        const selectedLocation = {
          id: location.id,
          place: location.place_name,
          address: location.address_name,
          latitude: location.y,
          longitude: location.x
        };
  
        setSelectedLocations(prevLocations => [...prevLocations, selectedLocation]);
        setSelectedMarkers(prevMarkers => [...prevMarkers, selectedLocation]);
  
        const markerPosition = new window.kakao.maps.LatLng(selectedLocation.latitude, selectedLocation.longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
  
        window.kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div style="padding:5px;font-size:12px;">' + selectedLocation.place + '</div>');
          infowindow.open(map, marker);
        });
  
        marker.setMap(map);
      }
    } catch (error) {
      console.error('장소 정보를 서버로 전송하는 중 오류가 발생했습니다:', error);
    }
  };
  
  const handleRecommendRoute = async () => {
    if (selectedMarkers.length > 0) {
      try {
        const allRouteData = await Promise.all(selectedMarkers.map((marker, index) => {
          return sendSelectedLocations(marker, index + 1);
        }));
  
        drawAllRoutes(allRouteData);
  
        console.log('모든 동선 처리 및 그리기 완료');
  
        // 수정된 부분: routeData를 다른 데이터베이스로 전송
        await sendRouteDataToDatabase(allRouteData);
  
      } catch (error) {
        console.error('오류 발생:', error);
      }
    }
  };
  
  
  const drawAllRoutes = (allRouteData) => {   
    allRouteData.forEach((routeData) => {
      drawRoute(routeData);
    });
  };
  
  
  const drawRoute = (routeData) => {
    const path = routeData.map(point => new window.kakao.maps.LatLng(point.latitude, point.longitude));
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });
    polyline.setMap(map);
  };
  
  const initializeMap = () => {
    const mapContainer = document.getElementById('kakao-map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5828482, 127.0090811),
      level: 4
    };
    const newMap = new window.kakao.maps.Map(mapContainer, options);
    setMap(newMap);
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className="show-map-container">
      <div className="search-container">
        <input type="text" placeholder="검색하고 싶은 장소를 입력해주세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <ul className="search-list">
          {searchResults.map((location, index) => (
            <li key={index} className="search-result-item" onClick={() => handleSearchItemClick(location)}>
              <strong>{location.place_name}</strong>
              <p>{location.address_name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="map-container">
        <div id="kakao-map"></div>
        <div className={`chatbot-container ${isChatbotOpen ? 'open' : ''}`}>
          {isChatbotOpen && <Chatbot />}
        </div>
      </div>
      <div className="scrap-container">
        <div className="scrap-title">🔖스크랩 목록</div>
        <p/>
        <b>처음의 장소를 첫번째로 선택해주세요.</b>
        <ul className="scrap-list">
          {locations.map((location, index) => (
            <li key={index} onClick={() => handleLocationClick(location)} className={selectedLocations.includes(location) ? 'selected' : ''}>
              <strong>{location.place}</strong>
              <p>{location.address}</p>
            </li>
          ))}
        </ul>
        <button onClick={handleRecommendRoute}>동선 추천</button>
        <button onClick={() => setIsChatbotOpen(!isChatbotOpen)}>챗봇 {isChatbotOpen ? '닫기' : '열기'}</button>
      </div>
    </div>
  );
};

export default ShowMap;
