import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

interface Props {
  navigation: any;
}

const BottomNav: React.FC<Props> = ({ navigation }) => (
  <View style={styles.floatingNavContainer}>
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Ionicons name="home" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("AppHome")}
      >
        <Ionicons name="business" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="heart-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="location-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="person-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
);

export default BottomNav;
