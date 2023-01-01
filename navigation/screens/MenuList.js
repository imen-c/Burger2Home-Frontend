import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

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
  console.log(data);

  useEffect(() => {
    fetch("http://localhost:3001/burgers")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
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
            <TouchableOpacity>
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
          data={data.burgers}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.containerCell}
              onPress={() =>
                navigation.navigate("BurgerDetail", { item: item })
              }
            >
              <Image
                style={styles.image}
                source={require("../../assets/burger.png")}
              />
              <View>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.descriptionCell}>{item.description}</Text>
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
    backgroundColor: "#A6A9BC",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 5,
    marginLeft: 5,
    width: "100%",
    textAlign: "left",
    fontSize: 28,
    fontWeight: "bold",
  },
  containerCell: {
    backgroundColor: "#7fffd4",
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  filter: {
    width: "100%",
    backgroundColor: "#f0e68c",
    height: 70,
  },
  listContainer: {
    backgroundColor: "#daa520",
    width: "100%",
    height: "85%",
  },
  listBurger: {
    backgroundColor: `#ffd700`,
    flex: 1,
    top: "2%",
    left: "2%",
    marginEnd: "2%",
    width: "100%",
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    paddingTop: 10,
    width: 180,
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionCell: {
    paddingStart: 15,
    paddingTop: 40,
    width: 250,
  },
  rectangle: {
    height: 30,
    width: 60,
    backgroundColor: "salmon",
    marginTop: 20,
    marginStart: 10,
  },
  textFilters: {
    textAlign: "center",
    paddingTop: 8,
  },
});
