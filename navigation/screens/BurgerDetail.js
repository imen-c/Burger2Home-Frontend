import React, { useEffect, useState, useSyncExternalStore } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { orderListManage } from "./Order";
import { AntDesign, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export var orderList = [];
export function emptyCart() {
  orderList = [];

  console.log("je passe dans le emptyCart");
  console.log(orderList, "apres empycart");
}
const BurgerDetail = ({ route }) => {
  console.log(orderList, "liste detail");

  const [orderItems, setOrderItems] = React.useState(orderList);

  function edit(item) {
    console.log("itemName", item.name);

    if (orderItems.find((ar) => ar.name === item.name)) {
      console.log("LE FIND OK");
      // console.log(item);
      let i = 0;
      for (i; i < orderList.length; i++) {
        if (orderList[i].name == item.name) {
          orderList[i].qty = orderList[i].qty + 1;

          break;
        }
      }
      setOrderItems(orderList);
    } else {
      var burger = {
        id: item.id,
        name: item.name,
        qty: 1,
        price: item.basePrice,
      };
      orderList.push(burger);
    }

    setOrderItems(orderList);
    storeCart(orderItems);

    console.log(orderList, "after EDIT");
    console.log(orderItems, "items after EDIT");
  }

  const storeCart = async (dataAsync) => {
    try {
      let jsonValue = JSON.stringify(dataAsync);
      await AsyncStorage.setItem("@cart", jsonValue);
      console.log("JSON Storage CART", jsonValue);
    } catch (e) {
      console.log("ASYNC storage erreur Cart", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/burger.png")}
        />
        <Text style={styles.title}>{route.params.item.name}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.idescription}>{route.params.item.description}</Text>
        <TouchableOpacity
          style={{ width: "100%", height: 40 }}
          onPress={() => unrase()}
        >
          <Text>
            Allergens <Octicons name="info" size={18} color="black" />
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => edit(route.params.item)}
      >
        <Text style={{ textAlign: "center" }}>
          AddToCart: {route.params.item.basePrice} €
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BurgerDetail;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "40%",
  },
  textContainer: {
    position: "absolute",
    borderTopRightRadius: 30,
    bottom: 70,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    tintColor: `#fffaf0`,
  },
  idescription: {},
  allergButtons: {
    width: "100%",
    height: 100,
  },
  addButton: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    backgroundColor: `#dcdcdc`,
    bottom: 25,
    height: 40,
    width: "100%",
  },
});
