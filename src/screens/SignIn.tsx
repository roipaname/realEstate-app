import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

const { width } = Dimensions.get("window");
const db = getFirestore();

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      // Query Firestore for matching email & password
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User found
        const userData = querySnapshot.docs[0].data();

        // Prepare user object to store locally (pick needed fields)
        const userToCache = {
          id: querySnapshot.docs[0].id,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "",
          profilePic: userData.profilePic || "",
          dateJoined: userData.dateJoined || new Date().toISOString(),
        };

        // Store user data locally as JSON string
        await AsyncStorage.setItem("currentUser", JSON.stringify(userToCache));

        console.log("User cached locally:", userToCache);

        navigation.navigate("AppHome");
      } else {
        Alert.alert("Invalid Credentials", "Email or password is incorrect.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#A0AEC0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#A0AEC0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.signInButton}
        activeOpacity={0.9}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Small Register Button */}
      <TouchableOpacity
        style={styles.registerLinkContainer}
        onPress={() => navigation.navigate("Register")}
        activeOpacity={0.7}
      >
        <Text style={styles.registerLinkText}>No account? Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>← Back to Welcome</Text>
      </TouchableOpacity>
    </View>
  );
}

// 📱 Matching styles to your Welcome screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38B2AC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: width > 375 ? 42 : 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  registerLinkContainer: {
    marginBottom: 20,
  },

  registerLinkText: {
    color: "#A0AEC0",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  signInButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#319795",
    fontSize: 18,
    fontWeight: "600",
  },
  backText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 20,
    fontSize: 16,
  },
});
