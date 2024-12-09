import axios from "axios";
import { BASE_URL } from "@env";

export async function fetchTodayWordId(token) {
  try {
    const res = await axios.get(`${BASE_URL}/today-word`, {
      headers: { Authorization: token },
    });
    console.log(`${BASE_URL}/today-word`);
    if (res.status === 200) {
      console.log("새로운 word id를 받음", res.data.word_id);
      return { word_id: res.data.word_id };
    }
  } catch (error) {
    console.log("HomeScreen- 3번 오늘 학습 단어 조회 에러", error);
  }
}
