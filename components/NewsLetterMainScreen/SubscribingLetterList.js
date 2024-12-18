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
const EditorProfileImg = styled.View`
  width: 16px;
  height: 16px;
  background-color: #d9d9d9;
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

  const getSubscribingList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/economy-letter/subscribe`, {
        headers: { Authorization: token },
      });
      setFetchedData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscribingList();
  }, []);

  const DATA = [
    {
      editor: "대단한 샐러리",
      content: "중국 경제 둔화, 우리가 어떻게 대응해야 할까?",
      isNew: true,
      uploadDate: "2024.11.24",
      articleList: [
        "망고망고 으라차차",
        "까리까리 까리의의의",
        "마르모라아 으으오실",
        "다시 걸어갈 수 있도록",
        "끼룩끼룩 독수리의 여행",
      ],
    },
    {
      editor: "청경채",
      content: "오늘은 기술주 vs 가치주, 어느 쪽이 유망한지....",
      isNew: false,
      uploadDate: "2024.12.02",
      articleList: [
        "망고망고 으라차차",
        "까리까리 까리의의의",
        "마르모라아 으으오실",
        "다시 걸어갈 수 있도록",
        "끼룩끼룩 독수리의 여행",
      ],
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <LetterBox
        onPress={() =>
          navigation.navigate("LetterDrawer", {
            editor: item.editor,
            uploadDate: item.uploadDate,
            title: item.title
          })
        }
      >
        <LetterBoxInner>
          <View style={styles.RowView}>
            <EditorProfileImg />
            <TextContainer>
              <EditorNameContainer>
                <EditorName>{item.editor}</EditorName>
                <BlueCheckImg source={BlueCheck} />
              </EditorNameContainer>
              <ContentText isNew={true}>
                {item.isNew ? "새 레터가 도착했어요!" : item.content}
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
          <Title>(닉네임)님이 구독 중인 경제 레터</Title>
          <FlatList
            style={styles.LetterBoxList}
            data={fetchedData}
            renderItem={renderItem}
            keyExtractor={(item) => item.content}
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
