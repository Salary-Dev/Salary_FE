import { Shadow } from "react-native-shadow-2";
import styled, { css } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import getFormattedDate from "../../functions/getFormattedDate";
import compareDate from "../../functions/compareDate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import getKoreaFormattedDate from "../../functions/getKoreaForamttedDate";

const TouchableContainer = styled.TouchableOpacity`
  margin-top: 4px;
  margin-left: 2px;
  margin-right: 2px;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  background-color: white;

  border-radius: 18px;

  ${(props) =>
    props.attendanceState >= 3
      ? css`
          background-color: ${colors.Primary_100};
        `
      : props.attendanceState > 0
      ? css`
          border-width: 3px;
          border-color: ${colors.Primary_100};
        `
      : css`
          background-color: white;
        `}

  ${(props) =>
    props.emptyState
      ? css`
          background-color: white;
        `
      : css``}

    ${(props) =>
    props.isToday === true
      ? css`
          background-color: ${colors.Grayscale_80};
          border: none;
        `
      : css``}
`;

const DayText = styled(fonts.Body2M)`
  ${(props) =>
    props.emptyState === true
      ? css`
          color: ${colors.Grayscale_20};
        `
      : css`
          color: ${colors.Grayscale_80};
        `}

  ${(props) =>
    props.isToday === true
      ? css`
          color: ${colors.Grayscale_white};
        `
      : css``}
`;

async function getStateFromStorage(
  date,
  calendarDate,
  setEmpty,
  setAttendanceState
) {
  // console.log(date, calendarDate, "함수 호출");

  var formattedDate;
  if (date) formattedDate = getFormattedDate(new Date(date));
  else formattedDate = calendarDate.dateString;

  // console.log("formattedDate", formattedDate);
  const storedState = await AsyncStorage.getItem(formattedDate);

  // date를 key로 저장되어 있던 state를 불러온다.
  if (storedState !== null) {
    // console.log("storedState return", formattedDate, "결과", storedState);
    await setEmpty(false);
    await setAttendanceState(parseInt(storedState));
    // 더미
    return storedState;
  } else {
    // console.log("false return");
    await setEmpty(true); // 정보가 없다면 empty로 처리한다.
    return false;
  }
}

function Home_DayAttendanceCircle({
  calendarDate, // 캘린더에서 보내는 date
  date, // week strip에서 보내는 date
  onCalendarModalOpen,
  type, // calendar면 전달
  empty, // true라면 비활성화된 circle을 전달
  isToday,
}) {
  //   console.log("date", date); //date "2024-12-06T03:25:08.085Z"
  //   console.log("calendarDate.dateString", calendarDate); // 2024-11-15

  const [emptyState, setEmpty] = useState(empty);
  const [attendanceState, setAttendanceState] = useState(0);

  // empty = compareDate(new Date(), new Date(formattedDate)); // 중복 처리임

  getStateFromStorage(date, calendarDate, setEmpty, setAttendanceState);
  // console.log(calendarDate, attendanceState, emptyState);

  return (
    <Shadow
      distance={3}
      startColor="rgba(0, 0, 0, 0.03)"
      offset={[0, 2]}
      style={{ borderRadius: 15 }}
    >
      <TouchableContainer
        onPress={type === "calendar" ? () => {} : () => onCalendarModalOpen()}
        attendanceState={attendanceState}
        emptyState={emptyState}
        isToday={isToday}
      >
        {/* 날짜 */}
        {attendanceState < 3 || isToday ? (
          <DayText emptyState={emptyState} isToday={isToday}>
            {type === "calendar" ? calendarDate.day : date.format("D")}
          </DayText>
        ) : (
          <Ionicons
            name="checkmark-sharp"
            color={colors.Grayscale_100}
            size={20}
          ></Ionicons>
        )}

        {/* 요일 */}
        {/* <Text style={styles.dayName}>{date.format("ddd")}</Text> */}
      </TouchableContainer>
    </Shadow>
  );
}

export default React.memo(Home_DayAttendanceCircle);
