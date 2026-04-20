import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function Dashboard() {
  const { user, logout } = useAuth();

  function sair() {
    logout();
    router.replace("/login");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user?.name}</Text>
      <Button title="Sair" onPress={sair} />
    </View>
  );
}