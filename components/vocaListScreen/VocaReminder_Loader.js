import React from "react";
import { View, Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import styled from "styled-components";
import fonts from "../../styles/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";
import { nicknameState } from "../../Recoil/nicknameState";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  flex: 1;
  background-color: white;
`;

const TextContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 50%;
  text-align: center;
`;

const TextDescr = styled(fonts.H5)`
  color: #000000;
  text-align: center;
  line-height: 30px;
  position: absolute;

  word-break: keep-all;
`;

const VocaReminder_Loader = () => {
  const nickname = useRecoilValue(nicknameState);

  return (
    <Container>
      <View style={styles.container}>
        {/* Lottie Animation */}
        <LottieView
          source={require("../../assets/animations/RemindLoading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />

        {/* Centered Image */}
        <Image
          source={require("../../assets/Salary_Character.png")}
          style={styles.image}
        />
      </View>
      <TextContainer>
        <TextDescr>
          {nickname}님이 단어를 {"\n"}리마인드할 수 있도록 {"\n"}
          랜덤으로 10개 단어를 {"\n"} 추출하고 있어요
        </TextDescr>
      </TextContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  lottie: {
    width: 350,
    height: 350,
  },
  image: {
    position: "absolute",
    width: 100,
    height: 100,
  },
});

export default VocaReminder_Loader;
