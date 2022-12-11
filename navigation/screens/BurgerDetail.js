import * as React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';

export default function BurgerDetail({}) {
    return (
        <View >
            <Image style={styles.image} source={require("../../assets/burger.png")}/>
        
    </View>
    );
  }

  const styles = StyleSheet.create({
   image:{

    width: '100%',
    height: 400,
    borderBottomEndRadius: 30,
    
   },





  })