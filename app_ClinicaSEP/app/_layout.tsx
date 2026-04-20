import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { Redirect, useSegments } from "expo-router";

function Guard() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const inAuthRoute = segments[0] === "login";

  // não logado tentando acessar dashboard
  if (!user && !inAuthRoute) {
    return <Redirect href="/login" />;
  }

  // logado tentando ir pro login
  if (user && inAuthRoute) {
    return <Redirect href="/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <Guard />
    </AuthProvider>
  );
}