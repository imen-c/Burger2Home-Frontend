import * as React from 'react';
import { View, Text } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import colors from '../config/colors';

import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import Home from './screens/Home';
import Menu from './screens/Menu';
import News from './screens/News';
import Order from './screens/Order';
import MyAccount from './screens/MyAccount';

//Screens names
const homeName = 'Acceuil';
const menuName = 'Menu';
const newsName = 'News';
const orderName = 'Order';
const accountName = 'MyB2H';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
      <NavigationContainer>
        <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === orderName) {
              iconName = focused ? 'list-unordered' : 'list-unordered-outline';

            }else if (rn === menuName) {
              iconName = focused ? 'home' : 'home-outline';
            }  else if (rn === newsName) {
              iconName = focused ? 'home' : 'home-outline';
            }else if (rn === accountName) {
              iconName = focused ? 'home' : 'home-outline';
            }


            // You can return any component that you like here!
            return <AntDesign name="home" size={24} color="darkRed" />,
            <Octicons name="list-unordered" size={24} color="darkRed" />;
          },
          
        })}>

        <Tab.Screen name={homeName} component={Home} options={{headerShown:false}} />
        <Tab.Screen name={orderName} component={Order} options={{headerShown:false}} />
        <Tab.Screen name={menuName} component={Menu} options={{headerShown:false}} />
        <Tab.Screen name={newsName} component={News} />
        <Tab.Screen name={accountName} component={MyAccount} options={{headerShown:false}} />
        






        </Tab.Navigator>



      </NavigationContainer>
    );
  }