import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { userReceived } from "./MyAccount";

export default function Home({ navigation }) {
  React.useEffect(() => {
    console.log("un event est detecte from HOME");
  }, [navigation]);

  const getUser = () => {
    console.log("userReceived HOME", userReceived);
  };
  React.useEffect(() => {
    if (navigation.isFocused()) {
      console.log("un focus HOME est detecte"); // replace with your function
    }
  }, [navigation.isFocused()]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      //e.preventDefault();
      console.log("listener activé");
      getData();

      // Do something manually
      // ...
    });

    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@user");

        console.log("user CONNECTé", jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // lance une erreur
        console.log("ASYNC storage erreur getDATA");
      }
    };

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white" }}>HEADER</Text>
      </View>
      <TouchableOpacity onPress={() => getUser()}>
        <Text>BUTTON</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7fffd4",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    width: "100%",
    height: "15%",
    backgroundColor: "black",
    position: "absolute",
    top: 40,
  },
  body: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "50%",
  },
  ButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },
});
