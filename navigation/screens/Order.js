import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Octicons, Ionicons } from "@expo/vector-icons";
import { orderList, emptyCart } from "./BurgerDetail";

export default function Order({ navigation }) {
  console.log(orderList, "liste order");

  function todo() {
    console.log(orderList), "liste reçu par order";
    emptyCart();
    console.log(orderList, "liste apres trash");
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white" }}>HEADER</Text>
        <TouchableOpacity style={styles.trash} onPress={() => todo()}>
          <Ionicons
            style={{ textAlign: "center" }}
            name="md-trash-outline"
            size={35}
            color="black"
          />
          <Text>Vider le panier 22</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => console.log(orderList, "liste ordre actuel")}
      >
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
    height: "12%",
    backgroundColor: "salmon",
    position: "absolute",
    top: 40,
  },
  trash: {
    position: "absolute",
    right: 5,
    bottom: 10,
  },
});
