import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import BurgerDetail from './screens/BurgerDetail';


const Stack = createStackNavigator()

const FirstScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="BurgerDetail"
                component={BurgerDetail}
            />
        </Stack.Navigator>
    )
}
export {FirstScreenNavigator}