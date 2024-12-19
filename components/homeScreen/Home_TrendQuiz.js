import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import styled, { css } from "styled-components";
import colors from "../../styles/colors";
import ellipse_done from "../../common/homeScreen/ellipse_done.png";
import ellipse_yet from "../../common/homeScreen/ellipse_yet.png";
import { useNavigation } from "@react-navigation/native";
import PrimaryBtn from "../../common/PrimaryBtn";
import fonts from "../../styles/fonts";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { todayAttendanceDetail } from "../../Recoil/todayAttendanceDetail";
import { todayTrendSelector } from "../../Recoil/todayAttendanceDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  height: 100%;
  margin: 28px;
  margin-top: 0px;
  gap: 32px;

  border-radius: 20px;
`;

const DesriptContainer = styled.View`
  flex: 1;
  flex-direction: column;
  gap: 8px;
`;

const TitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

const Title = styled(fonts.H5)`
  color: ${colors.Grayscale_100};
`;

const TitleDescript = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
`;

const DoneMarker = styled.Image`
  width: 13px;
  height: 13px;
  object-fit: cover;
`;

function Home_TrendQuiz() {
  const trendState = useRecoilValue(todayTrendSelector);
  const setTrendState = useSetRecoilState(todayTrendSelector);

  const navigation = useNavigation();

  const [trendQuizData, setTrendQuizData] = useState({});

  useEffect(() => {
    async function fetchTrendQuizData() {
      // 당연히 있을 테니 검증은 안 함
      const existingTrendQuizData = JSON.parse(
        await AsyncStorage.getItem("todayTrendQuizData")
      );
      console.log("트렐ㄴ드퀴즈 해설: ", existingTrendQuizData);
      setTrendQuizData(existingTrendQuizData);
    }

    fetchTrendQuizData();
    console.log(trendQuizData);
  }, []);

  return (
    <Container>
      <DesriptContainer>
        <TitleContainer>
          <DoneMarker
            source={trendState ? ellipse_done : ellipse_yet}
          ></DoneMarker>
          <Title trendState={trendState}>뜨거운 감자가 도착했어요!</Title>
        </TitleContainer>
        <TitleDescript>
          {trendState
            ? "오늘의 퀴즈를 이미 풀었어요. \n 내일 새로운 퀴즈가 업데이트 될 예정이에요!"
            : "요즘 경제 상황에 기반한 퀴즈를 준비했어요"}
        </TitleDescript>
      </DesriptContainer>

      <PrimaryBtn
        type={trendState ? "eduDone" : "active"}
        text={trendState ? "트렌드 퀴즈 해설 보러가기" : "트렌드 퀴즈 풀기"}
        onPress={() => {
          if (!trendState) navigation.push("TodayTrendQuiz");
          else
            navigation.push("TodayTrendSolution", {
              // trendquiz params 전달
              ...trendQuizData,
            });
        }}
      ></PrimaryBtn>
    </Container>
  );
}

export default Home_TrendQuiz;
