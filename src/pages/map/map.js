import React, { useEffect, useState, useRef } from 'react';
import { fetchLocations, searchLocations, sendSelectedLocations } from '../../api/kakaomap';
import './showmap.css'; // CSS 파일 임포트

const ShowMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const infowindow = useRef(new window.kakao.maps.InfoWindow({ zIndex: 1 }));
  const mapInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocations();
        console.log('스크랩데이터:', data); // 데이터를 콘솔에 출력
        setLocations(data);
      } catch (error) {
        console.error('목록 불러오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const displayMap = () => {
      if (mapRef.current) {
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5828482, 127.0090811),
          level: 4 // 기본 페이지의 레벨을 7로 설정
        });

        const bounds = new window.kakao.maps.LatLngBounds();

        // 선택된 위치가 있을 때에만 마커를 추가하고 경계 상자를 확장
        selectedLocations.forEach(location => {
          // 선택된 위치에 마커 표시
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(location.latitude, location.longitude),
            map: mapInstance.current
          });

          // 경계 상자에 위치 추가
          bounds.extend(new window.kakao.maps.LatLng(location.latitude, location.longitude));

          // 마커 클릭 시 인포윈도우 표시
          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.current.setContent('<div style="padding:5px;font-size:12px;">' + location.place + '</div>');
            infowindow.current.open(mapInstance.current, marker);
          });
        });

        // 모든 마커를 포함하는 경계 상자에 맞게 지도 중심과 줌 레벨 조정
        if (selectedLocations.length > 0) {
          mapInstance.current.setBounds(bounds);
        }
      }
    };

    displayMap();
  }, [selectedLocations]);

  useEffect(() => {
    // 검색어가 변경될 때마다 검색을 수행하고 결과를 업데이트
    const handleSearch = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const searchResults = await searchLocations(searchQuery);
          console.log('검색 결과:', searchResults);
          setSearchResults(searchResults); // 검색 결과를 상태에 설정
        } catch (error) {
          console.error('검색 중 오류가 발생했습니다:', error);
        }
      } else {
        // 검색어가 없는 경우 검색 결과 초기화
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [searchQuery]);

  // 클라이언트에서 선택한 위치 클릭 시 함수 호출
  const handleLocationClick = async (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(prevLocations => prevLocations.filter(prevLocation => prevLocation !== location));
    } else {
      setSelectedLocations(prevLocations => [...prevLocations, location]);
    }
  };

// 동선 추천 버튼 클릭 시 선택된 위치들을 서버로 보내고 동선을 그리고 해당 위치를 중심으로 지도를 보여주는 함수
const handleRecommendRoute = async () => {
  if (selectedLocations.length > 0) {
    try {
      // 선택한 위치들을 서버로 보냄
      selectedLocations.forEach(async (location, index) => {
        await sendSelectedLocations(location, index + 1); // index는 0부터 시작하므로 +1 해줌
      });

      console.log('선택한 위치들을 서버로 전송했습니다.');

      // 서버에서 업데이트된 데이터를 받아옴
      const updatedData = await sendSelectedLocations();
      
      // 받아온 업데이트된 데이터로 동선을 그림
      drawRoute(updatedData);

      // 선택된 위치들 중 첫 번째 위치를 기준으로 지도를 보여줌
      const firstLocation = updatedData[0];
      const centerPosition = new window.kakao.maps.LatLng(firstLocation.latitude, firstLocation.longitude);
      mapInstance.current.setCenter(centerPosition); // 선택된 위치를 중심으로 지도 조정
    } catch (error) {
      console.error('선택한 위치들을 서버로 전송하거나 받아오는 중 오류가 발생했습니다:', error);
    }
  }
};

// 새로운 데이터로 동선을 그리는 함수
const drawRoute = (data) => {
  const points = selectedLocations.map(location => new window.kakao.maps.LatLng(location.latitude, location.longitude));
  const polyline = new window.kakao.maps.Polyline({
    path: points,
    strokeWeight: 3,
    strokeColor: '#FF0000',
    strokeOpacity: 0.7,
    strokeStyle: 'solid'
  });

  polyline.setMap(mapInstance.current);
};



  // 검색 결과를 클릭했을 때 선택된 위치로 이동하고 마커를 표시하는 함수 수정
  const handleSearchResultClick = (location) => {
    setSelectedLocations([location]);
    const markerPosition = new window.kakao.maps.LatLng(location.y, location.x);
    mapInstance.current.panTo(markerPosition);
  };
  

  return (
    <div className="show-map-container">
      <div className="search-container">
        <input type="text" placeholder = "검색하고 싶은 장소를 입력해주세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <ul className="search-list">
          {searchResults.map((location, index) => (
            <li key={index} onClick={() => handleSearchResultClick(location)} className="search-result-item">
              <strong>{location.place_name}</strong>
              <p>{location.address_name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="map-container">
        <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
      </div>
      <div className="scrap-container">
        <div className="scrap-title">🔖스크랩 목록</div>
        <ul className="scrap-list">
          {locations.map((location, index) => (
            <li key={index} onClick={() => handleLocationClick(location)} className={selectedLocations.includes(location) ? 'selected' : ''}>
              <strong>{location.place}</strong>
              <p>{location.address}</p>
            </li>
          ))}
        </ul>
        <button onClick={handleRecommendRoute}>동선 추천</button>
      </div>
    </div>
  );
};

export default ShowMap;