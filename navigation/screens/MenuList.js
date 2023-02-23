import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import { COLORS } from "../Colors";

const listings = [
  {
    id: 1,
    title: "burger1",
    image: require("../../assets/burger.png"),
  },
  {
    id: 2,
    title: "Burger2",
    image: require("../../assets/burger.png"),
  },
  {
    id: 3,
    title: "Burger3",
    image: require("../../assets/burger.png"),
  },
  {
    id: 4,
    title: "Burger2",
    image: require("../../assets/burger.png"),
  },
  {
    id: 5,
    title: "Burger5",
    image: require("../../assets/burger.png"),
  },
  {
    id: 6,
    title: "Burger6",
    image: require("../../assets/burger.png"),
  },
  {
    id: 7,
    title: "Burger7",
    image: require("../../assets/burger.png"),
  },
];
export default function MenuList({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categoryId, setCategoryId] = useState(1);

  console.log(data);

  useEffect(() => {
    fetch("http://10.0.2.2:8000/burgers")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const setFilter = (id) => {
    console.log("ID TO FILTER", id);
    console.log("CATTTTTEGORY", data.burgers[0].categories);

    setCategoryId(id);
    console.log("LISTE FILTRE", filteredBurgers);
  };
  const filteredBurgers = data.burgers.filter((burger) =>
    burger.categories.some((category) => category.id === categoryId)
  );

  return (
    <SafeAreaView styles={styles.container}>
      <Text style={styles.header}>Burgers</Text>
      <View style={styles.filter}>
        <FlatList
          style={styles.listFilters}
          data={data.categories}
          keyExtractor={({ id }, index) => id}
          horizontal={true}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setFilter(item.id)}>
              <View style={styles.rectangle}>
                <Text style={styles.textFilters}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.listBurger}
          data={filteredBurgers}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.containerCell}
              onPress={() => navigation.navigate("BurgerDetail", { item })}
            >
              <Image
                style={styles.image}
                source={require("../../assets/burger.png")}
              />
              <View
                style={{
                  //backgroundColor: "yellow",
                  marginStart: 0,
                  height: 96,

                  position: "absolute",
                  right: 20,
                  left: 100,
                  bottom: 4,
                }}
              >
                <Text style={styles.title}>{item.name}</Text>
                <View style={{ backgroundColor: "pink" }}>
                  <View style={styles.fidelityP}>
                    <Text style={styles.point}>{item.burgerPoint}</Text>
                    <Image
                      style={styles.coin}
                      source={require("../../assets/bonhomme.png")}
                    />
                  </View>
                </View>
                {/* <Text style={styles.descriptionCell}>{item.description}</Text> */}
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    //backgroundColor: "pink",
                    position: "absolute",
                    bottom: 0,
                    justifyContent: "flex-end",
                    right: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      justifyContent: "flex-end",
                      marginBottom: 15,
                    }}
                  >
                    <Text style={{ color: "black" }}>{item.basePrice} €</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 15,
    marginLeft: 5,
    width: "100%",
    textAlign: "left",
    fontSize: 28,
    fontWeight: "bold",
  },
  containerCell: {
    width: "85%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    marginBottom: 20,
    marginStart: 25,
    borderRadius: 10,
    paddingEnd: 0,
  },
  filter: {
    width: "100%",
    backgroundColor: COLORS.white,
    height: 70,
  },
  listContainer: {
    height: "85%",
    paddingBottom: 60,
    backgroundColor: COLORS.veryLightRed,
  },
  listBurger: {
    //backgroundColor: COLORS.grayOne,
    flex: 1,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  title: {
    paddingTop: 5,
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 15,
    color: COLORS.darkRed,
  },
  fidelityP: {
    flex: 1,
    marginTop: 20,
    marginStart: 10,
    flexDirection: "row",
    //backgroundColor: "red",
    position: "absolute",
    alignItems: "center",
  },
  point: {
    fontWeight: "600",

    justifyContent: "flex-end",
  },
  coin: {
    width: 50,
    height: 50,
  },
  descriptionCell: {
    paddingStart: 15,
    paddingTop: 40,
    width: 250,
  },
  rectangle: {
    backgroundColor: COLORS.darkRed,
    marginTop: 15,
    marginStart: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.darkRed,
  },
  textFilters: {
    textAlign: "center",
    paddingTop: 8,
    fontFamily: "Roboto",
    fontWeight: "900",
    color: COLORS.white,
  },
});
