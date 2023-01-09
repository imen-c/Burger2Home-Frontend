import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import MenuList from "./screens/MenuList";
import BurgerDetail from "./screens/BurgerDetail";
import Order from "./screens/Order";
import MyAccount from "./screens/MyAccount";

const Stack = createStackNavigator();

const FirstScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuList"
        component={MenuList}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BurgerDetail" component={BurgerDetail} />
    </Stack.Navigator>
  );
};
export { FirstScreenNavigator };

const LoginScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyAccount" component={MyAccount} />
    </Stack.Navigator>
  );
};
export { LoginScreenNavigator };
