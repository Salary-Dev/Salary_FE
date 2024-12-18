import React, { memo, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import styled, { css } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Home_DayAttendanceCircle from "./Home_DayAttendanceCircle";
import getFormattedDate from "../../functions/getFormattedDate";
import getKoreaFormattedDate from "../../functions/getKoreaForamttedDate";
import isEqualDate from "../../functions/isEqualDate";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.View`
  flex: 1;
`;
const HeaderContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 5px;
  margin-top: 10px;
  gap: 6px;
`;

const HeaderText = styled(fonts.Body2M)`
  color: ${colors.Grayscale_80};
`;

const HeaderCalendarBtn = styled.TouchableOpacity``;

const calculateWeekOfMonth = (date) => {
  // 해당 월의 첫 번째 날 가져오기
  const startOfMonth = moment(date).startOf("month");
  // 현재 주차 계산
  const currentWeek = moment(date).week();
  const startWeek = startOfMonth.week();

  // 주차 계산
  const weekOfMonth = currentWeek - startWeek + 1;
  return weekOfMonth < 1 ? 1 : weekOfMonth; // 1주차부터 시작
};

const Home_WeekStrip = ({ onCalendarModalOpen }) => {
  // 오늘 기준 이전 30일에 대한 formatted date 배열
  const [prevMonthData, SetPrevMonthData] = useState([]);

  const [headerText, setHeaderText] = useState("");
  const [calendarData, setCalendarData] = useState({});

  // week이 바뀌면 알맞게 헤더를 업데이트한다.
  const handleWeekChange = (date) => {
    const formattedDate = moment(date);
    const year = formattedDate.format("YYYY");
    const month = formattedDate.format("MM");
    const week = calculateWeekOfMonth(date);

    // 헤더 텍스트 업데이트
    setHeaderText(`${year}년 ${month}월 ${week}주차`);
  };

  // 오늘 기준 한 달 전의 날짜 데이터
  function getPastMonthDates() {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i); // i일 전의 날짜
      dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD" 형식으로 저장
    }

    return dates;
  }

  // console.log(getPastMonthDates());
  // 출력: ["2024-11-21", "2024-11-20", ..., "2024-10-23"]

  async function getPastMonthData() {
    const dates = getPastMonthDates();

    try {
      const storedData = await AsyncStorage.multiGet(dates);

      // 데이터를 객체 형태로 변환
      const pastMonthData = storedData.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      }, {});

      return pastMonthData;
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
      return {};
    }
  }

  useEffect(() => {
    // handleWeekChange(new Date());
    getPastMonthData().then((data) => SetPrevMonthData(data));
  }, []);

  useEffect(() => {});

  return (
    <Container>
      <HeaderContainer onPress={onCalendarModalOpen}>
        <HeaderText>{headerText}</HeaderText>
        <HeaderCalendarBtn>
          <Ionicons name="calendar-clear-outline" size={20}></Ionicons>
        </HeaderCalendarBtn>
      </HeaderContainer>
      <CalendarStrip
        calendarHeaderStyle={{ height: 0, opacity: 0 }} // 헤더 숨기기
        style={styles.calendar}
        startingDay={3}
        dayComponent={(props) => {
          return (
            <Home_DayAttendanceCircle
              {...props}
              prevMonthData={prevMonthData}
              onCalendarModalOpen={onCalendarModalOpen} // 날짜 선택 핸들러 전달
              isToday={isEqualDate(new Date(), new Date(props.date))}
            />
          );
        }}
        scrollable
        onWeekChanged={handleWeekChange}
        startingDate={new Date()} // 시작 날짜 설정
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  calendar: {
    height: 48,
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default React.memo(Home_WeekStrip);
