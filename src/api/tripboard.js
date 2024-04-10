import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

//여행 게시판 글 불러오기 -> cors 오류
export const showTripPost = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trip`);
      return response.data.map(post => ({
        id: post.id,
        title: post.title,
        date: post.created_at
      }));
    } catch (error) {
      console.error('게시물 불러오기 오류:', error);
      throw error;
    }
  };