import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Property } from "../structures/types";
import styles from "./styles";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const PropertyCard: React.FC<Props> = ({ property, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % property.imageUrls.length;
    setCurrentImageIndex(nextIndex);
  };

  return (
    <TouchableOpacity onPress={handleNextImage}>
      <View style={styles.cardGlow}>
        <LinearGradient
          colors={["#ffffff", "#f0f2f5"]}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: property.imageUrls[currentImageIndex] }}
              style={styles.propertyImage}
            />
          </View>
          <View style={styles.propertyContent}>
            <View style={styles.propertyHeader}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => onEdit(property)}>
                  <Text style={styles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(property.id)}>
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.propertyAddress}>{property.address}</Text>
            <Text style={styles.propertyDescription}>
              {property.description}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
