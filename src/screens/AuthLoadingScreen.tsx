import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type AuthLoadingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AuthLoading"
>;

export default function AuthLoadingScreen() {
  const navigation = useNavigation<AuthLoadingScreenNavigationProp>();

  useEffect(() => {
    const checkUser = async () => {
      const currentUserJSON = await AsyncStorage.getItem("currentUser");
      if (currentUserJSON) {
        // User cached, navigate to app main screen
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      } else {
        // No user found, go to welcome screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#319795" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38B2AC",
  },
});
