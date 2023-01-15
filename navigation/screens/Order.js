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
  Alert,
} from "react-native";
import {
  AntDesign,
  Octicons,
  Ionicons,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { orderList, emptyCart } from "./BurgerDetail";
import { LoginScreenNavigator } from "../CustomNavigation";

const adressEncoded = {
  street: "",
  code_postal: 0,
  city: "",
};

export default function Order({ navigation }) {
  React.useEffect(() => {
    console.log("changement sur User Load des addresses");
    //console.log("token", JSON.parse(token));

    let us = getDataUser();
    setUser(us);
  }, [user]);
  /*   React.useEffect(() => {
    if (addresses.length == 3) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [addresses]); */
  React.useEffect(() => {
    adressEncoded.city = city;
    adressEncoded.code_postal = codePostal;
    adressEncoded.street = street;
  }, [street, codePostal, city]);
  React.useEffect(() => {
    console.log("1ere fois");
    //console.log("token", JSON.parse(token));
    if (user == null) {
      let us = getDataUser();
      setUser(us);
      //let token = getToken();
      //setToken(token);
    }
    /*     setTimeout(() => {
      this.setState({ color: 'wheat' });
    }, 2000); */
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
    let postStreet = street;
    let postCp = parseInt(codePostal);
    let postCity = city;
    console.log("Adress LET", postStreet, postCp, postCity);

    await fetch("http://10.0.2.2:8000/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },

      body: JSON.stringify({
        street: postStreet,
        postal_code: postCp,
        city: postCity,
      }),
    })
      .then((res) => {
        res.json;
        console.log("STATUT", res.status);
      })
      .then((data) => {
        // enter you logic when the fetch is successful
        console.log("DATA", data);
        getAddresses();
        alertUpdateAdress();
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
  const [street, setStreet] = React.useState("");
  /*   const [streetInput, setStreetInput] = React.useState("");
  const [cPInput, setcPInput] = React.useState("");
  const [cityInput, setCityInput] = React.useState(""); */
  const [codePostal, setCodePostal] = React.useState("");
  const [city, setCity] = React.useState("");
  const [tryModify, setTryMofify] = React.useState(false);
  const [tryAddOne, setTryAddOne] = React.useState(false);
  const [idToModify, setIdToModify] = React.useState(0);
  const [adresseSelected, setAdressSelected] = React.useState();
  //const [disabled, setDisabled] = React.useState(false);
  const [code200AdressReceived, setCodeAdressReceived] = React.useState(false);

  function todo() {
    console.log(orderList), "liste reçu par order";
    emptyCart();
    console.log(orderList, "liste apres trash");
  }
  const handleStreet = (text) => {
    console.log("street", text);
    setStreet(text);
  };
  const handleCP = (text) => {
    console.log("CP", text);
    setCodePostal(text);
  };
  const handleCity = (text) => {
    console.log("city", text);
    setCity(text);
  };

  const ChooseAdress = () => {
    return (
      <View>
        {addresses.length > 0 && !tryModify && !tryAddOne && <AdressReceived />}
        {tryModify && <ModifyAdressView />}
        {(addresses === undefined || addresses.length == 0 || tryAddOne) && (
          <SafeAreaView>
            <Text
              style={{
                fontSize: 20,
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
              <TextInput
                style={styles.inputText}
                placeholder="Adresse 1"
                onEndEditing={(e) => handleStreet(e.nativeEvent.text)}
                defaultValue={street}
              />
              <Text style={styles.titleInputText}>code postal:</Text>
              <TextInput
                style={styles.inputText}
                placeholder="Adresse 2"
                onEndEditing={(e) => handleCP(e.nativeEvent.text)}
                defaultValue={codePostal}
              />
              <Text style={styles.titleInputText}>ville:</Text>
              <TextInput
                style={styles.inputText}
                placeholder="Adresse 3"
                onEndEditing={(e) => handleCity(e.nativeEvent.text)}
                defaultValue={city}
              />
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
  const ModifyAdressView = () => {
    return (
      <SafeAreaView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            position: "absolute",
            top: 100,
            marginStart: 35,
          }}
        >
          Vous souhaitez modifier votre adresse
        </Text>
        <View style={styles.modalAddAdress}>
          <Text style={styles.titleInputText}>rue:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Adresse 1"
            onEndEditing={(e) => handleStreet(e.nativeEvent.text)}
            defaultValue={street}
          />
          <Text style={styles.titleInputText}>code postal:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Adresse 2"
            onEndEditing={(e) => handleCP(e.nativeEvent.text)}
            defaultValue={codePostal}
          />
          <Text style={styles.titleInputText}>ville:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Adresse 3"
            onEndEditing={(e) => handleCity(e.nativeEvent.text)}
            defaultValue={city}
          />
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.modalSaveNewAdress}
            onPress={() => ModifyAdressCall()}
          >
            <Text>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  const AdressReceived = () => {
    return (
      <SafeAreaView>
        <View>
          <Text style={styles.modalTitle}>Options de livraison</Text>
          <Text style={styles.modalSubTitle}>Adresse RECEIVED</Text>
          <View style={{ marginTop: 10, marginLeft: "80%" }}>
            <TouchableOpacity onPress={() => AddOneAdress()}>
              <Fontisto name="plus-a" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.flatListAdressContainer}>
            <FlatList
              data={addresses}
              extraData={addresses}
              keyExtractor={(adresse) => adresse.id}
              renderItem={({ item }) => (
                <View style={styles.rectangle}>
                  <TouchableOpacity
                    style={
                      item === adresseSelected
                        ? { backgroundColor: "yellow" }
                        : {}
                    }
                    onPress={() => {
                      setAdressSelected(item);
                    }}
                  >
                    <View style={styles.subRectangle}>
                      <Text
                        style={{
                          backgroundColor: "red",
                          marginTop: 10,
                          marginBottom: 10,
                          marginStart: 20,
                          marginEnd: 20,
                        }}
                      >
                        {item.street}
                      </Text>

                      <Text style={{ marginStart: 20, marginBottom: 10 }}>
                        {item.postal_code}
                        {"   "}
                        {item.city}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: "20%",
                      marginEnd: 0,
                    }}
                  >
                    <TouchableOpacity onPress={() => ModifyAdress(item.id)}>
                      <Entypo
                        style={{
                          paddingTop: 10,
                          paddingEnd: 5,
                        }}
                        name="edit"
                        size={21}
                        color="black"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => DeleteAdress(item.id)}>
                      <AntDesign
                        style={{
                          paddingTop: 8,
                          paddingEnd: 5,
                        }}
                        name="delete"
                        size={21}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
          <View style={styles.viewButtonStripe}>
            <TouchableOpacity
              style={styles.buttonStripe}
              onPress={() => createThreeButtonAlert()}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 15,
                }}
              >
                Payer avec Stripe
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
  const alertUpdateAdress = () =>
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => endAddAdress() },
    ]);
  const endAddAdress = () => {
    setTryMofify(false);
    setTryAddOne(false);
  };
  const AddOneAdress = () => {
    if (addresses.length === 3) {
      console.log("LENGTH 3");
      Alert.alert(
        "Ajout",
        "Vous avez enregistré un maximum de 3 adresses, veuillez modifier ou supprimer l'une d'elles",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("ok Pressed") },
        ]
      );
    } else {
      setTryAddOne(true);
    }
  };
  const ModifyAdress = (id) => {
    setTryMofify(true);
    setIdToModify(id);
  };
  const ModifyAdressCall = () => {
    let postStreet = street;
    let postCp = parseInt(codePostal);
    let postCity = city;
    let id = idToModify;
    console.log("Adress LET", postStreet, postCp, postCity);
    fetch(`http://10.0.2.2:8000/addresses/${id.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },
      body: JSON.stringify({
        street: postStreet,
        postal_code: postCp,
        city: postCity,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        getAddresses();
        alertUpdateAdress();
      })
      .catch((error) => {
        setErrorMessage(error);
        console.error("There was an error!", error);
      });
  };
  const DeleteAdress = (id) => {
    fetch(`http://10.0.2.2:8000/addresses/${id.toString()}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        getAddresses();
        alertUpdateAdress();
      })
      .catch((error) => {
        setErrorMessage(error);
        console.error("There was an error!", error);
      });
  };
  const closeModale = () => {
    setTryMofify(false);
    setTryAddOne(false);
    setModalVisible(false);
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
        data={cart}
        extraData={orderList}
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
          <TouchableOpacity onPress={() => closeModale()}>
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
    marginTop: 30,
    backgroundColor: "pink",
    width: "80%",
    top: "60%",
  },
  inputText: {
    borderColor: "#ccc",
    backgroundColor: "yellow",
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
    marginTop: 400,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 25,
    left: 20,
    marginTop: 40,
  },
  modalSubTitle: {
    marginTop: 20,
  },
  flatListAdressContainer: {
    marginTop: 25,
    backgroundColor: "pink",
    marginLeft: 30,
    marginRight: 30,
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 25,
    backgroundColor: "salmon",
    marginTop: 20,
    marginStart: 10,
    marginEnd: 20,
  },

  viewButtonStripe: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    height: 40,
    marginTop: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonStripe: {
    display: "flex",
    justifyContent: "center",
  },
  subRectangle: {
    borderRadius: 25,
    backgroundColor: "green",
    width: "90%",
    marginStart: 10,
    marginEnd: 20,
  },
});
