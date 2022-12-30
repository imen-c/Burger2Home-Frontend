import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../config/colors';

function MenuItem({title,description,photo}) {
    return (
        <TouchableOpacity style={styles.container} onPress={()=>navigation.navigate("BurgerDetail", {msg: "I came From Screen1"})}>
        <Image style={styles.image} source={photo} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text >{description}</Text>
        </View>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
container: {
flexDirection: "row",
marginBottom: 20,


},
image: {
width: 150,
height: 180,
borderRadius: 10,
marginRight: 10
}
    

})

export default MenuItem;