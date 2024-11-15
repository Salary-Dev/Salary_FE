import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import Salary_CharacterImg from "../assets/Salary_Character.png";
import ArrowBtn from "../assets/img/signUpScreen/ArrowBtn.png";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { Shadow } from "react-native-shadow-2";

const ResultViewContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin: 19px 0px 5px 27px;
`;

const CharacterImg = styled.Image`
  resizemode: contain;
  width: 66px;
  height: 66px;
`;

const Title_Green = styled(fonts.H3)`
  font-weight: 600;
  color: ${colors.Primary_80};
  margin-bottom: 5px;
`;
const Title_Normal = styled(fonts.H5)`
  color: #000;
  margin-bottom: 5px;
`;

const SubTitle = styled(fonts.Caption2)`
  color: #3a3a3a;
  margin-left: 93px;
`;

const SubTitle_Num = styled.Text`
  text-decoration: underline;
`;

const CenteredView = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 39px;
`;
const ResultList = styled.FlatList`
  width: 100%;
  padding-top: 10px;
  margin-bottom: 140px;
`;
const ResultBox = styled.Pressable`
  width: 325px;
  background-color: #fff;
  height: 92px;
  padding: 17px 25px 20px 25px;
  border-radius: 10px;
`;
const ResultBoxUpperContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const ResultBox_Word = styled.View`
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-color: ${colors.Primary_80};
  border-width: 2px;
  padding: 4px 12px;
  height: 29px;
`;
const ResultBox_Word_Text = styled(fonts.Body2M)`
  height: 22px;
`;
const ArrowBtnImg = styled.Image`
  resize-mode: contain;
  width: 8px;
  height: 14px;
`;
const ResultBox_Content = styled(fonts.Caption2)`
  width: 100%;
`;
function VocaSearchResultScreen({ navigation, route }) {
  const renderItem = ({ item }) => {
    return (
      <Shadow
        style={styles.shadowContainer}
        distance={10}
        startColor="rgba(0,0,0,0.03)"
        endColor="rgba(0,0,0,0)"
        offset={[0, 0]}
      >
        <ResultBox
          onPress={() =>
            navigation.navigate("TodaySalaryEdu", { word_id: item.word_id })
          }
        >
          <ResultBoxUpperContainer>
            <ResultBox_Word>
              <ResultBox_Word_Text>{item.word}</ResultBox_Word_Text>
            </ResultBox_Word>
            <ArrowBtnImg source={ArrowBtn} />
          </ResultBoxUpperContainer>
          <ResultBox_Content numberOfLines={1}>{item.mean}</ResultBox_Content>
        </ResultBox>
      </Shadow>
    );
  };

  return (
    <ResultViewContainer>
      <TitleContainer>
        <CharacterImg source={Salary_CharacterImg} />
        <Title_Green>{route.params.input}</Title_Green>
        <Title_Normal> 에 대한 검색 결과에요</Title_Normal>
      </TitleContainer>
      <SubTitle>
        검색 결과가 <SubTitle_Num>{route.params.renderedItems.length}건</SubTitle_Num> 있어요.
      </SubTitle>
      <CenteredView>
        <ResultList
          data={route.params.renderedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.word_id}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </CenteredView>
    </ResultViewContainer>
  );
}

export default VocaSearchResultScreen;

const styles = StyleSheet.create({
  shadowContainer: {
    width: 325,
    height: 92,
    marginBottom: 20,
    borderRadius: 10,
  },
});
