import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; // 서버의 주소로 대체해야 합니다.

// 회원가입 요청을 보내는 함수
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/signup`, userData);
    return response.data; // 요청에 대한 응답 데이터 반환
  } catch (error) {
    console.error('Error while signing up:', error);
    throw error; // 오류를 상위 컴포넌트로 전파
  }
};


//로그인 요청을 보내는 함수
// login 함수에서 토큰을 저장하는 방법
export const login = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, userData);
      const token = response.data.token;
      localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
      return response.data; // 요청에 대한 응답 데이터 반환
    } catch (error) {
      console.error('Error while logging in:', error);
      throw error; // 오류를 상위 컴포넌트로 전파
    }
  };
  
  //로그아웃 요청을 보내는 함수
  export const logout = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/logout`);
      return response.data; // 요청에 대한 응답 데이터 반환
    } catch (error) {
      console.error('Error while logging out:', error);
      throw error; // 오류를 상위 컴포넌트로 전파
    }
  };