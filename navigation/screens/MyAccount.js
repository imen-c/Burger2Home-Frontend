import * as React from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
//web : 847208551891-necii31vte9019a0bsa5d7tikv9dm1fg.apps.googleusercontent.com
//ios: 847208551891-k56coiplhensr838oh6t2eq913j8lg6e.apps.googleusercontent.com
//android: 847208551891-rsjduu0msth6q3dmc3oe0qei7q9j1l49.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();
export default function Home({ navigation }) {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "847208551891-necii31vte9019a0bsa5d7tikv9dm1fg.apps.googleusercontent.com",
    iosClientId:
      "847208551891-k56coiplhensr838oh6t2eq913j8lg6e.apps.googleusercontent.com",
    androidClientId:
      "847208551891-rsjduu0msth6q3dmc3oe0qei7q9j1l49.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);

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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => alert("MyB2h")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        MYB2H
      </Text>
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
              source={require("../../assets/btn.png")}
              style={{ width: 300, height: 40 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
