import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProfileContext from "../context/ProfileContext";

const ProfileImage = ({ navigation }) => {
  const { data, dispatch } = useContext(ProfileContext);
  console.log("profile image", data);

  return (
    <View style={styles.avatar}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        {data.profileImage ? (
          <Image source={{ uri: data.profileImage }} style={styles.image} />
        ) : data.profile?.firstname && data.profile?.lastname ? (
          <Text style={styles.avatarfont}>
            {(
              data.profile.firstname[0] + data.profile.lastname[0]
            ).toUpperCase()}
          </Text>
        ) : (
          <Image
            source={require("../assets/profile-default.jpg")}
            style={styles.image}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    padding: 0,
    margin: 0,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#62d6c4",
    color: "#fff",

    overflow: "hidden",
    alignContent: "center",
    justifyContent: "center",
  },
  avatarfont: {
    fontSize: 30,
    alignSelf: "center",
  },
});

export default ProfileImage;
