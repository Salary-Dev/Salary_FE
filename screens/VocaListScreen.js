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
import styled from "styled-components";
import PrimaryBtn from "../common/PrimaryBtn";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons"; // 북마크
import VocaList_FlatListItem from "../components/vocaListScreen/VocaList_FlatListItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@env";
import { useRecoilValue } from "recoil";
import { isSavedSelector } from "../Recoil/todaySalaryContent";
import { Shadow } from "react-native-shadow-2";
import VocaReminder_Button from "../components/vocaListScreen/VocaReminder_Button";
import Info from "../assets/img/vocaListScreen/info.png";
import { authToken } from "../Recoil/authToken";
import { nicknameState } from "../Recoil/nicknameState";
import emptyBox from "../assets/img/vocaListScreen/emptyBox.png";

const TitleContainer = styled.View`
  width: 100%;
  padding: 30px;
  padding-bottom: 16px;
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
  gap: 4px;

  padding: 0px 15px 30px 15px;
`;

// * 전역상태 닉네임 받아와서 띄울 필요 있음
// 리마인드 클릭 상태에 따라 버튼 active, deactive 관리
function VocaListScreen() {
  // stack에 쌓여있던 VocaScreen이 focus되면 리렌더링되어 데이터를 알맞게 띄우도록 함
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [vocaList, setVocaList] = useState();
  // 토큰 추가
  const token = useRecoilValue(authToken);
  const nickname = useRecoilValue(nicknameState);

  async function getData() {
    try {
      const res = await axios.get(`${BASE_URL}/wordbook`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
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
        <TitleContainer>
          <fonts.H4SB style={{ color: "3a3a3a" }}>
            {nickname}의 단어장
          </fonts.H4SB>
          <fonts.Caption2 style={{ color: "3a3a3a" }}>
            저장한 단어들의 목록이에요. 다시 학습해보세요!
          </fonts.Caption2>
        </TitleContainer>
        <BtnContainer>
          <VocaReminder_Button
            type="preview"
            state={vocaList.length >= 10 ? "active" : "deactive"}
            text={"저장된 단어들로 리마인드 학습을 해볼까요?"}
            onClick={() => {
              if (vocaList.length >= 10) navigation.navigate("VocaReminder");
            }}
          />
          {vocaList.length < 10 && (
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Image
                source={Info}
                style={{ objectFit: "cover", width: 11, height: 11.5 }}
              />
              <fonts.Caption2
                style={{ textAlign: "center", color: colors.Grayscale_60 }}
              >
                단어를 10개 이상 저장해야 리마인드를 진행할 수 있어요.
              </fonts.Caption2>
            </View>
          )}
        </BtnContainer>
        <FlatListContainer>
          <FlatList
            data={vocaList}
            renderItem={({ item }) => <VocaList_FlatListItem {...item} />}
            keyExtractor={(item) => item.word_id}
            ListEmptyComponent={
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%", // 여백 높이를 전부 차지
                  gap: 10,
                }}
              >
                <Image
                  style={{ width: 44, height: 44 }}
                  source={emptyBox}
                ></Image>
                <fonts.Caption2 style={{ color: colors.Grayscale_40 }}>
                  아직 저장된 단어가 없어요.
                </fonts.Caption2>
              </View>
            }
          />
        </FlatListContainer>
        <Shadow
          distance={100}
          startColor="rgba(255,255,255,1)"
          endColor="rgba(255,255,255,0)"
          offset={[0, 0]}
          style={{ width: "100%" }}
        ></Shadow>
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
