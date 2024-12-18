import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SalaryLogo from "../assets/img/myPageScreen/salaryLogo.jpg";
import BackBtn from "../assets/img/myPageScreen/arrow-left.png";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import Charac from "../assets/img/myPageScreen/Charac.jpg";

const Header = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0 10px;
`;

const Title = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 100px;
  margin: 20px 0;
`;

const TitleText = styled.Text`
  color: #121212;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 22px;
  font-weight: 500;
`;

const SmallText = styled.Text`
  color: #717171;

  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  letter-spacing: 0.24px;
`;

const AppInfoScreen = () => {
  const navigate = useNavigation();
  const data = [
    {
      role: "영명 (PM)",
      message:
        "누구보다 샐러리에 진심이었던 우리 사자의 채소밭** 좋은 사람들과 함께 프로젝트 할 수 있어서 영광이었고 덕분에 많은 걸 배워갈 수 있었던 너무 뜻깊은 시간이었습니다! 샐러리는 끝나지 않아...뽀에바...",
      bgColor: "#FFF8E1", // 연한 노랑
    },
    {
      role: "다인 (PM)",
      message:
        "3개월간 열심히 키워낸 샐러리..! 멋진 팀원들을 만나 성장할 수 있어 행복한 시간이었어요. 올해 최고의 기억! 😊 애정 가득한 우리 샐러리,, 잘 수확되어 지속 가능한 경제에 작은 보탬이 되었으면 합니다💚 우리팀 사랑해용",
      bgColor: "#FFF8E1", // 연한 초록
    },
    {
      role: "유정 (DE)",
      message:
        "사자의 채소밭 🌱에서 샐러리를 키워낸 3개월 간 함께 성장할 수 있어 행복했어요 💚 샐러리가 많은 이들에게 꾸준한 성장의 기회가 되길 바랍니다!",
      bgColor: "#F3E5F5", // 연한 보라
    },
    {
      role: "지효 (DE)",
      message:
        "저희 사자의 채소밭 팀에서 열심히 가꾼 샐러리 좋은 수확있으면 좋겠습니다😍 우리 팀원들 너무 수고많으셨슴다🤍",
      bgColor: "#F3E5F5", // 연한 보라
    },
    {
      role: "윤호 (FE)",
      message:
        "샐 수 없이 많은 시간 동안 \n러블리한 샐러리를 만들기 위해 노력한 우리 팀원들 너무 수고하셨습니다 \n리",
      bgColor: "#E1F5FE", // 연한 파랑
    },
    {
      role: "민주 (FE)",
      message:
        "3달 동안 차근차근 쌓아올린 우리 샐러리가 완성되다니 감회가 새롭습니당 함께라서 너무 즐거웠고 많이 배울 수 있었어요 샐러리 최고~!!! 😘",
      bgColor: "#E1F5FE", // 연한 주황
    },
    {
      role: "지환 (BE)",
      message:
        "영광스러운 팀원들과 영광스러운 프로젝트를 함께 할 수 있어 영광이었습니다.",
      bgColor: "#FFF3E0", // 연한 핑크
    },
    {
      role: "민경 (BE)",
      message:
        "모두가 손 안 댄 곳 없이 함께 만들어간 애정가득한 샐러리💚  모두 고생많았고 샐러리로 경제/금융 공부해서 똑똑해집시다 🤩",
      bgColor: "#FFF3E0", // 연한 연두
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: "white" }}>
      {/* 헤더 */}
      <Header>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <Image
            source={BackBtn}
            style={{ width: 25, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <Image
          source={SalaryLogo}
          style={{ width: 80, height: 34, resizeMode: "contain" }}
        />
        <View style={{ width: 20 }} />
      </Header>

      {/* ScrolLView */}
      <ScrollView style={styles.container}>
        {/* Title 1 */}
        <Title>
          <TitleText>겨울잠을 마치며..</TitleText>
          <Image source={Charac} style={{ width: 46, resizeMode: "contain" }} />
        </Title>
        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: item.bgColor }]}
          >
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        ))}

        {/* Title 2 */}
        {/* Title 1 */}
        <Title style={{ flexDirection: "column", gap: 10 }}>
          <TitleText style={{ fontSize: 25 }}>
            운영진께 감사의 말씀 🦁
          </TitleText>
          <SmallText>
            사자의 채소밭팀이 운영진에게 감사의 말씀을 전하는 곳
          </SmallText>
        </Title>
        <View style={[styles.card, { backgroundColor: "#f7f8fa" }]}>
          <Text style={styles.message}>
            아기사자에서 샐러리 뜯어먹는 어른 사자가 되기까지 운영진분들의
            도움을 정말 많이 받았어요. {"\n"}
            지난 일년을 돌아보면 너무 소중하고 값진 기억이 가득해 벌써 12기를
            마무리한다는게 실감이 안 나고 아쉽습니다.{"\n"} 각 팀의 정신적
            지주가 되어준 파트장님들, 멋사를 가꿔준 팀장님들, 그리고 멋사를
            최고의 동아리로 만들어준 회장단까지 깊은 감사의 말씀을 드립니다. 🍀
            {"\n"}숭멋사 최고!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white", // 배경색
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#121212",
    lineHeight: 20,
    letterSpacing: 1.05,
    wordSpacing: 1.05,
    flexWrap: "wrap",
  },
  lastCard: {
    borderRadius: 20,
    padding: 18,
    elevation: 2, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default AppInfoScreen;
