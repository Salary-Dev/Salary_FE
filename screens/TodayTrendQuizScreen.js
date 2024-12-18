import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";
import { useEffect, useLayoutEffect, useState } from "react";
import GreenCheckMark from "../assets/img/todayTrendQuizScreen/GreenCheckMark.png";
import { Shadow } from "react-native-shadow-2";
import { Modal } from "react-native";
import PrimaryModal from "../common/PrimaryModal";
import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getKoreaFormattedDate from "../functions/getKoreaForamttedDate";
import LottieView from "lottie-react-native";
import fonts from "../styles/fonts";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authToken } from "../Recoil/authToken";
import { todayTrendSelector } from "../Recoil/todayAttendanceDetail";
import { todayAttendanceState } from "../Recoil/todayAttendanceState";
import DoneEventEmitter from "../events/DoneEventEmitter";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import ErrorSound from "../assets/sounds/ErrorSound.mp3";
import SuccessSound from "../assets/sounds/SuccessSound.mp3";

const ViewContainer = styled.SafeAreaView`
  background-color: white;
  align-items: center;
  height: 100%;
`;

const QuizViewContainer = styled.View`
  width: 360px;
`;

const MainTitle = styled.Text`
  color: #121212;
  font-size: 20px;
  font-weight: 600;
  margin: 20px 0px 0px 12px;
`;

const SubTitle = styled.Text`
  color: #414141;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.24px;
  margin-left: 12px;
  margin-top: 8px;
`;

const QuizContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  background-color: #f3f4f6;
  align-items: center;
  margin-top: 13px;
`;

const QuestionText = styled.Text`
  padding: 34px 17px 21px 17px;
  line-height: 22px;
`;

const QDot = styled.Text`
  color: #c1f032;
  font-size: 22px;
  font-weight: 700;
`;

const QuestionContent = styled.Text`
  color: #121212;
  font-size: 16px;
  font-weight: 500;
`;

const AnswerContainer = styled.View`
  width: 320px;
  align-self: center;
`;

const AnswerBox = styled.Pressable`
  width: 100%;
  min-height: 60px;
  border-radius: 6px;
  background-color: ${(props) => (!props.isSelected ? "#ffffff" : "#313131")};
  padding: 8px 12px;
  margin-bottom: 14px;
`;

const AnswerContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

const AnswerBox_Btn = styled.View`
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: #e8e8e8;
`;

const AnswerBox_BtnNumber = styled.Text`
  color: #a0a0a0;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
`;

const GreenCheckMarkImg = styled.Image`
  resizemode: cover;
  width: 28px;
  height: 28px;
`;

const AnswerBox_Text = styled.Text`
  color: ${(props) => (!props.isSelected ? "#121212" : "#ffffff")};
  font-size: 16px;
  font-weight: 500;
  width: 220px;
  flex: 1;
  flex-shrink: 1;
  line-height: 20px;
`;

// 초록 버튼 컴포넌트로 재활용하자(SignUpModal에도 존재)
const SubmitBtn = styled.Pressable`
  margin-top: 180px;
  margin-bottom: 17px;
  justify-content: center;
  align-items: center;
  width: 320px;
  height: 45px;
  border-radius: 10px;
  background-color: ${(props) =>
    !props.isAbleToSubmit ? "#eff4d2" : "#d7ff01"};
`;

const SubmitBtn_Text = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isAbleToSubmit ? "#313131" : "#a0a0a0")};
`;

const LoadingIndicator = styled.View`
  background-color: #fff;
  align-items: center;
  padding-top: 100px;
`;

const LoadingText = styled(fonts.H5)`
  line-height: 24px;
  text-align: center;
`;

