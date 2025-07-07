import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { Menu } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { availableAmenities } from "../structures/datastructures";

type AmenitiesSelectorProps = {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
};

export default function AmenitiesSelector({
  selectedAmenities,
  onAmenitiesChange,
}: AmenitiesSelectorProps) {
  const [amenitiesMenuVisible, setAmenitiesMenuVisible] = useState(false);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onAmenitiesChange(selectedAmenities.filter((a) => a !== amenity));
    } else {
      onAmenitiesChange([...selectedAmenities, amenity]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>🏠 Amenities</Text>
        <Menu
          visible={amenitiesMenuVisible}
          onDismiss={() => setAmenitiesMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setAmenitiesMenuVisible(true)}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.8)"]}
                style={styles.dropdownGradient}
              >
                <Text style={styles.dropdownText}>
                  {selectedAmenities.length > 0
                    ? `${selectedAmenities.length} Selected`
                    : "Select Amenities"}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </LinearGradient>
            </TouchableOpacity>
          }
          style={styles.dropdownMenu}
        >
          {availableAmenities.map((amenity) => (
            <Menu.Item
              key={amenity.value}
              onPress={() => toggleAmenity(amenity.value)}
              title={`${selectedAmenities.includes(amenity.value) ? "✓ " : ""}${
                amenity.label
              }`}
              titleStyle={[
                styles.dropdownMenuItemTitle,
                selectedAmenities.includes(amenity.value) && {
                  color: "#4a90e2",
                },
              ]}
              style={styles.dropdownMenuItem}
            />
          ))}
        </Menu>
      </View>

      {selectedAmenities.length > 0 && (
        <View style={styles.selectedAmenitiesContainer}>
          <Text style={styles.selectedAmenitiesLabel}>Selected Amenities:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedAmenitiesRow}>
              {selectedAmenities.map((amenity, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedAmenityChip}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <LinearGradient
                    colors={[
                      "rgba(74, 144, 226, 0.1)",
                      "rgba(74, 144, 226, 0.05)",
                    ]}
                    style={styles.selectedAmenityGradient}
                  >
                    <Text style={styles.selectedAmenityText}>
                      {
                        availableAmenities
                          .find((a) => a.value === amenity)
                          ?.label.split(" ")[0]
                      }{" "}
                      {amenity}
                    </Text>
                    <Text style={styles.removeAmenityText}>×</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  dropdownContainer: {},
  dropdownLabel: { fontWeight: "bold", marginBottom: 6, color: "#4a90e2" },
  dropdownButton: { borderRadius: 6, overflow: "hidden" },
  dropdownGradient: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { color: "#333", fontSize: 16 },
  dropdownArrow: { fontSize: 16, color: "#333" },
  dropdownMenu: { maxHeight: 300 },
  dropdownMenuItem: {},
  dropdownMenuItemTitle: { fontSize: 14 },
  selectedAmenitiesContainer: { marginTop: 8 },
  selectedAmenitiesLabel: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#4a90e2",
  },
  selectedAmenitiesRow: { flexDirection: "row", gap: 8 },
  selectedAmenityChip: {
    marginRight: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  selectedAmenityGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedAmenityText: { color: "#4a90e2", fontWeight: "500" },
  removeAmenityText: {
    marginLeft: 6,
    fontWeight: "700",
    color: "#4a90e2",
  },
});
