import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const houseAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(houseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const PlayButton = () => (
    <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
      <View style={styles.playButtonInner}>
        <View style={styles.playTriangle} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background - Simple colored background */}
      <View style={styles.background} />

      {/* Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Main Heading */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.mainTitle}>Find Your Dream</Text>
          <Text style={[styles.mainTitle, styles.secondLine]}>Home Easily</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Your journey to find the perfect home{"\n"}starts here. Discover
          properties that{"\n"}match your dreams.
        </Animated.Text>

        {/* House Image Container */}
        <Animated.View
          style={[
            styles.houseContainer,
            {
              opacity: houseAnim,
              transform: [
                {
                  translateY: houseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                { scale: houseAnim },
              ],
            },
          ]}
        >
          {/* Replace this with your PNG image */}
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/staynova-fea5c.firebasestorage.app/o/logoRE.png?alt=media&token=4a27d695-ac2c-40a9-86f2-02b91e424b67",
            }}
            style={styles.houseImage}
            resizeMode="contain"
          />

          {/* If you don't have the image yet, uncomment this placeholder */}
          {/* 
          <View style={styles.housePlaceholder}>
            <Text style={styles.placeholderText}>🏠 House Image Here</Text>
          </View>
          */}
        </Animated.View>

        {/* Play Button */}
        <Animated.View
          style={[
            styles.playButtonContainer,
            {
              opacity: houseAnim,
              transform: [{ scale: houseAnim }],
            },
          ]}
        >
          <PlayButton />
        </Animated.View>
      </Animated.View>

      {/* Bottom Section */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>

      {/* Floating Decorative Elements */}
      <View style={styles.floatingDot1} />
      <View style={styles.floatingDot2} />
      <View style={styles.floatingDot3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#38B2AC", // Solid teal color
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: width > 375 ? 42 : 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: width > 375 ? 50 : 44,
  },
  secondLine: {
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  houseContainer: {
    width: width * 0.8,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  houseImage: {
    width: "100%",
    height: "100%",
  },
  // Placeholder for when you don't have the image yet
  housePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 18,
    fontWeight: "600",
  },
  playButtonContainer: {
    marginBottom: 40,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonInner: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "#FFFFFF",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 3,
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#319795",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Floating decorative elements
  floatingDot1: {
    position: "absolute",
    top: 100,
    left: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  floatingDot2: {
    position: "absolute",
    top: 150,
    right: 50,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  floatingDot3: {
    position: "absolute",
    bottom: 200,
    left: 40,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
});

export default WelcomeScreen;
