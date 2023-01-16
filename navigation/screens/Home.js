import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { userReceived } from "./MyAccount";

export default function Home({ navigation }) {
  React.useEffect(() => {
    console.log("changement sur User Load des addresses");
    //console.log("token", JSON.parse(token));

    let us = getDataUser();
    setUser(us);
    console.log("US", us);
  }, [user]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {});
    if (user == null) {
      let us = getDataUser();
      setUser(us);
      //let token = getToken();
      //setToken(token);
    }

    return unsubscribe;
  }, [navigation]);

  const [token, setToken] = React.useState();
  const [user, setUser] = React.useState();
  const [firstname, setFirstName] = React.useState();
  const [name, setName] = React.useState();
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      console.log("getUser Info", jsonValue);
      //setToken(JSON.parse(jsonValue).token);
      console.log("PARSE token", JSON.parse(jsonValue).token);
      let t = JSON.parse(jsonValue).token;
      console.log("TOKEN to String", t);
      let n = JSON.parse(jsonValue).nom;
      setName(n);
      let f = JSON.parse(jsonValue).prenom;
      setFirstName(f);
      setToken(t);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // lance une erreur
      console.log("ASYNC storage erreur getDATA");
    }
  };
  const userConnected = () => {
    return (
      <View style={styles.header}>
        <Text>Hello</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text>Hello</Text>
          <Text>{firstname}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#A6A9BC",
    backgroundColor: "green",
    marginTop: Platform.OS === "android" ? 25 : 0,
    //marginTop: 25,
  },

  header: {
    marginStart: 5,
    marginEnd: 5,
    height: 80,
    backgroundColor: "#A6A9BC",
    marginTop: 10,
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
