import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import Home_TrendQuiz from "../components/homeScreen/Home_TrendQuiz";
import Home_TodaySalary from "../components/homeScreen/Home_TodaySalary";
import Home_WeekStrip from "../components/homeScreen/Home_WeekStrip";
import Home_AttendanceProgress from "../components/homeScreen/Home_AttendanceProgress";
import Home_Article from "../components/homeScreen/Home_Article";
import colors from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { Shadow } from "react-native-shadow-2";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import process1 from "../assets/img/homeScreen/charac/process1.png";
import process2 from "../assets/img/homeScreen/charac/process2.png";
import process3 from "../assets/img/homeScreen/charac/process3.png";
import process4 from "../assets/img/homeScreen/charac/process4.png";
import fonts from "../styles/fonts";
import Home_CalendarModal from "../components/homeScreen/Home_CalendarModal";
import getFormattedDate from "../functions/getFormattedDate";
import { BASE_URL } from "@env";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { todayAttendanceState } from "../Recoil/todayAttendanceState";
import {
  todayArticleSelector,
  todayAttendanceDetail,
  todayTrendSelector,
  todayWordSelector,
} from "../Recoil/todayAttendanceDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getKoreaFormattedDate from "../functions/getKoreaForamttedDate";
import { parse } from "react-native-svg";
import { todaySalaryContent } from "../Recoil/todaySalaryContent";
import { fetchTodayAttendanceState } from "../services/fetchTodayAttendanceState";
import { fetchTodayAttendanceDetail } from "../services/fetchTodayAttendanceDetail";
import { fetchTodayWordId } from "../services/fetchTodayWordId";
import { fetchTodayWordData } from "../services/fetchTodayWordData";
import { authToken } from "../Recoil/authToken";
import { nicknameState } from "../Recoil/nicknameState";
import DoneEventEmitter from "../events/DoneEventEmitter";
import LottieView from "lottie-react-native";

const ContentsContainer = styled.View`
  background: ${colors.bg};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex: 1;
  width: 100%;
`;

const Horizon = styled.View`
  height: 1px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${colors.Grayscale_10};
`;

const StepContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px;

  position: absolute;
  left: 20px;
  top: 0px;
`;

const ProcessBarWrapper = styled.View`
  height: 200px;
  width: 100%;
  margin-bottom: 15px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  position: relative;
`;

const CharacWrapper = styled.Image`
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  object-fit: cover;

  position: absolute;
  bottom: -20px;
