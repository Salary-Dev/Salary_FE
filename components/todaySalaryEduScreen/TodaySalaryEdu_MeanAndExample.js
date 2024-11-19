import { View, TouchableOpacity, Text } from "react-native";
import styled, { css } from "styled-components";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { useEffect, useState } from "react";
import HighlightText from "react-native-highlight-underline-text";

const RootContainer = styled.View`
  border: 1px solid ${colors.Grayscale_10};
  background-color: ${colors.Grayscale_white};
  align-items: center;
`;

const ToggleContainer = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const Toggle = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding: 4px 0px 5px 0px;

  ${(props) =>
    props.meanPressed
      ? css`
          background-color: ${colors.Grayscale_white};
        `
      : css`
          background-color: ${colors.bg};
        `}
`;

const ToggleText = styled(fonts.Body2M)`
  color: "#000000";
  box-sizing: content-box;
`;

const ContentContainer = styled.View`
  width: 90%;
  text-align: center;
  padding: 18px 0px;
  justify-content: center;
  flex-direction: row;
  background-color: ${colors.Grayscale_white};
  flex-wrap: wrap;
  word-break: keep-all;
`;

const ContentText = styled(fonts.Body2M)`
  flex-wrap: wrap;
  word-break: keep-all;
`;

const UnderlineView = styled.View`
  border-bottom-color: ${colors.Primary_100};
  border-bottom-width: 5px;
  border-bottom-style: solid;

  margin: 0;
  padding: 0;

  background-color: red;
`;

function TodaySalaryEdu_MeanAndExample({ word, mean, example }) {
  // 뜻/예문 중 뜻이 눌렸는지를 관리
  const [meanPressed, setMeanPressed] = useState(true);
  const [splitted, setSplitted] = useState("");

  function handleTogglePress({ name }) {
    if (name === "mean") setMeanPressed(true);
    else setMeanPressed(false);
  }

  // 예문에서 단어를 찾아 단어를 기준으로 배열 split을 해야 함.
  function splitExample() {
    if (!example.includes(word)) {
      return [];
    }
    if (!example.includes(" ")) return [];

    // 단어를 기준으로 문장을 분리
    const parts = example.split(word);
    const result = [
      parts[0], // 단어 앞부분
      // word, // 단어 자체는 안 함
      parts[1], // 단어 뒷부분
    ];

    return result;
  }

  useEffect(() => {
    if (example != "") setSplitted(splitExample(example));
  }, [example]);

  if (splitted)
    return (
      <RootContainer>
        {/* 뜻과 예문 사이 토글 */}
        <ToggleContainer>
          <Toggle
            meanPressed={meanPressed}
            onPress={() => handleTogglePress({ name: "mean" })}
            activeOpacity={0.5}
          >
            <ToggleText>뜻</ToggleText>
          </Toggle>
          <Toggle
            meanPressed={!meanPressed}
            onPress={() => handleTogglePress({ name: "example" })}
            activeOpacity={0.5}
          >
            <ToggleText>예문</ToggleText>
          </Toggle>
        </ToggleContainer>
        {/* 뜻 혹은 예문을 띄우는 섹션 */}
        {meanPressed ? (
          <ContentContainer>
            <ContentText>{mean}</ContentText>
          </ContentContainer>
        ) : splitted.length != 0 ? (
          <ContentContainer>
            <ContentText>
              {/* 일반 텍스트 앞부분 */}
              {splitted[0]}
              {/* 밑줄 텍스트 */}
              <Text
                style={{
                  backgroundColor: colors.Primary_100,
                  textDecorationLine: "underline", // 밑줄 스타일
                  textDecorationColor: colors.Primary_100, // 밑줄 색상
                  textDecorationStyle: "solid", // 밑줄 형태
                }}
              >
                {word}
              </Text>
              {/* 일반 텍스트 뒷부분 */}
              {splitted[1]}
            </ContentText>
          </ContentContainer>
        ) : (
          <ContentContainer>
            <ContentText>{example}</ContentText>
          </ContentContainer>
        )}
      </RootContainer>
    );
}

export default TodaySalaryEdu_MeanAndExample;
