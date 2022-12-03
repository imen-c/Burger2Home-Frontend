import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function MenuItem({title,decription,price}) {
    return (
       <View style={styles.container}>
           <image source={require('./assets/burger.png')}/>
           <View>
            <Text>{title}</Text>
            <Text>{description}</Text>
           </View>
       </View>
    );
}

const styles = StyleSheet.create({
container: {
flexDirection: "row"


},
image: {
width: 90,
height: 90,
borderRadius: 10,
marginRight: 10
}
    

})

export default MenuItem;