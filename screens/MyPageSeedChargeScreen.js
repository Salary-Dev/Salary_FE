import { StatusBar, Text, View, Image, Modal } from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components";
import DollarIcn from "../assets/img/myPageScreen/dollar.png";
import Dollar2Icn from "../assets/img/myPageScreen/Dollar2.png";
import Dollar3Icn from "../assets/img/myPageScreen/Dollar3.png";
import NavigateBtn from "../assets/img/myPageScreen/SeedChargeBtn.png";
import GradientBtm from "../assets/img/myPageScreen/GradientBtm.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Toast from "../common/Toast";

const BlackContainer = styled.View`
  background-color: ${colors.Grayscale_90};
  width: 100%;
  height: 30%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  position: relative;
`;

const ItemsContainer = styled.View`
  width: 100%;
  position: absolute;

  flex-direction: row;
  justify-content: center;
  gap: 6px;

  top: 85%;
`;

const ItemContainer = styled.Pressable`
  width: 116px;
  height: 150px;

  border-radius: 8px;
  background: #fff;
  position: relative;

  padding-top: 12px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const LinearGradient = styled.Image`
  width: 100%;
  height: 25%;
  position: absolute;

  left: 0;
  bottom: 0;
  z-index: 4;
`;

const TransparentGradient = styled.View`
  width: 100%;
  height: 25%;
`;

const AbsoluteText = styled.View`
  width: 116px;
  height: 25%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;

  z-index: 5;
`;

const GrayContainer = styled.View`
  background-color: ${colors.bg};
  width: 100%;
  flex: 1;
  padding: 12px;

  display: flex;
  gap: 14px;

  margin-top: 40%;
`;

const GrayItemContainer = styled.Pressable`
  border-radius: 6px;
  border: 1px solid ${colors.Grayscale_40};
  background-color: ${colors.Grayscale_90};
  width: 100%;

  padding: 18px 14px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 200px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;

  border-radius: 10px;

  border: 2px solid ${colors.Grayscale_20};
`;
const ModalText = styled(fonts.Body2R)`
  color: black;
`;

function ChargeItem({ amount, price, totalSeed, onClick }) {
  var width;
  if (price === "2,500원") width = "40%";
  else if (price === "5,600원") width = "80%";
  else width = "100%";

  return (
    <ItemContainer onPress={onClick}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 29,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <View></View>
        <fonts.Caption2>{amount}</fonts.Caption2>
        <Ionicons name="chevron-forward-outline" size={12}></Ionicons>
      </View>
      <Image
        style={{
          resizeMode: "contain",
          flex: 1,
          width: width,
        }}
        source={
          price === "2,500원"
            ? DollarIcn
            : price === "5,600원"
            ? Dollar2Icn
            : Dollar3Icn
        }
      />
      <TransparentGradient />
      <AbsoluteText>
        <fonts.Caption2 style={{ color: "#ffffff" }}>{price}</fonts.Caption2>
      </AbsoluteText>
      <LinearGradient source={GradientBtm} />
    </ItemContainer>
  );
}

// route.params.totalSeed 사용
function MyPageSeedChargeScreen({ route }) {
  console.log(route.params.totalSeed);
  const [modal, setModal] = useState(false);

  const navigation = useNavigation();

  function openModal() {
    setModal(true);
    setTimeout(() => {
      setModal(false);
    }, 2000);
  }

  return (
    <>
      <BlackContainer>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 4,
            width: "100%",
            padding: 40,
          }}
        >
          <Image source={DollarIcn} style={{ width: 35, height: 35 }} />
          <fonts.Body2M style={{ color: colors.Grayscale_40 }}>
            총 시드
          </fonts.Body2M>
          <fonts.H2M style={{ color: colors.Grayscale_white }}>
            {Number(route.params.totalSeed).toLocaleString()} 개
          </fonts.H2M>
        </View>
        <ItemsContainer>
          <ChargeItem amount={"50 개"} price={"2,500원"} onClick={openModal} />
          <ChargeItem amount={"100 개"} price={"5,600원"} onClick={openModal} />
          <ChargeItem amount={"200 개"} price={"9,900원"} onClick={openModal} />
        </ItemsContainer>
      </BlackContainer>
      {/* 두 컨테이너 사이에 겹치는 시드 아이템 컨테이너 */}
      <GrayContainer>
        <GrayItemContainer
          onPress={() =>
            navigation.navigate("BottomTab", {
              screen: "Home",
            })
          }
        >
          <fonts.Caption2 style={{ color: colors.Grayscale_white }}>
            <Text style={{ color: colors.text_green }}>
              오늘의 샐러리 한조각
            </Text>{" "}
            학습하고 <Text style={{ color: colors.text_green }}>무료</Text>로
            시드 5개 받기
          </fonts.Caption2>
          <Image source={NavigateBtn} style={{ width: 26, height: 26 }} />
        </GrayItemContainer>
        <GrayItemContainer
          onPress={() =>
            navigation.navigate("BottomTab", {
              screen: "Home",
            })
          }
        >
          <fonts.Caption2 style={{ color: colors.Grayscale_white }}>
            <Text style={{ color: colors.text_green }}>트렌드 퀴즈</Text> 풀고{" "}
            <Text style={{ color: colors.text_green }}>무료</Text>로 시드 5개
            받기
          </fonts.Caption2>
          <Image source={NavigateBtn} style={{ width: 26, height: 26 }} />
        </GrayItemContainer>
      </GrayContainer>
      <Modal
        visible={modal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModal(false)}
      >
        <Toast text="준비 중인 서비스입니다." />
      </Modal>
    </>
  );
}

export default MyPageSeedChargeScreen;
