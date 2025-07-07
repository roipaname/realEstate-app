import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcomeScreen";
import PropertiesScreen from "../../Apptest";
import SignInScreen from "../screens/SignIn";
import RegisterScreen from "../screens/RegisterScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import HomeScreen from "../screens/HomeScreen";

export type RootStackParamList = {
  Welcome: undefined;
  PropertiesScreen: undefined;
  SignIn: undefined;
  Register: undefined;
  AuthLoading: undefined;
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PropertiesScreen" component={PropertiesScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
