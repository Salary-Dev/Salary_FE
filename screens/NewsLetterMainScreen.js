import styled from "styled-components/native";
import SubscribingLetterList from "../components/NewsLetterMainScreen/SubscribingLetterList";
import ArrivedLetterList from "../components/NewsLetterMainScreen/ArrivedLetterList";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import HighlightText from "react-native-highlight-underline-text";
import PrimaryBtn from "../common/PrimaryBtn";
import { useRecoilValue } from "recoil";
import { nicknameState } from "../Recoil/nicknameState";
import dottedCircle from "../assets/img/NewsLetterMainScreen/dottedCircle.png";
import seedPrice from "../assets/img/NewsLetterMainScreen/seedPrice.png";
import { Modal } from "react-native";
import { totalSeedState } from "../Recoil/totalSeedState";

const ViewContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 0px 23px;
`;

const HeaderTitle = styled(fonts.H4M)`
  color: #3a3a3a;
  margin: 30px 0px 20px 4px;
`;

const MainTitle = styled(fonts.H4M)`
  color: #3a3a3a;
  margin: 33px 0px 6px 4px;
`;

const SubTitle = styled(fonts.Caption2)`
  color: #000;
  font-weight: 500;
  margin-bottom: 22px;
  margin-left: 4px;
`;

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
  padding: 46px 20px 26px;
  background-color: #fff;
  align-items: center;
  gap: 16px;
`;

// 텍스트
const TextContainer = styled.View`
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
`;

const GuideText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
  text-align: center;
`;

const CloseButton = styled.Pressable`
  padding: 4px;
`;

const ButtonText = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
  text-decoration-line: underline;
`;

const ImgContainer = styled.View`
  height: 36px;
  width: 156px;
  position: relative;
  margin: 24px 0px 11px;
`;

const DottedCircleImg = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const SeedPriceImg = styled.Image`
  position: absolute;
  width: 100%;
  height: 80%;
  resize-mode: contain;
`;

const Title = styled.Text`
  color: #313131;
  text-align: center;

  /* H4-20/Semibold */
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
`;

function NewsLetterMainScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const nickname = useRecoilValue(nicknameState);
  const [screenStage, setScreenStage] = useState(0);
  const totalSeed = useRecoilValue(totalSeedState);

  console.log(modalVisible);

  const moveToSeedCharge = () => {
    navigation.navigate("SeedCharge", { totalSeed: totalSeed});
    setModalVisible(false);
  }

  return (
    <>
      {
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <ModalOverlay>
            <ModalContent>
              {/* 세가지 요소를 담는 컨테이너 */}
              {screenStage === 0 ? (
                <>
                  <TextContainer>
                    <HighlightText
                      isFixed
                      underlineSize={10}
                      underlineColor={colors.Primary_100}
                      textStyle={{
                        color: "#121212",
                        fontFamily: "Pretendard-Bold",
                        fontSize: 18,
                        lineHeight: 23,
                      }}
                      text="레터를 읽고 싶다면..."
                    />
                    <ImgContainer>
                      <DottedCircleImg source={dottedCircle} />
                      <SeedPriceImg source={seedPrice} />
                    </ImgContainer>
                    <GuideText>현재 {nickname}님이 보유한 시드 {totalSeed}개</GuideText>
                  </TextContainer>
                  <PrimaryBtn
                    type="active"
                    text="시드로 레터 보기"
                    onPress={() => setScreenStage(1)}
                  />
                  <CloseButton onPress={() => setModalVisible(false)}>
                    <ButtonText>돌아가기</ButtonText>
                  </CloseButton>
                </>
              ) : screenStage === 1 ? (
                <>
                  <Title>시드 사용</Title>
                  <SubTitle>
                    시드 30개를 사용해서{"\n"}레터 보기를 진행할까요?
                  </SubTitle>
                  <PrimaryBtn
                    type="active"
                    text="네 진행할게요"
                    onPress={() => setScreenStage(2)}
                  />
                  <CloseButton onPress={() => setModalVisible(false)}>
                    <ButtonText>아니요, 돌아갈게요</ButtonText>
                  </CloseButton>
                </>
              ) : (
                <><TextContainer>
                <HighlightText
                  isFixed
                  underlineSize={10}
                  underlineColor={colors.Primary_100}
                  textStyle={{
                    color: "#121212",
                    fontFamily: "Pretendard-Bold",
                    fontSize: 18,
                    lineHeight: 23,
                  }}
                  text="앗! 시드가 부족해요.."
                />
                <ImgContainer>
                  <DottedCircleImg source={dottedCircle} />
                  <SeedPriceImg source={seedPrice} />
                </ImgContainer>
                <GuideText>현재 {nickname}님이 보유한 시드 {totalSeed}개</GuideText>
              </TextContainer>
              <PrimaryBtn
                type="active"
                text="시드 충전하러 가기"
                onPress={moveToSeedCharge}
              /></>
              )}
            </ModalContent>
          </ModalOverlay>
        </Modal>
      }
      <ViewContainer>
        <HeaderTitle>경제레터</HeaderTitle>
        <SubscribingLetterList />
        <MainTitle>에디터의 경제 레터가 도착했어요!</MainTitle>
        <SubTitle>
          인증된 에디터가 작성한 경제 레터에요.{"\n"}마음에 드는 글은 시드를
          소모하여 읽어볼 수 있어요.
        </SubTitle>
        <ArrivedLetterList onOpenModal={() => setModalVisible(true)} />
      </ViewContainer>
    </>
  );
}

export default NewsLetterMainScreen;
