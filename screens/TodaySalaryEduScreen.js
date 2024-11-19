import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import styled, { css } from "styled-components";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import TodaySalaryEdu_Modal from "../components/todaySalaryEduScreen/TodaySalaryEdu_Modal";
import TodaySalaryEdu_MeanAndExample from "../components/todaySalaryEduScreen/TodaySalaryEdu_MeanAndExample";
import TodaySalaryEdu_ScrollDownAnim from "../components/todaySalaryEduScreen/TodaySalaryEdu_ScrollDownAnim";
import { Ionicons } from "@expo/vector-icons";
import HighlightText from "react-native-highlight-underline-text";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { todayWordSelector } from "../Recoil/todayAttendanceDetail";
import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { todayAttendanceState } from "../Recoil/todayAttendanceState";
import WordToggle from "../common/WordToggle";
import * as Linking from "expo-linking";
import {
  isSavedSelector,
  todaySalaryContent,
} from "../Recoil/todaySalaryContent";
import parseStoryString from "../functions/parseStoryString";
import LottieView from "lottie-react-native";

const RootContainer = styled.View`
  flex: 1;
  width: "100%";
  background-color: ${colors.Grayscale_white};
`;

const BoldTitle = styled(fonts.H4SB)`
  color: ${colors.Grayscale_100};
`;

const Title = styled(fonts.H4M)`
  font-family: "Pretendard-Medium";
  color: ${colors.Grayscale_100};
`;

// 섹션 1) 뜻과 예문
const MeanAndExampleContainer = styled.View`
  padding: 20px 24px 44px;
`;

const MeanContainer = styled.View`
  margin-top: 25px;
  background-color: ${colors.bg};
  position: relative;
  border-radius: 10px;
  padding: 41px 0px;

  justify-content: center;
  align-items: center;

  margin-bottom: 28px;
`;

const BookMarkContainer = styled.TouchableOpacity`
  height: 60px;
  width: 80px;
  position: absolute;
  top: 0px;
  right: 0px;

  gap: 3px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

// 섹션 2) 스토리텔링
const StoryTellingContainer = styled.View`
  padding: 8px 0px 28px;
  width: 100%;

  gap: 20px;

  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
`;

const StoryTellingTitleContainer = styled.View`
  padding-left: 24px;

  width: 100%;
`;

const StoryTellingContentContainer = styled.View`
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 0 25px;
`;

const StoryTellingTitle = styled(fonts.H4M)`
  width: 100%;
  color: ${colors.Grayscale_100};
  text-align: left;
`;

// 뉴스 above Horizon
const Horizon = styled.View`
  height: 1px;
  background-color: #d0d0d0;
  margin-left: 16px;
  margin-right: 16px;
`;

// 섹션 3) 관련 뉴스
const NewsContainer = styled.View`
  padding: 31px 24px 50px;
  gap: 27px;
`;

const NewsTitleContainer = styled.View`
  justify-content: flex-start;
  gap: 5px;
  text-align: left;

  ${(props) =>
    props.tooLong
      ? css`
          align-items: flex-start;
        `
      : css`
          flex-direction: row;
          align-items: center;
        `}
`;

const NewsContentContainer = styled.View`
  gap: 12px;
  width: 100%;
`;

// 임시
const NewsContentBox = styled.View`
  /* background-color: #c2c2c2; */
  background-color: #b0b6aa;
  border-radius: 3px;
  align-items: center;
`;

const NewsText = styled(fonts.Caption2)`
  width: 100%;
  color: #323232;

  letter-spacing: 0.24px;
  padding: 19px 44px 52px 21px;
`;

// 섹션 4) 학습 완료와 모달
const EduDoneContainer = styled.View`
  padding: 50px 0px 160px;

  justify-content: center;
  align-items: center;

  ${(props) =>
    props.wordState
      ? css`
          padding: 50px 0px 100px;
        `
      : css`
          padding: 100px 0px 200px;
        `}
