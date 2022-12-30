import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Menu from './screens/Menu'
import BurgerDetail from './screens/BurgerDetail';


const Stack = createStackNavigator()

const FirstScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Menu"
                component={Menu}
            />
            <Stack.Screen
                name="BurgerDetail"
                component={BurgerDetail}
            />
        </Stack.Navigator>
    )
}
export {FirstScreenNavigator}