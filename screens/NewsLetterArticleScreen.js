import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import Hamburger from "../assets/img/NewsLetterMainScreen/Hamburger.png";
import BlueCheck from "../assets/img/NewsLetterMainScreen/BlueCheck.png";
import { Pressable } from "react-native";

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

const ProfileImg = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 18px;
  background-color: #d9d9d9;
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
const LetterBodyImg = styled.View`
  width: 100%;
  height: 170px;
  background-color: #d9d9d9;
`;
const LetterBody = styled.Text`
  width: 100%;
  line-height: 30px;
  margin-top: 27px;
  color: ${colors.Grayscale_100};
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
`;

const Data = [
  "망고망고 으라차차",
  "까리까리 까리의의의",
  "마르모라아 으으오실",
  "다시 걸어갈 수 있도록",
  "끼룩끼룩 독수리의 여행",
];

function NewsLetterArticleScreen({ navigation, route }) {
  console.log(route.params);

  return (
    <ViewContainer>
      <LetterHeader>
        <EditorInfoContainer>
          <ProfileImg />
          <EditorInfo_Middle>
            <EditorName>{route.params.editor}</EditorName>
            <UploadDate>{route.params.uploadDate}</UploadDate>
          </EditorInfo_Middle>
          <BlueCheckImg source={BlueCheck} />
        </EditorInfoContainer>
        <Pressable
          onPress={() => navigation.navigate("LetterDrawer", {
            editor: route.params.editor,
            articleList: Data,
          })}
        >
          <MoreLetterImg source={Hamburger} />
        </Pressable>
      </LetterHeader>
      <LetterBodyImg />
      <LetterBody>
        요즘 중국 경제가 좀 어려워지고 있다는 얘기, 많이 들어보셨죠? 그만큼
        우리나라에도 영향이 있을 수밖에 없어요. 중국은 우리 수출의 큰 비중을
        차지하는 나라라서 그쪽 경기가 안 좋으면 자연스럽게 우리도 영향을 받을 수
        있거든요. {"\n"}
        {"\n"}예를 들어, 중국이 잘 팔리는 물건이 줄어들면 우리 제품을 사는
        수요도 줄어들 수 있겠죠. 그런데 이럴 때일수록 우리가 해야 할 일은 다양한
        시장을 공략하는 것이에요. 중국에만 의존할게 아니라, 다른 나라로 수출을
        늘리거나 내수 활성화를 시도해보는 거죠.
      </LetterBody>
    </ViewContainer>
  );
}

export default NewsLetterArticleScreen;
