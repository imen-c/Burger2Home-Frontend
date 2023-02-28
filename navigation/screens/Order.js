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
import {
  CardField,
  useConfirmPayment,
  useStripe,
  StripeProvider,
} from "@stripe/stripe-react-native";
import { COLORS } from "../Colors";
import { CartContext } from "../CartContext";

export default function Order({ navigation }) {
  const [user, setUser] = React.useState();
  const [token, setToken] = React.useState();
  const [cart, setCart] = React.useContext(CartContext);
  const [addresses, setAddresses] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0.0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [adresseSelected, setAdressSelected] = React.useState();
  const [tryModify, setTryMofify] = React.useState(false);
  const [idToModify, setIdToModify] = React.useState(0);
  const [tryAddOne, setTryAddOne] = React.useState(false);

  const [clientSecret, setClientSecret] = React.useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [cartToPost, setCartToPost] = React.useState();

  const [street, setStreet] = React.useState("");
  const [codePostal, setCodePostal] = React.useState("");
  const [city, setCity] = React.useState("");

  React.useEffect(() => {
    console.log("Premier useEffect");

    getDataUser();
  }, []);

  React.useEffect(() => {
    console.log("Changement percu sur cart", cart);
    let total = 0;
    cart.forEach((item) => {
      total += item.qty * item.basePrice;
    });
    setTotalPrice(total);
    getDataUser();
  }, [cart]);
  React.useEffect(() => {
    if (clientSecret) {
      initialisePaymentSheet();
    }
  }, [clientSecret]);

  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      console.log("USER INFO --> order", jsonValue);

      //console.log("PARSE token", JSON.parse(jsonValue).token);
      let t = JSON.parse(jsonValue).token;
      let us = JSON.parse(jsonValue).nom;
      //console.log("TOKEN to String", t);
      setToken(t);
      setUser(us);
      getAddresses();
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("ASYNC STORAGE ERREUR GET USER INFO ORDER");
    }
  };

  /*   
            MANAGE CART
   */

  const emptyCart = () => {
    setCart([]);
  };
  const addProduct = (id) => {
    console.log("ID TO +", id);
    setCart((prevCart) =>
      prevCart.map((burger) => {
        if (burger.id === id) {
          return { ...burger, qty: burger.qty + 1 };
        }
        return burger;
      })
    );
  };
  const emptyProduct = (id) => {
    console.log("ID TO -", id);
    const index = cart.findIndex((item) => item.id === id);
    if (cart[index].qty > 0) {
      cart[index].qty -= 1;
    } else {
      cart.splice(index, 1);
    }

    setCart([...cart]);
  };

  const postCart = () => {
    var list = [];
    cart.map((item) => {
      console.log(item.name);
      var product = {
        id: item.id,
        quantity: item.qty,
      };
      list.push(product);
    });

    setCartToPost(list);
    console.log("CART TO POST", cartToPost);

    fetch("http://10.0.2.2:8000/baskets", {
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
        console.log("DATA rceive FROM POST CART", data);
        setCart([]);
      })
      .catch((error) => {
        // enter your logic for when there is an error (ex. error toast)
        console.log("ERROR POst CART", error);
      });
  };

  /*   
            MANAGE ADDRESS
   */
  const ChooseAdress = () => {
    console.log("CHOOSE ADRESS");
    return (
      <View>
        {addresses.length > 0 && !tryModify && !tryAddOne && <AdressReceived />}
        {tryModify && <ModifyAdressView />}
        {(addresses === undefined || addresses.length == 0 || tryAddOne) && (
          <SafeAreaView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => closeOneAddress()}
            >
              <AntDesign name="closecircle" size={24} color="black" />
            </TouchableOpacity>
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
                keyboardType="numeric"
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
                onPress={() => postAddress()}
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
  const AdressReceived = () => {
    return (
      <SafeAreaView>
        <View>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => closeAdressReceived()}
          >
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
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
                      handleAdressSelected(item);
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
            placeholder="rue"
            onEndEditing={(e) => handleStreet(e.nativeEvent.text)}
            defaultValue={street}
          />
          <Text style={styles.titleInputText}>code postal:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="CP"
            onEndEditing={(e) => handleCP(e.nativeEvent.text)}
            defaultValue={codePostal}
          />
          <Text style={styles.titleInputText}>ville:</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Ville"
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
  function handleConfirmButton() {
    fetchIntentPayement();
    getAddresses();
    setShowAddressForm(true);
    console.log("SHOWADRESSFORM", showAddressForm);
  }
  function closeOneAddress() {
    setShowAddressForm(false);
    console.log("SHOWADRESSFORM", showAddressForm);
  }
  function closeAdressReceived() {
    setShowAddressForm(false);
    console.log("SHOWADRESSFORM", showAddressForm);
  }
  const handleAdressSelected = (item) => {
    setAdressSelected(item);
  };
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
  const postAddress = async () => {
    const oneAddress = {
      street: street,
      postal_code: parseInt(codePostal),
      city: city,
    };

    await fetch("http://10.0.2.2:8000/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },

      body: JSON.stringify(oneAddress),
    })
      .then((res) => {
        res.json;
        console.log("STATUT POST ADDRESS", res.status);
      })
      .then((data) => {
        // enter you logic when the fetch is successful
        console.log("DATA", data);
        getAddresses();
        alertAddAdress();
      })
      .catch((error) => {
        // enter your logic for when there is an error (ex. error toast)
        console.log("ERROR POst ONE adrress", error);
      });
  };
  const getAddresses = async () => {
    if (!(token == undefined)) {
      await fetch("http://10.0.2.2:8000/addresses", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.toString()}` },
      })
        .then((response) => response.json())
        .then((json) => setAddresses(json))
        .catch((error) => console.error("ERREUR getAdresses()", error));
      //.finally(() => setLoading(false));

      console.log("Addresses recçue", addresses);
    }
  };
  const ModifyAdress = (id) => {
    setTryMofify(true);
    setIdToModify(id);
  };
  const ModifyAdressCall = () => {
    const oneAddress = {
      street: street,
      postal_code: parseInt(codePostal),
      city: city,
    };

    console.log("ADRESS TO MODIFY", oneAddress);

    fetch(`http://10.0.2.2:8000/addresses/${idToModify.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },
      body: JSON.stringify(oneAddress),
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
  const alertAddAdress = () => {
    Alert.alert("", "Votre adresse a été ajoutée", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => endAddAdress() },
    ]);
  };
  const alertUpdateAdress = () => {
    Alert.alert("", "Votre adresse a été modifié", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => endAddAdress() },
    ]);
  };
  const alertDeleteAdress = () => {
    Alert.alert("", "Votre adresse a été supprimée", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => endAddAdress() },
    ]);
  };
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
        alertDeleteAdress();
      })
      .catch((error) => {
        setErrorMessage(error);
        console.error("There was an error!", error);
      });
  };
  /*   
            MANAGE PAYEMENT
   */
  const checkout = () => {
    openPaymentSheet();
    console.log("CHECKOUT");
  };

  const fetchIntentPayement = async () => {
    if (token) {
      let tok = token.toString();
      await fetch("http://10.0.2.2:8000/payment/stripe/intent", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          setClientSecret(json);

          console.log("SECRET-CLIENT SUCCEED", json);
        })
        .catch((error) => console.error("ERREUR CLIENT SECRET", error));
      //.finally(() => setLoading(false));
    }
  };

  const initialisePaymentSheet = async () => {
    if (!clientSecret) {
      console.log("clientSecret NOT DETECTED init");
      return;
    }
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Burger2Home, Inc.",
      paymentIntentClientSecret: clientSecret,
    });
    console.log("SUCCESS initpayementsheet");
    if (error) {
      Alert.alert("Erreur initialisePaymentSheet", error.message);
    }
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      console.log("clientSecret NOT DETECTED present");
      return;
    }
    const { error } = await presentPaymentSheet({ clientSecret });

    if (error) {
      Alert.alert(`Error Payement Stripe code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your payment is confirmed!");
      saveOrder();
    }
  };

  const saveOrder = () => {
    postCart();
    setShowAddressForm(false);
  };
  return (
    <SafeAreaView style={styles.safearea}>
      {!showAddressForm && (
        <View>
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

            <TouchableOpacity style={styles.trash} onPress={() => emptyCart()}>
              <Ionicons
                style={{ textAlign: "center" }}
                name="md-trash-outline"
                size={30}
                color="black"
              />
              <Text>Vider le panier </Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              style={styles.listOrder}
              data={cart}
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
                        <TouchableOpacity onPress={() => addProduct(item.id)}>
                          <Ionicons name="md-add" size={16} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => emptyProduct(item.id)}>
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
              onPress={() => handleConfirmButton()}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Passer commande {totalPrice}€{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showAddressForm && (
        <View style={styles.confirmView}>
          {user && <ChooseAdress />}
          {user == null && (
            <View>
              {/*     <Text
                style={{
                  fontSize: 35,
                  fontWeight: "bold",
                  position: "absolute",
                  top: 120,
                  marginStart: 35,
                }}
              >
                Welcome
              </Text> */}
              <TouchableOpacity
                //style={styles.modalConnect}
                onPress={() => navigation.navigate("MyB2H")}
              >
                <Text>Connectez-Vous</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    //flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    position: "absolute",
    top: 30,
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
    top: 130,
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
  confirmView: {
    width: "100%",
    top: 0,
    bottom: 25,
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
