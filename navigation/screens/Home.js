import { COLORS } from "../Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";

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
import AnimatedLottieView from "lottie-react-native";
import i18n from "../language/i18n";
import { useTranslation, Trans } from "react-i18next";

export default function Home({ navigation }) {
  const { t } = useTranslation();
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
  const lngs = {
    en: { nativeName: "English" },
    fr: { nativeName: "Français" },
    ar: { nativeName: "عربي" },
  };
  const french = () => {
    const frKey = Object.keys(lngs)[1];
    i18n.changeLanguage(frKey);
  };
  const arab = () => {
    const arKey = Object.keys(lngs)[2];
    i18n.changeLanguage(arKey);
  };
  const english = () => {
    const enKey = Object.keys(lngs)[0];
    i18n.changeLanguage(enKey);
  };
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
      {test && <UserConnected />}
      {!test && (
        <View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              source={require("../../assets/profil.png")}
            />
            <Text style={styles.title}>{t("home.title")}</Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.grayOne,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text style={styles.questionTitle}>{t("home.hook")}</Text>
            <View
              style={{
                marginTop: 10,
                height: 100,
                borderRadius: 10,
                backgroundColor: COLORS.lightRed,
                marginStart: 15,
                marginEnd: 15,
              }}
            >
              <AnimatedLottieView
                source={require("../../assets/walkBurger.json")}
                autoPlay
                loop
              />
            </View>

            <View style={styles.connectButton}>
              <TouchableOpacity onPress={() => navigation.navigate("MyB2H")}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {t("home.login")}
                  <AntDesign
                    style={{ textAlignVertical: "center" }}
                    name="login"
                    size={24}
                    color="white"
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lnButton}>
              <TouchableOpacity style={styles.button} onPress={() => english()}>
                <Text style={styles.itext}>{lngs.en.nativeName}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => french()}>
                <Text style={styles.itext}>{lngs.fr.nativeName}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => arab()}>
                <Text style={styles.itext}>{lngs.ar.nativeName}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: COLORS.darkRed,
    flexDirection: "row",
    borderRadius: 15,

    height: 50,
    marginTop: 20,
    paddingTop: 10,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: "60%",
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Roboto",
    marginStart: 10,
    marginTop: 25,
  },
  questionTitle: {
    marginTop: 30,
    fontFamily: "Roboto",
    fontWeight: "700",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignContent: "center",
  },
  avatar: {
    marginStart: 15,
    width: "18%",
    height: 50,
    tintColor: COLORS.grayOne,
  },

  bonhContainer: {
    marginTop: 10,
    width: "100%",
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  fidelityCard: {
    //backgroundColor: "white",
    backgroundColor: COLORS.darkRed,
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
  lnButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 50,
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
  itext: {
    fontSize: 18,
  },
});
