import axios from 'axios';

const BASE_URL = 'http://3.35.115.71:8080';

const getToken = () => {
  return sessionStorage.getItem('accessToken');
};

export const fetchLocations = async () => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('유저를 찾을 수 없습니다');
    }
    const response = await axios.get(`${BASE_URL}/scrap`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data.map(location => ({
      id: location.id,  
      place: location.place,
      address: location.address,
      latitude:(location.latitude),
      longitude:(location.longitude)
    }));
  } catch (error) {
    console.error('위치 데이터를 불러오는데 오류가 발생했습니다 :', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};


export const sendSelectedLocations = async (location, routeorder) => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('유저를 찾을 수 없습니다');
    }

    // 클라이언트에서 서버로 보낼 데이터
    const postData = {
      id: location.id,  
      place: location.place,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      route_order: routeorder > 1 ? null : routeorder // route_order가 1 초과일 경우에는 null로 설정
    };

    console.log('보내는 데이터:', postData);

    // "/route" 엔드포인트에 데이터 전송
    await fetch(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    console.log('선택한 위치 데이터를 "/route" 엔드포인트에 서버에 전송했습니다.');

    // "/route/update" 엔드포인트에 데이터 전송하고 업데이트된 데이터 받기
    await fetch(`${BASE_URL}/route/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    // "/route" 엔드포인트에서 업데이트된 데이터 가져오기
    const responseData = await fetch(`${BASE_URL}/route`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    let routeData = await responseData.json();
    console.log('"/route" 엔드포인트에서 업데이트된 데이터를 받았습니다.', routeData);

    // 받은 데이터를 route_order 값을 기준으로 정렬합니다.
    routeData = routeData.sort((a, b) => a.route_order - b.route_order);

    await fetch(`${BASE_URL}/route`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    console.log('동선 데이터를 삭제하는 DELETE 요청을 보냈습니다.');

    return routeData;
    
  } catch (error) {
    console.error('선택한 위치 데이터를 서버에 전송하거나 받아오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};


// Kakao Maps API 키
const API_KEY = '41269fe83b2600b01b0dc41c4d81616e';

// 장소 검색 함수
export const searchLocations = async (query) => {
  try {
    // Kakao Maps API의 장소 검색 엔드포인트 URL
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;

    // API 요청을 보내기 위한 설정
    const config = {
      headers: {
        Authorization: `KakaoAK ${API_KEY}` // API 키를 헤더에 추가
      }
    };
    // Axios를 사용하여 GET 요청을 보냄
    const response = await axios.get(url, config);

    // API 응답에서 검색 결과를 추출하여 반환
    return response.data.documents;
  } catch (error) {
    // 오류 발생 시 오류 객체를 throw
    throw error;
  }
};