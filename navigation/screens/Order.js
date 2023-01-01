import * as React from "react";
import { View, Text } from "react-native";
import MenuList from "./MenuList";

const cusOrder = {
  name: "",
};

export default function Order({ navigation }) {
  console.log(cusOrder.name);
  
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => alert("This is the Order screen.")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Commandes
      </Text>
    </View>
  );
}
