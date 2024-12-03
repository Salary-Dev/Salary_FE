import styled from "styled-components/native";
import SubscribingLetterList from "../components/NewsLetterMainScreen/SubscribingLetterList";
import ArrivedLetterList from "../components/NewsLetterMainScreen/ArrivedLetterList";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 0px 23px;
`;

const HeaderTitle = styled(fonts.H4M)`
  color: #3a3a3a;
  margin: 30px 0px 20px 4px;
`;

const MainTitle = styled(fonts.H4M)`
  color: #3a3a3a;
  margin: 33px 0px 6px 4px;
`;

const SubTitle = styled(fonts.Caption2)`
  color: #000;
  font-weight: 500;
  margin-bottom: 22px;
  margin-left: 4px;
`;

function NewsLetterMainScreen() {
  return (
    <ViewContainer>
      <HeaderTitle>경제레터</HeaderTitle>
      <SubscribingLetterList />
      <MainTitle>에디터의 경제 레터가 도착했어요!</MainTitle>
      <SubTitle>
        인증된 에디터가 작성한 경제 레터에요.{"\n"}마음에 드는 글은 시드를
        소모하여 읽어볼 수 있어요.
      </SubTitle>
      <ArrivedLetterList />
    </ViewContainer>
  );
}

export default NewsLetterMainScreen;
