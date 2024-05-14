import React, { useEffect, useState } from 'react';
import { fetchLocations, searchLocations, sendSelectedLocations, sendRouteDataToDatabase, deleteScrap } from '../../api/kakaomap';
import { BsBookmarkStar } from "react-icons/bs";
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
  const [routeDrawn, setRouteDrawn] = useState(false);

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

  const fitBoundsToRoutes = () => {
    if (map && selectedMarkers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
  
      selectedMarkers.forEach(marker => {
        bounds.extend(new window.kakao.maps.LatLng(marker.latitude, marker.longitude));
      });
  
      // Fit the bounds to the map
      map.setBounds(bounds);
    }
  };
  const handleLocationClick = async (location) => {
    try {
      const isAlreadySelected = selectedMarkers.some(marker => marker.id === location.id);
      
      if (isAlreadySelected) {
        // 이미 선택된 위치인 경우 해당 마커를 지우고 선택된 목록에서 제거합니다.
        const updatedMarkers = selectedMarkers.filter(marker => marker.id !== location.id);
        setSelectedMarkers(updatedMarkers);
  
        const markerToRemove = selectedMarkers.find(marker => marker.id === location.id);
        if (markerToRemove) {
          markerToRemove.marker.setMap(null); // 마커 지우기
        }
  
        setSelectedLocations(prevLocations => prevLocations.filter(prevLocation => prevLocation !== location));
      } else {
        // 선택되지 않은 위치인 경우 선택된 목록에 추가하고 마커를 그립니다.
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
        location.marker = marker; // 마커 객체를 location에 추가
  
        // 클릭한 마커의 위치로 지도를 이동시킵니다.
        map.panTo(markerPosition);
      }
    } catch (error) {
      console.error('장소 정보를 서버로 전송하는 중 오류가 발생했습니다:', error);
    }
  };
  

  const handleSearchItemClick = async (location) => {
    try {
      const isAlreadySelected = selectedMarkers.some(marker => marker.id === location.id);
      
      if (isAlreadySelected) {
        // 이미 선택된 위치인 경우 해당 마커를 지우고 선택된 목록에서 제거합니다.
        const updatedMarkers = selectedMarkers.filter(marker => marker.id !== location.id);
        setSelectedMarkers(updatedMarkers);
  
        const updatedLocations = selectedLocations.filter(selectedLocation => selectedLocation.id !== location.id);
        setSelectedLocations(updatedLocations);
  
        const markerToRemove = selectedMarkers.find(marker => marker.id === location.id);
        if (markerToRemove) {
          markerToRemove.marker.setMap(null); // 마커 지우기
        }
      } else {
        // 선택되지 않은 위치인 경우 선택된 목록에 추가하고 마커를 그립니다.
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
        selectedLocation.marker = marker; // 마커 객체를 selectedLocation에 추가

        map.panTo(markerPosition);
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
        setRouteDrawn(true); // 동선이 그려졌음을 표시

        // 모든 동선 지점을 포함하는 경계를 지도에 맞춰서 보여줍니다.
        fitBoundsToRoutes();
      } catch (error) {
        console.error('오류 발생:', error);
      }
    }
  };
  
  const drawAllRoutes = async (allRouteData) => {   
    try {
      const routes = await Promise.all(allRouteData.map((routeData, index) => drawRoute(routeData, index + 1)));
      // 각 동선의 마커에 번호를 표시합니다.
      routes.forEach(route => {
        route.forEach((marker, index) => {
          const label = new window.kakao.maps.CustomOverlay({
            position: marker.getPosition(),
            content: `<div style="padding: 3px; background-color: blue; color: white; border-radius: 50%; text-align: center; width: 20px; height: 20px; line-height: 20px;">${index + 1}</div>`,
            xAnchor: 0.5,
            yAnchor: 1.5
          });
          label.setMap(map);
        });
      });
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };
  
  const drawRoute = async (routeData, routeIndex) => {
    try {
      const path = routeData.map(point => new window.kakao.maps.LatLng(point.latitude, point.longitude));
      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      });
      polyline.setMap(map);
      
      // 경로의 각 지점에 마커를 생성합니다.
      const markers = await Promise.all(path.map(async (position, index) => {
        const marker = new window.kakao.maps.Marker({
          position,
          map: map
        });
        return marker;
      }));
  
      console.log(`동선 ${routeIndex} 그리기 완료`);
      return markers;
    } catch (error) {
      console.error(`동선 ${routeIndex} 그리는 중 오류 발생:`, error);
      throw error;
    }
  };
  

  //다시하기
  const handleReset = () => {
    setRouteDrawn(false); // 동선 그리기 상태 초기화
    setSelectedLocations([]); // 선택된 위치 초기화
    setSelectedMarkers([]); // 선택된 마커 초기화
  
    // 지도를 초기 상태로 되돌리기 위해 페이지 새로고침
    window.location.reload();
  };
  

  //기본맵
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
        <input type="text" placeholder="검색하고 싶은 장소를 입력해주세요." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <ul className="search-list">
        {searchResults.map((location, index) => (
  <li key={index} className={`search-result-item ${selectedLocations.some(selectedLocation => selectedLocation.place === location.place_name) ? 'selected' : ''}`} onClick={() => handleSearchItemClick(location)}>
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
        <div className="scrap-title"><BsBookmarkStar />&nbsp;스크랩 목록</div>
        <p/>
        <b>처음 방문할 장소를 첫번째로 선택해주세요.</b>
        <ul className="scrap-list">
          {locations.map((location, index) => (
            <li key={index} onClick={() => handleLocationClick(location)} className={selectedLocations.includes(location) ? 'selected' : ''}>
              <strong>{location.place}</strong>
              <p>{location.address}</p>
              <img src="/x.png" alt="Delete" className="delete-button" onClick={() => handleDeleteLocation(location)} />
            </li>
          ))}
        </ul>
        <div className="scrap-buttons">
        {/* 동선 추천과 챗봇 열고 닫기 버튼 */}
        <button onClick={routeDrawn ? handleReset : handleRecommendRoute}>
          {routeDrawn ? '다시 하기' : '동선 추천'}
        </button>
        <button onClick={() => setIsChatbotOpen(!isChatbotOpen)}>챗봇 {isChatbotOpen ? '닫기' : '열기'}</button>
      </div>
    </div>
  </div>
  );
};

export default ShowMap;
