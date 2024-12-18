import { FlatList, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import styled from "styled-components/native";
import colors from "../../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "../../styles/fonts";
import BlueCheck from "../../assets/img/NewsLetterMainScreen/BlueCheck.png";
import ArrowBtn from "../../assets/img/signUpScreen/ArrowBtn.png";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authToken } from "../../Recoil/authToken";
import axios from "axios";
import { BASE_URL } from "@env";
import profile_1 from "../../assets/img/NewsLetterMainScreen/profile_1.png";
import profile_2 from "../../assets/img/NewsLetterMainScreen/profile_2.png";
import profile_3 from "../../assets/img/NewsLetterMainScreen/profile_3.png";
import profile_4 from "../../assets/img/NewsLetterMainScreen/profile_4.png";
import { nicknameState } from "../../Recoil/nicknameState";

const SubscribingListWrapper = styled.View`
  padding: 14px 20px 8px;
  border-radius: 20px;
  height: 179px;
  width: 99%;
  background-color: ${colors.Grayscale_white};
`;

const SubscribingListContainer = styled.View`
  width: 100%;
  flex: 1;
  gap: 13px;
  width: 100%;
  align-items: flex-start;
`;

const Title = styled(fonts.Body2M)``;

const LetterBox = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  padding: 8px 16px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.Grayscale_10};
  background-color: ${colors.Grayscale_white};
  margin-bottom: 12px;
`;

const LetterBoxInner = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

// 향후 Image로 바꿔야 함
const EditorProfileImg = styled.Image`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-top: 2px;
`;

const TextContainer = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const EditorNameContainer = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 3px;
`;

const EditorName = styled(fonts.Caption1)``;

const BlueCheckImg = styled.Image`
  width: 14px;
  height: 14px;
`;

const ContentText = styled(fonts.Caption2)`
  color: ${(props) => (props.isNew ? colors.text_green : colors.Grayscale_100)};
`;

const RightArrowImg = styled.Image`
  width: 6px;
  height: 12px;
  margin-top: 3px;
`;

function SubscribingLetterList() {
  const navigation = useNavigation();
  const token = useRecoilValue(authToken);
  const [fetchedData, setFetchedData] = useState([]); 
  const nickname =useRecoilValue(nicknameState);

  const getSubscribingList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/economy-letter/subscribe`, {
        headers: { Authorization: token },
      });
      console.log("구독중인 경제레터 조회 api: ", res.data)
      setFetchedData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscribingList();
  }, []);

  const profileList = [profile_1, profile_2, profile_3];

  const renderItem = ({ item, index }) => {
    return (
      <LetterBox key={index}
        onPress={() =>
          navigation.navigate("LetterDrawer", {
            editor: item.editor,
            uploadDate: item.uploadDate,
            title: item.title,
            body: item.text
          })
        }
      >
        <LetterBoxInner>
          <View style={styles.RowView}>
            <EditorProfileImg source={profileList[0]}/>
            <TextContainer>
              <EditorNameContainer>
                <EditorName>{item.editor}</EditorName>
                <BlueCheckImg source={BlueCheck} />
              </EditorNameContainer>
              <ContentText >
                {item.title}
              </ContentText>
            </TextContainer>
          </View>
          <RightArrowImg source={ArrowBtn} />
        </LetterBoxInner>
      </LetterBox>
    );
  };

  return (
    <LinearGradient
      style={styles.LinearGradient}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      colors={["#d3ff4e", "#97f764"]}
    >
      <SubscribingListWrapper>
        <SubscribingListContainer>
          <Title>{nickname}님이 구독 중인 경제 레터</Title>
          <FlatList
            style={styles.LetterBoxList}
            data={fetchedData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </SubscribingListContainer>
      </SubscribingListWrapper>
    </LinearGradient>
  );
}

export default SubscribingLetterList;

const styles = StyleSheet.create({
  LinearGradient: {
    height: 183,
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  RowView: {
    flex: 1,
    flexDirection: "row",
    gap: 9,
  },
  LetterBoxList: {
    width: "100%",
  },
});
