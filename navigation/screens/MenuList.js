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
      <View style={styles.filter}></View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.listBurger}
          data={data.burgers}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.containerCell}
              onPress={() => navigation.navigate("BurgerDetail")}
            >
              <Image
                style={styles.image}
                source={require("../../assets/burger.png")}
              />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.description}</Text>
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
    alignItems: "center",
    justifyContent: "center",
    height: "10%",
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
    top: "2%",
    left: "2%",
    marginEnd: "2%",
  },
  image: {
    width: 150,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
});
