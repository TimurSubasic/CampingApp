import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { placesTypes } from "@/types/placesTypes";

type Props = {
  places: placesTypes[];
};

const Places = ({ places }: Props) => {
  const renderItems: ListRenderItem<placesTypes> = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box}>
        <View style={styles.container}>
          {/* Image is commented out for now */}
          {/* <Image source={{ uri: item.image }} style={styles.image} /> */}

          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.desc}</Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={places}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false} // Hides the scroll indicator (optional)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 10,
  },
  box: {
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    marginRight: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
    width: 200,
    height: 150,
  },
  container: {
    flexDirection: "row",
    padding: 6,
  },
  // Commenting out image style for now
  // image: {
  //   width: 60, // Smaller image size
  //   height: 60,
  //   borderRadius: 6,
  //   marginRight: 6,
  // },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
    width: "90%",
    lineHeight: 18,
  },

  rating: {
    fontSize: 13,
    color: "#888",
  },
  price: {
    fontSize: 13,
    color: "#0D7377",
    marginTop: 2,
    fontWeight: "bold",
  },
});

export default Places;
