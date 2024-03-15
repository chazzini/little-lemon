import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import validator from "validator";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileContext from "../context/ProfileContext";

const OnboardingScreen = () => {
  const { data, dispatch } = useContext(ProfileContext);
  //form input value variable
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [errors, setErrors] = useState({});

  const validateFirstname = () => {
    if (!(firstname.length > 0)) {
      setErrors({
        ...errors,
        firstname: "firstname must be more than 1 characters",
      });
    } else {
      setErrors({
        ...errors,
        firstname: "",
      });
    }
  };
  const validateEmail = () => {
    if (!validator.isEmail(email)) {
      setErrors({ ...errors, email: "Enter a valid email" });
    } else {
      setErrors({
        ...errors,
        email: "",
      });
    }
  };

  console.log(errors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        bounces={false}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Image style={styles.logo} source={require("../images/Logo.png")} />
        <View style={styles.body}>
          <Text style={styles.intro}>Let us get to know you</Text>
          <Text style={styles.label}>Firstname</Text>

          <KeyboardAvoidingView>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                validateFirstname();
                setFirstname(e);
              }}
              autoComplete="off"
              autoCorrect={false}
              placeholder="Please enter your firstname"
              keyboardType="default"
            />
            {errors?.firstname && (
              <Text style={styles.error}>{errors.firstname}</Text>
            )}
          </KeyboardAvoidingView>
          <KeyboardAvoidingView>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                validateEmail();
                setEmail(e);
              }}
              keyboardType="email-address"
              autoComplete="off"
              autoCorrect={false}
              inputMode="email"
              placeholder="Please enter your email"
            />
            {errors?.email && <Text style={styles.error}>{errors.email}</Text>}
          </KeyboardAvoidingView>
        </View>
        <View style={styles.footer}>
          {errors?.email?.length || errors?.firstname?.length ? (
            <Text style={styles.button}>Next</Text>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                console.log("clicked");
                if (
                  email &&
                  firstname &&
                  !errors?.email &&
                  !errors?.firstname
                ) {
                  try {
                    const credentials = JSON.stringify({
                      email: email,
                      firstname: firstname,
                    });
                    await AsyncStorage.setItem("credentials", credentials);
                    await AsyncStorage.setItem(
                      "onboardingCompleted",
                      true.toString()
                    );
                    dispatch({ type: "onboardingCompleted", payload: true });
                    dispatch({ type: "updateProfile", payload: credentials });
                  } catch (e) {
                    console.log(e);
                  }
                }
              }}
              disabled={!(email && firstname)}
            >
              <Text style={styles.button}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E5EB",
    justifyContent: "space-between",
  },
  logo: {
    width: 300,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
  },
  header: {
    flex: 0.2,
  },
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  body: {
    paddingVertical: 50,
    paddingHorizontal: 30,
    backgroundColor: "#CBD2D9",
    alignContent: "center",
  },
  input: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#4E606A",
    alignItems: "flex-end",
    marginTop: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#CBD2D9",
    color: "#4E606A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 24,
    fontWeight: "600",
    alignSelf: "flex-end",
    borderRadius: 10,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "#DDDDDD8B",
    color: "#616262",
  },
  intro: {
    fontSize: 32,
    fontWeight: "600",
    color: "#4E606A",
    textAlign: "center",
    paddingBottom: 40,
  },
  label: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "600",
    color: "#4E606A",
    textAlign: "center",
  },
  error: {
    fontSize: 14,
    color: "red",
    fontStyle: "italic",
  },
});

export default OnboardingScreen;
