import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../config/firebaseConfig";
import styles from "./styles";
import { Property, CachedUser } from "../structures/types";
import {
  availableAmenities,
  propertyTypes,
} from "../structures/datastructures";
import AddressPicker from "../structures/AddressPicker";

type PropertyFormProps = {
  propertyToEdit?: Property | null;
  onSubmit: (property: Property) => void;
  onCancel?: () => void;
};

const PropertyForm = ({
  propertyToEdit,
  onCancel,
  onSubmit,
}: PropertyFormProps) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [yearBuilt, setYearBuilt] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState(propertyTypes[0].value);
  const [saving, setSaving] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<CachedUser | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("currentUser");
        if (userJson) {
          const user: CachedUser = JSON.parse(userJson);
          setCurrentOwner(user);
        }
      } catch (error) {
        console.error("Failed to load current user", error);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setAddress(propertyToEdit.address);
      setLatitude(propertyToEdit.latitude);
      setLongitude(propertyToEdit.longitude);
      setPrice(propertyToEdit.price.toString());
      setDescription(propertyToEdit.description);
      setImageUrls(propertyToEdit.imageUrls || []);
      setAmenities(propertyToEdit.amenities || []);
      setYearBuilt(propertyToEdit.yearBuilt?.toString() || "");
      setBedrooms(propertyToEdit.bedrooms?.toString() || "");
      setBathrooms(propertyToEdit.bathrooms?.toString() || "");
      setArea(propertyToEdit.area?.toString() || "");
      setType(propertyToEdit.type || propertyTypes[0].value);
    }
  }, [propertyToEdit]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow gallery access.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setImageUrls((prev) => [...prev, ...uris]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearForm = () => {
    setTitle("");
    setAddress("");
    setLatitude(0);
    setLongitude(0);
    setPrice("");
    setDescription("");
    setImageUrls([]);
    setAmenities([]);
    setYearBuilt("");
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setType(propertyTypes[0].value);
  };

  const handleSubmit = async () => {
    if (!title || !address || !price) {
      Alert.alert("Missing fields", "Fill in Title, Address & Price.");
      return;
    }

    if (!currentOwner) {
      Alert.alert("User info missing", "Unable to find current user info.");
      return;
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      title,
      address,
      latitude,
      longitude,
      price: parseFloat(price),
      description,
      imageUrls,
      amenities,
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      area: area ? parseInt(area) : undefined,
      type,
      dateAdded: new Date(),
      owner: {
        id: currentOwner.id,
        name: currentOwner.name || "",
        phone: currentOwner.phone ?? undefined,

        email: currentOwner.email ?? undefined,
      },
    };

    try {
      setSaving(true);
      await addDoc(collection(db, "properties"), newProperty);
      Alert.alert("Success", "Property saved.");
      clearForm();
      onSubmit && onSubmit(newProperty);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <TextInput
        label="🏷️ Title"
        value={title}
        onChangeText={setTitle}
        style={styles.futuristicInput}
        mode="outlined"
      />

      <AddressPicker
        initialAddress={address}
        onLocationSelect={(selected, lat, lng) => {
          setAddress(selected);
          setLatitude(lat || 0);
          setLongitude(lng || 0);
        }}
      />

      <TextInput
        label="💰 Price (ZAR)"
        value={price}
        onChangeText={setPrice}
        style={styles.futuristicInput}
        keyboardType="numeric"
        mode="outlined"
      />

      <TextInput
        label="📝 Description"
        value={description}
        onChangeText={setDescription}
        style={styles.futuristicInput}
        multiline
        mode="outlined"
      />

      <View style={styles.dropdown}>
        {propertyTypes.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setType(item.value)}
            style={[
              styles.dropdownItem,
              type === item.value && styles.selectedDropdownItem,
            ]}
          >
            <Text
              style={[
                styles.dropdownText,
                type === item.value && styles.selectedDropdownText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formRow}>
        <TextInput
          label="🛏 Bedrooms"
          value={bedrooms}
          onChangeText={setBedrooms}
          style={styles.formColumn}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="🛁 Bathrooms"
          value={bathrooms}
          onChangeText={setBathrooms}
          style={styles.formColumn}
          keyboardType="numeric"
          mode="outlined"
        />
      </View>

      <TextInput
        label="📐 Area (sqm)"
        value={area}
        onChangeText={setArea}
        style={styles.futuristicInput}
        keyboardType="numeric"
        mode="outlined"
      />

      <TextInput
        label="🏗️ Year Built"
        value={yearBuilt}
        onChangeText={setYearBuilt}
        style={styles.futuristicInput}
        keyboardType="numeric"
        mode="outlined"
      />

      <View style={styles.amenitiesContainer}>
        <Text style={styles.amenitiesLabel}>Amenities</Text>
        <FlatList
          data={availableAmenities}
          horizontal
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const selected = amenities.includes(item.value);
            return (
              <TouchableOpacity
                onPress={() => toggleAmenity(item.value)}
                style={[
                  styles.amenityChip,
                  {
                    backgroundColor: selected
                      ? "#4a90e2"
                      : "rgba(74,144,226,0.1)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.amenityText,
                    { color: selected ? "#fff" : "#4a90e2" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <LinearGradient
          colors={["#4a90e2", "#74b9ff"]}
          style={styles.imageButtonGradient}
        >
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.imageButtonText}>Add Images</Text>
        </LinearGradient>
      </TouchableOpacity>

      <FlatList
        data={imageUrls}
        horizontal
        keyExtractor={(uri) => uri}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.propertyImage} />
        )}
        style={{ marginTop: 10 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSubmit}
        disabled={saving}
      >
        <LinearGradient
          colors={["#4a90e2", "#74b9ff"]}
          style={styles.addButtonGradient}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>
              {propertyToEdit ? "Update Property" : "Add Property"}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PropertyForm;
