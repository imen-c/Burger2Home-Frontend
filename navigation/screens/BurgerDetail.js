import React, {
  useEffect,
  useState,
  useSyncExternalStore,
  useContext,
} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { CartContext } from "../CartContext";
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
  const [cart, setCart] = useContext(CartContext);

  const [orderItems, setOrderItems] = React.useState(orderList);

  const addToCart = () => {
    var actualList = cart;
    const existingBurger = actualList.find(
      (item) => item.id === route.params.item.id
    );

    if (existingBurger) {
      existingBurger.qty += 1;

      setCart(actualList);
    } else {
      var burger = {
        id: route.params.item.id,
        name: route.params.item.name,
        qty: 1,
        price: route.params.item.basePrice,
      };
      actualList.push(burger);
      setCart(actualList);
    }

    console.log("ACTUAL LIST", actualList);
  };

  /*   const storeCart = async (dataAsync) => {
    try {
      let jsonValue = JSON.stringify(dataAsync);
      await AsyncStorage.setItem("@cart", jsonValue);
      console.log("JSON Storage CART", jsonValue);
    } catch (e) {
      console.log("ASYNC storage erreur Cart", e.message);
    }
  }; */

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
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart()}>
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
