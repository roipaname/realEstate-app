import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
//import { TextInput } from "react-native-paper";
import { GOOGLE_PLACES_API_KEY } from "../config/googleConfig";

type AddressPickerProps = {
  initialAddress: string;
  onLocationSelect: (
    address: string,
    latitude?: number,
    longitude?: number
  ) => void;
};

type Prediction = {
  description: string;
  place_id: string;
};

export default function AddressPicker({
  initialAddress,
  onLocationSelect,
}: AddressPickerProps) {
  const [query, setQuery] = useState(initialAddress);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&key=${GOOGLE_PLACES_API_KEY}`
        );
        const json = await response.json();
        if (json.status === "OK") {
          setPredictions(json.predictions);
        } else {
          setPredictions([]);
        }
      } catch (e) {
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [query]);

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const json = await response.json();
      if (
        json.status === "OK" &&
        json.result.geometry &&
        json.result.geometry.location
      ) {
        return {
          lat: json.result.geometry.location.lat,
          lng: json.result.geometry.location.lng,
        };
      }
    } catch (e) {
      // fail silently
    }
    return { lat: undefined, lng: undefined };
  };

  const handleSelect = async (prediction: Prediction) => {
    setQuery(prediction.description);
    setPredictions([]);
    const loc = await fetchPlaceDetails(prediction.place_id);
    onLocationSelect(prediction.description, loc.lat, loc.lng);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="📍 Enter Address"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        autoCorrect={false}
      />
      {loading && <ActivityIndicator size="small" color="#4a90e2" />}
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={styles.listItem}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  list: {
    maxHeight: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 4,
    elevation: 4,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
