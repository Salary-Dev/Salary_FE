import { useEffect, useState, useRef } from "react";
import {
  Modal,
  Pressable,
  TextInput,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import styled, { css } from "styled-components";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import Constants from "expo-constants";
import Advertise from "../common/assets/avt.jpg";
import { Shadow } from "react-native-shadow-2";
import PrimaryBtn from "../common/PrimaryBtn";
import { useNavigation } from "@react-navigation/native";
import PrimaryModal from "../common/PrimaryModal";
import { useRecoilValue } from "recoil";
import { todaySalaryContent } from "../Recoil/todaySalaryContent";

const Container = styled.View`
  align-items: center;
  background-color: ${colors.bg};

  gap: 13px;
  padding-top: 0px;
`;

const AdvertiseImg = styled.Image`
  width: 334px;
  height: 71px;
`;

const BoxContainer = styled.View`
  display: flex;
  width: 350px;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 44px;

  border-radius: 10px;
  background: ${colors.Grayscale_white};
`;

const DescriptContainer = styled.View`
  align-items: flex-start;
  gap: 22px;
`;

const AnswerDescript = styled(fonts.Body2M)`
  color: ${colors.Grayscale_90};
`;

const InputBoxContainer = styled.View`
  width: 100%;
  height: 25px;
  flex-direction: row;
  justify-content: space-between;

  border-bottom-color: #9f9f9f;
  border-bottom-width: 1px;
`;

const InputAnswer = styled.TextInput`
  font-size: 14px;
  color: ${colors.Grayscale_40};
  font-family: "Pretendard-Medium";
  font-size: 14px;
  line-height: 14px;
  vertical-align: middle;
`;

const InputHint = styled(fonts.Caption2)`
  color: ${colors.Grayscale_80};
`;

const BtnContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const SkipBtn = styled.Pressable`
  text-align: center;

  border-bottom-color: ${colors.Grayscale_80};
  border-bottom-width: 1px;
`;

const SkipBtnText = styled(fonts.Button2)`
  color: ${colors.Grayscale_80};
`;

function TodaySalaryScreen() {
  const todaySalary = useRecoilValue(todaySalaryContent);

  var tempAnsLth = todaySalary.word.length;
  const [tempAnswerInput, setTempAnswerInput] = useState("");
  const [answerInputLth, setAnswerInputLth] = useState(0);

  // 모달 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  function openModal() {
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  // textInput에 포커스를 주기 위함
  const inputRef = useRef(null);

  useEffect(() => {
    // 화면 렌더링 후 TextInput에 포커스
    if (inputRef.current) {
      // 화면 렌더링마다 모달 상태 초기화
      setIsModalVisible(false);
      inputRef.current.focus();
    }
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    tempAnsLth = todaySalary.word.length;
    // answer.length
  }, [todaySalary]);

  // 인자: enteredAnswer
  function answerInputHandler(enteredAnswer) {
    setTempAnswerInput(enteredAnswer);
    setAnswerInputLth(enteredAnswer.length);
  }

  return (
    <SafeAreaView style={styles.rootScreen}>
      <StatusBar style="dark" />
      <Modal
        visible={isModalVisible}
        transparent={true} // 배경 투명
        animationType="slide" // 모달 등장 애니메이션
        onRequestClose={closeModal} // 안드로이드에서 뒤로가기 버튼 처리
      >
        {/* Modal 태그 내부에 Modal View를 정의 */}

        <PrimaryModal
          type="todaySalary"
          result={todaySalary.word === tempAnswerInput}
          answer={todaySalary.word}
          word_id={todaySalary.word_id}
          closeModal={closeModal}
          replaceScreenName="TodaySalaryEdu"
        ></PrimaryModal>
      </Modal>

      {/* 전체 컨테이너 */}
      <Container>
        {/* 광고 섹션 */}
        <AdvertiseImg source={Advertise}></AdvertiseImg>
        {/* 박스 컨테이너 */}
        <Shadow
          style={styles.shadowContainer}
          distance={10}
          startColor="rgba(0, 0, 0, 0.03)"
          offset={[4, 4]}
        >
          <BoxContainer>
            {/* answerDescript와 정답 입력 inputbox */}
            <DescriptContainer>
              <AnswerDescript>{todaySalary.mean}</AnswerDescript>
              <InputBoxContainer>
                <InputAnswer
                  //  maxLength={2}
                  placeholder="정답을 입력해주세요."
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={answerInputHandler}
                  value={tempAnswerInput}
                  ref={inputRef}
                  returnKeyType="done" // enter 키 누르면 제출되도록
                ></InputAnswer>
                <InputHint>
                  {answerInputLth}/{tempAnsLth}자
                </InputHint>
              </InputBoxContainer>
            </DescriptContainer>
            {/* 버튼 2가지 Container */}
            <BtnContainer>
              <PrimaryBtn
                type={
                  tempAnsLth === tempAnswerInput.length ? "active" : "deactive"
                }
                text="제출하기"
                onPress={
                  tempAnsLth === tempAnswerInput.length
                    ? openModal
                    : // 팝업 띄우기
                      () => {}
                }
              ></PrimaryBtn>
              <SkipBtn
                onPress={() => {
                  navigation.replace("TodaySalaryEdu", {
                    // params 전달
                    word_id: todaySalary.word_id,
                    type: "todaySalary",
                  });
                  // 모달 없이 학습페이지로 바로 이동
                }}
              >
                <SkipBtnText>모르겠어요. 퀴즈는 건너뛸게요.</SkipBtnText>
              </SkipBtn>
            </BtnContainer>
          </BoxContainer>
        </Shadow>
      </Container>
    </SafeAreaView>
  );
}
export default TodaySalaryScreen;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.Grayscale_white,
  },
  shadowContainer: {
    width: "100%",
    flex: 1,
  },
});
