import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import styled from "styled-components";
import articleArrow from "../../assets/img/homeScreen/articleArrow.png";
import axios from "axios";
import {
  BASE_URL,
  BUCKET_NAME,
  BUCKET_REGION,
  S3_ACCESSKEY,
  S3_SECRETKEY,
} from "@env";
import { useEffect, useState } from "react";
import { authToken } from "../../Recoil/authToken";
import { useRecoilValue } from "recoil";
import { useFocusEffect } from "@react-navigation/native";

function Home_Article_List({ handleDoneTodayArticle }) {
  const [fetchedData, setFetchedData] = useState([]);
  const [isArticleWatched, setIsArticleWatched] = useState(false);
  const token = useRecoilValue(authToken);
  const [mergedArray, setMergedArray] = useState([]);

  const aiImgList = [
    "DALL·E 2024-11-26 15.43.07 - A professional and visually appealing image representing finance, featuring a modern office desk setup with a laptop displaying stock market charts, a.webp",
    "DALL·E 2024-11-26 15.43.11 - A creative and visually appealing image illustrating the concept of 'economy,' featuring symbols like a globe, currency signs (dollar, euro, yen), gra.webp",
    "DALL·E 2024-11-26 15.43.33 - A dynamic and visually striking image representing the stock market, featuring a trading desk with multiple monitors displaying live stock market char.webp",
    "DALL·E 2024-11-26 15.43.57 - A visually captivating and creative image representing the concept of money, featuring a dynamic composition with floating coins, banknotes, and digit.webp",
    "DALL·E 2024-11-26 15.46.02 - An impactful image representing political economy, featuring a government building or parliament silhouette with financial graphs overlaying the struc.webp",
    "DALL·E 2024-11-26 15.46.52 - A visually engaging image representing consumer behavior, featuring a shopping cart filled with colorful products, digital payment icons (credit card,.webp",
    "DALL·E 2024-11-26 15.52.20 - A sleek and professional image representing a corporate setting, featuring a high-rise office building with glass windows reflecting a city skyline. I.webp",
    "DALL·E 2024-11-26 15.53.39 - A modern and vibrant image representing the concept of mobile technology, featuring a smartphone with a glowing screen displaying app icons and a digi.webp",
    "DALL·E 2024-11-26 15.55.18 - An eye-catching and dynamic image representing the concept of hot issues, featuring bold headlines on a digital news interface displayed on a tablet. .webp",
    "DALL·E 2024-11-26 15.55.55 - A sophisticated and dynamic image representing the concept of celebrities, featuring a red carpet event with bright camera flashes, a blurred silhouet.webp",
  ];

  function replaceHtmlEntities(input) {
    // Replace &quot; with "
    return input.replace(/&quot;/g, '"');
  }

  const getNewsData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/shorts`);
      setFetchedData(res.data);
    } catch (error) {
      console.log("뉴스 불러오는 중 나타난 에러: ", error);
    }
  };
  useEffect(() => {
    getNewsData();
  }, []);

  // 뉴스 사진 관리
  useEffect(() => {
    if (fetchedData.length > 0) {
      // 뉴스 데이터에 AI 이미지 추가하기
      const AWS = require("aws-sdk");
      const s3 = new AWS.S3({
        region: BUCKET_REGION,
        accessKeyId: S3_ACCESSKEY,
        secretAccessKey: S3_SECRETKEY,
      });

      const imageUrlList = [];
      aiImgList.forEach((element, index) => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: element,
          Expires: 3600,
        };

        imageUrlList[index] = { source: s3.getSignedUrl("getObject", params) };
      });
      const updatedData = fetchedData.map((item, index) => ({
        ...item,
        ...imageUrlList[index],
      }));
      setMergedArray(updatedData);
    }
  }, [fetchedData]);

  const handlePress = async (url) => {
    console.log(url);
    Alert.alert(
      "URL 이동 확인", // 제목
      `다음 URL로 이동하시겠습니까?\n\n${url}`, // 메시지
      [
        {
          text: "취소",
          style: "cancel", // 취소 버튼
        },
        {
          text: "확인", // 확인 버튼
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
                if (!isArticleWatched) {
                  handleDoneTodayArticle();
                  setIsArticleWatched(true);
                }
              } else {
                Alert.alert(`이 URL을 열 수 없습니다. ${url}`);
              }
            } catch (error) {
              Alert.alert("에러 발생: ", error.toString());
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  useEffect(() => {
    const sendData = async () => {
      const res = await axios.post(
        `${BASE_URL}/shorts/update-status`,
        { params: { article: isArticleWatched } },
        { headers: { Authorization: token } }
      );
      console.log("아티클 학습 여부 전달: ", res.data);
    };
    if (isArticleWatched) {
      sendData();
    }
  }, [isArticleWatched]);

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handlePress(item.url)}>
      <ImageBackground
        source={{ uri: item.source }} // S3에서 이미지 받아오기
        style={styles.item}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />
        <Image source={articleArrow} style={styles.iconImage}></Image>
        <Text style={styles.title}>{replaceHtmlEntities(item.title)}</Text>
      </ImageBackground>
    </Pressable>
  );

  return (
    <FlatList
      data={mergedArray}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      horizontal={true} // 가로 스크롤을 위해 horizontal 속성을 true로 설정
      showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
      contentContainerStyle={styles.listContainer} // 리스트 전체 스타일 (선택 사항)
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  listContainer: {},
  item: {
    backgroundColor: "#f9c2ff",
    paddingLeft: 0,
    marginHorizontal: 8,
    borderRadius: 8,
    width: 132,
    height: 170,
    justifyContent: "space-between", // 하단 정렬을 위해 추가
    alignItems: "flex-end",
  },
  image: {
    borderRadius: 8, // 이미지 자체에 둥근 모서리를 적용
  },
  iconImage: {
    width: 8,
    height: 16,
    objectFit: "cover",
    marginRight: 15,
    marginTop: 12,
  },
  title: {
    width: "100%",
    padding: 8,
    paddingBottom: 0,
    fontSize: 12,
    color: "white",
    marginBottom: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 오버레이가 전체를 덮도록 설정
    backgroundColor: "rgba(0, 0, 0, 0.6)", // 검정색 0.6 opacity
    borderRadius: 8,
  },
  opacity: {
    paddingLeft: 0,
    marginHorizontal: 8,
    borderRadius: 8,
    width: 132,
    height: 170,
    position: "relative",
    backgroundColor: "rgba(18, 18, 18, 0.6)",
  },
});

export default Home_Article_List;
