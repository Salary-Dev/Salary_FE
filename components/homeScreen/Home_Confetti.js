import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Home_Confetti = ({ isVisible, onFinish }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (isVisible && animationRef.current) {
      console.log("Playing animation via ref...");
      setTimeout(() => {
        animationRef.current?.reset(); // 초기화
        animationRef.current?.play(); // 재생
      }, 100); // 렌더링 완료 후 실행
    }
  }, [isVisible]);

  return (
    <View
      style={[styles.overlay, { display: isVisible ? "flex" : "none" }]}
      pointerEvents="none"
    >
      <LottieView
        ref={animationRef}
        source={require("../../assets/animations/Confetti.json")}
        loop={false}
        onAnimationFinish={() => {
          console.log("Animation fnished");
        }}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1000, // 최상위
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default Home_Confetti;
