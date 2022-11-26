import * as React from 'react';
import { View, Text } from 'react-native';

export default function Menu({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
            onPress={() => alert('This is the MENU screen.')}
            style={{ fontSize: 26, fontWeight: 'bold' }}>Menu Screen</Text>
    </View>
    );
  }