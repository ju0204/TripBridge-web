import axios from 'axios';

const BASE_URL = 'http://localhost:8080';


//메이트 게시물 불러오는 함수
export const showMatePost = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/mate`);
    return response.data.map(post => ({
      id: post.id,
      title: post.title,
      user: post.userEntity.id,
      date: post.created_at
    }));
  } catch (error) {
    console.error('게시물 불러오기 오류:', error);
    throw error;
  }
};
//메이트 게시물 디테일
export const getMatePostDetail = async (Id) => {
  try {
    const response = await axios.get(`${BASE_URL}/mate/${Id}`); // 수정된 부분
    return {
      id: response.data.id,
      title: response.data.title,
      content: response.data.content,
      user: response.data.userEntity.id,
      date: response.data.created_at
    };
  } catch (error) {
    console.error('게시글 상세 정보 불러오기 오류:', error);
    throw error;
  }
};

/*
//게시판 불러오는 함수
export const showTripPost = asyncs () => {
  try {
    const response = await axios.get(`${BASE_URL}/게시판`);
    return response.data.map(post => {
      id : post.id,
      ""
    })
  }
} */


//글쓰기 함수 - 수정필요
export const savePost = async (postData) => {
  try {
    const response = await axios.post(`${BASE_URL}/mate`, postData);
    if (response.status >= 200 && response.status < 300) {
      console.log('글쓰기 성공');
      return response.data; // 성공한 경우 응답 데이터를 반환합니다.
    } else {
      console.error('글쓰기 실패');
      // 실패한 경우 에러를 throw하지 않고 그냥 종료합니다.s
    }
  } catch (error) {
    // 오류가 발생했을 때 아무것도 하지 않습니다.
  }
}; 
