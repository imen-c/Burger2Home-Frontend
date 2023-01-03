import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
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
    <SafeAreaView style={styles.safearea}>
      <View style={styles.header}>
        <Text style={{ color: "black" }}>HEADER</Text>
        <TouchableOpacity style={styles.trash} onPress={() => todo()}>
          <Ionicons
            style={{ textAlign: "center" }}
            name="md-trash-outline"
            size={35}
            color="black"
          />
          <Text>Vider le panier </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.listOrder}
        data={orderList}
        keyExtractor={(burger) => burger.name}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={{ textAlign: "center" }}>Passer commande</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#7fffd4",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    position: "absolute",
    top: 40,
    width: "100%",
    height: "12%",
    backgroundColor: "salmon",
  },
  trash: {
    position: "absolute",
    right: 5,
    bottom: 10,
  },
  listOrder: {
    backgroundColor: `pink`,
    marginTop: 85,
    width: "90%",
    left: 5,
  },
  confirmButton: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    backgroundColor: `#dcdcdc`,
    bottom: 10,
    height: 40,
    marginStart: 5,
    marginEnd: 5,
    width: "97%",
  },
});
