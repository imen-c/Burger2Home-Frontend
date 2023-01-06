import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestFrame } from "react-native-reanimated/lib/reanimated2/core";

//web 187568508686-jdjjciesnsfk4cvamgc1rc5qefc3p16m.apps.googleusercontent.com
//ios 187568508686-d1ss60c460327h8uvp6nug8166plreqc.apps.googleusercontent.com
//android 187568508686-39hd0ss5p80vmh76f1k4bnvupdve0cli.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function MyAccount() {
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

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const useInfo = await response.json();
    setUser(useInfo);
  }

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
