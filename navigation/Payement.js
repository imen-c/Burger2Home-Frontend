import * as React from "react";
import {
  CardField,
  useConfirmPayment,
  useStripe,
  StripeProvider,
} from "@stripe/stripe-react-native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";

const Payement = () => {
  const stripe = useStripe();
  const [name, setName] = React.useState("");

  const subscribe = async () => {
    try {
    } catch (err) {
      Alert.alert("Une erreur est survenue");
    }
  };
  return (
    <View>
      <Text>Payement</Text>
      <TextInput
        style={{ width: 300, fontSize: 20, padding: 10, borderWidth: 1 }}
        placeholder="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button title="Subscribe - 25 INR" onPress={subscribe} />
    </View>
  );
};

export default Payement;
