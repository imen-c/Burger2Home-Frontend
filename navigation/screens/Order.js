import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { AntDesign, Octicons, Ionicons } from "@expo/vector-icons";
import { orderList, emptyCart } from "./BurgerDetail";
import { LoginScreenNavigator } from "../CustomNavigation";

const messages = [];

export default function Order({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      //e.preventDefault();
      console.log("listener activé ORDER");
      let cart = getCart();
      setCart(cart);
      if (user == null) {
        let us = getDataUser();
        setUser(us);
      }
      // Do something manually
      // ...
    });
    const getCart = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@cart");

        console.log("CART storage", jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // lance une erreur
        console.log("ASYNC storage erreur getCart");
      }
    };
    const getDataUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@user");
        console.log("getData Info", jsonValue);
        setToken(JSON.parse(jsonValue).token);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // lance une erreur
        console.log("ASYNC storage erreur getDATA");
      }
    };

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    console.log("isFocus changed");
  }, [isFocus]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user, setUser] = React.useState();
  const [token, setToken] = React.useState();
  const [messages, setMessages] = React.useState([]);
  const [isFocus, setFocus] = React.useState();
  const [cart, setCart] = React.useState();

  function todo() {
    console.log(orderList), "liste reçu par order";
    emptyCart();
    console.log(orderList, "liste apres trash");
    setFocus(true);
    setFocus(false);
  }
  const ChooseAdress = () => {
    if (messages == []) {
      return (
        <View style={styles.modalAddAdress}>
          <TextInput style={styles.inputText} placeholder="Adresse 1" />
          <TextInput style={styles.inputText} placeholder="Adresse 2" />
          <TextInput style={styles.inputText} placeholder="Adresse 3" />
        </View>
      );
    }
  };
  const UserConnected = () => {
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

  const VerifyLogin = () => {
    setModalVisible(true);
  };
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
        extraData={cart}
        keyExtractor={(burger) => burger.name}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => VerifyLogin()}
      >
        <Text style={{ textAlign: "center" }}>Passer commande</Text>
      </TouchableOpacity>
      <Modal style={styles.modal} visible={modalVisible} animationType="slide">
        <SafeAreaView>
          <ChooseAdress />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons
              style={styles.modalClose}
              name="close-circle-outline"
              size={20}
              color="black"
            />
          </TouchableOpacity>
          {user == null && (
            <>
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>Welcome</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MyB2H")}>
                <Text>Connectez-Vous</Text>
              </TouchableOpacity>
            </>
          )}
          <View>
            <Text style={styles.modalTitle}>Options de livraison</Text>
          </View>
        </SafeAreaView>
      </Modal>
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
  modal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 25,
    left: 20,
    top: 30,
  },
  modalClose: {
    position: "absolute",
    top: 15,
    right: 10,
    height: 35,
  },
  modalFlatListAdress: {
    backgroundColor: "red",
    width: "80%",
    top: 70,
    left: 30,
  },
  listAdress: {},
  listAdressCell: {
    marginTop: 10,
    borderRadius: 10,
    height: 40,
    shadowColor: "rgb(0,0,0)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    backgroundColor: "white",
    borderColor: "#ccc",
  },
  textCell: {
    paddingTop: 5,
    paddingStart: 10,
  },
  payButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `#dcdcdc`,
    height: 40,
    marginTop: 200,
    marginStart: 5,
    marginEnd: 5,
    width: "97%",
  },
  modalAddAdress: {
    backgroundColor: "pink",
    width: "80%",
  },
  inputText: {
    borderColor: "#ccc",
    backgroundColor: "blue",
    top: 100,
    width: 80,
  },
});
