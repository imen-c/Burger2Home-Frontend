import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import MenuList from "./screens/MenuList";
import BurgerDetail from "./screens/BurgerDetail";
import Order from "./screens/Order";
import MyAccount from "./screens/MyAccount";
import Payement from "./Payement";

const Stack = createStackNavigator();

const FirstScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuList"
        component={MenuList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BurgerDetail"
        component={BurgerDetail}
        options={{ headerShown: false }}
      />
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

const PaymentScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Payement" component={Payement} />
    </Stack.Navigator>
  );
};
export { PaymentScreenNavigator };
