import * as React from 'react';
import { View,StyleSheet, Text } from 'react-native';

export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={{color: "white"}}>HEADER</Text>
            </View>


            

            
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
        height: "15%",
        backgroundColor: "black",
        position: "absolute",
        top: 40,
        
     
    },
    body: {
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
  });