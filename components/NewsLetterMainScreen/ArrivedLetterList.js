import { FlatList, StyleSheet } from "react-native";
import styled from "styled-components/native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import BlueCheck from "../../assets/img/NewsLetterMainScreen/BlueCheck.png";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "@env";
import { useRecoilValue } from "recoil";
import { authToken } from "../../Recoil/authToken";
import { useEffect, useState } from "react";
import profile_1 from "../../assets/img/NewsLetterMainScreen/profile_1.png";
import profile_2 from "../../assets/img/NewsLetterMainScreen/profile_2.png";
import profile_3 from "../../assets/img/NewsLetterMainScreen/profile_3.png";
import profile_4 from "../../assets/img/NewsLetterMainScreen/profile_4.png";
import article_1 from "../../assets/img/NewsLetterMainScreen/article_1.png";
import article_2 from "../../assets/img/NewsLetterMainScreen/article_2.png";
import article_3 from "../../assets/img/NewsLetterMainScreen/article_3.png";

const LetterBoxContainer = styled.TouchableOpacity`
  width: 100%;
  height: 103px;
  padding: 0px 22px 21px 10px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.Grayscale_10};
  margin-bottom: 13px;
`;
const TextContainer = styled.View`
  gap: 22px;
  width: 200px;
`;
const Title = styled(fonts.Body2M)`
  font-weight: 500;
`;

const LetterInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImg = styled.Image`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-right: 6px;
`;
const EditorName = styled(fonts.Caption1)`
  font-weight: 500;
  margin-right: 6px;
`;

const BlueCheckImg = styled.Image`
  width: 14px;
  height: 14px;
  margin-right: 15px;
`;

const Circle = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2px;
  background-color: #a0a0a0;
  margin-right: 5px;
`;

const ElapsedTime = styled(fonts.Caption1)`
  color: ${colors.Grayscale_100};
  font-weight: 500;
`;

const LetterImg = styled.Image`
  width: 82px;
  height: 82px;
  border-radius: 12px;
`;

const DATA = [
  {
    title: "중국 경제 둔화, 우리가 어떻게 대응해야 할까?",
    editor: "청경채",
    elapsedTime: "3분 전",
    uploadDate: "2024-11-24",
  },
  {
    title: "AI 열풍 속 관심 가질만 한 주식을 모아봤어요.",
    editor: "농부사자",
    elapsedTime: "1시간 전",
    uploadDate: "2024-11-24",
  },
  {
    title: "2025년, 내 돈 어떻게 굴릴까?",
    editor: "부자사자",
    elapsedTime: "1시간 전",
    uploadDate: "2024-11-24",
  },
  {
    title: "테스트에욥. 나는 낭만 고양이 생선을 좋아하죠",
    editor: "낭만고양이",
    elapsedTime: "5시간 전",
    uploadDate: "2024-11-24",
  },
];

function ArrivedLetterList({ onOpenModal }) {
  const navigation = useNavigation();
  const [fetchedData, setFetchedData] = useState([]);
  const token = useRecoilValue(authToken);

  const getArrivedList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/economy-letter/normal`);
      console.log("도착한 경제레터 조회 api: ", res.data);
      setFetchedData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArrivedList();
  }, []);

  const profileList = [
    profile_1,
    profile_2,
    profile_3,
    profile_4,
    profile_1,
    profile_3,
  ];
  const articleList = [
    article_1,
    article_2,
    article_3,
    article_1,
    article_2,
    article_3,
  ];

  const renderItem = ({ item, index }) => {
    return (
      <LetterBoxContainer key={index} onPress={() => onOpenModal()}>
        <TextContainer>
          <Title>{item.title}</Title>
          <LetterInfoContainer>
            <ProfileImg source={profileList[index]} />
            <EditorName>{item.editor}</EditorName>
            <BlueCheckImg source={BlueCheck} />
            <Circle />
            <ElapsedTime>{item.elapsedTime}</ElapsedTime>
          </LetterInfoContainer>
        </TextContainer>
        <LetterImg source={articleList[index]} />
      </LetterBoxContainer>
    );
  };

  return (
    <FlatList style={styles.List} data={fetchedData} renderItem={renderItem} />
  );
}

export default ArrivedLetterList;

const styles = StyleSheet.create({
  List: { width: "100%", height: 330 },
});
