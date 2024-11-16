import styled, { css } from "styled-components";
import {
  Pressable,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import WordToggle from "../../common/WordToggle";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ReminderContainer = styled.View`
  padding: 40px;
  width: 90%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const RemindContentContainer = styled.ScrollView`
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 0 25px;
`;

const WordBtnElement = styled.Pressable`
  border-radius: 15px;
  border: 2px solid ${colors.Primary_80};
  align-self: flex-start;
  padding: 5px 12px;
  margin: 6px;

  ${(props) =>
    props.clickState
      ? css`
          background-color: ${colors.Primary_80};
        `
      : css``}
`;

const WordBtnText = styled(fonts.Body1)`
  color: "#000000";
`;

// data={remindWords}
// reminding={reminding}
// onClick={handleWordClick}
function VocaReminder_remindContent({
  data,
  reminding,
  onClick,
  clickedWordCount,
}) {
  const navigation = useNavigation();
  let content;

  // 0개 고른 경우 렌더링 방지
  if (reminding && clickedWordCount === 0) {
    navigation.goBack(-1);
  } else if (!reminding) {
    content = (
      <Container>
        <ReminderContainer>
          {data.map((item, index) => (
            <WordBtnElement
              onPress={() => onClick({ word: item.word })}
              clickState={item.clickState}
              key={item.word}
            >
              <WordBtnText key={item.word}>{item.word}</WordBtnText>
            </WordBtnElement>
          ))}
        </ReminderContainer>
      </Container>
    );
  } else {
    let wordIndex = 1; // indexing을 위한 변수 선언
    content = (
      <Container>
        <RemindContentContainer>
          {data.map((item) =>
            item.clickState ? (
              <WordToggle
                type="vocaReminder"
                index={wordIndex++}
                word={item.word}
                mean={item.mean}
                key={item.word}
              />
            ) : (
              <></>
            )
          )}
        </RemindContentContainer>
      </Container>
    );
  }

  return content;
}

export default VocaReminder_remindContent;
