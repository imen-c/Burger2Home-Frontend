import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Octicons,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  FirstScreenNavigator,
  PaymentScreenNavigator,
} from "./navigation/CustomNavigation";
import {
  CardField,
  useConfirmPayment,
  useStripe,
  StripeProvider,
} from "@stripe/stripe-react-native";
import Order from "./navigation/screens/Order";
import Home from "./navigation/screens/Home";
import News from "./navigation/screens/News";
import MyAccount from "./navigation/screens/MyAccount";
import { COLORS } from "./navigation/Colors";
import MenuList from "./navigation/screens/MenuList";
import Payement from "./navigation/Payement";
import { CartProvider } from "./navigation/CartContext";
import LanguageProvider from "./navigation/LanguageContext";
import { useTranslation, Trans } from "react-i18next";

//Screens names

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const homeName = t("home.menu");
  const menuName = t("home.list");
  const newsName = t("home.news");
  const orderName = t("home.order");
  const accountName = "MyB2H";
  return (
    <StripeProvider publishableKey="pk_test_51MQTzHHp17SDAKMQfzr42OtsfU2OGH04W2EvPs6BD2sJRKZcPliaAX7CiCK2tPkAP9Lq9ZkJkiUhAvWp1tuMsCSD005IlOnwKX">
      <LanguageProvider>
        <CartProvider>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName={homeName}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  let rn = route.name;

                  if (rn === homeName) {
                    iconName = focused ? "home" : "home-outline";

                    return <AntDesign name="home" size={24} color="black" />;
                  } else if (rn === orderName) {
                    iconName = focused ? "appstore-o" : "appstore-O";
                    return (
                      <Octicons name="list-unordered" size={24} color="black" />
                    );
                  } else if (rn === menuName) {
                    iconName = focused ? "home" : "home-outline";
                    return (
                      <FontAwesome5 name="hamburger" size={24} color="black" />
                    );
                  } else if (rn === newsName) {
                    iconName = focused ? "home" : "home-outline";
                    return (
                      <FontAwesome name="newspaper-o" size={24} color="black" />
                    );
                  } else if (rn === accountName) {
                    iconName = focused ? "home" : "home-outline";
                    return (
                      <MaterialCommunityIcons
                        name="account-cowboy-hat"
                        size={24}
                        color="black"
                      />
                    );
                  }

                  // You can return any component that you like here!
                  return <AntDesign name="home" size={24} color="darkRed" />;
                },
              })}
            >
              <Tab.Screen
                name={homeName}
                component={Home}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name={orderName}
                component={Order}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name={menuName}
                component={FirstScreenNavigator}
                options={{ headerShown: false }}
              />
              <Tab.Screen name={newsName} component={News} />
              <Tab.Screen
                name={accountName}
                component={MyAccount}
                options={{ headerShown: false }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </CartProvider>
      </LanguageProvider>
    </StripeProvider>
  );
}
