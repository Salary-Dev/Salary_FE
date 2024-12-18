import { useState, useRef, useEffect, useReducer } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Keyboard, StyleSheet, Animated } from "react-native";

import TermsOfUseBtn from "../components/signUpScreen/TermsOfUseBtn";
import CompleteBtn from "../components/signUpScreen/CompleteBtn";
import CheckBtn_Off from "../assets/img/signUpScreen/CheckBtn_Off.png";
import CheckBtn_On from "../assets/img/signUpScreen/CheckBtn_On.png";
import Salary_Character from "../assets/img/signUpScreen/Salary_Character.png";
import ArrowBtn from "../assets/img/vocaSearchScreen/ArrowBtn.png";
import axios from "axios";
import { BASE_URL } from "@env";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useDebounce from "../hooks/useDebounce";
import ConfirmingModal from "../components/signUpScreen/ConfirmingModal";
import Confetti from "../assets/animations/Confetti.json";
import LottieView from "lottie-react-native";
import TermsOfUseDetail from "../components/signUpScreen/TermsOfUseDetail";
import { FadeIn, FadeOut } from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;

const ViewContainer = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;

const ArrowBtnWrapper = styled.Pressable`
  justify-content: center;
  padding-left: 6px;
  height: 41px;
  width: 32px;
`;

const ArrowBtnImg = styled.Image`
  transform: scaleX(-1);
  resizemode: contain;
  width: 8px;
  height: 14px;
`;

const Modal = styled.Modal``;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: "rgba(0, 0, 0, 0.7)";
  justify-content: flex-end;
`;

const ModalView = styled.View`
  border-radius: 30px 30px 0px 0px;
  background-color: white;
  align-items: center;
  height: 380px;
  width: 100%;
  /* position: fixed;
  top: 55%; */
`;

const BtnContainer = styled.View`
  margin: 33px 0px 40px 0px;
  width: 320px;
`;

const AllTermsOfUseBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  margin-bottom: 30px;
`;

const CheckBtnImg = styled.Image`
  resizemode: cover;
  width: 25px;
  height: 25px;
  margin: 0px 24px 0px 20px;
`;

const BtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #313131;
`;

const GoToNextBtn = styled.Pressable`
  justify-content: center;
  align-items: center;
  margin-top: 11px;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: ${(props) => (!props.allApproved ? "#eff4d2" : "#d7ff01")};
`;

const GoToNextBtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.allApproved ? "#313131" : "#a0a0a0")};
`;

const SignUpView = styled.View`
  flex: 1;
  padding: 0px 35px;
`;

const AlertText = styled(fonts.Caption1)`
  color: ${(props) =>
    props.state === "invalid" ? colors.Warning_100 : colors.Grayscale_white};
  font-weight: 500;
`;

const PwContainer = styled.View`
  margin: 30px 0px 250px;
`;
const InputLabel = styled(fonts.Body2R)`
  color: #000;
`;

const Input = styled.TextInput`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.state === "empty"
      ? colors.Grayscale_10
      : props.state === "valid"
      ? colors.Primary_100
      : "#f34b4b"};
  width: 100%;
  height: 40px;
  padding: 9px 0px 9px 22px;
  align-items: center;
  margin-top: 4px;
`;

const InputContainer = styled.View``;

const NickNameLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  margin-top: 48px;
`;

const NickNameInput = styled(Input)`
  margin-bottom: 30px;
`;

const HeaderText = styled.Text`
  font-size: 30px;
  font-weight: 800;
  margin: 20px 0px 50px;
`;

const AgeInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 4px;
`;

const AgeInput = styled.TextInput`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.state === "empty" ? colors.Grayscale_10 : colors.Primary_100};
  width: 60px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  padding: 0px 16px;
`;

const AgeInputText = styled.Text`
  color: #000;
  font-size: 15px;
  font-weight: 500;
  margin-left: 11px;
`;

const GenderInputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 350px;
  justify-content: space-between;
`;

const GenderBtn = styled.Pressable`
  border-radius: 5px;
  background-color: ${(props) =>
    props.isSelected ? colors.Primary_100 : colors.button_deactive};
  width: 150px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const GenderBtnText = styled(fonts.Button1)`
  font-weight: 600;
  color: ${(props) =>
    props.isSelected ? colors.Grayscale_90 : colors.Grayscale_40};
`;

const WelcomeContainer = styled.View`
  margin-top: 270px;
  align-items: center;
`;

