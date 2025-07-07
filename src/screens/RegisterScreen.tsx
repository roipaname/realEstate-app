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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const { width } = Dimensions.get("window");
const db = getFirestore();

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      // Check if user with this email already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Account Exists", "A user with this email already exists.");
        return;
      }

      // Add new user document to 'users' collection with empty profilePic
      const docRef = await addDoc(usersRef, {
        name,
        email,
        password,
        phone,
        dateJoined: Timestamp.now(),
        role,
        profilePic: "",
      });

      const userData = {
        id: docRef.id,
        name,
        email,
        phone,
        role,
        profilePic: "",
        dateJoined: new Date().toISOString(),
      };

      // Save user locally to AsyncStorage as JSON string
      await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("AppHome");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#A0AEC0"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#A0AEC0"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* Role selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "buyer" ? styles.roleSelected : null,
            ]}
            onPress={() => setRole("buyer")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.roleText,
                role === "buyer" ? styles.roleTextSelected : null,
              ]}
            >
              Buyer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "seller" ? styles.roleSelected : null,
            ]}
            onPress={() => setRole("seller")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.roleText,
                role === "seller" ? styles.roleTextSelected : null,
              ]}
            >
              Seller
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.9}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles matching your app
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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    width: "100%",
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
  },
  roleSelected: {
    backgroundColor: "#FFFFFF",
  },
  roleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  roleTextSelected: {
    color: "#319795",
  },
  registerButton: {
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
  registerButtonText: {
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
