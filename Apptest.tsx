import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import PropertyForm from "./src/components/PropertyForm";
import PropertyCard from "./src/components/PropertyCard";
import BottomNav from "./src/components/BottomNav";
import styles from "./src/components/styles";
import { Property } from "./src/structures/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import { db } from "./src/config/firebaseConfig"; // Adjust if needed

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CachedUser = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  profilePic?: string;
  dateJoined?: string;
};

const PropertiesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [currentUser, setCurrentUser] = useState<CachedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user from AsyncStorage
  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("currentUser");
      if (userJson) {
        const user: CachedUser = JSON.parse(userJson);
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      console.error("Failed to load current user:", error);
    }
    return null;
  };

  // Fetch properties for current user
  const fetchProperties = async (userId: string) => {
    try {
      setLoading(true);
      const propertiesRef = collection(db, "properties");
      const q = query(propertiesRef, where("owner.id", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedProperties: Property[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Property, "id">;
        const propertyWithId: Property = {
          id: docSnap.id,
          ...data,
        };
        fetchedProperties.push(propertyWithId);
      });
      setProperties(fetchedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const user = await loadCurrentUser();
      if (user?.id) {
        await fetchProperties(user.id);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  // Add or update property handler
  const handleAddOrUpdateProperty = async (newProperty: Property) => {
    // Save/update to Firestore
    try {
      setLoading(true);
      const propertiesRef = collection(db, "properties");
      const existingIndex = properties.findIndex(
        (p) => p.id === newProperty.id
      );

      if (existingIndex !== -1) {
        // Update existing document
        const docRef = doc(db, "properties", newProperty.id);
        await updateDoc(docRef, newProperty);
      } else {
        // Add new document
        const propertiesRef = collection(db, "properties");
        const docRef = doc(propertiesRef); // generates new doc ref with id
        newProperty.id = docRef.id;
        await setDoc(docRef, newProperty);
      }

      // Refresh list
      if (currentUser?.id) await fetchProperties(currentUser.id);
    } catch (error) {
      Alert.alert("Error", "Failed to save property.");
      console.error("Error saving property:", error);
    } finally {
      setLoading(false);
      setShowForm(false);
      setPropertyToEdit(null);
    }
  };

  // Delete property handler
  const handleDeleteProperty = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this property?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const docRef = doc(db, "properties", id);
            await deleteDoc(docRef);
            if (currentUser?.id) await fetchProperties(currentUser.id);
          } catch (error) {
            Alert.alert("Error", "Failed to delete property.");
            console.error("Error deleting property:", error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEditProperty = (property: Property) => {
    setPropertyToEdit(property);
    setShowForm(true);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#64FFDA" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#12181F", "#12181F"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>PropFlow</Text>
            <Text style={styles.headerSubtitle}>Your smart property hub</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={["#64FFDA", "#74b9ff"]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>
                {currentUser?.name?.[0].toUpperCase() || "E"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.addPropertySection}>
          <TouchableOpacity
            style={styles.futuristicButton}
            onPress={() => setShowForm(true)}
          >
            <LinearGradient
              colors={["#64FFDA", "#74b9ff"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>+ Add Property</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showForm && (
          <PropertyForm
            propertyToEdit={propertyToEdit}
            onSubmit={handleAddOrUpdateProperty}
            onCancel={() => {
              setShowForm(false);
              setPropertyToEdit(null);
            }}
          />
        )}

        <View style={styles.propertiesSection}>
          <View style={styles.propertiesHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Listed Properties</Text>
            </View>
          </View>

          {properties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={["#64FFDA", "#74b9ff"]}
                style={styles.emptyGradient}
              >
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyText}>No properties added yet.</Text>
                <Text style={styles.emptySubtext}>
                  Tap + Add Property to get started.
                </Text>
              </LinearGradient>
            </View>
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PropertyCard
                  property={item}
                  onDelete={() => handleDeleteProperty(item.id)}
                  onEdit={() => handleEditProperty(item)}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.floatingNavContainer}>
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
};

export default PropertiesScreen;
