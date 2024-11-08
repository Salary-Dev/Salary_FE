import styled from "styled-components/native";
import PrimaryBtn from "../../common/PrimaryBtn";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import HighlightText from "react-native-highlight-underline-text";

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
  padding: 65px 20px 41px;
  background-color: #fff;
  align-items: center;
  gap: 16px;
`;

// 텍스트
const TextContainer = styled.View`
  gap: 12px;
  align-items: center;
  margin-bottom: 43px;
`;

const ResultText = styled.Text`
  color: ${colors.Grayscale_100};
  font-size: 18px;
  font-family: Pretendard-SemiBold;
`;

const AnswerText = styled(fonts.H2)`
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

function SignUp_ConfirmingModal({onHide, onWelcome, nickname}) {
  return (
    <ModalOverlay>
      <ModalContent>
        {/* 세가지 요소를 담는 컨테이너 */}
        <TextContainer>
          <HighlightText
            isFixed
            underlineSize={10}
            underlineColor={colors.Primary_100}
            textStyle={{
              color: "#121212",
              fontFamily: "Pretendard-Bold",
              fontSize: 23,
              lineHeight: 27,
            }}
            text={nickname}
          ></HighlightText>
          <GuideText>
            으로 샐러리를 시작합니다.
          </GuideText>
        </TextContainer>
        <PrimaryBtn
          type="active"
          text="네, 좋아요"
          onPress={onWelcome}
        ></PrimaryBtn>
        <CloseButton onPress={onHide}>
          <ButtonText>아니요, 변경할게요</ButtonText>
        </CloseButton>
      </ModalContent>
    </ModalOverlay>
  )
}

export default SignUp_ConfirmingModal;