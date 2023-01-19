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
  Image,
  Button,
  ImageBackground,
} from "react-native";

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
  const [test, setTest] = React.useState();
  const [firstname, setFirstName] = React.useState();
  const [name, setName] = React.useState();
  const UserConnected = () => {
    return (
      <View style={styles.header}>
        <Text>Helloooooooo</Text>
      </View>
    );
  };
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {test && <UserConnected />}
        {!test && (
          <View>
            <View style={styles.imageContainer}>
              <Image source={require("../../assets/b2hTitle.png")} />
            </View>

            <ImageBackground
              style={{
                borderTopRightRadius: 30,
                borderTopEndRadius: 30,
                height: 600,
              }}
              source={require("../../assets/newSplash.png")}
            >
              <View style={styles.bonhContainer}>
                <TouchableOpacity style={styles.connectButton}>
                  <Text>BOUTON</Text>
                  <View style={styles.fidelityCard}></View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#A6A9BC",

    marginTop: Platform.OS === "android" ? 25 : 0,
    //marginTop: 25,
  },
  connectButton: {
    height: 50,
    marginTop: 100,
  },
  imageContainer: {
    height: 120,
    width: "80%",
  },
  bonhContainer: {
    marginTop: 10,
    width: "100%",
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  fidelityCard: {
    backgroundColor: "white",
    alignContent: "center",
    justifyContent: "center",
    height: 150,
    marginTop: 20,
    marginStart: 25,
    marginRight: 25,
    margin: 25,
    borderRadius: 20,
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
