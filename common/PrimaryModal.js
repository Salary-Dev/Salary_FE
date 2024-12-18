import styled from "styled-components";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import PrimaryBtn from "./PrimaryBtn";
import { useNavigation } from "@react-navigation/native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import HighlightText from "react-native-highlight-underline-text";
import { useEffect } from "react";

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(18, 18, 18, 0.4);
`;

const ModalContent = styled.View`
  width: 300px;
  height: auto;
  border-radius: 30px;
  padding: 42px 20px 22px;
  background-color: #fff;
  align-items: center;
  gap: 16px;
`;

// 텍스트
const TextContainer = styled.View`
  gap: 46px;
  align-items: center;
`;

const ResultText = styled.Text`
  color: ${colors.Grayscale_100};
  font-size: 18px;
  font-family: Pretendard-SemiBold;
`;

const AnswerText = styled(fonts.H2B)`
  color: ${colors.Grayscale_100};
`;

const AnswerTextHighLight = styled.View`
  background-color: ${colors.Primary_100};
  height: 10px;
  position: relative;
`;

const GuideText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
  text-align: center;
`;

const CloseButton = styled.TouchableOpacity``;

const ButtonText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
`;

// type: todaySalary 혹은 trendQuiz 문자열 형태로 전달
//   result: 정답 여부
//   answer: 정답 word
//   정답의 word_id (트렌드 퀴즈는 id 없음)
//   closeModal : 모달을 닫는 함수를 전달
//  replaceScreenName: 버튼 클릭시 replace할 스크린명을 전달
//  ??? : 트렌드 퀴즈의 데이터 관리 how
function PrimaryModal({
  type,
  result,
  answer,
  word_id,
  closeModal,
  replaceScreenName,
  trend_quiz,
  explanation,
}) {
  var screenName = replaceScreenName;
  const handleNavigateEdu = () => {
    closeModal();
    setTimeout(() => {
      navigation.replace(
        screenName,
        type === "trendQuiz"
          ? {
              // 트렌드 퀴즈 params 전달
              trend_quiz: trend_quiz,
              correct: answer,
              explanation: explanation,
            }
          : // 샐러리 한조각 params 전달
            { word_id: word_id, type: "todaySalary" }
      ); // 모달 닫은 후 화면 교체하도록
    }, 300); // 모달 닫는 애니메이션 시간과 동일하게 설정
  };

  // 단어학습, 트렌드 퀴즈 모두 공통으로 적용
  const handleNavigateHome = () => {
    closeModal();
    setTimeout(() => {
      // 스택에 쌓여 있는 홈화면으로 돌아감
      navigation.goBack(-1);
      // navigation.navigate("BottomTab");
      // navigate로 변경함
    }, 300);
  };

  const navigation = useNavigation();

  useEffect(() => {
    screenName = replaceScreenName;

    if (screenName && navigation.isFocused()) {
    } else {
      console.warn("Invalid screen name or navigator context");
    }
  }, [screenName]);

  return (
    <ModalOverlay>
      <ModalContent>
        {/* 세가지 요소를 담는 컨테이너 */}
        <TextContainer>
          <ResultText>{result ? "정답이에요! 🎉" : "정답은 ...🧐"}</ResultText>
          <HighlightText
            isFixed
            underlineSize={10}
            underlineColor={colors.Primary_100}
            textStyle={{
              color: "#121212",
              fontFamily: "Pretendard-Bold",
              fontSize: 23,
              lineHeight: 23,
            }}
            text={answer}
          ></HighlightText>
          <GuideText>
            {type === "todaySalary" ? (
              <GuideText>
                {" "}
                이어서 단어학습을 진행해보세요!{"\n"}단어학습을 모두 완료하면
                시드 5개를 받을 수 있어요.
              </GuideText>
            ) : (
              <GuideText>
                트렌드 퀴즈에 참여해 시드 5개를 획득했어요. 축하해요.
              </GuideText>
            )}
          </GuideText>
        </TextContainer>
        <PrimaryBtn
          type="active"
          text={
            type === "trendQuiz"
              ? "해설 보러가기"
              : result
              ? "단어 학습하러 가기"
              : "단어 이해하러 가기"
          }
          onPress={handleNavigateEdu}
        ></PrimaryBtn>
        <CloseButton onPress={handleNavigateHome}>
          <ButtonText>홈 화면으로 이동</ButtonText>
        </CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default PrimaryModal;
