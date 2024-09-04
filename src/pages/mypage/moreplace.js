import React, { useEffect, useState } from 'react';
import { fetchLocations } from '../../api/kakaomap';
import { BsBookmarkStar } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { sendScrap, deleteScrap } from '../../api/filter';

import './moreplace.css';

function MorePlace() {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [nickname, setNickname] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [placeMarkers, setPlaceMarkers] = useState([]);
  const [showScrapedPopup, setShowScrapedPopup] = useState(false);
  const [showAlreadyScrapedPopup, setshowAlreadyScrapedPopup] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=29f03c7b54622c8d9a8c60c20cd7e7e0&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      initMap();
      setPlacesService(new window.kakao.maps.services.Places());
    };

    return () => {
      document.head.removeChild(script);
      if (map) {
        placeMarkers.forEach(marker => marker.setMap(null));
      }
    };
  }, []);

  const initMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };
    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);
  };

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
      const sessionStorageValue = sessionStorage.getItem(`doNotShowGuide_${storedNickname}`);
      if (sessionStorageValue !== 'true') {
        setShowGuide(true);
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

  const handleLocationClick = async (location) => {
  try {
    if (!map || !placesService) {
      console.error("Map or PlacesService is not initialized yet.");
      return;
    }

    // Clear existing place markers
    placeMarkers.forEach(marker => marker.setMap(null));
    setPlaceMarkers([]);

    // Use location address to search for places
    const keyword = `${location.address} 관광지`;
    placesService.keywordSearch(keyword, async (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newMarkers = result.map(place => {
          const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // Create an info window with custom styling
const infowindow = new window.kakao.maps.InfoWindow({
  content: `
    <div style="padding:5px; white-space:nowrap; display: flex; align-items: center;">
      <div style="flex-grow: 1;">
        <i class="fa-regular fa-bookmark" style="margin-right:5px; cursor: pointer;" data-place-id="${place.id}"></i> ${place.place_name}
      </div>
      <div style="margin-left: 20px;"></div>
    </div>
  `,
  removable: true
});

          

          // Add click event to show info window
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);

            // Add event listener to the icon within the info window
            setTimeout(() => {
              const icon = document.querySelector(`i[data-place-id="${place.id}"]`);
              if (icon) {
                icon.addEventListener('click', async () => {
                  console.log('Icon clicked for place:', place.place_name);
                  
                  const scrapData = {
                    place: place.place_name,
                    address: place.address_name,
                    longitude: place.x,
                    latitude: place.y,
                  };

                  try {
                    const response = await sendScrap(scrapData);
                    console.log('Scrap response from server:', response);

                    if (response.result) {
                      // 서버에서 반환된 ID를 새로 스크랩된 위치에 추가
                      const updatedScrapData = {
                        ...scrapData,
                        id: response.data.id // 서버에서 반환된 ID
                      };

                      // Scrapping is successful, now update the locations state
                      setLocations(prevLocations => [...prevLocations, updatedScrapData]);
                      setShowScrapedPopup(true); // 성공 팝업 표시
                    } else {
                      throw new Error('Failed to scrap place');
                    }
                  } catch (error) {
                    console.error('에러Error sending scrap data:', error);
                    setshowAlreadyScrapedPopup(true); // 에러 팝업 표시
                  }
                });
              }
            }, 0);
          });

          return marker;
        });

        setPlaceMarkers(newMarkers);

        if (newMarkers.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds();
          newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
          map.setBounds(bounds);
        }
      } else {
        console.error('Places search failed:', status);
      }
    });

    setSelectedLocations([location]);
  } catch (error) {
    console.error('An error occurred while processing the location click:', error);
  }
};

  
  
  const handleDeleteLocation = async (location) => {
    console.log('Deleting location:', location);
  
    if (!location || !location.id) {
      console.error('유효하지 않은 위치입니다.', location);
      return;
    }
  
    try {
      await deleteScrap(location.id);
  
      setLocations(prevLocations => 
        prevLocations.filter(prevLocation => prevLocation.id !== location.id)
      );
  
      setSelectedLocations(prevLocations => 
        prevLocations.filter(prevLocation => prevLocation.id !== location.id)
      );
  
      setPlaceMarkers(prevMarkers => {
        prevMarkers.forEach(marker => marker.setMap(null));
        return prevMarkers.filter(marker => marker.id !== location.id);
      });
  
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
                  onClick={() => handleLocationClick(location)}
                  className={selectedLocations.includes(location) ? 'selected' : ''}
                >
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
          </div>
        </div>
      </div>

     {/* 팝업 코드 추가 */}
    {showScrapedPopup && (
      <div className="more-popup-result">
        <div className="more-popup-inner1">
          <p>스크랩 되었습니다.</p>
          <button onClick={() => setShowScrapedPopup(false)}>확인</button>
        </div>
      </div>
    )}

    {/* Already Scraped Popup */}
    {showAlreadyScrapedPopup && (
        <div className="more-popup-result">
          <div className="more-popup-inner2">
            <p>이미 스크랩 된 장소입니다.</p>
            <button onClick={() => setshowAlreadyScrapedPopup(false)}>확인</button>
          </div>
        </div>
      )}


    </div>
  );
}

export default MorePlace;
