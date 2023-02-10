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
  TextInput,
  Alert,
  Image,
} from "react-native";
import {
  AntDesign,
  Octicons,
  Ionicons,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { orderList, emptyCart } from "./BurgerDetail";
import {
  CardField,
  useConfirmPayment,
  useStripe,
  StripeProvider,
} from "@stripe/stripe-react-native";
import { COLORS } from "../Colors";

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

    /*     setClientSecret(
      "pi_3MRNWCHp17SDAKMQ0opFA2vX_secret_h8A2JRjeZNl9MNWSWFm6OXU6x"
    ); */
    proceedPayement();
    //console.log("token", JSON.parse(token));
    if (user == null) {
      let us = getDataUser();
      setUser(us);
      //let token = getToken();
      //setToken(token);
    }
    fetchIntentPayement();
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
      console.log("JE PASSE DANS LE GET CART");
      try {
        const jsonValue = await AsyncStorage.getItem("@cart");

        console.log("CART storage", jsonValue);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // lance une erreur
        console.log("ASYNC storage erreur getCart");
      }
    };
    if (!clientSecret) {
      console.log("pas de client secret");
      fetchIntentPayement();
    }

    return unsubscribe;
  }, [navigation]);
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      console.log("getUser Info", jsonValue);

      console.log("PARSE token", JSON.parse(jsonValue).token);
      let t = JSON.parse(jsonValue).token;
      console.log("TOKEN to String", t);
      setToken(t);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
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
  const [tryToPay, setTryToPay] = React.useState(false);
  const [idToModify, setIdToModify] = React.useState(0);
  const [adresseSelected, setAdressSelected] = React.useState();
  const [clientSecret, setClientSecret] = React.useState();
  const [cartToPost, setCartToPost] = React.useState();
  const [totalPrice, setTotalPrice] = React.useState(0.0);
  //const [disabled, setDisabled] = React.useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
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
                top: 60,
                marginStart: 35,
              }}
            >
              Veuillez encoder au moins une adresses
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
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Enregistrer
                </Text>
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
          <Text style={styles.modalSubTitle}>Choisissez une adresse:</Text>
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
                        ? { backgroundColor: COLORS.veryLightRed }
                        : {}
                    }
                    onPress={() => {
                      setAdressSelected(item);
                    }}
                  >
                    <View style={styles.subRectangle}>
                      <Text
                        style={{
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
              onPress={() => checkout()}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "white",
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
  const fetchIntentPayement = async () => {
    if (token) {
      console.log("Token present pour inten");
      let tok = token.toString();
      await fetch("http://10.0.2.2:8000/payment/stripe/intent", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          setClientSecret(json);

          console.log("get secretClient");
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  };
  const proceedPayement = async () => {
    //let pi = "pi_3MRNWCHp17SDAKMQ0opFA2vX_secret_h8A2JRjeZNl9MNWSWFm6OXU6x";
    // ici envoyer payement intent async le faire dans le useEffect 1:03:50
    // setClientsecret repose .data.createPaymentIntent.clientSecret
    //navigation.navigate("Payement");
    setModalVisible(false);
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Burger2Home, Inc.",
      //customerId: customer,
      //customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      //allowsDelayedPaymentMethods: true,
      //defaultBillingDetails: {
      //  name: 'Jane Doe',
      //}
    });
    console.log("SUCCESS PROCEDD PAYment");
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    //console.log("JE RENTRE DANS OPENPAYEMENTSHEET");
    //console.log("DERNIER CLIENT SECRET", clientSecret);
    const { error } = await presentPaymentSheet({ clientSecret });

    if (error) {
      Alert.alert(`Error Payement Stripe code: ${error.code}`, error.message);
    } else {
      todo(); // vider le panier
      Alert.alert("Success", "Your payment is confirmed!");
      setModalVisible(false);
    }
  };
  const checkout = () => {
    console.log("CART", cart);
    postCart();
    openPaymentSheet();

    // save the order!
  };
  const VerifyLogin = () => {
    getAddresses();
    console.log("Addresses recçue", addresses);
    console.log("passer commande");
    console.log("USER ", user);
    console.log("TOKEN passer commande", token);
    setModalVisible(true);
  };
  const postCart = async () => {
    var list = [];
    let i = 0;
    for (i; i < orderList.length; i++) {
      var product = {
        id: orderList[i].id,
        quantity: orderList[i].qty,
      };
      list.push(product);
    }
    setCartToPost(list);
    console.log("LA LISTE", list);

    await fetch("http://10.0.2.2:8000/baskets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },

      body: JSON.stringify({ burgers: cartToPost }),
    })
      .then((res) => {
        res.json;
        console.log("STATUT", res.status);
      })
      .then((data) => {
        // enter you logic when the fetch is successful
        console.log("DATA", data);
        todo();
      })
      .catch((error) => {
        // enter your logic for when there is an error (ex. error toast)
        console.log("ERROR POst adrress", error);
      });
  };
  const alertUpdateAdress = () =>
    Alert.alert("Adresse", "Votre a été modifié", [
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
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 30,
            marginStart: 20,
          }}
        >
          Commande
        </Text>

        <TouchableOpacity style={styles.trash} onPress={() => todo()}>
          <Ionicons
            style={{ textAlign: "center" }}
            name="md-trash-outline"
            size={30}
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
        renderItem={({ item }) => (
          <View style={styles.orderCell}>
            <View
              style={{
                marginStart: 20,
                width: "25%",
                height: "100%",
              }}
            >
              <Image
                style={{
                  marginStart: 10,
                  borderRadius: 20,
                  height: 60,
                  width: 60,
                  marginBottom: 10,
                  marginTop: 10,
                }}
                source={require("../../assets/burger.png")}
              />
            </View>
            <View
              style={{
                width: "60%",
                height: "100%",
                marginEnd: 5,
              }}
            >
              <Text
                style={{
                  marginTop: 5,
                  marginStart: 20,
                  fontWeight: "bold",
                }}
              >
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ marginStart: 20 }}>X{item.qty}</Text>
                <View style={{ flexDirection: "row", marginStart: 30 }}>
                  <TouchableOpacity>
                    <Ionicons name="md-add" size={16} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <AntDesign name="minus" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => VerifyLogin()}
      >
        <Text
          style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
        >
          Passer commande {totalPrice}€{" "}
        </Text>
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
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    marginTop: 20,
    height: 80,
    width: "100%",
  },
  trash: {
    position: "absolute",
    right: 5,
    top: 8,
  },
  listOrder: {
    backgroundColor: COLORS.grayOne,
    marginTop: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
  },
  orderCell: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginBottom: 15,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 5,
    height: 80,
    borderRadius: 20,
  },
  confirmButton: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    backgroundColor: COLORS.darkRed,
    borderRadius: 20,
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
    marginTop: 10,
    marginEnd: 35,
    backgroundColor: COLORS.grayOne,
    width: "80%",
    top: "60%",
  },
  inputText: {
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginTop: 10,
    marginEnd: 10,
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
    backgroundColor: COLORS.darkRed,
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
    marginTop: 380,
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
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "800",
  },
  flatListAdressContainer: {
    marginTop: 25,

    marginLeft: 30,
    marginRight: 30,
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 25,
    backgroundColor: COLORS.grayOne,
    marginTop: 20,
    marginStart: 10,
    marginEnd: 20,
  },

  viewButtonStripe: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.darkRed,
    borderRadius: 20,
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

    borderRadius: 20,
    width: "90%",
    marginStart: 10,
    marginEnd: 20,
  },
});