`;

const EduDoneText = styled(fonts.Body2M)`
  color: #000000;
  text-align: center;

  ${(props) =>
    props.wordState
      ? css``
      : css`
          font-family: "Pretendard-SemiBold";
          font-size: 16px;
        `}
`;

const GoToNewsText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;
const GoToNewsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

// 이 스크린을 호출하는 경우
// 1) modal에서 학습 버튼
// 2) 퀴즈 스크린에서 모르겠어요
// 3) 단어 검색에서 특정 단어 클릭시

// word_id를 params로 받아 api 호출

// route.params.type !== "todaySalary" 로 오늘의 단어 학습과 단어 검색 구분
function TodaySalaryEduScreen({ route }) {
  // 전역으로 오늘의 todaysalary 학습 상태를 관리
  const wordState = useRecoilValue(todayWordSelector);
  const setTodayWordState = useSetRecoilState(todayWordSelector);
  // 전역 attendance state를 업데이트해주기 위해 불러옴
  const [attendaceState, setAttendanceState] =
    useRecoilState(todayAttendanceState);

  // 전역 오늘의 샐러리 단어 데이터를 사용
  const todaySalary = useRecoilValue(todaySalaryContent);
  // 전역 오늘의 샐러리 단어 데이터의 북마크 상태를 다룸
  const [bookmarkTodaySalary, setBookmarkTodaySalary] =
    useRecoilState(isSavedSelector);

  // 이 screen에서 사용되는 state로, 이 eduscreen에서 학습하는 단어에 대한 state를 관리
  const [loading, setLoading] = useState(true);
  const [wordData, setWordData] = useState({});
  const [storyTelling, setStoryTelling] = useState([]);
  // 단어 저장 상태를 관리
  const [bookMark, setBookMark] = useState(false);

  // 알맞게 렌더링되도록 함
  useEffect(() => {}, [
    wordData,
    storyTelling,
    bookMark,
    loading,
    bookmarkTodaySalary,
    todaySalary,
  ]);

  // 임시 변수 사용
  const news1 = "기술주 중심 나스닥 또 급락…신규 고용 시장 기대 못미쳐";
  const news2 = "美 고용지표 악화에 증시 급락…AI 빅테크 주가 일제히 하락";

  function onBookmarkToggle() {
    console.log("토글 전 북마크 상태", bookMark);
    fetchBookMarkState(!bookMark);
  }

  async function fetchBookMarkState(tmpState) {
    // tmpState로 바꾸겠다
    // if (wordData.isSaved !== tmpState) {
    console.log("tmpState: ", tmpState);
    if (tmpState) {
      // tmpState로 바꾸겠다
      try {
        const res = await axios.post(
          `${BASE_URL}/wordbook?word_id=${wordData.word_id}`
        );
        setBookMark(true);
        if (wordData.word_id === todaySalary.word_id)
          setBookmarkTodaySalary(true); // 오늘의 샐러리와 일치할 때에만
        if (res.status === 200) console.log("북마크 등록 완료");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.delete(
          `${BASE_URL}/wordbook?word_id=${wordData.word_id}`
        );
        setBookMark(false);
        if (wordData.word_id === todaySalary.word_id)
          setBookmarkTodaySalary(false); //오늘의 샐러리와 일치할 때에만
        if (res.status === 200) console.log("북마크 삭제 완료");
      } catch (error) {
        console.log(error);
      }
    }
    // }
  }

  async function postWordAttendance() {
    try {
      const res = await axios.post(
        `${BASE_URL}/today-word/update-status?word_id=${wordData.word_id}`
      );
      console.log("단어 학습 완료 api post", res.status);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 밑으로 새로고침시 API 호출하여 단어 학습 완료를 POST
  // 최초 1회만 실행되며. 이후에는 새로고침해도 핸들러 호출 X
  function handleDoneTodaySalary() {
    if (loading) return; // 중복 요청 방지
    setLoading(true);

    if (postWordAttendance() && !wordState) {
      setTodayWordState(true); // 전역 상태 관리
      setIsModalVisible(true); // 모달 상태 관리
      setAttendanceState((prev) => prev + 3); // 3을 더해주어 salary done 표시
      console.log("정상적으로 처리 완료함");
    }
  }

  useEffect(() => {
    setLoading(true);
    async function fetchWordData() {
      try {
        const res = await axios.get(
          `${BASE_URL}/words?word_id=${route.params.word_id}`
        );
        if (res.status === 200) {
          console.log(res.data.example);
          setWordData(res.data);
          setStoryTelling([
            parseStoryString(res.data.story1),
            parseStoryString(res.data.story2),
            parseStoryString(res.data.story3),
          ]);
          setBookMark(res.data.isSaved);
          setLoading(false);
        }
      } catch (error) {
        console.log("에러", error);
      }
    }

    async function fetchTodaySalary() {
      setWordData(todaySalary);
      setStoryTelling([
        parseStoryString(todaySalary.story1),
        parseStoryString(todaySalary.story2),
        parseStoryString(todaySalary.story3),
      ]);
      setBookMark(todaySalary.isSaved);
      setLoading(false);
    }

    // 단어 검색을 통해 들어온 경우 데이터를 받아옴
    if (route.params.type !== "todaySalary") fetchWordData();
    else fetchTodaySalary();
  }, [route.params.type]);

  // 스크롤 이벤트 핸들러
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    // ScrollView의 맨 아래에 도달했는지 확인
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (
      route.params.type === "todaySalary" &&
      !wordState &&
      isBottom &&
      !loading
    ) {
      handleDoneTodaySalary();
    }
  };

  // 모달 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 임시
  const [isTopNewsAvailable, setIsTopNewsAvailable] = useState(false);
  const [isBottomNewsAvailable, setIsBottomNewsAvailable] = useState(false);

  function openModal() {
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  const link = (url) => {
    Linking.openURL(url);
  };

  if (!loading || isModalVisible)
    return (
      <ScrollView
        onScroll={handleScroll} // 스크롤 이벤트 연결
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
      >
        {/* 로딩 표시 */}
        {/* {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading...</Text>
        </View>
      )} */}
        <Modal
          visible={isModalVisible}
          transparent={true} // 배경 투명
          animationType="slide" // 모달 등장 애니메이션
          onRequestClose={closeModal} // 안드로이드에서 뒤로가기 버튼 처리
        >
          {/* Modal 태그 내부에 Modal View를 정의 */}
          <TodaySalaryEdu_Modal
            fetchBookMarkState={fetchBookMarkState}
            closeModal={closeModal}
          ></TodaySalaryEdu_Modal>
        </Modal>
        <RootContainer>
          {/* 1. 오늘의 샐러리 한조각 */}
          <MeanAndExampleContainer>
            {wordData.word_id === todaySalary.word_id && (
              <BoldTitle>오늘의 샐러리 한조각</BoldTitle>
            )}
            <MeanContainer>
              <HighlightText
                isFixed
                underlineSize={10}
                underlineColor={colors.Primary_100}
                textStyle={{
                  color: "#121212",
                  fontFamily: "Pretendard-Bold",
                  fontSize: 26,
                  lineHeight: 26,
                }}
                text={wordData.word}
              ></HighlightText>
              <BookMarkContainer onPress={onBookmarkToggle}>
                {bookMark ? (
                  <Ionicons
                    name="bookmark"
                    color={colors.Primary_100}
                    size={25}
                  />
                ) : (
                  <Ionicons
                    name="bookmark-outline"
                    color={colors.Grayscale_100}
                    size={25}
                  />
                )}
                <Text>저장</Text>
              </BookMarkContainer>
            </MeanContainer>
            <TodaySalaryEdu_MeanAndExample
              word={wordData.word}
              mean={wordData.mean}
              example={wordData.example}
            />
          </MeanAndExampleContainer>
          {/* 2. 스토리텔링 */}
          <StoryTellingContainer>
            <StoryTellingTitleContainer>
              <StoryTellingTitle>더 쉽게 이해해볼까요?</StoryTellingTitle>
            </StoryTellingTitleContainer>

            <StoryTellingContentContainer>
              <WordToggle
                type="todaySalaryEdu"
                index={1}
                word={storyTelling[0][0]}
                mean={storyTelling[0][1]}
              />
              <WordToggle
                type="todaySalaryEdu"
                index={2}
                word={storyTelling[1][0]}
                mean={storyTelling[1][1]}
              />
              <WordToggle
                type="todaySalaryEdu"
                index={3}
                word={storyTelling[2][0]}
                mean={storyTelling[2][1]}
              />
            </StoryTellingContentContainer>
          </StoryTellingContainer>
          <Horizon />
          {/* 3. 관련 뉴스 확인 */}
          <NewsContainer>
            <NewsTitleContainer tooLong={wordData.word.length > 10}>
              <HighlightText
                isFixed
                underlineSize={10}
                underlineColor={colors.Primary_100}
                textStyle={{
                  color: "#121212",
                  fontFamily: "Pretendard-Medium",
                  fontSize: 20,
                  lineHeight: 20,
                }}
                text={wordData.word}
              ></HighlightText>
              <Title style={{ lineHeight: 20 }}>관련 뉴스 확인하기</Title>
            </NewsTitleContainer>
            <NewsContentContainer>
              <Pressable
                onPressIn={() => setIsTopNewsAvailable(true)}
                onPressOut={() => setIsTopNewsAvailable(false)}
                onPress={() => link(wordData.articles[0].url)}
              >
                <NewsContentBox>
                  {!isTopNewsAvailable ? (
                    <NewsText>{wordData.articles[0].title}</NewsText>
                  ) : (
                    <GoToNewsContainer>
                      <GoToNewsText>뉴스 보러 가기</GoToNewsText>
                      <LottieView
                        style={{ width: 30, height: 30, marginVertical: 30 }}
                        source={require("../assets/animations/News.json")}
                        autoPlay
                        loop={true}
                      />
                    </GoToNewsContainer>
                  )}

                  {/* <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 50,
                      color: "#858585",
                      marginBottom: 5,
                    }}
                  >
                    바로가기
                  </Text> */}
                </NewsContentBox>
              </Pressable>
              <Pressable
                onPressIn={() => setIsBottomNewsAvailable(true)}
                onPressOut={() => setIsBottomNewsAvailable(false)}
                onPress={() => link(wordData.articles[1].url)}
              >
                <NewsContentBox>
                  {!isBottomNewsAvailable ? (
                    <NewsText numberOfLines={1} ellipsizeMode="tail">
                      {wordData.articles[1].title}
                    </NewsText>
                  ) : (
                    <GoToNewsContainer>
                      <GoToNewsText>뉴스 보러 가기</GoToNewsText>
                      <LottieView
                        style={{ width: 30, height: 30, marginVertical: 30 }}
                        source={require("../assets/animations/News.json")}
                        autoPlay
                        loop={true}
                      />
                    </GoToNewsContainer>
                  )}
                  {/* <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#858585",
                    marginBottom: 5,
                  }}
                >
                  기사 관련 이미지(배경)
                </Text> */}
                </NewsContentBox>
              </Pressable>
            </NewsContentContainer>
          </NewsContainer>
          {/* 4. 끝까지 내려 => 모달 올리기 & 학습 완료 api 호출 */}
          {route.params.type === "todaySalary" ? (
            <EduDoneContainer wordState={wordState}>
              {!wordState ? <TodaySalaryEdu_ScrollDownAnim /> : <></>}
              <EduDoneText wordState={wordState}>
                {!wordState
                  ? "끝까지 내리면 오늘의 샐러리 한조각 학습이 완료돼요!"
                  : "오늘의 학습을 완료했어요!"}
              </EduDoneText>
            </EduDoneContainer>
          ) : (
            <></>
          )}
        </RootContainer>
      </ScrollView>
    );
}

export default TodaySalaryEduScreen;
