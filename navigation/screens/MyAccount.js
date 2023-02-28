import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestFrame } from "react-native-reanimated/lib/reanimated2/core";

//web 187568508686-jdjjciesnsfk4cvamgc1rc5qefc3p16m.apps.googleusercontent.com
//ios 187568508686-d1ss60c460327h8uvp6nug8166plreqc.apps.googleusercontent.com
//android 187568508686-39hd0ss5p80vmh76f1k4bnvupdve0cli.apps.googleusercontent.com
const newUser = {
  email: "adibou11@lol.com",
  first_name: " adibou11",
  last_name: "adibou11",
};

WebBrowser.maybeCompleteAuthSession();

export default function MyAccount({ navigation }) {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "187568508686-jdjjciesnsfk4cvamgc1rc5qefc3p16m.apps.googleusercontent.com",
    iosClientId:
      "187568508686-d1ss60c460327h8uvp6nug8166plreqc.apps.googleusercontent.com",
    androidClientId:
      "187568508686-39hd0ss5p80vmh76f1k4bnvupdve0cli.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);
  /*   React.useEffect(() => {
    const persistAuth = async () => {
      await AsyncStorage.setItem("auth", JSON.stringify(useInfo.sub));
    };
    persistAuth();
  }, [useInfo]); */

  const postUser = async () => {
    await fetch("http://10.0.2.2:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        // enter you logic when the fetch is successful

        console.log("retrieve data ", data);
        // storage user
        let userAsync = {
          nom: data.currentUser.last_name,
          prenom: data.currentUser.first_name,
          token: data.token,
        };
        const userJSON = JSON.stringify(userAsync);
        AsyncStorage.setItem("@user", userJSON)
          .then(() => console.log("USER enregistré avec succès", userJSON))
          .catch((error) => console.log("Erreur storage du user:", error));
        //storage token
        AsyncStorage.setItem("@token", data.token)
          .then(() => console.log("Token enregistré avec succès", data.token))
          .catch((error) => console.log("Erreur storage du token:", error));
      })
      .catch((error) => {
        // enter your logic for when there is an error (ex. error toast)
        console.log("ERROR POST USER", error);
      });
  };

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const useInfo = await response.json();

    setUser(useInfo);
  }

  /*   const storeToken = async (token) => {
    try {
      const jsonValue = JSON.stringify(token);
      await AsyncStorage.setItem("@token", jsonValue);
      console.log("token Storage", jsonValue);
    } catch (e) {
      console.log("ASYNC storage erreur stock login");
    }
  }; */

  /*   const storeDataUser = async (dataAsync) => {
    try {
      const jsonValue = JSON.stringify(dataAsync);
      await AsyncStorage.setItem("@user", jsonValue);
      console.log("JSON Storage", jsonValue);
    } catch (e) {
      console.log("ASYNC storage erreur stock login");
    }
  }; */

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      console.log("getData Info", jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // lance une erreur
      console.log("ASYNC storage erreur getDATA");
    }
  };
  const ShowUserInfo = () => {
    if (user) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 35, fontWeight: "bold", marginBottom: 20 }}>
            Welcome
          </Text>
          <Text>: Sub:{user.sub}</Text>
          <Text>user givenname: {user.given_name}</Text>
          <Text>user familyname: {user.family_name}</Text>
          <Text>email: {user.email}</Text>
          <Image
            source={{ uri: user.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null && (
        <>
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Welcome</Text>
          <Button
            style={{ width: 300, height: 40 }}
            title="getData "
            onPress={() => {
              getData();
            }}
          />
          <Button
            style={{ width: 300, height: 40 }}
            title=" new"
            onPress={() => {
              postUser();
            }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 20,
              color: "gray",
            }}
          >
            Please login
          </Text>
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            <Image
              source={require("./btn.png")}
              style={{ width: 300, height: 40 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
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
