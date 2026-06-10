// arquivo app/agendamento-sucesso.tsx 

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

// router pra navegação entre telas
import { router } from 'expo-router';

// componente principal da tela de sucesso
export default function AgendamentoSucessoScreen() {
  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 700
  const isMobile = width < 700;

  return (
    // container principal da tela
    <View style={styles.screen}>
      {/* elementos decorativos de fundo (bolas) */}
      <View style={styles.circleLeft} />
      <View style={styles.circleRightTop} />
      <View style={styles.circleRightBottom} />

      {/* card central */}
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        
        {/* área da logo */}
        <View style={styles.logoArea}>
          <Text style={styles.psi}>Ψ</Text>

          <View>
            <Text style={styles.logoText}>SEP</Text>
            <Text style={styles.logoSub}>CLÍNICA DE PSICOLOGIA</Text>
          </View>
        </View>

        {/* círculo com ícone de sucesso */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={42} color="#FFFFFF" />
        </View>

        {/* título principal */}
        <Text style={styles.title}>Agendamento realizado!</Text>

        {/* mensagem de confirmação */}
        <Text style={styles.subtitle}>
          O agendamento foi salvo com sucesso no sistema.
        </Text>

        {/* botão principal (voltar pra agenda) */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Voltar para agenda</Text>
        </TouchableOpacity>

        {/* botão secundário (criar novo agendamento) */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/novo-agendamento')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-outline" size={22} color="#087A73" />
          <Text style={styles.secondaryButtonText}>Novo agendamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por seção
const styles = StyleSheet.create({
  screen: {
    flex: 1, // ocupa a tela inteira
    backgroundColor: '#F7FCFA', // fundo bem clarinho
    justifyContent: 'center', // centraliza verticalmente
    alignItems: 'center', // centraliza horizontalmente
    paddingHorizontal: 24, // espaçamento lateral
  },

  // bolha decorativa da esquerda
  circleLeft: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: '#DCEFEB',
    opacity: 0.85,
    left: -150,
    top: -125,
  },

  // bolha decorativa superior direita
  circleRightTop: {
    position: 'absolute',
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
    right: 240,
    top: 160,
  },

  // bolha decorativa inferior direita
  circleRightBottom: {
    position: 'absolute',
    width: 470,
    height: 470,
    borderRadius: 235,
    backgroundColor: '#DCEFEB',
    opacity: 0.85,
    right: -95,
    bottom: -185,
  },

  // card central onde fica o conteúdo
  card: {
    width: '100%',
    maxWidth: 430, // limita largura no desktop
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 36,
    alignItems: 'center',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  // ajuste de padding para mobile
  cardMobile: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // área da logo
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },

  // símbolo ψ
  psi: {
    fontSize: 50,
    color: '#087A73',
    fontWeight: '700',
    lineHeight: 58,
  },

  // texto SEP
  logoText: {
    fontSize: 30,
    color: '#087A73',
    fontWeight: '700',
  },

  // subtítulo da logo
  logoSub: {
    fontSize: 12,
    color: '#087A73',
    letterSpacing: 0.3,
  },

  // círculo do ícone de sucesso
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#087A73',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  // título principal
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#087A73',
    textAlign: 'center',
    marginBottom: 8,
  },

  // texto de apoio
  subtitle: {
    fontSize: 14,
    color: '#6B7C86',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
  },

  // botão principal (verde)
  primaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#087A73',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  // texto do botão principal
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },

  // botão secundário (outline)
  secondaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E5E1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  // texto do botão secundário
  secondaryButtonText: {
    color: '#087A73',
    fontSize: 15,
    fontWeight: '500',
  },
});