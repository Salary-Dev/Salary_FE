import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useEffect, useState } from "react";
import axios from "axios";
import Advertise from "../common/assets/avt.jpg";
import styled from "styled-components";
import PrimaryBtn from "../common/PrimaryBtn";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons"; // 북마크
import VocaList_FlatListItem from "../components/vocaListScreen/VocaList_FlatListItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@env";
import { useRecoilState } from "recoil";
import { isSavedSelector } from "../Recoil/todaySalaryContent";
import { Shadow } from "react-native-shadow-2";

const AdvertiseWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;
const AdvertiseImg = styled.Image`
  width: 334px;
  height: 71px;
  flex-shrink: 0;
  object-fit: cover;
`;

const TitleContainer = styled.View`
  width: 100%;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  gap: 14px;
`;

const FlatListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const BtnContainer = styled.View`
  display: flex;
  flex-direction: center;
  justify-content: center;
  gap: 8px;

  padding: 20px 30px;
`;

// * 전역상태 닉네임 받아와서 띄울 필요 있음
// 리마인드 클릭 상태에 따라 버튼 active, deactive 관리
function VocaListScreen() {
  // stack에 쌓여있던 VocaScreen이 focus되면 리렌더링되어 데이터를 알맞게 띄우도록 함
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [vocaList, setVocaList] = useState();

  async function getData() {
    try {
      const res = await axios.get(`${BASE_URL}/wordbook`);
      if (res.status === 200) {
        const orderedDate = res.data.sort(
          (a, b) => new Date(b.like_date) - new Date(a.like_date)
        );
        setVocaList(orderedDate);
      }
    } catch (error) {
      console.log("단어장 불러오기 오류", error);
    }
  }

  const nickname = "나야들기름";

  useEffect(() => {
    // focus가 다시 되었을 때에만 다시 단어장 데이터를 받아옴.
    if (isFocused) getData();
  }, [isFocused]);

  useEffect(() => {
    getData();
  }, []);

  if (vocaList)
    return (
      <View style={styles.rootScreen}>
        <StatusBar style="dark" />
        <AdvertiseWrapper>
          <AdvertiseImg source={Advertise} />
        </AdvertiseWrapper>
        <TitleContainer>
          <fonts.H4SB style={{ color: "3a3a3a" }}>
            {nickname}의 단어장
          </fonts.H4SB>
          <fonts.Caption2 style={{ color: "3a3a3a" }}>
            저장한 단어들의 목록이에요. 다시 학습해보세요!
          </fonts.Caption2>
        </TitleContainer>
        <FlatListContainer>
          <FlatList
            data={vocaList}
            renderItem={({ item }) => <VocaList_FlatListItem {...item} />}
            keyExtractor={(item) => item.word_id}
            ListEmptyComponent={
              <fonts.H2B style={{ textAlign: "center" }}>
                단어장에 단어를 추가해보세요!
              </fonts.H2B>
            }
          />
        </FlatListContainer>
        <Shadow
          distance={100}
          startColor="rgba(255,255,255,1)"
          endColor="rgba(255,255,255,0)"
          offset={[0, 0]}
          style={{ width: "100%" }}
        >
          <BtnContainer>
            <fonts.Caption2 style={{ textAlign: "center" }}>
              단어를 10개 이상 저장해야 리마인드를 진행할 수 있어요.
            </fonts.Caption2>
            <PrimaryBtn
              type={vocaList.length >= 10 ? "active" : "deactive"}
              text="단어 리마인드 하러 가기"
              onPress={() => {
                if (vocaList.length >= 10) navigation.navigate("VocaReminder");
              }}
            />
          </BtnContainer>
        </Shadow>
      </View>
    );
}

export default VocaListScreen;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.Grayscale_white,
    display: "flex",
    paddingTop: Constants.statusBarHeight, // IOS와 안드로이드 통일성을 위해 SafeAreaView 대신 marginBottom 사용
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
});
