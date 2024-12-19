import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ArrowBtn from "../../assets/img/signUpScreen/ArrowBtn.png";
import Profile1 from "../../assets/img/NewsLetterMainScreen/profile_1.png";

const EditorInfoContainer = styled.View`
  flex-direction: row;
  margin-left: 33px;

  gap: 10px;
`;

const ProfileImg = styled.Image`
  width: 26px;
  height: 26px;
  border-radius: 18px;
  background-color: #d9d9d9;

  resize-mode: contain;
`;

const TextContainer = styled.View`
  gap: 3px;
  margin-top: 3px;
`;

const EditorName = styled(fonts.Body1)`
  line-height: 20px;
  color: ${colors.Grayscale_90};
`;

const SubText = styled(fonts.Caption1)`
  color: ${colors.Grayscale_80};
`;

const LastLetters = styled(fonts.Body1)`
  line-height: 20px;
  margin: 40px 0px 25px 40px;
`;

const DrawerListItem = styled.View`
  border-radius: 10px;
  border: 1px solid ${colors.Grayscale_10};
  background-color: ${colors.Grayscale_white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px 10px;
  padding: 6px 12px;
`;

const DrawerListItemText = styled(fonts.Body2M)``;
const ArrowBtnImg = styled.Image`
  width: 6px;
  height: 12px;
`;

function CustomDrawer({ editor, articleList, ...props }) {
  console.log("CustomDrawer에서 artileList의 값", articleList);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <LinearGradient
          style={styles.LinearGradient}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={["#d3ff4e", "#97f764"]}
        >
          <EditorInfoContainer>
            <ProfileImg source={Profile1} />
            <TextContainer>
              <EditorName>{editor}</EditorName>
              <SubText>시장 분석과 트렌드를 쉽고 간결하게 전달합니다.</SubText>
            </TextContainer>
          </EditorInfoContainer>
        </LinearGradient>
        <LastLetters>지난 글</LastLetters>

        {articleList.map((item, index) => (
          <DrawerItem
            key={index}
            label={({ focused, color }) => (
              <DrawerListItem>
                <DrawerListItemText>{item}</DrawerListItemText>
                <ArrowBtnImg source={ArrowBtn} />
              </DrawerListItem>
            )}
          />
        ))}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default CustomDrawer;

const styles = StyleSheet.create({
  LinearGradient: {
    height: 134,
    width: "100%",
    paddingVertical: 46,
  },
});