function shuffle(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function TodayTrendQuizScreen() {
  const [trendQuizData, setTrendQuizData] = useState({});
  const [answersState, setAnswersState] = useState([]);
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
  const token = useRecoilValue(authToken);
  const [trendState, setTrendState] = useRecoilState(todayTrendSelector);
  const setAttendanceState = useSetRecoilState(todayAttendanceState);

  const fetchTrendQuizData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/trend-quiz`);
      console.log("트렌드 퀴즈 데이터 페칭 데이터: ", res.data);
      setTrendQuizData(res.data);
      await AsyncStorage.setItem(
        "todayTrendQuizData",
        JSON.stringify(res.data)
      );
      await AsyncStorage.setItem("lastFetchedDate", getKoreaFormattedDate());
    } catch (error) {
      console.log("트렌드 퀴즈 가져오기: ", error);
    }
  };

  useEffect(() => {
    const checkAndFetchData = async () => {
      try {
        const lastFetchedDate = await AsyncStorage.getItem("lastFetchedDate");

        if (lastFetchedDate !== getKoreaFormattedDate()) {
          fetchTrendQuizData();
        } else {
          console.log("오늘은 이미 데이터를 불러왔습니다.");
          const existingTrendQuizData = JSON.parse(
            await AsyncStorage.getItem("todayTrendQuizData")
          );
          setTrendQuizData(existingTrendQuizData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAndFetchData();
  }, []);

  useEffect(() => {
    if (trendQuizData.correct && trendQuizData.incorrect) {
      const InitialAnswers = [
        {
          isCorrect: true,
          isSelected: false,
          content: `${trendQuizData.correct}`,
        },
        {
          isCorrect: false,
          isSelected: false,
          content: `${trendQuizData.incorrect[0]}`,
        },
        {
          isCorrect: false,
          isSelected: false,
          content: `${trendQuizData.incorrect[1]}`,
        },
        {
          isCorrect: false,
          isSelected: false,
          content: `${trendQuizData.incorrect[2]}`,
        },
      ];
      setAnswersState(shuffle(InitialAnswers));
    }
  }, [trendQuizData]);

  console.log("answerState: ", answersState);

  const handleSelectAnswer = (targetedIndex) => {
    let updatedAnswersState;
    // 답을 아무것도 고르지 않았을 때
    if (!answersState.find((item) => item.isSelected)) {
      updatedAnswersState = answersState.map((item, index) =>
        index === targetedIndex
          ? { ...item, isSelected: !item.isSelected }
          : item
      );
      // 답을 하나 골랐을 때
    } else {
      updatedAnswersState = answersState.map((item, index) =>
        index === targetedIndex || item.isSelected
          ? { ...item, isSelected: !item.isSelected }
          : item
      );
    }
    setAnswersState(updatedAnswersState);
  };

  // 소리 추가가
  const [sound, setSound] = useState();

  async function playSound(type) {
    const { sound } = await Audio.Sound.createAsync(
      type // 로컬 사운드 파일
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const onSubmitHandler = () => {
    // 무언가 데이터를 처리해서...
    // 모달 띄우기
    openModal();
    const isSucceeded = answersState.find(
      (item) => item.isSelected && item.isCorrect
    );
    if (isSucceeded) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(SuccessSound);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      playSound(ErrorSound);
    }
  };

  // 모달 관리
  // 모달 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  function openModal() {
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  useLayoutEffect(() => {
    if (answersState.find((item) => item.isSelected)) setIsAbleToSubmit(true);
    else setIsAbleToSubmit(false);
  }, [answersState]);

  useEffect(() => {
    setIsModalVisible(false); // 상태 초기화
  }, []);

  const handleFinishStudy = () => {
    // navigation.navigate("BottomTab"); 이거 필요한가?
    DoneEventEmitter.emit("trendDone");
    console.log("이벤트 emit");
  };

  useEffect(() => {
    if (isModalVisible) {
      handleFinishStudy();
      // 이벤트를 발행함.
    }
  }, [isModalVisible]);

  return (
    <ViewContainer>
      <StatusBar style="dark" />
      {/* 모달 컴포넌트 */}
      <Modal
        visible={isModalVisible}
        transparent={true} // 배경 투명
        animationType="slide" // 모달 등장 애니메이션
        onRequestClose={closeModal} // 안드로이드에서 뒤로가기 버튼 처리
      >
        {/* Modal 태그 내부에 Modal View를 정의 */}

        <PrimaryModal
          type="trendQuiz"
          // result={answersState.isCorrect}
          result={answersState.find(
            (item) => item.isSelected && item.isCorrect
          )} // 테스트용
          // answer={answersState.content}
          answer={`${trendQuizData.correct}`}
          trend_quiz={`${trendQuizData.trend_quiz}`}
          explanation={`${trendQuizData.explanation}`}
          closeModal={closeModal}
          replaceScreenName="TodayTrendSolution" // 여기에 새로운 트렌드 퀴즈 해설 스크린명을 전달해주세요
        ></PrimaryModal>
      </Modal>
      {trendQuizData.trend_quiz ? (
        <QuizViewContainer>
          <MainTitle>오늘의 트렌드 퀴즈</MainTitle>
          <SubTitle>요즘 경제 상황에 맞는 퀴즈를 준비했어요</SubTitle>
          <Shadow
            style={{ width: "100%" }}
            distance={10}
            startColor="rgba(0, 0, 0, 0.02)"
            offset={[4, 4]}
          >
            <QuizContainer>
              <QuestionText>
                <QDot>Q. </QDot>
                <QuestionContent>{trendQuizData.trend_quiz}</QuestionContent>
              </QuestionText>
              <AnswerContainer>
                {answersState.map((item, index) => (
                  <AnswerBox
                    key={index}
                    onPress={() => handleSelectAnswer(index)}
                    isSelected={answersState[index].isSelected}
                  >
                    <AnswerContentContainer>
                      {!answersState[index].isSelected ? (
                        <AnswerBox_Btn key={index}>
                          <AnswerBox_BtnNumber>{index + 1}</AnswerBox_BtnNumber>
                        </AnswerBox_Btn>
                      ) : (
                        <GreenCheckMarkImg source={GreenCheckMark} />
                      )}

                      <AnswerBox_Text
                        isSelected={answersState[index].isSelected}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.content}
                      </AnswerBox_Text>
                    </AnswerContentContainer>
                  </AnswerBox>
                ))}
              </AnswerContainer>
              <SubmitBtn
                isAbleToSubmit={isAbleToSubmit}
                onPress={isAbleToSubmit ? onSubmitHandler : null}
              >
                <SubmitBtn_Text isAbleToSubmit={isAbleToSubmit}>
                  제출하기
                </SubmitBtn_Text>
              </SubmitBtn>
            </QuizContainer>
          </Shadow>
        </QuizViewContainer>
      ) : (
        <LoadingIndicator>
          <LottieView
            style={{ width: 300, height: 300 }}
            source={require("../assets/animations/Loading.json")}
            autoPlay
            loop={true}
          />
          <LoadingText>트렌드 퀴즈{"\n"}불러오는 중..</LoadingText>
        </LoadingIndicator>
      )}
    </ViewContainer>
  );
}

export default TodayTrendQuizScreen;
