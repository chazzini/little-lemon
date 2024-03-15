import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Lodding</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4E606A",
    justifyContent: "center",
    alignContent: "center",
  },
});
