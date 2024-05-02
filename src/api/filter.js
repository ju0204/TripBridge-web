import axios from 'axios';

// const BASE_URL = 'http://52.79.232.68:8080';
const BASE_URL = 'http://localhost:8080';

export const sendRequest = async (selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird) => {
  try {
    // 선택한 지역 정보와 관광 타입, 카테고리 정보 등을 쿼리 문자열로 조합
    const queryString = `areaCode=${encodeURIComponent(selectedAreas)}&contentTypeId=${encodeURIComponent(selectedTourType)}&cat1=${encodeURIComponent(selectedCategory)}&cat2=${encodeURIComponent(selectedCategoryMiddle)}&cat3=${encodeURIComponent(selectedCategoryThird)}`;
    
    // 요청 URL 생성
    const requestURL = `${BASE_URL}/place/list?${queryString}`;

    console.log('Request_api URL:', requestURL);

    // GET 요청 보내기
    const response = await axios.get(requestURL);

    // Content-Type 확인
    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType);

    // JSON 형식인지 확인
    if (contentType && contentType.includes('application/json')) {
      // JSON 형식의 데이터인 경우
      console.log('Response:', response);
      
      // console.log('Response Data:', response.data);

      // 응답 데이터 확인
      const responseData = response.data;

      
      console.log('Success_send:', responseData);
      


      // 응답데이터 추출 
      const places = responseData.response.body.items.item;
      const processedData = places.map(place => ({
        address: place.addr1,
        title: place.title,
        image: place.firstimage
        //필요한 데이터 추가
      }));

      console.log('응답데이터',processedData);
      return processedData; // 처리된 데이터를 반환
    } else {
      // JSON 형식이 아닌 경우
      console.log('Received data is not in JSON format.');
      // 처리할 방법을 결정하거나 오류를 처리할 수 있음
      throw new Error('Received data is not in JSON format.');
    }
  } catch (error) {
    console.error('데이터 전송 중 오류:', error);
    throw error;
  }
};




// 백엔드로 스크랩 요청을 보내는 함수
export const sendScrap = async (postId) => {
  try {
    const response = await axios.post(`${BASE_URL}/scrap`, { postId });
    return response.data; // 스크랩 결과를 반환할 수도 있음
  } catch (error) {
    console.error('스크랩 요청 오류:', error);
    throw error;
  }
};