import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Home_Confetti = ({ isVisible, onFinish }) => {
  const animationRef = useRef(null);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <LottieView
        ref={animationRef}
        source={require("../../assets/animations/Confetti.json")}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
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
    width: 600,
    height: 450,
  },
});

export default Home_Confetti;
