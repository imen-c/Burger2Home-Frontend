import * as React from 'react';
import { View, Text } from 'react-native';

export default function Home({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
            onPress={() => alert('MyB2h')}
            style={{ fontSize: 26, fontWeight: 'bold' }}>MYB2H</Text>
    </View>
    );
  }