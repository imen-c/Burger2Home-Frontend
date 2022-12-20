import * as React from 'react';
import { View, Text, Image,StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Octicons} from '@expo/vector-icons';
import { Button } from 'react-native';


export default function BurgerDetail({}) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
            <Image style={styles.image} source={require("../../assets/burger.png")}/>
            <Text style={styles.title}>Nom du burger</Text>
            
            </View>
            <View style={styles.textContainer}>
            <Text style={styles.idescription}>description du burger</Text>
            <TouchableOpacity style={{width: '100%', height: 40,}}>
            <Text>Allergens <Octicons name="info" size={18} color="black" /></Text>
            
          </TouchableOpacity >
            </View>
            <TouchableOpacity style={styles.addButton}>
            <Text style={{textAlign: 'center'}}>AddToCart: 19,90 </Text>
            
          </TouchableOpacity>
            

        
    </View>
    
    );
  }

  const styles = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%',

    },
    imageContainer:{
        position:'absolute',
        top: 0,
        width:'100%',
        height : '40%',


    },
    textContainer:{
        position: 'absolute',
        borderTopRightRadius: 30,
        bottom: 70,

    },
   image:{
    height: '100%',
    width: '100%',
    
    
    
   },
   title:{

    fontSize: 24,
    fontWeight: "500",
    tintColor: `#fffaf0`,
    
    
   },
   idescription:{

    
    
   },
   allergButtons:{
    width: '100%',
    height: 100,
    
    
    
},
addButton:{
    position:'absolute',
    display: 'flex',
    justifyContent:'center',
    backgroundColor: `#dcdcdc`,
    bottom:25,
    height: 40,
    width:'100%',

}





  })