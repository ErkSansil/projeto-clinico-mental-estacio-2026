import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text>Ir para Login</Text>
      </TouchableOpacity>
    </View>
  );
}