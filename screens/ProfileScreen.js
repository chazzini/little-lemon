import React, { useState, useReducer, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import CheckBox from "expo-checkbox";
import ProfileContext from "../context/ProfileContext";
import ProfileImage from "../components/ProfileImage";
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as ImagePicker from "expo-image-picker";

function reducer(state, action) {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.payload };
    case "setFirstname":
      return { ...state, firstname: action.payload };
    case "setLastname":
      return { ...state, lastname: action.payload };
    case "setPhonenumber":
      return { ...state, phonenumber: action.payload };
    case "setImage":
      return { ...state, image: action.payload };
    case "setProfile":
      return { ...state, ...action.payload };
    case "clear":
      return {};
    default:
      return state;
  }
}

function ProfileScreen({ route }) {
  const { data, dispatch } = useContext(ProfileContext);
  console.log("ProfileScreen", data);

  const [isChecked, setIsChecked] = useState(true);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch({ type: "updateProfileImage", payload: result.assets[0].uri });
      try {
        await AsyncStorage.setItem("savedImage", result.assets[0].uri);
        console.log("Image saved successfully.");
      } catch (error) {
        console.error("Error saving image to AsyncStorage:", error);
      }
    }
  };

  const clearImage = () => {
    AsyncStorage.removeItem("savedImage");
    dispatch({ type: "updateProfileImage", payload: null });
  };

  const [state, setState] = useReducer(reducer, {
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    image: "",
  });
  /**
   * Save last for  state
   */
  const handleSave = async () => {
    const formData = JSON.stringify(state);
    try {
      await AsyncStorage.setItem("credentials", formData);
      dispatch({ type: "updateProfile", payload: state });
    } catch (e) {
      console.log("AsyncStorage failed to set credentials:", e);
    }
  };

  const handleClearForm = async () => {
    try {
      //return form to saved state
      const credentials = await AsyncStorage.getItem("credentials");
      setState({ type: "setProfile", payload: credentials });
    } catch (error) {
      console.log("AsyncStorage clear credentials errors:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      dispatch({ type: "clearProfile", payload: {} });
      dispatch({ type: "onboardingCompleted", payload: false });
    } catch (error) {
      console.log("AsyncStorage clear all errors:", error);
    }
  };

  const handleRepopulateForm = async () => {
    try {
      const formData = JSON.parse(await AsyncStorage.getItem("credentials"));
      if (formData.firstname)
        setState({ type: "setFirstname", payload: formData.firstname });
      if (formData.lastname)
        setState({ type: "setLastname", payload: formData.lastname });
      if (formData.email)
        setState({ type: "setEmail", payload: formData.email });
      if (formData.phonenumber)
        setState({ type: "setPhonenumber", payload: formData.phonenumber });
      if (formData.image)
        setState({ type: "setImage", payload: formData.image });
    } catch (e) {
      console.log("AsyncStorage failed to fetch credentials:", e);
    }
  };

  useEffect(() => {
    handleRepopulateForm();
  }, []);

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
      <KeyboardAvoidingView>
        <View style={styles.innerContainer}>
          <Text style={{ ...styles.title, paddingBottom: 40 }}>
            Personal Information
          </Text>
          <Text>Avatar</Text>
          <View style={styles.avatarcontainer}>
            <ProfileImage />
            <TouchableOpacity onPress={async () => await pickImage()}>
              <Text style={styles.button}>Change </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearImage}>
              <Text style={{ ...styles.outline, borderRadius: 0 }}>
                Remove{" "}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e) => {
              setState({ type: "setFirstname", payload: e });
            }}
            value={state.firstname}
            autoComplete="off"
            autoCorrect={false}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={state.lastname}
            onChangeText={(e) => {
              setState({ type: "setLastname", payload: e });
            }}
            autoComplete="off"
            autoCorrect={false}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={state.email}
            onChangeText={(e) => {
              setState({ type: "setEmail", payload: e });
            }}
            inputMode="email"
            autoComplete="off"
            autoCorrect={false}
          />
          <Text style={styles.label}>Phone number</Text>
          <MaskedTextInput
            mask="(999) 999-9999"
            value={state.phonenumber}
            style={styles.input}
            onChangeText={(e, rawText) => {
              setState({ type: "setPhonenumber", payload: rawText });
            }}
            autoComplete="off"
            autoCorrect={false}
            inputMode="tel"
          />
          <Text style={styles.title}>Email notifications</Text>

          <View style={styles.section}>
            <CheckBox
              onValueChange={() => {}}
              style={styles.checkbox}
              value={isChecked}
            />
            <Text style={styles.checkboxlabel}>Order statuses</Text>
          </View>
          <View style={styles.section}>
            <CheckBox
              onValueChange={() => {}}
              style={styles.checkbox}
              value={isChecked}
            />
            <Text style={styles.checkboxlabel}>Password changes</Text>
          </View>
          <View style={styles.section}>
            <CheckBox
              onValueChange={() => {}}
              style={styles.checkbox}
              value={isChecked}
            />
            <Text style={styles.checkboxlabel}>Special offers</Text>
          </View>
          <View style={styles.section}>
            <CheckBox
              onValueChange={() => {}}
              style={styles.checkbox}
              value={isChecked}
            />
            <Text style={styles.checkboxlabel}>Newsletter</Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logooutButton}>Log out</Text>
          </TouchableOpacity>

          <View style={styles.btnsection}>
            <TouchableOpacity
              onPress={async () => {
                await handleClearForm();
              }}
            >
              <Text style={styles.outline}>Discharge changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSave();
              }}
            >
              <Text style={styles.button}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingBottom: 40 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginTop: 20,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    margin: 10,
    borderRadius: 20,
    padding: 20,
  },
  button: {
    backgroundColor: "#495E57",
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "800",
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "#3B454A",
    borderWidth: 1,
    textAlign: "center",
  },
  outline: {
    alignSelf: "center",
    backgroundColor: "#fff",
    color: "#B5B7B9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "800",

    borderRadius: 10,
    textAlign: "center",
    borderColor: "#495E57",
    borderWidth: 1,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#495E57",
    alignItems: "flex-end",
    marginTop: 5,
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    color: "#495E57",
  },
  checkboxlabel: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 20,
    color: "#495E57",
  },
  checkbox: {
    backgroundColor: "#495E57",
    color: "#fff",
  },
  section: {
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
  },
  logooutButton: {
    backgroundColor: "#F4CE14",
    color: "#0F1010",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "800",
    alignSelf: "stretch",
    borderRadius: 10,
    textAlign: "center",
    borderColor: "#EBC019",
    padding: 10,
    marginTop: 40,
    borderWidth: 3,
  },
  btnsection: {
    flex: 1,
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 40,
  },
  avatarcontainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    marginTop: 40,
  },
});

export default ProfileScreen;
