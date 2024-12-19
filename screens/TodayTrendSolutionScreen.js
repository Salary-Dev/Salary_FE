import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";
import Salary_Character from "../assets/img/signUpScreen/Salary_Character.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Shadow } from "react-native-shadow-2";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "@env";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { todayTrendSelector } from "../Recoil/todayAttendanceDetail";
import { todayAttendanceState } from "../Recoil/todayAttendanceState";
import { authToken } from "../Recoil/authToken";

const ViewContainer = styled.SafeAreaView`
  background-color: white;
  align-items: center;
`;

const SolutionView = styled.View`
  width: 360px;
`;

const MainTitle = styled(fonts.H4SB)`
  color: ${colors.Grayscale_100};
  text-align: left;
  margin: 20px 0px 0px 12px;
`;
const SubTitle = styled.Text`
  color: ${colors.Grayscale_80};
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin: 8px 0px 16px 12px;
`;
const Salary_CharacterImg = styled.Image`
  resizemode: contain;
  width: 104px;
  height: 104px;
  position: absolute;
  top: 100px;
  left: 200px;
`;
const SolutionContainer = styled.View`
  width: 360px;
  height: 640px;
  border-radius: 10px;
  background-color: ${colors.Grayscale_90};
  align-items: center;
  padding: 24px 19px 16px 19px;
`;

const QuestionText = styled.Text`
  line-height: 22px;
  width: 100%;
`;

const QDot = styled.Text`
  color: ${colors.Secondary_100};
  font-size: 22px;
  font-weight: 700;
`;

const QuestionContent = styled.Text`
  color: ${colors.Grayscale_white};
  font-weight: 500;
  font-size: 14px;
`;

const AnswerText = styled.Text`
  line-height: 20px;
  width: 100%;
  margin-top: 40px;
`;

const ADot = styled.Text`
  color: ${colors.Secondary_100};
  font-size: 22px;
  font-weight: 700;
`;

const AnswerContent = styled.Text`
  color: ${colors.Grayscale_white};
  font-size: 16px;
  font-weight: 500;
`;

const ExplanationWrapper = styled.View`
  width: 100%;
  height: 415px;
  margin-top: 16px;
  border-top-width: 1px;
  border-top-color: ${colors.Grayscale_80};
`;

const Explanation = styled(fonts.Body2M)`
  color: ${colors.Grayscale_20};
  margin-top: 18px;
`;

// 텍스트의 길이에 따라 박스 크기 어떻게 변하는지 고려해야함
const CompleteBtn = styled.Pressable`
  border-radius: 10px;
  height: 45px;
  width: 100%;
  background-color: ${colors.Primary_100};
  justify-content: center;
  align-items: center;
`;

const CompleteBtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  font-family: "Inter-SemiBold";
  color: ${colors.Grayscale_90};
`;

function TodayTrendSolutionScreen({ navigation, route }) {
  // 메인화면에서 알맞게 렌더링하기 위해 전역 상태 관리
  const trendState = useRecoilValue(todayTrendSelector);
  const setTrendState = useSetRecoilState(todayTrendSelector);
  const [attendanceState, setAttendanceState] =
    useRecoilState(todayAttendanceState);
  // 토큰 추가
  const token = useRecoilValue(authToken);

  // const handleFinishStudy = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${BASE_URL}/trend-quiz/update-status?trend=${true}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     const resSeed = await axios.patch(
  //       `${BASE_URL}/seed/update`,
  //       {
  //         seed_earned: 5,
  //         seed_used: 0,
  //       },
  //       { headers: { Authorization: token } }
  //     );
  //     console.log("시드 patch", resSeed.data.status);
  //     if (!trendState) {
  //       setTrendState(true);
  //       setAttendanceState((prev) => prev + 1); // attendance state에 1을 더해주어 알맞게 상태 관리
  //       // 중복 처리되어서는 안됨!!
  //     }
  //     console.log(res.data);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <ViewContainer>
      <StatusBar style="dark" />
      <SolutionView>
        <MainTitle>오늘의 트렌드 퀴즈 해설</MainTitle>
        <SubTitle>
          퀴즈 해설을 확인해보세요.{"\n"}
          내일 새로운 퀴즈가 업데이트 될 예정이에요!
        </SubTitle>
        <Salary_CharacterImg source={Salary_Character} />
        <Shadow
          style={{ width: "100%" }}
          distance={20}
          startColor="rgba(0, 0, 0, 0.02)"
          offset={[4, 4]}
        >
          <SolutionContainer>
            <QuestionText>
              <QDot>Q. </QDot>
              <QuestionContent>{route.params.trend_quiz}</QuestionContent>
            </QuestionText>
            <AnswerText>
              <ADot>A. </ADot>
              <AnswerContent>{route.params.correct}</AnswerContent>
            </AnswerText>
            <ExplanationWrapper>
              <Explanation>{route.params.explanation}</Explanation>
            </ExplanationWrapper>
            {/* 학습 완료한 상태면 버튼 렌더링 안 됨 */}
            <CompleteBtn onPress={() => navigation.goBack()}>
              <CompleteBtnText>트렌드 퀴즈 완료하기</CompleteBtnText>
            </CompleteBtn>
          </SolutionContainer>
        </Shadow>
      </SolutionView>
    </ViewContainer>
  );
}

export default TodayTrendSolutionScreen;
