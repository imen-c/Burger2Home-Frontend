import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import BurgerDetail from './navigation/screens/BurgerDetail';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { FirstScreenNavigator } from './navigation/CustomNavigation';
import Order from './navigation/screens/Order';
import Home from './navigation/screens/Home';

const Tab = createBottomTabNavigator()

export default function App() {
  return   <NavigationContainer>
  <Tab.Navigator
    tabBarOptions={{
      labelStyle:{fontSize:18},
      activeTintColor: 'red'
    }}
  >
    <Tab.Screen
      name="Screen1"
      component={FirstScreenNavigator}
    />
    <Tab.Screen
      name="Screen2"
      component={BurgerDetail}
    />
    <Tab.Screen
      name="Screen3"
      component={Order}
    />
  </Tab.Navigator>
</NavigationContainer>;
}
