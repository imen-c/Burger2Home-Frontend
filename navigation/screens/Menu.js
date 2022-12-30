import * as React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity , Image} from 'react-native';

import MenuItem from '../../components/MenuItem';

const listings = [
    {
      id: 1,
      title: "burger1",
      image: require("../../assets/burger.png"),
    },
    {
      id: 2,
      title: "Burger2",
      image: require("../../assets/burger.png"),
    },
    {
        id: 3,
        title: "Burger3",
        image: require("../../assets/burger.png"),
      },
      {
        id: 4,
        title: "Burger2",
        image: require("../../assets/burger.png"),
      },
      {
        id: 5,
        title: "Burger5",
        image: require("../../assets/burger.png"),
      },
      {
        id: 6,
        title: "Burger6",
        image: require("../../assets/burger.png"),
      },
      {
        id: 7,
        title: "Burger7",
        image: require("../../assets/burger.png"),
      },
  ];

export default function Menu({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.title}>Burgers</Text>
            </View>
            <View style={styles.filters}>
            <Text >Filters</Text>
            <TouchableOpacity style={styles.Button} >
                <Text style={styles.ButtonText}>Click Me!</Text>
            </TouchableOpacity>
            </View>
                
        <FlatList style={styles.listBurger}
        data={listings}
        keyExtractor={(burger) =>burger.id.toString()}
        renderItem ={({ item}) => (
          <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate('BurgerDetail' )} >
          <Image style={styles.image} source={item.image} />
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text >{item.description}</Text>
          </View>
        </TouchableOpacity>       
    )}/>


        

        
    </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7fffd4",
        alignItems: "center",
        justifyContent: "center",
      },

    header: {
        width: "100%",
        height: '8%',
        backgroundColor: "#deb887",
        position: "absolute",
        top: '5%',
        
     
    },
    title:{
        paddingTop: 15,
        left: 20,
        fontSize: 20,
        
    },
    filters:{
        width: "100%",
        height: '8%',
        position: "absolute",
        top: '13%',

    },
    
    listBurger: {
        backgroundColor: "white",
        position: "absolute",
        top: '21%',
        left: 20,
        right: 20,
    },
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
  });