import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const EditorInfoContainer = styled.View`
  flex-direction: row;
  margin-left: 33px;

  gap: 10px;
`;

const ProfileImg = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 18px;
  background-color: #d9d9d9;
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
`;

function CustomDrawer({ editor, articleList, ...props }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <DrawerContentScrollView {...props} contentContainerStyle={{paddingLeft: 0}} style={styles.ContentView}>
        <LinearGradient
          style={styles.LinearGradient}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={["#d3ff4e", "#97f764"]}
        >
          <EditorInfoContainer>
            <ProfileImg />
            <TextContainer>
              <EditorName>{editor}</EditorName>
              <SubText>시장 분석과 트렌드를 쉽고 간결하게 전달합니다.</SubText>
            </TextContainer>
          </EditorInfoContainer>
        </LinearGradient>
        <LastLetters>지난 글</LastLetters>
        <DrawerItemList {...props}>
          {articleList.map((item, index) => (
            <DrawerItem key={index}>{item}</DrawerItem>
          ))}
        </DrawerItemList>
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
  ContentView: {
    paddingHorizontal: 0,
  },
});
