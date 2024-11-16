import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 폰트 불러오는 로직 추가
  // 폰트 안 불러와졌으면 loading을 해야되는데 Splash랑 충돌날까봐 일단 뺌
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("./assets/font/fonts/Pretendard-Bold.ttf"),
    "Pretendard-SemiBold": require("./assets/font/fonts/Pretendard-SemiBold.ttf"),
    "Pretendard-Medium": require("./assets/font/fonts/Pretendard-Medium.ttf"),
  });

  function handleLogIn() {
    setIsLoggedIn(true);
    console.log("메인으로 갑니다");
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
          screenOptions={{
            headerBackTitleVisible: false,
            headerBackTitleStyle: { fontSize: 1 },
          }}
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
});
