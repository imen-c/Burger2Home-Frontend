import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '../config/colors';

function MenuItem({title,description,photo}) {
    return (
        <View style={styles.container}>
        <Image style={styles.image} source={photo} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text >{description}</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
container: {
flexDirection: "row",
marginBottom: 20,


},
image: {
width: 120,
height: 120,
borderRadius: 10,
marginRight: 10
}
    

})

export default MenuItem;