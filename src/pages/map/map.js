import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { sendScrap } from '../../api/filter';
import { fetchLocations, searchLocations, sendSelectedLocations, sendRouteDataToDatabase, deleteScrap, saveRoute } from '../../api/kakaomap';
import { BsBookmarkStar } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
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
  const [isSaving, setIsSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false); // 기본적으로 모달 닫힌 상태로 설정
  const [nickname, setNickname] = useState('');
  const [doNotShowGuide, setDoNotShowGuide] = useState(false); // 사용자가 가이드를 다시 보지 않기로 선택한 상태

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

  const handleDoNotShowGuideAgain = () => {
    // sessionStorage에서 닉네임을 가져와 사용자 식별자로 사용합니다.
    const userId = sessionStorage.getItem('nickname') || ''; // 닉네임을 사용자 식별자로 사용

    // 모달을 다시 보지 않기로 설정하고 sessionStorage에 저장합니다.
    sessionStorage.setItem(`doNotShowGuide_${userId}`, 'true');
    setDoNotShowGuide(true); // 상태를 업데이트합니다.
    setShowGuide(false); // 모달을 닫습니다.
  };

  const closeGuideModal = () => {
    setShowGuide(false); // 닫기 버튼 클릭 시 모달을 닫습니다.
  };

  const openGuideModal = () => {
    setShowGuide(true); // 이용 가이드를 엽니다.
  };

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

  const drawRoute = async (routeData, routeIndex) => {
    try {
      const path = routeData.map(point => new window.kakao.maps.LatLng(point.latitude, point.longitude));
      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeOpacity: 0.7,
        strokeColor: '#00008B',
        strokeStyle: 'solid'
      });
      polyline.setMap(map);

      const markers = await Promise.all(path.map(async (position, index) => {
        const marker = new window.kakao.maps.Marker({
          position,
          map: map
        });

        // Marker label with number
        const labelContent = `<div class="marker-label">${index + 1}</div>`;
        const label = new window.kakao.maps.CustomOverlay({
          content: labelContent,
          position,
          xAnchor: 0.5,
          yAnchor: 0  // Adjust vertical position as needed
        });
        label.setMap(map);

        // Marker click event for custom infowindow
        const infowindowContent = `<div class="custom-infowindow">${routeData[index].place}</div>`;
        const infowindow = new window.kakao.maps.CustomOverlay({
          content: infowindowContent,
          position,
          xAnchor: 0.5,
          yAnchor: 2.2 // Adjust vertical position as needed
        });

        let isOpen = false; // Infowindow open state

        window.kakao.maps.event.addListener(marker, 'click', function () {
          if (isOpen) {
            infowindow.setMap(null);
            isOpen = false;
          } else {
            infowindow.setMap(map);
            isOpen = true;
          }
        });

        return { marker, label };
      }));

      console.log(`Route ${routeIndex} drawn successfully`);
      return markers;
    } catch (error) {
      console.error(`Error drawing Route ${routeIndex}:`, error);
      throw error;
    }
  };

  const drawAllRoutes = async (allRouteData) => {
    try {
      const routes = await Promise.all(allRouteData.map((routeData, index) => drawRoute(routeData, index + 1)));

      // Display numbers on each marker of each route
      routes.forEach((route, routeIndex) => {
        route.forEach((item, index) => {
          const { label } = item; // Remove 'marker' from destructuring

          // Set marker label (number)
          label.setContent(`<div class="marker-label">${index + 1}</div>`);
          label.setMap(map);
        });
      });
    } catch (error) {
      console.error('Error drawing routes:', error);
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

  const handleScrap = async (place, address, longitude, latitude) => {
    try {
      const scrapData = {
        place,
        address,
        longitude,
        latitude
      };
  
      console.log('스크랩 요청 데이터:', scrapData);
  
      // 이미 스크랩된 장소인지 확인합니다.
      if (locations.some(location => location.place === place && location.address === address)) {
        console.log('이미 스크랩된 장소입니다.');
        return;
      }
  
      // 스크랩 요청을 서버로 보냅니다.
      await sendScrap(scrapData);
      console.log('스크랩 완료');
  
      // 스크랩이 성공적으로 완료되면 장소를 스크랩 목록에 추가합니다.
      setLocations(prevLocations => [...prevLocations, scrapData]);
  
    } catch (error) {
      console.error('스크랩 요청 오류:', error);
    }
  };
  

  useEffect(() => {
    initializeMap();
  }, []);

// UI에서 동선을 저장하는 함수
const handleSaveRoute = async () => {
  setIsSaving(true);

  try {
    const response = await saveRoute();  // API 함수 호출
    console.log('Server response:', response);  // 서버 응답 콘솔 출력
    alert('동선이 성공적으로 저장되었습니다!');
  } catch (error) {
    console.error('Error saving route:', error);  // 에러 콘솔 출력
    alert('동선 저장에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setIsSaving(false);
  }
};
  
  return (
    <div className="show-map-container">
      <Modal
        isOpen={showGuide}
        onRequestClose={closeGuideModal}
        className="guide-modal"
        overlayClassName="guide-modal-overlay"
      >
        <div className="guide">
          <IoCloseOutline className="close-icon" onClick={closeGuideModal} />
          <div className="guideTitle">동선 추천 이용 가이드</div>
          <p>
            1. 검색창 혹은 스크랩 목록에서 출발하고자 하는 장소를 처음으로 선택합니다.<br />
            2. 검색창 혹은 스크랩 목록에서 가고싶은 여행지들을 출발지를 포함하여 2개 이상 선택합니다.<br />
            3. 그 후, 동선 추천 버튼을 눌러 처음 선택한 장소를 시작으로 선택한 여행지들의 최단 경로를 확인합니다. <br />
            4. 화면에 표시된 동선에서 각 장소가 궁금한 경우, 마커를 클릭하여 확인할 수 있습니다. <br />
            5. 스크랩 목록을 삭제하고 싶은 경우, 각 목록의 'X'를 클릭하여 삭제할 수 있습니다. <br />
            6. 챗봇은 여러분들이 선택한 스크랩과 동선에 대한 정보를 추가적으로 얻을 수 있습니다.
          </p>
          <label>
            <input
              type="checkbox"
              checked={doNotShowGuide}
              onChange={handleDoNotShowGuideAgain}
            />
            다시 보지 않기
          </label>
        </div>
      </Modal>
  
      <div className="search-container">
        <input type="text" placeholder="검색하고 싶은 장소를 입력해주세요." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <ul className="search-list">
          {searchResults.map((location, index) => (
            <li key={index} className={`search-result-item ${selectedLocations.some(selectedLocation => selectedLocation.place === location.place_name) ? 'selected' : ''}`} onClick={() => handleSearchItemClick(location)}>
              <strong>{location.place_name}</strong>
              <p>{location.address_name}</p>
              <button
                className="search-scrap-button"
                onClick={() => handleScrap(location.place_name, location.address_name, location.x, location.y)}
              >
                스크랩
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="map-container">
        <div id="kakao-map"></div>
        {routeDrawn && (
              <button className='route-save-button' onClick={handleSaveRoute} disabled={isSaving}>
                {isSaving ? '저장 중...' : '동선 저장'}
              </button>
            )}
        <div className={`chatbot-container ${isChatbotOpen ? 'open' : ''}`}>
          {isChatbotOpen && <Chatbot />}
        </div>
      </div>
      <div className="scrap-container">
        <div className="scrap-title"><BsBookmarkStar />&nbsp;스크랩 목록</div>
        <div className="openguide" onClick={openGuideModal}>이용가이드</div>
        <ul className="scrap-list">
          {locations.map((location, index) => (
            <li key={index} onClick={() => handleLocationClick(location)} className={selectedLocations.includes(location) ? 'selected' : ''}>
              <strong>{location.place}</strong>
              <p>{location.address}</p>
              <CgClose
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLocation(location);
                }}
              />
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
