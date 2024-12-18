import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import Hamburger from "../assets/img/NewsLetterMainScreen/Hamburger.png";
import BlueCheck from "../assets/img/NewsLetterMainScreen/BlueCheck.png";
import { Pressable } from "react-native";
import profile_1 from "../assets/img/NewsLetterMainScreen/profile_1.png";
import article_1 from "../assets/img/NewsLetterMainScreen/article_1.png";

const ViewContainer = styled.View`
  flex: 1;
  padding: 30px 23px 50px;
`;
const LetterHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 27px;
  padding-left: 12px;
`;

const EditorInfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;

const ProfileImg = styled.Image`
  width: 26px;
  height: 26px;
  border-radius: 18px;
  
`;

const EditorInfo_Middle = styled.View`
  height: 40px;
`;
const EditorName = styled(fonts.Body1)`
  font-weight: 500;
  line-height: 20px;
  color: ${colors.Grayscale_90};
`;

const UploadDate = styled(fonts.Caption1)`
  font-weight: 500;
  color: ${colors.Grayscale_80};
`;

const BlueCheckImg = styled.Image`
  width: 20px;
  height: 20px;
`;

const MoreLetterImg = styled.Image`
  width: 28px;
  height: 28px;
`;
const LetterBodyImg = styled.Image`
  width: 100%;
  height: 170px;
  resize-mode: cover;
`;

const LetterBodyWrapper = styled.ScrollView`
  height: 200px;
  width: 100%;
  margin-top: 27px;
`;

const LetterBody = styled.Text`
  width: 100%;
  line-height: 30px;
  padding: 0px 10px;
  color: ${colors.Grayscale_100};
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
  word-break: keep-all;
`;

const Data = [
  "망고망고 으라차차",
  "까리까리 까리의의의",
  "마르모라아 으으오실",
  "다시 걸어갈 수 있도록",
  "끼룩끼룩 독수리의 여행",
];

function NewsLetterArticleScreen({ navigation, route }) {
  return (
    <ViewContainer>
      <LetterHeader>
        <EditorInfoContainer>
          <ProfileImg source={profile_1}/>
          <EditorInfo_Middle>
            <EditorName>{route.params.editor}</EditorName>
            <UploadDate>{route.params.uploadDate}</UploadDate>
          </EditorInfo_Middle>
          <BlueCheckImg source={BlueCheck} />
        </EditorInfoContainer>
        <Pressable onPress={() => navigation.openDrawer()}>
          <MoreLetterImg source={Hamburger} />
        </Pressable>
      </LetterHeader>
      <LetterBodyImg source={article_1}/>
      <LetterBodyWrapper>
        <LetterBody>{route.params.body}</LetterBody>
      </LetterBodyWrapper>
    </ViewContainer>
  );
}

export default NewsLetterArticleScreen;
