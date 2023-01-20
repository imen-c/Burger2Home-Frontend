import React, { useEffect, useState, useSyncExternalStore } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { orderListManage } from "./Order";
import { AntDesign, Octicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../Colors";

export var orderList = [];
export function emptyCart() {
  orderList = [];

  console.log("je passe dans le emptyCart");
  console.log(orderList, "apres empycart");
}
const BurgerDetail = ({ navigation, route }) => {
  console.log(orderList, "liste detail");

  const [orderItems, setOrderItems] = React.useState(orderList);

  function edit(item) {
    console.log("itemName", item.name);
    let i = 0;

    for (i; i < orderItems.length; i++) {
      if (orderItems[i].name == item.name) {
        orderItems[i].qty = orderItems[i].qty + 1;
        break;
      } else {
      }
    }

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
      </View>
      <TouchableOpacity
        style={{ position: "absolute", top: 40, left: 30 }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{route.params.item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.idescription}>
            {route.params.item.description}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.allergButtons} onPress={() => unrase()}>
        <Text>
          Allergens <Octicons name="info" size={18} color="black" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => edit(route.params.item)}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 16,
            fontWeight: "800",
          }}
        >
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
    marginTop: 25,
    width: "100%",
    height: "55%",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  idescription: {
    flex: 1,
    flexWrap: "wrap",
    marginTop: 5,
    marginStart: 20,
    marginEnd: 20,
    textAlign: "justify",
    lineHeight: 20,
  },
  allergButtons: {
    marginTop: 30,
    marginStart: 20,
  },
  addButton: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: COLORS.darkRed,
    borderRadius: 20,
    marginTop: 20,
    marginStart: 20,
    marginEnd: 20,
    height: 40,
  },
});
