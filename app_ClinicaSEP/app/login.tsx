import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.logoCircle}>
          <Text style={styles.logo}>Ψ</Text>
        </View>

        <Text style={styles.title}>Clínica SEP</Text>
        <Text style={styles.subtitle}>
          Bem-vindo ao sistema da Clínica SEP
        </Text>

        <Text style={styles.label}>Usuário</Text>
        <TextInput placeholder="Digite seu usuário" style={styles.input} />

        <Text style={styles.label}>Senha</Text>
        <TextInput placeholder="Digite sua senha" secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.link}>Criar conta</Text>
        <Text style={styles.linkSecondary}>Esqueci minha senha</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cfe3d8",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f2f4f7",
    width: "90%",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e6eaf0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
  },
  button: {
    backgroundColor: "#5f8575",
    width: "100%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#5f8575",
  },
  linkSecondary: {
    marginTop: 5,
  },
});