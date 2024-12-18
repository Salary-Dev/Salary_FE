import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import VocaSearchScreen from "./screens/VocaSearchScreen";
import VocaListScreen from "./screens/VocaListScreen";
import MyPageScreen from "./screens/MyPageScreen";
import TodaySalaryEduScreen from "./screens/TodaySalaryEduScreen";
import TodaySalaryQuizScreen from "./screens/TodaySalaryQuizScreen";
import TodayTrendQuizScreen from "./screens/TodayTrendQuizScreen";
import TodayTrendSolutionScreen from "./screens/TodayTrendSolutionScreen";
import SignUpScreen from "./screens/SignUpScreen";

import { useFonts } from "expo-font";
import colors from "./styles/colors";
import fonts from "./styles/fonts";
import VocaReminderScreen from "./screens/VocaReminderScreen";
import VocaReminder_HeaderRight from "./components/vocaListScreen/VocaReminder_HeaderRight";
import VocaSearchResultScreen from "./screens/VocaSearchResultScreen";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import arrowImg from "./assets/img/signUpScreen/ArrowBtn.png";
import { useNavigation } from "@react-navigation/native";
import MyPageSeedChargeScreen from "./screens/MyPageSeedChargeScreen";
import MyPageSeedHistoryScreen from "./screens/MyPageSeedHistoryScreen";
import MyPageNicknameChangeScreen from "./screens/MyPageNicknameChangeScreen";
import HeaderLeftBtn from "./common/HeaderLftBtn";
import { authToken } from "./Recoil/authToken";
import NewsLetterMainScreen from "./screens/NewsLetterMainScreen";
import NewsLetterArticleScreen from "./screens/NewsLetterArticleScreen";
import CustomDrawer from "./components/NewsLetterMainScreen/CustomDrawer";
import "./gesture-handler";
import NavLetterActiveIcn from "./assets/img/nav/Nav_LetterActive.png";
import NavLetterIcn from "./assets/img/nav/Nav_Letter.png";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '876108588654-js1ul4fdeveqoqkdakn6osv1jr0v1k2q.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  };

  useEffect(() => {
    configGoogleSignIn(); // will execute everytime the component mounts
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      console.log('GoogleSignin,signIn 함수의 리턴값', res);
      // 지속적인 테스트를 위한 로그아웃 및 캐시 삭제 로직
      // await GoogleSignin.signOut();
      // await GoogleSignin.clearCachedAccessToken();
      // 현재는 res 파일이 존재하는지의 여부로 메인페이지로의 전환을 하는데 
      // 백엔드 개발이 완료되면 api 연동 추가해야 함
      if (res) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error('User Sign In is required');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error('Google Play Services are needed');
          break;
      }
      console.log('Error', error.code);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const HeaderButton = () => {
    const navigation = useNavigation();

    return (
      <Pressable onPress={() => navigation.goBack(-1)} style={styles.ArrowBtnImgWrapper}>
        <Image source={arrowImg} style={styles.ArrowBtnImg} />
      </Pressable>
    );
  };

  // 폰트 불러오는 로직 추가
  // 폰트 안 불러와졌으면 loading을 해야되는데 Splash랑 충돌날까봐 일단 뺌
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("./assets/font/fonts/Pretendard-Bold.ttf"),
    "Pretendard-SemiBold": require("./assets/font/fonts/Pretendard-SemiBold.ttf"),
    "Pretendard-Medium": require("./assets/font/fonts/Pretendard-Medium.ttf"),
  });

  function handleLogIn() {
    signIn();
    console.log(authToken);
  }

  function handleLogOut() {
    setIsLoggedIn(false);
    console.log("로그인창으로 돌아갑니다");
  }

  function BottomTabNavigator() {
    const navigation = useNavigation(); // 컴포넌트 내부에서 호출
    const [isCenterButtonActive, setIsCenterButtonActive] = useState(false);

    const handleCenterButtonPress = () => {
      // 중앙 버튼 활성화
      setIsCenterButtonActive(true);
      navigation.navigate("NewsLetterMain"); // 중앙 버튼 화면으로 이동
    };

    return (
      <BottomTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#f3f4f6",
            paddingTop: 5,
          },
        }}
      >
        {/* 1. 홈 */}
        <BottomTab.Screen
          name="Home"
          options={{
            title: "홈",
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name={"home"} color={color} size={size} />
              ) : (
                <Ionicons
                  name={`${"home"}-outline`}
                  color={color}
                  size={size}
                />
              ),
            tabBarActiveTintColor: "#313131",
          }}
        >
          {({ navigation }) => <HomeScreen />}
        </BottomTab.Screen>
        {/* 2. 단어 검색 */}
        <BottomTab.Screen
          name="VocabularySearch"
          options={{
            title: "단어 검색",
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name={"search"} color={color} size={size} />
              ) : (
                <Ionicons
                  name={`${"search"}-outline`}
                  color={color}
                  size={size}
                />
              ),
            tabBarActiveTintColor: "#313131",
          }}
        >
          {({ navigation }) => <VocaSearchScreen />}
        </BottomTab.Screen>
        {/* 3.뉴스 레터 */}
        <BottomTab.Screen
          name="NewsLetter"
          component={NewsLetterMainScreen}
          options={{
            title: "뉴스 레터",
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused }) => (
              <View style={styles.centerButtonContainer}>
                <Image
                  source={focused ? NavLetterActiveIcn : NavLetterIcn}
                  style={styles.centerButtonIcon}
                />
              </View>
            ),
            tabBarActiveTintColor: "#313131",
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // 기본 탭 동작 차단
              navigation.navigate("NewsLetter"); // 커스텀 네비게이션 실행
            },
          })}
        />
        {/* 4. 단어장 */}
        <BottomTab.Screen
          name="VocabularyList"
          options={{
            title: "단어장",
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name={"bookmark"} color={color} size={size} />
              ) : (
                <Ionicons
                  name={`${"bookmark"}-outline`}
                  color={color}
                  size={size}
                />
              ),
            tabBarActiveTintColor: "#313131",
          }}
        >
          {({ navigation }) => <VocaListScreen />}
        </BottomTab.Screen>
        {/* 5. 마이페이지 */}
        <BottomTab.Screen
          name="MyPage"
          options={{
            title: "마이페이지",
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name={"person"} color={color} size={size} />
              ) : (
                <Ionicons
                  name={`${"person"}-outline`}
                  color={color}
                  size={size}
                />
              ),
            tabBarActiveTintColor: "#313131",
          }}
        >
          {({ navigation }) => (
            <MyPageScreen navigation={navigation} onLogOut={handleLogOut} />
          )}
        </BottomTab.Screen>
      </BottomTab.Navigator>
    );
  }

  function DrawerNavigator({ route }) {
    const editor = route.params.editor;
    const articleList = [
      "돈은 어떻게 흐르는가?",
      "경제 위기, 우리가 할 수 있는 일",
      "투자 시작은 언제가 좋을까?",
      "투자 시작은 언제가 좋을 까? (2)",
      "내일의 경제를 읽는 법",
    ];
    
    console.log("DrawerNavigator에서 params: ", route.params);

    return (
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawer {...props} editor={editor} articleList={articleList} />
        )}
        defaultStatus="closed"
        screenOptions={{
          drawerPosition: "right",
          drawerStyle: { width: 320 },
          headerShown: false,
          drawerType: "front",
        }}
      >
        {articleList.map((item, index) => (
          <Drawer.Screen
            key={index}
            name={item}
            component={NewsLetterArticleScreen}
            initialParams={{
              editor,
              uploadDate: route.params.uploadDate.slice(0,10),
              title: route.params.title,
              body: route.params.body
            }}
            options={{
              headerTitle: "경제레터",
              headerStyle: {
                backgroundColor: colors.bg,
              },
              headerTintColor: colors.Grayscale_100,
              headerTitleStyle: {
                fontFamily: "Pretendard-Medium",
              },
              headerShown: true,
              headerBackgroundColor: colors.bg,
              headerBackTitleVisible: false,
              headerLeft: () => <HeaderButton />,
            }}
          />
        ))}
      </Drawer.Navigator>
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
        // screenOptions={{
        //   headerShown: false,
        // }}
        >
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="SignIn" options={{ headerShown: false }}>
                {({ navigation }) => (
                  <SignInScreen onEnter={handleLogIn} navigation={navigation} />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="BottomTab"
                component={BottomTabNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="TodaySalaryQuiz"
                component={TodaySalaryQuizScreen}
                options={{
                  title: "오늘의 샐러리 한조각 QUIZ",
                  headerStyle: {
                    backgroundColor: colors.bg,
                  },
                  headerTintColor: colors.Grayscale_100,
                  headerTitleStyle: {
                    fontFamily: "Pretendard-Medium",
                  },
                  headerShown: true,
                  headerBackgroundColor: colors.bg,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderButton />,
                }}
              />
              <Stack.Screen
                name="TodaySalaryEdu"
                component={TodaySalaryEduScreen}
                options={{
                  headerTitle: "",
                  headerTintColor: colors.Grayscale_100,
                  headerShown: true,
                  headerBackTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderButton />,
                }}
              />
              <Stack.Screen
                name="TodayTrendQuiz"
                component={TodayTrendQuizScreen}
                options={{
                  headerTitle: "",
                  headerTintColor: colors.Grayscale_100,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderButton />,
                }}
              />
              <Stack.Screen
                name="VocaSearchResult"
                component={VocaSearchResultScreen}
                options={{
                  headerTitle: "",
                  headerTintColor: colors.Grayscale_100,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderButton />,
                }}
              />
              <Stack.Screen
                name="TodayTrendSolution"
                component={TodayTrendSolutionScreen}
                options={{
                  headerTitle: "",
                  headerTintColor: colors.Grayscale_100,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderButton />,
                }}
              />
              <Stack.Screen
                name="VocaReminder"
                component={VocaReminderScreen}
                options={{
                  headerTitle: "단어 리마인드",
                  headerTintColor: colors.Grayscale_100,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderLeftBtn theme="light" />,
                  headerRight: () => <VocaReminder_HeaderRight />,
                }}
              />
              <Stack.Screen
                name="SeedCharge"
                component={MyPageSeedChargeScreen}
                options={{
                  headerTitle: "시드 충전소",
                  headerTintColor: colors.Grayscale_20,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerStyle: {
                    backgroundColor: colors.Grayscale_90,
                  },
                  headerLeft: () => <HeaderLeftBtn theme="light" />,
                }}
              />
              <Stack.Screen
                name="SeedHistory"
                component={MyPageSeedHistoryScreen}
                options={{
                  headerTitle: "시드 내역",
                  headerTintColor: colors.Grayscale_20,
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerStyle: {
                    backgroundColor: colors.Grayscale_90,
                  },
                  headerLeft: () => <HeaderLeftBtn theme="light" />,
                }}
              />
              <Stack.Screen
                name="NicknameChange"
                component={MyPageNicknameChangeScreen}
                options={{
                  headerTitle: "",
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => <HeaderLeftBtn theme="dark" />,
                }}
              />
              <Stack.Screen
                name="NewsLetterMain"
                component={NewsLetterMainScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LetterDrawer"
                component={DrawerNavigator}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ArrowBtnImg: {
    resizeMode: "contain",
    width: 20,
    height: 20,
    transform: [{ scaleX: -1 }],
  },
  ArrowBtnImgWrapper: {
    
    padding: 10
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centerButtonContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 38, // 탭바 높이 조정
    elevation: 5, // 그림자 효과 (Android)
    shadowColor: "#000", // 그림자 효과 (iOS)
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  centerButtonIcon: {
    width: 70,
    height: 70,
  },
});
