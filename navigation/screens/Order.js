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

export default function Order({ navigation }) {
  React.useEffect(() => {
    console.log("changement sur User Load des addresses");
    //console.log("token", JSON.parse(token));

    let us = getDataUser();
    setUser(us);
  }, [user]);
  React.useEffect(() => {
    console.log("1ere fois");
    //console.log("token", JSON.parse(token));
    if (user == null) {
      let us = getDataUser();
      setUser(us);
      //let token = getToken();
      //setToken(token);
    }
  }, []);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      //e.preventDefault();
      console.log("TabPress");
      let cart = getCart();
      setCart(cart);
      if (user == null) {
        let us = getDataUser();
        setUser(us);
        //let token = getToken();
        //setToken(token);
      }
      getAddresses();

      // Do something manually
      // ...

      fetch("http://10.0.2.2:8000/addresses", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.toString()}` },
      })
        .then((response) => response.json())
        .then((json) => setAddresses(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));

      console.log("Addresses recçue", addresses);
      console.log("passer commande");
      console.log("USER ", user);
      console.log("TOKEN passer commande", token);
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

    return unsubscribe;
  }, [navigation]);
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      console.log("getUser Info", jsonValue);
      //setToken(JSON.parse(jsonValue).token);
      console.log("PARSE token", JSON.parse(jsonValue).token);
      let t = JSON.parse(jsonValue).token;
      console.log("TOKEN to String", t);
      setToken(t);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // lance une erreur
      console.log("ASYNC storage erreur getDATA");
    }
  };
  const getAddresses = async () => {
    if (!(token == undefined)) {
      await fetch("http://10.0.2.2:8000/addresses", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.toString()}` },
      })
        .then((response) => response.json())
        .then((json) => setAddresses(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));

      console.log("Addresses recçue", addresses);
      console.log("passer commande");
      console.log("USER ", user);
      console.log("TOKEN passer commande", token);
    }
  };

  const postAdress = async () => {
    await fetch("http://10.0.2.2:8000/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },

      body: JSON.stringify({
        street: "rue de la place 1",
        postal_code: 4000,
        city: "liege",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // enter you logic when the fetch is successful
        console.log("DATA", data);
      })
      .catch((error) => {
        // enter your logic for when there is an error (ex. error toast)
        console.log("ERROR POst adrress", error);
      });
  };

  const [modalVisible, setModalVisible] = React.useState(false);
  const [user, setUser] = React.useState();
  const [token, setToken] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [addresses, setAddresses] = React.useState([]);
  const [cart, setCart] = React.useState();

  React.useEffect(() => {
    console.log("changement sur User Load des addresses");
    //console.log("token", JSON.parse(token));
  }, [user]);

  function todo() {
    console.log(orderList), "liste reçu par order";
    emptyCart();
    console.log(orderList, "liste apres trash");
  }

  const ChooseAdress = () => {
    return (
      <View>
        {addresses.length > 0 && <AdressReceived />}
        {(addresses === undefined || addresses.length == 0) && (
          <SafeAreaView>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                position: "absolute",
                top: 100,
                marginStart: 35,
              }}
            >
              Veuillez encoder au moins une adresses afin de passer commande
            </Text>
            <View style={styles.modalAddAdress}>
              <Text style={styles.titleInputText}>rue:</Text>
              <TextInput style={styles.inputText} placeholder="Adresse 1" />
              <Text style={styles.titleInputText}>code postal:</Text>
              <TextInput style={styles.inputText} placeholder="Adresse 2" />
              <Text style={styles.titleInputText}>ville:</Text>
              <TextInput style={styles.inputText} placeholder="Adresse 3" />
            </View>
            <View style={styles.containerButton}>
              <TouchableOpacity
                style={styles.modalSaveNewAdress}
                onPress={() => postAdress()}
              >
                <Text>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  };
  const AdressReceived = () => {
    return (
      <View>
        <Text style={styles.modalTitle}>Options de livraison</Text>
        <Text style={styles.modalSubTitle}>Adresse RECEIVED</Text>

        {/*       <View style={styles.modalAddAdress}>
        <TextInput style={styles.inputText} placeholder="Adresse 1" />
        <TextInput style={styles.inputText} placeholder="Adresse 2" />
        <TextInput style={styles.inputText} placeholder="Adresse 3" />
      </View> */}
      </View>
    );
  };

  const VerifyLogin = () => {
    getAddresses();
    console.log("Addresses recçue", addresses);
    console.log("passer commande");
    console.log("USER ", user);
    console.log("TOKEN passer commande", token);
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
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons
              style={styles.modalClose}
              name="close-circle-outline"
              size={20}
              color="black"
            />
          </TouchableOpacity>
          {user && <ChooseAdress />}
          {user == null && (
            <SafeAreaView>
              <Text
                style={{
                  fontSize: 35,
                  fontWeight: "bold",
                  position: "absolute",
                  top: 120,
                  marginStart: 35,
                }}
              >
                Welcome
              </Text>
              <TouchableOpacity
                style={styles.modalConnect}
                onPress={() => navigation.navigate("MyB2H")}
              >
                <Text>Connectez-Vous</Text>
              </TouchableOpacity>
            </SafeAreaView>
          )}
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
    top: "50%",
  },
  modalSubTitle: {
    top: "40%",
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
    marginStart: 35,
    marginTop: 50,
    backgroundColor: "pink",
    width: "80%",
    top: "60%",
  },
  inputText: {
    borderColor: "#ccc",
    backgroundColor: "blue",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "100%",
  },
  modalConnect: {
    position: "absolute",
    top: 250,
    marginStart: 40,
    alignContent: "center",
    justifyContent: "center",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    height: 50,
    width: "50%",
    paddingStart: 10,
  },
  modalSaveNewAdress: {
    position: "absolute",
    display: "flex",
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
    width: 130,
    borderRadius: 30,
  },
  titleInputText: {
    marginStart: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  containerButton: {
    position: "absolute",
    top: "170%",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});
