import React, { useEffect, useState, useRef } from "react";
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
import * as Haptics from "expo-haptics";
import { Audio } from 'expo-av';
import ErrorSound from "../assets/sounds/ErrorSound.mp3";
import SuccessSound from "../assets/sounds/SuccessSound.mp3";


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
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  flex-wrap: wrap;
`;

const HiddenInput = styled.TextInput`
  position: absolute;
  opacity: 1;
  top: 0;
  left: 0;
  height: 35px;
  width: 35px;
  font-size: 14px;

  background-color: transparent;
  color: transparent;
`;

const EachInputBox = styled.View`
  width: 35px;
  height: 35px;
  border-width: 1px;
  border-color: #ccc;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
`;

const HintBox = styled(fonts.Body1)`
  color: ${colors.Grayscale_90};

  text-align: center;
  vertical-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
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
  const navigation = useNavigation();
  const todaySalary = useRecoilValue(todaySalaryContent);

  const [tempAnswerInput, setTempAnswerInput] = useState("");
  const [answerInputLth, setAnswerInputLth] = useState(0);

  const inputRefs = useRef([]); // 여러 input의 ref를 저장
  const [koreanAnswers, setKoreanAnswers] = useState({
    wordAnswer: [],
    wordCount: "",
    wordLengths: [],
  }); // 실제 "한글 정답 값"
  const [answerTotalLength, setAnswerTotalLength] = useState(0);
  //  {"wordAnswers": ["국고금", "실시간", "전자이체"], "wordCount": 3, "wordLengths": [3, 3, 4]}
  const [englishHint, setEnglishHint] = useState(""); // 괄호 내부의 영어 힌트
  const [texts, setTexts] = useState([]); // 전체 입력 값들 (띄어쓰기로 구분)

  // inputRefs 배열을 동적으로 생성/초기화
  const assignRef = (index, ref) => {
    inputRefs.current[index] = ref;
  };

  const handleFocusNext = (index) => {
    // 다음 TextInput으로 포커스 이동
    if (inputRefs && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // count만큼의 box로 구성된 하나의 큰 박스와 각 input을 return 하는 함수
  const returnBoxes = ({ index, item }) => {
    // 글자수만큼 box를 구성한다
    const result = [];
    for (let i = 0; i < item; i++) {
      result.push(
        <EachInputBox key={i}>
          <fonts.Body2M>
            {texts[index] && texts[index].length >= i + 1 && texts[index][i]}
          </fonts.Body2M>
        </EachInputBox>
      );
    }

    // todaySalary.word의 구성을 파악한다 -> ()가 시작되기 전 한글 단어의 개수와 단어의 길이를 파악하여 알맞게 box를 띄운다.
    return (
      <View
        key={index}
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "flex-start",
        }}
      >
        {result}
        <HiddenInput
          ref={(ref) => assignRef(index, ref)}
          value={texts[index]} // texts 관리
          maxLength={item + 1} // 최대 글자 수 (박스 개수)
          onChangeText={(text) => {
            if (text.length > item) {
              handleFocusNext(index);
            }
            setTexts((prevTexts) => {
              const newArray = [...prevTexts];
              newArray[index] = text;
              return newArray;
            });
            answerInputHandler(index, text);
          }} // 입력값 업데이트
          autoFocus={index === 0 ? true : false} // 자동 포커스
        />
      </View>
    );
  };

  useEffect(() => {
    // 화면 렌더링 후 TextInput에 포커스
    if (inputRefs && inputRefs[0]) {
      // 화면 렌더링마다 모달 상태 초기화
      inputRefs[0].current.focus();
    }
  }, [inputRefs]);

  //// 모달 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 소리 추가 
  const [sound, setSound] = useState();

  async function playSound(type) {
    const { sound } = await Audio.Sound.createAsync(
      type // 로컬 사운드 파일
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound ? () => { sound.unloadAsync() } : undefined;
  }, [sound])

  async function openModal() {
    setIsModalVisible(true);
    if (checkIfAnswer()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(SuccessSound);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      playSound(ErrorSound);
    }
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  useEffect(() => {
    if (todaySalary.word) {
      const input = todaySalary.word;

      const regex = /\((.*?)\)$/; // 영어 문자열 추출 정규식
      const match = input.match(regex);

      let koreanString = input;
      let englishString = null;

      if (match) {
        // todaySalary.word를 파싱해서 koreanAnswer과 englishHint를 각각 set한다
        englishString = match[1]; // 영어 부분 추출
        setEnglishHint(englishString);
        koreanString = input.replace(regex, "").trim(); // 영어 문자열 제거 후 한글 부분만 추출
      }

      // 한글 문자열 띄어쓰기 기준 단어 분석
      const koreanWords = koreanString.split(" ").filter(Boolean); // 빈 단어 제거

      const wordCount = koreanWords.length; // 각 단어의 개수

      // tempAnsLth도 한국어 답의 길이로 set한다.
      setAnswerTotalLength(0);
      const wordLengths = koreanWords.map((word) => {
        setAnswerTotalLength((prev) => prev + word.length);
        return word.length;
      });

      setKoreanAnswers({
        wordAnswers: koreanWords,
        wordCount,
        wordLengths,
      });
    }
  }, [todaySalary]);

  // input이 입력될 때마다 길이를 알맞게 set함
  function answerInputHandler(index, text) {
    // 길이를 확인하여 버튼 활성화/ 비활성화를 결정
    let length = 0;
    for (let i = 0; i < koreanAnswers.wordCount; i++) {
      if (i === index) {
        if (text.length > koreanAnswers.wordLengths[i])
          length += koreanAnswers.wordLengths[i];
        else length += text.length;
      } else if (texts[i]) {
        if (texts[i].length > koreanAnswers.wordLengths[i])
          length += koreanAnswers.wordLengths[i];
        else length += texts[i].length;
      }
    }
    setAnswerInputLth(length);
  }

  function checkIfAnswer() {
    for (let i = 0; i < koreanAnswers.wordCount; i++) {
      if (koreanAnswers.wordAnswers[i] !== texts[i]) return false;
    }
    return true;
  }

  useEffect(() => {
    if (inputRefs && inputRefs[0]) {
      // 화면 렌더링마다 모달 상태 초기화
      inputRefs[0].current.focus();
    }
  }, []);

  if (koreanAnswers.wordLengths.length != 0) {
    if (inputRefs[0]) inputRefs[0].current.focus();
    return (
      <SafeAreaView>
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
            result={checkIfAnswer()}
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
            distance={10}
            startColor="rgba(0, 0, 0, 0.03)"
            offset={[4, 4]}
          >
            <BoxContainer>
              {/* answerDescript와 정답 입력 inputbox */}
              <DescriptContainer>
                <AnswerDescript>{todaySalary.mean}</AnswerDescript>
                <InputBoxContainer>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignSelf: "flex-start",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {koreanAnswers.wordLengths.map((item, index) =>
                      returnBoxes({ index, item })
                    )}
                    {/* 실제 입력값을 받아주는 숨겨진 Input */}
                    <View
                      style={{
                        paddingHorizontal: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      {englishHint && <HintBox>({englishHint})</HintBox>}
                    </View>
                  </View>
                  {/* 영어 힌트가 있다면 */}
                </InputBoxContainer>
              </DescriptContainer>
              {/* 버튼 2가지 Container */}
              <BtnContainer>
                <PrimaryBtn
                  type={
                    answerTotalLength <= answerInputLth ? "active" : "deactive"
                  }
                  text="제출하기"
                  onPress={
                    answerTotalLength <= answerInputLth
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
}
export default TodaySalaryScreen;
