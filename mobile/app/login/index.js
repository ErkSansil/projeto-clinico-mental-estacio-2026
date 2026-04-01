import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';



export default function Home() {
  return (
    <LinearGradient
      colors={['#0a2d75', '#0f4fb3', '#2b81db']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
            <View style={styles.logoCircle}>
            <Image
                source={require('../midia/simboloPsicologia.avif')}
                style={styles.logoImage}
                contentFit="contain"
            />
            </View>

          <Text style={styles.title}>Clínica SEP</Text>
          <Text style={styles.subtitle}>Acesso ao sistema clínico</Text>

          <View style={styles.formArea}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#7f8898"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#7f8898"
              secureTextEntry
            />

            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </Pressable>

            <Pressable>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#00143d',
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 10,
  },
  logoCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#f1f8ff',
    borderWidth: 2,
    borderColor: '#d3e7ff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
  },
  logoLeaf: {
    position: 'absolute',
    width: 18,
    height: 30,
    borderRadius: 16,
    backgroundColor: '#67cd8f',
  },
  logoSymbol: {
    fontSize: 102,
    lineHeight: 102,
    fontWeight: '900',
    color: '#27272c',
  },
  title: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: '800',
    color: '#1b2640',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 15,
    color: '#4f5a70',
  },
  formArea: {
    width: '100%',
  },
  label: {
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#2f3a50',
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d8e6',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 15,
    color: '#1d2432',
  },
  loginButton: {
    marginTop: 4,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0f4fb3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f6f9ff',
  },
  forgotPassword: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 13,
    color: '#3f679e',
    fontWeight: '600',
  },
});