`;

function HomeScreen() {
  const navigation = useNavigation();
  // stack에 쌓여있던 HomeScreen이 focus되면 리렌더링되어 데이터를 알맞게 띄우도록 함
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  // 모달 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 오늘의 attendance state : 학습시마다 전역 상태에 반영됨.
  const [attendanceState, setAttendanceState] =
    useRecoilState(todayAttendanceState);

  // 오늘의 attendance detail : word, trend, article의 boolean 값으로 구성
  const [attendanceDetail, setAttendanceDetail] = useRecoilState(
    todayAttendanceDetail
  );

  // 오늘의 salary 학습 content
  const [todaySalary, setTodaySalary] = useRecoilState(todaySalaryContent);

  // 토큰 추가
  const token = useRecoilValue(authToken);
  // console.log("홈스크린에서 token값: ", token);
  const setNickname = useSetRecoilState(nicknameState);

  // 날짜 범위에 대해 AsyncStorage에 데이터를 저장하는 함수
  // 나중에 쓸까봐 안 지움
  // const storeAttendanceData = async () => {
  //   // 시작 날짜와 끝 날짜 설정
  //   const startDate = new Date("2024-10-01"); // 시작 날짜: 2024-10-01
  //   const endDate = new Date("2024-11-14"); // 끝 날짜: 2024-11-14

  //   // 날짜를 순차적으로 반복
  //   let currentDate = new Date(startDate);

  //   while (currentDate <= endDate) {
  //     const formattedDate = getFormattedDate(currentDate); // 날짜 형식 변환

  //     try {
  //       // API 호출하여 해당 날짜의 데이터 받기
  //       const res = await axios.get(
  //         `${BASE_URL}/attendance/status?attendance_date=${formattedDate}`
  //       );

  //       if (res.status === 200) {
  //         // 받은 데이터를 AsyncStorage에 저장
  //         await AsyncStorage.setItem(
  //           formattedDate,
  //           JSON.stringify(res.data.attendance_state)
  //         );
  //         console.log(
  //           `Data for ${formattedDate} saved successfully. : `,
  //           "state : ",
  //           res.data.attendance_state
  //         );
  //       } else {
  //         console.log(
  //           `Error fetching data for ${formattedDate}: ${res.status}`
  //         );
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching data for ${formattedDate}:`, error);
  //     }

  //     // 날짜를 하루 증가시킴
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }
  // };

  // focus 됐을 때에는 알아서 전역 상태 데이터를 가져옴.
  // 소셜로그인 구현 후 주석 제거 -> 오늘의 샐러리 데이터를 하루에 한번만 가져오도록.
  useEffect(() => {
    const checkAndFetchData = async () => {
      // await AsyncStorage.removeItem("todaySalaryData"); 디버깅
      try {
        const lastFetchedData = await AsyncStorage.getItem("todaySalaryData");
        const parsedLastFetchedData = JSON.parse(lastFetchedData);
        if (
          !parsedLastFetchedData ||
          parsedLastFetchedData.lastFetchedDate !== getKoreaFormattedDate()
        ) {
          console.log(
            "이전에 패치된 데이터가 없거나 지난 날짜라서 새로 단어 id를 받아옴"
          );
          fetchTodayWordId(token).then((fetchedData) => {
            fetchTodayWordData({ ...fetchedData, token: token }).then(
              (fetchedWordData) => {
                setTodaySalary(fetchedWordData);
              }
            );
          });
        } else {
          // 이미 데이터가 asyncStorage에 저장된 상태이므로 전역 상태값의 초기값으로 지정해줌
          setTodaySalary(parsedLastFetchedData);
          console.log("이미 word Id를 받아옴");
        }
      } catch (error) {
        console.log(error);
      }
    };

    setLoading(true);
    // 1. 최초 렌더링 시 attendance_state를 받아와 전역 상태로 관리
    fetchTodayAttendanceState(token).then((fetchedData) =>
      setAttendanceState(fetchedData)
    );

    // 2. 오늘 학습 과목 조회 API 받아와 전역 상태로 set
    fetchTodayAttendanceDetail(token).then((fetchedData) =>
      setAttendanceDetail(fetchedData)
    );
    checkAndFetchData().then(() => {
      setLoading(false);
    });
  }, []);

  // 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/nickname`, {
          headers: { Authorization: token },
        });
        console.log("홈스크린에서 닉네임 조회", res.data);
        setNickname(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNickname();
  }, [token]);

  function onCalendarModalOpen() {
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  // 리렌더링 관리
  // useEffect(() => {}, [attendanceDetail, attendanceState, todaySalary]);

  //////////////////// 학습 상태를 focus 되면 반영하기 위한 핸들러
  const isFocusedRef = useRef(false); // 현재 focus 상태를 추적
  const eventQueue = useRef([]); // 이벤트를 큐로 저장
  const [trendState, setTrendState] = useRecoilState(todayTrendSelector);
  const [articleState, setArticleState] = useRecoilState(todayArticleSelector);
  const wordState = useRecoilValue(todayWordSelector);
  const setTodayWordState = useSetRecoilState(todayWordSelector);

  //////////// 3가지 이벤트에 대한 구독
  // salaryDone, trendDone, newsDone

  ///// 1. 오늘의 샐러리
  const handleSalaryDone = async (data) => {
    console.log("handleSalaryDone called with data:", data);

    const fetchState = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/today-word/update-status?word_id=${todaySalary.word_id}`,
          {},
          { headers: { Authorization: token } }
        );
        console.log("단어 학습 완료 api post", res.status);

        const resSeed = await axios.patch(
          `${BASE_URL}/seed/update`,
          {
            seed_earned: 5,
            seed_used: 0,
          },
          { headers: { Authorization: token } }
        );
        console.log("시드 patch", resSeed.data.status);

        if (!wordState) {
          console.log("Updating wordState and attendanceState");
          setTodayWordState(true);
          setAttendanceState((prev) => prev + 3); // attendance state에 1을 더해주어 알맞게 상태 관리
          // 중복 처리되어서는 안됨!!
        }
        if (!isAnimationVisible) {
          setAnimationVisible(true);
          setTimeout(() => animationRef.current?.play(), 0); // 즉시 재생
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    if (isFocusedRef.current) {
      fetchState();
      console.log("Salary Event Processed Immediately:", data);
    } else {
      console.log("Salary Event Queued:", data);
      eventQueue.current.push({ data, type: "salaryDone" });
    }
  };

  /// 2. 트렌드 퀴즈 done
  const handleTrendDone = async (data) => {
    const fetchState = async () => {
      try {
        console.log("트렌드퀴즈 이벤트 객체 받음");
        const res = await axios.post(
          `${BASE_URL}/trend-quiz/update-status?trend=${true}`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const resSeed = await axios.patch(
          `${BASE_URL}/seed/update`,
          {
            seed_earned: 5,
            seed_used: 0,
          },
          { headers: { Authorization: token } }
        );
        console.log("시드 patch", resSeed.data.status);
        if (!trendState) {
          setTrendState(true);
          setAttendanceState((prev) => prev + 1); // attendance state에 1을 더해주어 알맞게 상태 관리
          // 중복 처리되어서는 안됨!!
        }
        if (!isAnimationVisible) {
          setAnimationVisible(true);
          setTimeout(() => animationRef.current?.play(), 0); // 즉시 재생
        }
        // navigation.navigate("BottomTab"); 이거 필요한가?
      } catch (error) {
        console.log(error);
      }
    };

    if (isFocusedRef.current) {
      fetchState();
      console.log("Trend Event Processed Immediately:", data);
    } else {
      console.log("Trend Event Queued:", data);
      eventQueue.current.push({ data, type: "trendDone" });
      console.log("저장된 이벤트 : ", eventQueue.current.length);
    }
  };

  // if (!isFocusedRef.current) {
  //   console.log("Screen not focused. Triggering animation after delay.");
  //   setTimeout(triggerAnimation, 300); // 포커스 이후 실행 지연
  // } else {
  //   triggerAnimation();
  // }

  ///// 3. 뉴스 done
  const handleNewsDone = (data) => {
    const fetchState = async () => {
      try {
        console.log("뉴스 이벤트 객체 받음");
        const res = await axios.post(
          `${BASE_URL}/shorts/update-status?article=true`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const resSeed = await axios.patch(
          `${BASE_URL}/seed/update`,
          {
            seed_earned: 5,
            seed_used: 0,
          },
          { headers: { Authorization: token } }
        );
        console.log("시드 patch", resSeed.data.status);
        if (!articleState) {
          setArticleState(true); // 전역 상태
          setAttendanceState((prev) => prev + 1);
        }
        if (!isAnimationVisible) {
          setAnimationVisible(true);
          setTimeout(() => animationRef.current?.play(), 0); // 즉시 재생
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log("News Event Received:", data);

    if (isFocusedRef.current) {
      fetchState();
      console.log("News Event Processed Immediately:", data);
    } else {
      console.log("News Event Queued:", data);
      eventQueue.current.push({ data, type: "newsDone" });
    }
  };

  // 처리할 이벤트 이름들
  // 각 이벤트의 핸들러

  // 초기 마운트 시 리스너 등록
  useEffect(() => {
    const handlers = {
      trendDone: handleTrendDone,
      salaryDone: handleSalaryDone,
      newsDone: handleNewsDone,
    };

    console.log("리스너 등록");

    // 각 이벤트에 대해 리스너 등록
    Object.entries(handlers).forEach(([eventName, handler]) => {
      DoneEventEmitter.addListener(eventName, handler);
    });

    // 클린업: 각 이벤트 리스너 제거
    return () => {
      Object.entries(handlers).forEach(([eventName, handler]) => {
        DoneEventEmitter.removeListener(eventName, handler);
      });
    };
  }, []);

  useEffect(() => {
    const onFocus = () => {
      isFocusedRef.current = true;
      console.log("Screen is focused. Processing queued events...");

      // 큐에 저장된 이벤트 처리
      const processQueue = async () => {
        if (eventQueue.current.length > 0) {
          console.log("Processing queued events...");

          // 이벤트를 순차적으로 처리
          while (eventQueue.current.length > 0) {
            console.log("while문 시작");
            const { data, type } = eventQueue.current.shift();
            console.log(`Processing Event: ${type}`, data);

            switch (type) {
              case "trendDone":
                await handleTrendDone(data); // async 처리
                break;
              case "salaryDone":
                await handleSalaryDone(data); // async 처리
                break;
              case "newsDone":
                await handleNewsDone(data); // async 처리
                break;
              default:
                console.warn(`Unknown event type: ${type}`);
            }
            console.log("while문 끝");
          }
        }
      };

      processQueue();
    };

    const onBlur = () => {
      isFocusedRef.current = false;
      console.log("Screen is unfocused. Events will be queued.");
    };

    // focus/blur 리스너 등록
    const unsubscribeFocus = navigation.addListener("focus", onFocus);
    const unsubscribeBlur = navigation.addListener("blur", onBlur);

    // 클린업: focus/blur 리스너 제거
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  ////////////// 컨페티 관리
  const scrollViewRef = useRef(null);
  const [isAnimationVisible, setAnimationVisible] = useState(false); // 애니메이션 표시 상태
  const animationRef = useRef(null); // Lottie 애니메이션 참조

  // const triggerAnimation = () => {
  //   console.log("triggerAnimation called");

  //   if (isAnimationVisible) return;
  //   // ScrollView가 렌더링될 때까지 강제로 대기 후 스크롤
  //   // if (scrollViewRef.current) {
  //   //   scrollViewRef.current.scrollTo({ y: 0, animated: true });
  //   //   console.log("Scrolled to top");
  //   // }

  //   setAnimationVisible(true);
  //   // animationRef.current?.play(); // 수동 재생 추가

  //   setTimeout(() => {
  //     setAnimationVisible(false);
  //     console.log("Animation forced to stop");
  //   }, 10000);
  // };

  const handleAnimationFinish = () => {
    setAnimationVisible(false); // 애니메이션 숨김
  };

  useEffect(() => {
    console.log("변경", isAnimationVisible);
  }, [isAnimationVisible]);

  if (!loading)
    return (
      <SafeAreaView style={styles.rootScreen}>
        {isAnimationVisible && (
          <View style={styles.overlay}>
            <View style={styles.animationContainer} pointerEvents="box-none">
              {/* 오버레이 내부의 최상단에 LottieView */}
              <LottieView
                ref={animationRef}
                source={require("../assets/animations/Confetti.json")} // Lottie JSON 파일 경로
                autoPlay={false} // 수동 재생
                loop={false} // 반복 X
                onAnimationFinish={handleAnimationFinish} // 애니메이션 종료 이벤트
                style={styles.animation}
              />
            </View>
          </View>
        )}
        <ScrollView
          ref={scrollViewRef}
          automaticallyAdjustContentInsets={false}
        >
          <Home_WeekStrip onCalendarModalOpen={onCalendarModalOpen} />
          {/* 상단 프로세스 바 */}
          <ProcessBarWrapper>
            <StepContainer>
              <fonts.H2M style={{ color: colors.Grayscale_100 }}>
                STEP {todaySalary.word_id}
              </fonts.H2M>
              <Text>학습 진행률</Text>
            </StepContainer>
            {/* progressbar */}
            <Home_AttendanceProgress />
            <CharacWrapper
              source={
                attendanceState === 5
                  ? process4
                  : attendanceState > 3
                  ? process3
                  : attendanceState > 0
                  ? process2
                  : process1
              }
            />
          </ProcessBarWrapper>
          {/* 하단의 3가지 요소를 감싸는 Container */}
          <Shadow
            style={styles.shadowContainer}
            offset={[0, -3]}
            distance={5}
            startColor="rgba(0, 0, 0, 0.08)"
            endColor="rgba(0, 0, 0, 0.0)"
          >
            <ContentsContainer>
              <Home_TodaySalary />
              <Home_TrendQuiz />
              <Horizon />
              <Home_Article />
            </ContentsContainer>
          </Shadow>
        </ScrollView>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <Home_CalendarModal closeModal={closeModal} />
        </Modal>
      </SafeAreaView>
    );
  else return <View></View>;
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.Grayscale_white,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 화면 전체를 덮는 오버레이
    zIndex: 100, // 최상단 위치
    justifyContent: "flex-start", // 내부 요소 최상단 배치
    alignItems: "center",
  },
  animationContainer: {
    width: "100%", // 전체 너비
    height: "30%", // 상단 절대값 높이
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 400, // 애니메이션 크기 조정
    height: 400,
    marginTop: 50,
  },
  fullscreenAnimation: {
    width: "100%",
    height: "100%",
  },
  shadowContainer: {
    width: "100%",
    flex: 1,
  },
});

export default HomeScreen;
