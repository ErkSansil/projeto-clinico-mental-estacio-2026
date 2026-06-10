// arquivo app/cadastro-sucesso.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React from 'react';

// componentes nativos do React são usados nesta tela
import {
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  Text,
  // botão com clique e efeito ao toque
  TouchableOpacity,
  // componente base de estrutura e layout
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  useWindowDimensions,

} from 'react-native';

// biblioteca de ícones do Expo
// usado para exibir ícones visuais na interface da tela
import { Ionicons } from '@expo/vector-icons';

// aqui eu uso o router pra navegação entre telas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// componente da tela de cadastro realizado com sucesso
export default function CadastroSucessoScreen() {
  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >
        {/* fundo com bolas */}
        <View style={styles.backgroundDecor}>
          <View style={styles.blurCircleOne} />
          <View style={styles.blurCircleTwo} />
          <View style={styles.blurCircleThree} />
        </View>

      <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>

            {/* círculo com check de sucesso */}
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={54} color="#FFFFFF" />
            </View>

          {/* título principal da tela */}
          <Text style={styles.title}>Cadastro realizado</Text>

          {/* mensagem explicando que o cadastro deu certo */}
          <Text style={styles.subtitle}>
            Cadastro de estagiário realizado com sucesso!{'\n'}
            Acesse o sistema para continuar.
          </Text>

          {/* botão para voltar a tela de administrador */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.replace('/acesso-administrador')}
          >
            <Text style={styles.primaryText}>Voltar ao sistema de administrador</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )};

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por seção
const styles = StyleSheet.create({

  // fundo principal da tela
  // ocupa toda a altura disponível
  background: {
    flex: 1,
  },

  // fundo decorativo da tela
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

    // círculo decorativo grande 1
  blurCircleOne: {
    position: 'absolute',
    width: 520, // tamanho do círculo
    height: 520,
    borderRadius: 260, 
    backgroundColor: 'rgba(12, 112, 110, 0.08)', // cor verde suave com transparência
    top: -120, 
    left: -120,
  },

  // círculo decorativo grande 2
  blurCircleTwo: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(166, 189, 184, 0.18)', // tom neutro esverdeado claro
    right: -180,
    bottom: -180,
  },

  // círculo decorativo menor 
  blurCircleThree: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // branco translúcido para brilho
    right: 220,
    top: 120,
  },

  // container principal da tela 
  wrapper: {
    flex: 1, // ocupa toda a altura disponível
    justifyContent: 'center', // centraliza verticalmente
    paddingHorizontal: 22, // espaçamento lateral
    paddingVertical: 28, // espaçamento vertical
  },

  // ajuste do container no desktop 
  wrapperDesktop: {
    alignItems: 'center', // centraliza o card na horizontal
  },

  // card principal da tela
  card: {
    width: '100%', // ocupa largura total do container
    backgroundColor: '#FFFFFF', // fundo branco
    borderRadius: 18, // bordas arredondadas
    paddingHorizontal: 28, // espaçamento interno lateral
    paddingVertical: 32, // espaçamento interno vertical
    alignItems: 'center', // centraliza conteúdo interno
    shadowColor: '#A6BDB8', // cor da sombra
    shadowOpacity: 0.18, // intensidade da sombra
    shadowRadius: 22, // suavidade da sombra
    shadowOffset: { width: 0, height: 8 }, // direção da sombra
    elevation: 8, // sombra no Android
  },

  // limite de largura no desktop
  cardDesktop: {
    maxWidth: 430,
  },

  // área do ícone 
  iconWrapper: {
    position: 'relative', // base para elementos internos posicionados
    marginBottom: 22, // espaço abaixo do ícone
    justifyContent: 'center',
    alignItems: 'center',
  },

  // círculo principal do ícone de sucesso
  iconCircle: {
    width: 106,
    height: 106,
    borderRadius: 53, // 
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginBottom: 10,
  },

  // título principal da tela 
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#171717',
    marginBottom: 10,
    textAlign: 'center',
  },

  // subtítulo explicativo abaixo do título
  subtitle: {
    fontSize: 14,
    color: '#6E7C7A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  // botão principal de ação
  primaryButton: {
    width: '100%', // ocupa toda largura do card
    height: 44, // altura fixa
    backgroundColor: '#0C706E', // cor principal
    borderRadius: 6, // leve arredondamento
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  // texto do botão principal
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 14,
  },
});