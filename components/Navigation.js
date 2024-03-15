import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import ProfileContext from "../context/ProfileContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import OnboardingScreen from "../screens/OnboardingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileImage from "../components/ProfileImage";
import HomeScreen from "../screens/HomeScreen";

export default function Navigation() {
  const { data, dispatch } = useContext(ProfileContext);
  const [isloading, setIsLoading] = useState(true);

  const checkIfOnboardingCompleted = async () => {
    try {
      let value = await AsyncStorage.getItem("onboardingCompleted");

      value = JSON.parse(value);

      if (value) {
        dispatch({ type: "onboardingCompleted", payload: true });
      } else {
        dispatch({ type: "onboardingCompleted", payload: false });
        await AsyncStorage.setItem("onboardingCompleted", false.toString());
        await AsyncStorage.setItem("credentials", "{}");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //check if profile exist
  const checkIfProfileImage = async () => {
    try {
      let value = await AsyncStorage.getItem("savedImage");
      if (value) {
        dispatch({ type: "updateProfileImage", payload: value });
      }
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      checkIfOnboardingCompleted();
      checkIfProfileImage();
    })();
  }, []);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {data.onboardingCompleted ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerTitle: () => {
                  return (
                    <View>
                      <Image
                        source={require("../images/Logo.png")}
                        resizeMode="contain"
                        style={{
                          alignSelf: "center",
                        }}
                      />
                    </View>
                  );
                },
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerRight: () => {
                  return (
                    <ProfileImage
                      navigation={navigation}
                      firstname="John"
                      lastname="Anthony"
                    />
                  );
                },
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ navigation }) => ({
                headerLeft: () => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.goBack();
                      }}
                    >
                      <Ionicons
                        name="arrow-back-circle-sharp"
                        size={40}
                        color="#495E57"
                      />
                    </TouchableOpacity>
                  );
                },
                headerBackVisible: false,
                headerShadowVisible: false,
                headerRight: () => {
                  return (
                    <ProfileImage
                      navigation={navigation}
                      firstname="John"
                      lastname="Anthony"
                    />
                  );
                },
                headerTitle: () => {
                  return (
                    <View>
                      <Image
                        source={require("../images/Logo.png")}
                        resizeMode="contain"
                        style={{
                          alignSelf: "center",
                        }}
                      />
                    </View>
                  );
                },
                headerTitleAlign: "center",
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
