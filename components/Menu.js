import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const Menu = ({ data }) => {
  return (
    <FlatList
      style={{ flex: 4, paddingBottom: 40, marginTop: 5 }}
      data={data}
      renderItem={({ item }) => {
        return (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <View style={styles.listContent}>
              <View style={styles.descriptionContent}>
                <Text style={styles.description}>{item.description}</Text>

                <Text style={styles.price}>${item.price}</Text>
              </View>
              <Image
                source={{
                  uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                }}
                style={styles.image}
              />
            </View>
          </View>
        );
      }}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
  },
  listContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  listContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",

    justifyContent: "center",

    alignItems: "flex-start",
  },
  image: {
    flex: 1,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  description: {
    paddingRight: 10,
    color: "#495E57",
    fontSize: 14,
  },
  descriptionContent: {
    justifyContent: "flex-start",
    flex: 2,
  },
  price: {
    color: "#495E57",
    fontSize: 18,
    fontWeight: "600",
  },
});
export default Menu;
