import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import recommendedCategories from "@/data/recommend";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface RecommendButtonsProps {
  onCategorySelect: (id: string) => void;
}
const RecommendButtons: React.FC<RecommendButtonsProps> = ({
  onCategorySelect,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setSelectedId(id);
    onCategorySelect(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Recommended Places</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {recommendedCategories.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.button,
              (selectedId === item.id || hoveredId === item.id) && {
                backgroundColor: "#0D7377",
              },
            ]}
            onPress={() => handlePress(item.id)}
            onPressIn={() => setHoveredId(item.id)}
            onPressOut={() => setHoveredId(null)}
          >
            <FontAwesome5
              name={item.icon}
              size={20}
              color={
                selectedId === item.id || hoveredId === item.id
                  ? "white"
                  : "#0D7377"
              }
              style={styles.icon}
            />
            <Text
              style={[
                styles.buttonText,
                (selectedId === item.id || hoveredId === item.id) && {
                  color: "white",
                },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default RecommendButtons;
