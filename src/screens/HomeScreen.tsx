import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";

import { Property, RegionType, FilterType } from "../structures/types";

const { width } = Dimensions.get("window");

type HomeScreenScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenScreenNavigationProp>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filters, setFilters] = useState<FilterType>({
    type: "all",
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    maxBedrooms: 10,
  });

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const filterButtonScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (reverseGeocode.length > 0) {
        const rg = reverseGeocode[0];
        setRegion({
          city: rg.city ?? undefined,
          region: rg.region ?? undefined,
          country: rg.country ?? undefined,
        });

        const countryCurrencyMap: Record<string, string> = {
          US: "USD",
          ZA: "ZAR",
          GB: "GBP",
          DE: "EUR",
          FR: "EUR",
          IN: "INR",
          CA: "CAD",
          AU: "AUD",
        };
        const countryCode = rg.isoCountryCode || "US";
        setCurrency(countryCurrencyMap[countryCode] || "USD");
      }

      fetchProperties();
    })();
  }, []);

  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "properties"));
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const deg2rad = (deg: number) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const applyFilters = (properties: Property[]) => {
    return properties.filter((property) => {
      // Type filter
      if (filters.type !== "all" && property.type !== filters.type) {
        return false;
      }

      // Price filter
      if (
        property.price < filters.minPrice ||
        property.price > filters.maxPrice
      ) {
        return false;
      }

      // Bedrooms filter
      if (property.bedrooms) {
        if (
          property.bedrooms < filters.minBedrooms ||
          property.bedrooms > filters.maxBedrooms
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredProperties = applyFilters(
    properties.filter((property) => {
      const searchText = searchQuery.trim().toLowerCase();
      const titleLower = property.title.toLowerCase();
      const addressLower = property.address.toLowerCase();
      if (searchText === "") return true;
      if (
        !titleLower.includes(searchText) &&
        !addressLower.includes(searchText)
      )
        return false;
      const lat = Number(property.latitude);
      const lon = Number(property.longitude);
      if (location && !isNaN(lat) && !isNaN(lon)) {
        const distance = getDistanceFromLatLonInKm(
          location.latitude,
          location.longitude,
          lat,
          lon
        );
        return distance <= 20;
      }
      return true;
    })
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.trim().length > 0);
  };

  const handleSuggestionSelect = (selected: Property) => {
    setSearchQuery(selected.title);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleFilterPress = () => {
    Animated.sequence([
      Animated.timing(filterButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(filterButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setShowFilterModal(true);
  };

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setShowPropertyDetails(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      minPrice: 0,
      maxPrice: 10000000,
      minBedrooms: 0,
      maxBedrooms: 10,
    });
  };

  const renderPropertyDetailsModal = () => {
    if (!selectedProperty) return null;

    const images = selectedProperty.imageUrls;
    const currentImage = images[currentImageIndex];

    return (
      <Modal
        visible={showPropertyDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPropertyDetails(false)}
      >
        <View style={styles.propertyModalOverlay}>
          <View style={styles.propertyModalContent}>
            {/* Header */}
            <View style={styles.propertyModalHeader}>
              <TouchableOpacity onPress={() => setShowPropertyDetails(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.propertyModalScroll}>
              {/* Image Gallery */}
              <View style={styles.imageGallery}>
                <Image
                  source={{ uri: currentImage }}
                  style={styles.mainImage}
                />
                {images.length > 1 && (
                  <View style={styles.imageIndicators}>
                    {images.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setCurrentImageIndex(index)}
                        style={[
                          styles.imageIndicator,
                          currentImageIndex === index && styles.activeIndicator,
                        ]}
                      />
                    ))}
                  </View>
                )}
                {images.length > 1 && (
                  <View style={styles.imageNavigation}>
                    <TouchableOpacity
                      onPress={() =>
                        setCurrentImageIndex(
                          currentImageIndex > 0
                            ? currentImageIndex - 1
                            : images.length - 1
                        )
                      }
                      style={styles.navButton}
                    >
                      <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setCurrentImageIndex(
                          currentImageIndex < images.length - 1
                            ? currentImageIndex + 1
                            : 0
                        )
                      }
                      style={styles.navButton}
                    >
                      <Ionicons name="chevron-forward" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Property Info */}
              <View style={styles.propertyDetailsContainer}>
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyDetailTitle}>
                    {selectedProperty.title}
                  </Text>
                  <Text style={styles.propertyDetailPrice}>
                    {new Intl.NumberFormat("en", {
                      style: "currency",
                      currency,
                    }).format(selectedProperty.price)}
                  </Text>
                </View>

                <View style={styles.ratingSection}>
                  <View style={styles.starsContainer}>
                    {renderStars(selectedProperty.rating || 4)}
                  </View>
                  <Text style={styles.ratingText}>
                    {selectedProperty.rating || 4.0} (
                    {selectedProperty.reviews || 12} reviews)
                  </Text>
                </View>

                <Text style={styles.propertyAddress}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  {" " + selectedProperty.address}
                </Text>

                {/* Property Details */}
                <View style={styles.detailsRow}>
                  {selectedProperty.bedrooms && (
                    <View style={styles.detailBox}>
                      <Ionicons name="bed-outline" size={20} color="#007AFF" />
                      <Text style={styles.detailBoxText}>
                        {selectedProperty.bedrooms} Bedrooms
                      </Text>
                    </View>
                  )}
                  {selectedProperty.bathrooms && (
                    <View style={styles.detailBox}>
                      <Ionicons
                        name="water-outline"
                        size={20}
                        color="#007AFF"
                      />
                      <Text style={styles.detailBoxText}>
                        {selectedProperty.bathrooms} Bathrooms
                      </Text>
                    </View>
                  )}
                  {selectedProperty.area && (
                    <View style={styles.detailBox}>
                      <Ionicons
                        name="resize-outline"
                        size={20}
                        color="#007AFF"
                      />
                      <Text style={styles.detailBoxText}>
                        {selectedProperty.area} sqft
                      </Text>
                    </View>
                  )}
                  {selectedProperty.parking && (
                    <View style={styles.detailBox}>
                      <Ionicons name="car-outline" size={20} color="#007AFF" />
                      <Text style={styles.detailBoxText}>
                        {selectedProperty.parking} Parking
                      </Text>
                    </View>
                  )}
                </View>

                {/* Description */}
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedProperty.description ||
                      "Beautiful property with great amenities and modern features."}
                  </Text>
                </View>

                {/* Amenities */}
                {selectedProperty.amenities && (
                  <View style={styles.amenitiesSection}>
                    <Text style={styles.sectionTitle}>Amenities</Text>
                    <View style={styles.amenitiesGrid}>
                      {selectedProperty.amenities.map((amenity, index) => (
                        <View key={index} style={styles.amenityItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#28a745"
                          />
                          <Text style={styles.amenityText}>{amenity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Owner Info */}
                {selectedProperty.owner && (
                  <View style={styles.ownerSection}>
                    <Text style={styles.sectionTitle}>Property Owner</Text>
                    <View style={styles.ownerInfo}>
                      <View style={styles.ownerAvatar}>
                        {selectedProperty.owner.avatar ? (
                          <Image
                            source={{ uri: selectedProperty.owner.avatar }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Ionicons name="person" size={30} color="#666" />
                        )}
                      </View>
                      <View style={styles.ownerDetails}>
                        <Text style={styles.ownerName}>
                          {selectedProperty.owner.name}
                        </Text>
                        <TouchableOpacity style={styles.contactButton}>
                          <Ionicons name="call" size={16} color="#007AFF" />
                          <Text style={styles.contactText}>Contact Owner</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}

                {/* Map */}
                <View style={styles.mapSection}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  <View style={styles.mapPlaceholder}>
                    <Ionicons name="map" size={48} color="#666" />
                    <Text style={styles.mapText}>
                      Lat: {selectedProperty.latitude.toFixed(4)}, Lng:{" "}
                      {selectedProperty.longitude.toFixed(4)}
                    </Text>
                    <Text style={styles.mapSubtext}>
                      Interactive map would be displayed here
                    </Text>
                  </View>
                </View>

                {/* Comments */}
                <View style={styles.commentsSection}>
                  <Text style={styles.sectionTitle}>Reviews & Comments</Text>
                  {selectedProperty.comments?.length ? (
                    selectedProperty.comments.map((comment) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                          <View style={styles.commentAvatar}>
                            {comment.avatar ? (
                              <Image
                                source={{ uri: comment.avatar }}
                                style={styles.commentAvatarImage}
                              />
                            ) : (
                              <Ionicons name="person" size={20} color="#666" />
                            )}
                          </View>
                          <View style={styles.commentInfo}>
                            <Text style={styles.commentUser}>
                              {comment.user}
                            </Text>
                            <View style={styles.commentRating}>
                              {renderStars(comment.rating)}
                            </View>
                          </View>
                          <Text style={styles.commentDate}>{comment.date}</Text>
                        </View>
                        <Text style={styles.commentText}>
                          {comment.comment}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.noComments}>
                      <Text style={styles.noCommentsText}>
                        No reviews yet. Be the first to review!
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.scheduleButton}>
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={styles.scheduleButtonText}>Schedule Tour</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton2}>
                <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (!text) return "Beautiful property with great amenities";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const renderProperty = ({
    item,
    index,
  }: {
    item: Property;
    index: number;
  }) => {
    const animatedValue = new Animated.Value(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <TouchableOpacity onPress={() => handlePropertyPress(item)}>
        <Animated.View
          style={[
            styles.propertyCard,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#ffffff", "#fefefe"]}
            style={styles.cardGradient}
          >
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={styles.propertyImage}
            />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.propertyAddress} numberOfLines={1}>
                {item.address}
              </Text>
              <Text style={styles.propertyDescription}>
                {truncateDescription(item.description)}
              </Text>
              <View style={styles.propertyDetails}>
                {item.bedrooms && (
                  <View style={styles.detailItem}>
                    <Ionicons name="bed-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.bedrooms} bed</Text>
                  </View>
                )}
                {item.bathrooms && (
                  <View style={styles.detailItem}>
                    <Ionicons name="water-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.bathrooms} bath</Text>
                  </View>
                )}
                {item.area && (
                  <View style={styles.detailItem}>
                    <Ionicons name="resize-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.area} sqft</Text>
                  </View>
                )}
              </View>
              <Text style={styles.propertyPrice}>
                {new Intl.NumberFormat("en", {
                  style: "currency",
                  currency,
                }).format(item.price)}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Properties</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <Text style={styles.filterLabel}>Property Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filters.type === "all" && styles.selectedTypeButton,
                ]}
                onPress={() => setFilters({ ...filters, type: "all" })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filters.type === "all" && styles.selectedTypeButtonText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {[
                { label: "🏰 Estate", value: "Estate" },
                { label: "🏖️ Villa", value: "Villa" },
                { label: "🏢 Apartment", value: "Apartment" },
                { label: "🏠 Home", value: "Home" },
                { label: "🏨 Condo", value: "Condo" },
                { label: "🏬 Flat", value: "Flat" },
              ].map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    filters.type === type.value && styles.selectedTypeButton,
                  ]}
                  onPress={() => setFilters({ ...filters, type: type.value })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      filters.type === type.value &&
                        styles.selectedTypeButtonText,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Price"
                value={filters.minPrice.toString()}
                onChangeText={(text) =>
                  setFilters({ ...filters, minPrice: parseInt(text) || 0 })
                }
                keyboardType="numeric"
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max Price"
                value={filters.maxPrice.toString()}
                onChangeText={(text) =>
                  setFilters({
                    ...filters,
                    maxPrice: parseInt(text) || 10000000,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.filterLabel}>Bedrooms</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Bedrooms"
                value={filters.minBedrooms.toString()}
                onChangeText={(text) =>
                  setFilters({ ...filters, minBedrooms: parseInt(text) || 0 })
                }
                keyboardType="numeric"
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max Bedrooms"
                value={filters.maxBedrooms.toString()}
                onChangeText={(text) =>
                  setFilters({ ...filters, maxBedrooms: parseInt(text) || 10 })
                }
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={["#ffffff", "#fafafa", "#f5f5f5"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.headerTitle}>🏠 PropFlow</Text>
            <Text style={styles.subText}>
              {region
                ? `${region.city ?? region.country ?? ""}`
                : "Locating..."}
            </Text>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search properties"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                />
              </View>
              <Animated.View
                style={{ transform: [{ scale: filterButtonScale }] }}
              >
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={handleFilterPress}
                >
                  <Ionicons name="filter" size={20} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {showSuggestions && (
              <Animated.View
                style={[
                  styles.suggestionsContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {filteredProperties.slice(0, 5).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSuggestionSelect(item)}
                    style={styles.suggestionItem}
                  >
                    <Text style={{ color: "#333" }}>{item.title}</Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>
                      {item.address}
                    </Text>
                  </TouchableOpacity>
                ))}
                {filteredProperties.length === 0 && (
                  <Text
                    style={{ padding: 10, color: "#666", fontStyle: "italic" }}
                  >
                    No results
                  </Text>
                )}
              </Animated.View>
            )}

            <Text style={styles.sectionTitle}>Nearby Places</Text>
            <FlatList
              data={filteredProperties}
              renderItem={renderProperty}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 120 }}
            />
          </Animated.View>
        </ScrollView>

        <View style={styles.floatingNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate("PropertiesScreen")}
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
      </KeyboardAvoidingView>

      {renderFilterModal()}
      {renderPropertyDetailsModal()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  headerTitle: {
    color: "#333",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: { color: "#666", marginBottom: 20, fontSize: 16 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: { flex: 1, color: "#333", padding: 10 },
  filterButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    color: "#333",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  propertyCard: {
    width: width * 0.75,
    height: 350, // Fixed height for consistent card length
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 0,
    borderRadius: 20,
  },
  propertyImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  propertyInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between", // Distribute content evenly
  },
  propertyTitle: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  propertyAddress: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  propertyDescription: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    height: 40, // Fixed height for consistent description area
  },
  propertyDetails: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: "#666",
    fontSize: 12,
  },
  propertyPrice: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  // Floating navbar styles
  floatingNavContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: "95%",
    height: 60,
    alignItems: "center",
  },
  navItem: {
    padding: 6,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterContent: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 16,
  },
  typeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  selectedTypeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    color: "#666",
    fontSize: 14,
  },
  selectedTypeButtonText: {
    color: "#fff",
  },
  priceInputs: {
    flexDirection: "row",
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Property Details Modal Styles
  propertyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  propertyModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  propertyModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  propertyModalScroll: {
    flex: 1,
  },
  imageGallery: {
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  imageNavigation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
  },
  propertyDetailsContainer: {
    padding: 20,
  },
  propertyHeader: {
    marginBottom: 12,
  },
  propertyDetailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  propertyDetailPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    color: "#666",
    fontSize: 14,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 16,
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  detailBoxText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  descriptionSection: {
    marginVertical: 16,
  },

  descriptionText: {
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  amenitiesSection: {
    marginVertical: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  amenityText: {
    color: "#333",
    fontSize: 14,
  },
  ownerSection: {
    marginVertical: 16,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contactText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  mapSection: {
    marginVertical: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  mapText: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  mapSubtext: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  commentsSection: {
    marginVertical: 16,
  },
  commentItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  commentAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInfo: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentRating: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  commentDate: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  noComments: {
    padding: 20,
    alignItems: "center",
  },
  noCommentsText: {
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contactButton2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default HomeScreen;
