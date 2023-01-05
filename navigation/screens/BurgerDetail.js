import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BurgerDetail({ route }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white" }}>HEADER</Text>
      </View>
      <TouchableOpacity onPress={() => console.log("HOME")}>
        <Text>DETAIL</Text>
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
