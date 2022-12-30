import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import MyAccount from './screens/MyAccount';


const Stack = createStackNavigator()

const FirstScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="MyAccount"
                component={MyAccount}
            />
        </Stack.Navigator>
    )
}
export {FirstScreenNavigator}