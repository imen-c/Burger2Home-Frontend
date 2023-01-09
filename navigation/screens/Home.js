import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { userReceived } from "./MyAccount";

export default function Home({ navigation }) {
  const [token, setToken] = React.useState();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      console.log("listener activé");
      let user = getData();
      console.log("User de home", user.first_name);
    });

    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@user");

        console.log("user CONNECTé", jsonValue);
        console.log("user connecte DETAIL, ", jsonValue.nom);
        console.log("PARSE token", JSON.parse(jsonValue).token);
        let t = JSON.parse(jsonValue).token;
        console.log("t ?????", t.toString());
        setToken(t);
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
      <TouchableOpacity onPress={() => console.log(token)}>
        <Text>BUTTON </Text>
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
