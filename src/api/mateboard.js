import axios from 'axios';

const BASE_URL = 'http://localhost:8080';


//메이트 게시물 불러오는 함수
export const showMatePost = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/mate`);
    return response.data.map(post => ({
      id: post.id,
      title: post.title,
      user : post.userEntity ? post.userEntity.nickname : 'Unknown',
      date: post.created_at
    }));
  } catch (error) {
    console.error('게시물 불러오기 오류:', error);
    throw error;
  }
};


//메이트 게시물 디테일
export const getMatePostDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/mate/${id}`);
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

//댓글 저장하기 
export const saveComment = async (commentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/mate/comment`, commentData);
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('댓글 저장 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

//저장된 댓글 불러오기
export const getComments = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/mate/comment/${id}`);
    // API 응답이 배열이 아니라 객체 형식일 경우를 처리
    // 예시로 응답의 comments 프로퍼티가 댓글 배열을 가리키는 것으로 가정
    const commentsArray = response.data.comments || []; // comments 프로퍼티가 없는 경우 빈 배열을 반환
    return commentsArray.map(comment => ({
      content: comment.content,
      date: comment.created_at,
      user: comment.userEntity ? comment.userEntity.nickname : 'Unknown'
    }));
  } catch (error) {
    console.error('댓글 불러오기 실패:', error);
    throw error;
  }
};




//글쓰기 함수
export const savePost = async (postData) => {
  try {
    // 쿠키에서 토큰 가져오기
    const token = getCookie('token');
    if (!token) {
      throw new Error('토큰이 없습니다. 로그인이 필요합니다.');
    }

    const response = await axios.post(`${BASE_URL}/mate`, postData, {
      headers: {
        Authorization: `Bearer ${token}` // 토큰을 헤더에 포함시킴
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('게시글 저장 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

// 쿠키에서 토큰을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}