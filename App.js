import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import { RecoilRoot } from "recoil";
import arrowImg from "./assets/img/signUpScreen/ArrowBtn.png";
import { useNavigation } from "@react-navigation/native";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const tabScreensProps = [
  {
    screenName: "Home",
    title: "홈",
    iconTitle: "home",
    screen: HomeScreen,
  },
  {
    screenName: "VocabularySearch",
    title: "단어 검색",
    iconTitle: "search",
    screen: VocaSearchScreen,
  },
  {
    screenName: "VocabularyList",
    title: "단어장",
    iconTitle: "bookmark",
    screen: VocaListScreen,
  },
  {
    screenName: "MyPage",
    title: "마이페이지",
    iconTitle: "person",
    screen: MyPageScreen,
  },
];

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      {tabScreensProps.map((item) => (
        <BottomTab.Screen
          key={item.screenName}
          name={item.screenName}
          component={item.screen}
          options={{
            title: item.title,
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "400",
            },
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name={item.iconTitle} color={color} size={size} />
              ) : (
                <Ionicons
                  name={`${item.iconTitle}-outline`}
                  color={color}
                  size={size}
                ></Ionicons>
              ),
            tabBarActiveTintColor: "#313131",
          }}
        />
      ))}
    </BottomTab.Navigator>
  );
}

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
      <Pressable onPress={() => navigation.goBack(-1)}>
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
              <Stack.Screen name="SignUp" options={{ headerShown: false }}>
                {({ navigation }) => (
                  <SignUpScreen onEnter={handleLogIn} navigation={navigation} />
                )}
              </Stack.Screen>
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
                  headerRight: () => <VocaReminder_HeaderRight />,
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
});