const ImgContainer = styled.View`
  position: relative;
  height: 146px;
  width: 202px;
`;

const CharacterImg = styled.Image`
  resizemode: cover;
  width: 106px;
  height: 106px;
  position: absolute;
  left: 48px;
  top: 40px;
`;

const FireworksRightImg = styled.Image`
  resizemode: cover;
  width: 78px;
  height: 78px;
  position: absolute;
  top: 25%;
  left: 124px;
`;

const CompleteText = styled.Text`
  color: #c7ec00;
  font-size: 20px;
  font-weight: 600;
  margin-top: 5px;
`;

const WelcomeText = styled.Text`
  margin-top: 12px;
  color: #121212;
  font-size: 26px;
  font-weight: 500;
  max-width: 300px;
  text-align: center;
`;

function SignUpScreen({ navigation }) {
  const InitializedTermsOfUseList = [
    { id: 0, approved: false, text: "(필수) 서비스 이용약관" },
    { id: 1, approved: false, text: "(필수) 개인정보수집 및 이용 동의" },
    { id: 2, approved: false, text: "(필수) 개인정보 제 3자 정보제공 동의" },
    { id: 3, approved: false, text: "(선택) 수신 알림 서비스 동의" },
  ];

  const [termsOfUseList, setTermsOfUseList] = useState(
    InitializedTermsOfUseList
  );
  const [allApproved, setAllApproved] = useState(false);
  const [firstModalVisible, setFirstModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [screenStage, setScreenStage] = useState(1);
  const [signUpData, setSignUpData] = useState({
    loginId: "",
    username: "",
    password: "",
    age: null,
    gender: "",
    nickname: "",
  });
  const [subPassword, setSubPassword] = useState("");
  const [detailNeeded, setDetailNeeded] = useState(false);
  const [indexOfDetail, setIndexOfDetail] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const buttonPosition = useState(new Animated.Value(0))[0]; // 애니메이션 초기 값

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // 버튼의 위치를 키보드 상태에 따라 조정
    Animated.timing(buttonPosition, {
      toValue: keyboardVisible ? 270 : 50, // 키보드가 올라오면 100px 위로
      duration: 1,
      useNativeDriver: false,
    }).start();
  }, [keyboardVisible]);

  // 인풋 검증 로직

  const [state, dispatch] = useReducer(
    (prev, action) => {
      switch (action.type) {
        case "EMPTY_OR_REDUNDANT_ID":
          return {
            ...prev,
            loginId: "invalid",
          };

        case "PASSWORD_DISCORD":
          return {
            ...prev,
            password: "invalid",
            subPassword: "invalid",
          };
        case "VALID_INPUT":
          const target = action.item;
          return {
            ...prev,
            [target]: "valid",
          };
      }
    },
    {
      loginId: "empty",
      password: "empty",
      subPassword: "empty",
      age: "empty",
      nickname: "empty",
    }
  );

  const handleSubmit = async () => {
    // if (event.target.value.trim()) {
    //   setNickname(event.target.value);
    // } else {
    //   alert('텍스트를 입력하지 않았습니다.');
    // }
    // setIsSubmitted(true);
    try {
      const res = await axios.post(`${BASE_URL}/join`, signUpData);
      console.log(res.data);
      if (res.data) {
        setScreenStage(3);
        await AsyncStorage.setItem("Nickname", signUpData.nickname);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeparateCheck = (approvedId) => {
    const updatedList = termsOfUseList.map((item) =>
      item.id === approvedId ? { ...item, approved: !item.approved } : item
    );

    setTermsOfUseList(updatedList);
  };

  const handleAllCheck = () => {
    const updatedList = termsOfUseList.map((item) => ({
      ...item,
      approved: !allApproved,
    }));
    setTermsOfUseList(updatedList);
  };

  useEffect(() => {
    if (
      termsOfUseList.every((item) => item.approved) ||
      termsOfUseList.findIndex((item) => !item.approved) === 3
    ) {
      setAllApproved(true);
    } else {
      setAllApproved(false);
    }
  }, [termsOfUseList]);

  useEffect(() => {
    if (screenStage === 3)
      setTimeout(() => {
        navigation.navigate("SignIn");
      }, 3000);
  }, [screenStage]);

  const goToDetail = () => {
    setFirstModalVisible(!firstModalVisible);
    setScreenStage(2);
  };

  const debouncedIdInput = useDebounce(signUpData.loginId, 200);

  useEffect(() => {
    const handleCheckRedundance = async () => {
      try {
        if (signUpData.loginId.length > 0) {
          const res = await axios.get(`${BASE_URL}/existId`, {
            params: { loginId: debouncedIdInput },
          });
          console.log(res.data);
          if (res.data !== "성공") {
            dispatch({ type: "EMPTY_OR_REDUNDANT_ID" });
          } else {
            dispatch({ type: "VALID_INPUT", item: "loginId" });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleCheckRedundance();
  }, [debouncedIdInput]);

  const handleChangePassword = (pw) => {
    setSignUpData((prev) => ({ ...prev, password: pw }));
    if (pw.length > 0) dispatch({ type: "VALID_INPUT", item: "password" });
  };

  const handleChangeSubPassword = (pw) => {
    setSubPassword(pw);
    if (pw.length > 0 && signUpData.password === pw) {
      dispatch({ type: "VALID_INPUT", item: "subPassword" });
      dispatch({ type: "VALID_INPUT", item: "password" });
    } else if (pw.length > 0) {
      dispatch({ type: "PASSWORD_DISCORD" });
    }
  };

  const handleChangeNickname = (nickname) => {
    setSignUpData((prev) => ({ ...prev, nickname: nickname }));
    if (nickname.length > 0)
      dispatch({ type: "VALID_INPUT", item: "nickname" });
  };

  const handleChangeAge = (age) => {
    setSignUpData((prev) => ({ ...prev, age: age }));
    if (age > 0) dispatch({ type: "VALID_INPUT", item: "age" });
  };

  const handleOpenDetail = (id) => {
    setIndexOfDetail(id);
    setDetailNeeded(true);
  };

  const handleCancelDetail = (approvedId) => {
    const updatedList = termsOfUseList.map((item) =>
      item.id === approvedId ? { ...item, approved: true } : item
    );

    setTermsOfUseList(updatedList);
    setDetailNeeded(false);
  };

  const isFirstCorrect =
    // +) 아이디가 중복이 안됐을때
    // state.loginId === "valid" &&
    signUpData.loginId.length > 0 &&
    signUpData.password.length > 0 &&
    signUpData.password === subPassword;

  const isSecondCorrect =
    signUpData.nickname.length > 0 &&
    signUpData.age > 0 &&
    signUpData.gender.length > 0;

  return (
    <ViewContainer>
      <StatusBar style="dark" />

      {screenStage === 1 && (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={firstModalVisible}
          >
            <ModalBackdrop>
              <ModalView>
                <BtnContainer>
                  {!detailNeeded ? (
                    <Animated.View
                      key={"uniquekey_1"}
                      entering={FadeIn.duration(500)}
                    >
                      <AllTermsOfUseBtn onPress={handleAllCheck}>
                        <CheckBtnImg
                          source={!allApproved ? CheckBtn_Off : CheckBtn_On}
                        />
                        <BtnText>모든 약관에 동의할게요</BtnText>
                      </AllTermsOfUseBtn>
                      {termsOfUseList.map((item, index) => (
                        <TermsOfUseBtn
                          btnText={item.text}
                          key={item.id}
                          approved={item.approved}
                          onCheck={() => handleSeparateCheck(item.id)}
                          setIndex={() => handleOpenDetail(index)}
                        />
                      ))}
                      <GoToNextBtn
                        allApproved={allApproved}
                        onPress={allApproved ? goToDetail : null}
                      >
                        <GoToNextBtnText allApproved={allApproved}>
                          다음 단계로 넘어갈게요
                        </GoToNextBtnText>
                      </GoToNextBtn>
                    </Animated.View>
                  ) : (
                    <TermsOfUseDetail
                      index={indexOfDetail}
                      onBack={() => handleCancelDetail(indexOfDetail)}
                    />
                  )}
                </BtnContainer>
              </ModalView>
            </ModalBackdrop>
          </Modal>

          <SignUpView>
            <ArrowBtnWrapper onPress={() => navigation.goBack(-1)}>
              <ArrowBtnImg source={ArrowBtn} />
            </ArrowBtnWrapper>
            <HeaderText>회원가입</HeaderText>

            <InputLabel>ID</InputLabel>
            <Input
              placeholder="아이디 입력"
              placeholderTextColor={colors.Grayscale_40}
              returnKeyType="done"
              autoFocus={true}
              value={signUpData.loginId}
              onChangeText={(id) =>
                setSignUpData((prev) => ({ ...prev, loginId: id }))
              }
              state={state.loginId}
            />
            <AlertText state={state.loginId}>
              이미 사용 중인 아이디입니다.
            </AlertText>
            <PwContainer>
              <InputLabel>PW</InputLabel>
              <Input
                placeholder="비밀번호 입력"
                placeholderTextColor={colors.Grayscale_40}
                returnKeyType="next"
                value={signUpData.password}
                onChangeText={(pw) => handleChangePassword(pw)}
                state={state.password}
              />
              <Input
                placeholder="비밀번호 확인"
                placeholderTextColor={colors.Grayscale_40}
                returnKeyType="done"
                value={subPassword}
                onChangeText={(pw) => handleChangeSubPassword(pw)}
                state={state.subPassword}
              />
              <AlertText state={state.subPassword}>
                비밀번호가 일치하지 않습니다.
              </AlertText>
            </PwContainer>
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: "100%",
                  alignSelf: "center",
                  
                },
                { bottom: buttonPosition },
              ]}
            >
              <CompleteBtn
                onPress={() => setFirstModalVisible(true)}
                isInputFull={isFirstCorrect}
                text="다음 단계로"
              />
            </Animated.View>
          </SignUpView>
        </>
      )}
      {screenStage === 2 && (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={secondModalVisible}
          >
            <ConfirmingModal
              onHide={() => setSecondModalVisible(false)}
              onWelcome={handleSubmit}
              nickname={signUpData.nickname}
            />
          </Modal>

          <SignUpView>
            <ArrowBtnWrapper onPress={() => navigation.goBack(-1)}>
              <ArrowBtnImg source={ArrowBtn} />
            </ArrowBtnWrapper>
            <InputContainer>
              <HeaderText>회원가입</HeaderText>
              <InputLabel>닉네임</InputLabel>
              <NickNameInput
                onChangeText={(nickname) => handleChangeNickname(nickname)}
                value={signUpData.nickname}
                placeholder="서비스에서 사용할 닉네임을 입력해주세요."
                placeholderTextColor={colors.Grayscale_40}
                state={state.nickname}
              />
              <InputLabel>나이</InputLabel>
              <AgeInputContainer>
                <AgeInput
                  onChangeText={(age) => handleChangeAge(age)}
                  value={signUpData.age}
                  inputMode="numeric"
                  maxLength={3}
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="done"
                  state={state.age}
                />
                <AgeInputText>세</AgeInputText>
              </AgeInputContainer>
              <InputLabel>성별</InputLabel>
              <GenderInputContainer>
                <GenderBtn
                  onPress={() =>
                    setSignUpData((prev) => ({ ...prev, gender: "남" }))
                  }
                  isSelected={signUpData.gender === "남"}
                >
                  <GenderBtnText isSelected={signUpData.gender === "남"}>
                    남성
                  </GenderBtnText>
                </GenderBtn>
                <GenderBtn
                  onPress={() =>
                    setSignUpData((prev) => ({ ...prev, gender: "여" }))
                  }
                  isSelected={signUpData.gender === "여"}
                >
                  <GenderBtnText isSelected={signUpData.gender === "여"}>
                    여성
                  </GenderBtnText>
                </GenderBtn>
              </GenderInputContainer>
              <Animated.View
              style={[
                {
                  position: "absolute",
                  width: "100%",
                  alignSelf: "center",
                  
                },
                { bottom: buttonPosition },
              ]}
            >
              <CompleteBtn
                onPress={() => setSecondModalVisible(true)}
                isInputFull={isSecondCorrect}
                text="샐러리 시작하기"
              /></Animated.View>
            </InputContainer>
          </SignUpView>
        </>
      )}
      {screenStage === 3 && (
        <WelcomeContainer>
          <ImgContainer>
            <CharacterImg source={Salary_Character} />
            <LottieView
              style={{
                width: 150,
                height: 120,
                position: "absolute",
                left: 24,
                top: 20,
              }}
              source={require("../assets/animations/Confetti.json")}
              autoPlay
              loop={false}
            />
          </ImgContainer>
          <CompleteText>가입 완료!</CompleteText>
          <WelcomeText>
            {signUpData.nickname}님,{" "}
            {signUpData.nickname.length > 7 ? "\n" : ""} 환영해요
          </WelcomeText>
        </WelcomeContainer>
      )}
    </ViewContainer>
  );
}

export default SignUpScreen;
