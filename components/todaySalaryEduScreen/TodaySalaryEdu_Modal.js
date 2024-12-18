import styled from "styled-components";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useNavigation } from "@react-navigation/native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import HighlightText from "react-native-highlight-underline-text";
import { useEffect } from "react";
import Salary_Character from "../../assets/img/signUpScreen/Salary_Character.png";
import Fireworks from "../../assets/img/signUpScreen/Fireworks.png";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSavedSelector,
  todaySalaryContent,
} from "../../Recoil/todaySalaryContent";

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
  gap: 14px;
  align-items: center;
`;

const ResultText = styled(fonts.H5)`
  color: ${colors.Grayscale_100};
`;

const GuideText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
  text-align: center;
`;

const CloseButton = styled.TouchableOpacity``;

const ButtonText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
  text-decoration: underline;
`;

const ImgContainer = styled.View`
  position: relative;
  height: 106px;
  width: 100%;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CharacterImg = styled.Image`
  resizemode: cover;
  width: 106px;
  height: 106px;
  position: absolute;
  left: 48px;
`;

const FireworksRightImg = styled.Image`
  resizemode: cover;
  width: 78px;
  height: 78px;
  position: absolute;
  top: 25%;
  left: 124px;
`;

function TodaySalaryEdu_Modal({ closeModal, fetchBookMarkState }) {
  const todaySalary = useRecoilValue(todaySalaryContent);

  const handleNavigateBookmark = () => {
    fetchBookMarkState(true);
    closeModal();
    setTimeout(() => {
      navigation.goBack(); // 모달 닫은 후 화면 교체하도록
    }, 300); // 모달 닫는 애니메이션 시간과 동일하게 설정
  };

  // 단어학습, 트렌드 퀴즈 모두 공통으로 적용
  const handleNavigateHome = () => {
    closeModal();
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback>
      <ModalOverlay>
        <TouchableWithoutFeedback>
          <ModalContent>
            {/* 세가지 요소를 담는 컨테이너 */}
            <TextContainer>
              <ResultText>오늘의 용어 학습을 완료했어요!</ResultText>
              <GuideText>
                샐러리 한조각에 참여해 시드 5개를 획득했어요. {"\n"}
                축하해요!
              </GuideText>
            </TextContainer>
            <ImgContainer>
              <CharacterImg source={Salary_Character} />
              <FireworksRightImg source={Fireworks} />
            </ImgContainer>
            <PrimaryBtn
              type="active"
              text="학습 완료하고 홈으로 돌아가기"
              onPress={handleNavigateHome}
            ></PrimaryBtn>

            <CloseButton onPress={handleNavigateBookmark}>
              <ButtonText>단어 저장하기</ButtonText>
            </CloseButton>
          </ModalContent>
        </TouchableWithoutFeedback>
      </ModalOverlay>
    </TouchableWithoutFeedback>
  );
}

export default TodaySalaryEdu_Modal;
