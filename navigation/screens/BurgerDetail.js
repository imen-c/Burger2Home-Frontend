import React, {
  useEffect,
  useState,
  useSyncExternalStore,
  useContext,
} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { CartContext } from "../CartContext";
import { orderListManage } from "./Order";
import {
  AntDesign,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../Colors";

const BurgerDetail = ({ navigation, route }) => {
  const [cart, setCart] = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);

  React.useEffect(() => {
    if (cart.length > 0) {
      try {
        const index = cart.findIndex(
          (item) => item.id === route.params.item.id
        );
        setQuantity(cart[index].qty);
      } catch {
        console.log("pas present dans le panier");
      }
    }
  }, [cart]);

  const addProduct = () => {
    console.log("ADD PRODUCT");
    const existingBurger = cart.find(
      (item) => item.id === route.params.item.id
    );

    if (existingBurger) {
      setCart(
        cart.map((burger) => {
          if (burger.id === existingBurger.id) {
            return { ...burger, qty: burger.qty + 1 };
          }
          return burger;
        })
      );
    } else {
      setCart([...cart, { ...route.params.item, qty: 1 }]);
    }
  };

  const emptyProduct = () => {
    console.log("EMPTY PRODUCT");
    if (quantity > 0) {
      setCart((prevCart) =>
        prevCart.map((burger) => {
          if (burger.id === route.params.item.id) {
            return { ...burger, qty: burger.qty - 1 };
          }
          return burger;
        })
      );
    }
    /*     if (cart.length > 0) {
      const index = cart.findIndex((item) => item.id === route.params.item.id);
      if (cart[index].qty > 0) {
        const index = cart.findIndex(
          (item) => item.id === route.params.item.id
        );
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
        setQuantity(0);
      }
    }

    setCart([...cart]); */
  };

  const addToCart = (item) => {
    const existingBurger = cart.find(
      (item) => item.id === route.params.item.id
    );

    if (existingBurger) {
      setCart(
        cart.map((burger) => {
          if (burger.id === existingBurger.id) {
            return { ...burger, qty: burger.qty + 1 };
          }
          return burger;
        })
      );
    } else {
      setCart([...cart, { ...route.params.item, qty: 1 }]);
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
      <TouchableOpacity style={styles.allergButtons}>
        <Text>
          Allergens <Octicons name="info" size={18} color="black" />
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text style={{ marginStart: 20 }}>X{quantity}</Text>
        <View style={{ flexDirection: "row", marginStart: 30 }}>
          <TouchableOpacity onPress={() => addProduct()}>
            <Ionicons name="md-add" size={16} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => emptyProduct()}>
            <AntDesign name="minus" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
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
    marginTop: 20,
    marginStart: 20,
  },
  addButton: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: COLORS.darkRed,
    borderRadius: 20,
    marginTop: 15,
    marginStart: 20,
    marginEnd: 20,
    height: 40,
  },
});
