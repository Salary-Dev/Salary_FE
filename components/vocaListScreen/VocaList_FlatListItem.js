import styled, { css } from "styled-components";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import axios from "axios";
import { BASE_URL } from "@env";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSavedSelector,
  todaySalaryContent,
} from "../../Recoil/todaySalaryContent";
import { useNavigation } from "@react-navigation/native";

const ItemWrapper = styled.TouchableOpacity`
  height: 60px;
  margin: 0px 50px;
  padding-right: 10px;
  padding-left: 10px;

  border-bottom-color: #e4e4e4;
  border-bottom-style: solid;
  border-bottom-width: 1px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  /* 마지막 요소인지 받아서 border 안 띄워야함 */
  ${(props) =>
    props.last
      ? css`
          border-bottom-width: 0px;
        `
      : css``}
`;

const BookMarkContainer = styled.TouchableOpacity`
  height: 100%;
  width: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

function VocaList_FlatListItem({ word_id, word }) {
  const [bookMark, setBookMark] = useState(true);
  // 단어장에 todaySalary 단어가 있고, 단어장의 북마크 데이터가 바뀌면 전역 todaySalary 데이터에도 반영해야함
  const [bookmarkTodaySalary, setbookmarkTodaySalary] =
    useRecoilState(isSavedSelector);

  const todaySalary = useRecoilValue(todaySalaryContent);

  async function fetchBookMarkState(tmpState) {
    if (tmpState) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/wordbook?word_id=${word_id}`
        );
        console.log("삭제 결과", res.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post(`${BASE_URL}/wordbook?word_id=${word_id}`);
        console.log("다시 저장 결과", res.data);
      } catch (error) {
        console.log(error);
      }
    }
    if (word_id === todaySalary.word_id) {
      // 오늘의 샐러리인 단어라면 북마크 전역 상태에 반영
      setbookmarkTodaySalary(!tmpState);
    }
  }

  function onBookmarkToggle() {
    const tmpState = bookMark; // 이전 북마크 상태를 받아와둠
    setBookMark(!bookMark);

    fetchBookMarkState(tmpState);
  }

  const navigation = useNavigation();
  return (
    <ItemWrapper
      key={word_id}
      onPress={() => {
        navigation.navigate("TodaySalaryEdu", { word_id: word_id });
      }}
    >
      <fonts.Body1>{word}</fonts.Body1>
      <BookMarkContainer onPress={onBookmarkToggle}>
        {bookMark ? (
          <Ionicons name="bookmark" color={colors.Primary_100} size={25} />
        ) : (
          <Ionicons
            name="bookmark-outline"
            color={colors.Grayscale_100}
            size={25}
          />
        )}
      </BookMarkContainer>
    </ItemWrapper>
  );
}

export default VocaList_FlatListItem;
