import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import MenuList from './screens/MenuList';
import BurgerDetail from './screens/BurgerDetail';


const Stack = createStackNavigator()

const FirstScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="MenuList"
                component={MenuList}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="BurgerDetail"
                component={BurgerDetail}
                
            />
        </Stack.Navigator>
    )
}
export {FirstScreenNavigator}