import React, { useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Home_DayAttendanceCircle from "./Home_DayAttendanceCircle";
import moment from "moment";
import fonts from "../../styles/fonts";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";
import { Header } from "react-native/Libraries/NewAppScreen";
import getFormattedDate from "../../functions/getFormattedDate";
import getKoreaFormattedDate from "../../functions/getKoreaForamttedDate";

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: "rgba(0, 0, 0, 0.7)";
`;

const ModalView = styled.View`
  border-radius: 30px 30px 0px 0px;
  background-color: white;
  align-items: center;
  height: 400px;
  position: fixed;
  padding-top: 10px;
  ${(props) =>
    css`
      top: ${props.position}%;
    `};
`;

const HeaderTotalContainer = styled.View`
  width: 100%;
`;
const DateContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderDateContainer = styled.View`
  padding-left: 20px;
`;

const ArrowsContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 26px;
  padding-right: 10px;
`;

// Locale 설정
LocaleConfig.locales["custom"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"], // 커스텀 요일
  today: "오늘",
};

// Locale을 커스텀 Locale로 설정
LocaleConfig.defaultLocale = "custom";

function Home_CalendarModal({ closeModal }) {
  const dayCache = useMemo(() => ({}), []);

  // 커스텀 헤더를 위한 currentDate값과 변경 함수
  const [currentDate, setCurrentDate] = useState(moment());

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const screenWidth = Dimensions.get("window").width;
  // 화면 높이와 BottomSheet 높이
  const screenHeight = Dimensions.get("window").height;
  // BottomSheet의 화면 비율 계산 (예: 400px이 화면의 몇 %인지)
  const bottomSheetPercentage = 100 - ((400 / screenHeight) * 100).toFixed(2);

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <ModalBackdrop>
        <TouchableWithoutFeedback>
          <ModalView position={bottomSheetPercentage}>
            <Calendar
              key={currentDate.format("YYYY-MM-DD")}
              current={currentDate.format("YYYY-MM-DD")}
              onMonthChange={(date) => {
                setCurrentDate(moment(date.dateString));
              }}
              // dayComponent에 커스텀 컴포넌트 전달
              calendarHeaderStyle={{ fontSize: 16, color: "black" }}
              calendarHeaderFormat="YYYY년 MM월"
              dayComponent={({ date, state }) => {
                return (
                  <Home_DayAttendanceCircle
                    empty={date.month === currentDate.month()}
                    calendarDate={date}
                    onPress={closeModal}
                    attendance_state={0}
                    type="calendar"
                    isToday={date.dateString === getKoreaFormattedDate()}
                  />
                );
              }}
              style={{ ...styles.container, width: screenWidth }}
              //   headerStyle={}
              //   customHeader={}
              // 초기 선택 날짜 설정
              // 선택된 날짜와 비활성화된 날짜 스타일
              renderHeader={() => (
                <HeaderTotalContainer>
                  <DateContainer>
                    <HeaderDateContainer>
                      <fonts.Body1>
                        {currentDate.format("YYYY년 MM월")}
                      </fonts.Body1>
                    </HeaderDateContainer>

                    <ArrowsContainer>
                      <TouchableOpacity
                        onPress={handlePrevMonth}
                        style={styles.arrow}
                      >
                        <Ionicons
                          name="chevron-back-outline"
                          size={20}
                          color={colors.Grayscale_60}
                        />
                      </TouchableOpacity>

                      {/* 오른쪽 화살표 */}
                      <TouchableOpacity
                        onPress={handleNextMonth}
                        style={styles.arrow}
                      >
                        <Ionicons
                          name="chevron-forward-outline"
                          size={20}
                          color={colors.Grayscale_60}
                        />
                      </TouchableOpacity>
                    </ArrowsContainer>
                  </DateContainer>
                </HeaderTotalContainer>
              )}
              firstDay={0} // 월요일 시작
              hideArrows={true}
              theme={{
                arrowColor: "transparent", // 기본 화살표 숨기기
              }}
            />
          </ModalView>
        </TouchableWithoutFeedback>
      </ModalBackdrop>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    gap: 1,
    borderRadius: 15,
  },
});

export default Home_CalendarModal;
