// arquivo app/(tabs)/perfil.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React from 'react';

// componentes nativos do React são usados nesta tela
import {
  // permite rolagem vertical na tela
  ScrollView,
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

// hook de navegação
import { useRouter } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// menu lateral do desktop, apenas no desktop, no mobile a navegação é diferente.
// lista de navegação principal da aplicação
const menuItems = [
  ['calendar-outline', 'Agenda', '/(tabs)'],
  ['people-outline', 'Pacientes', '/(tabs)/pacientes'],
  ['business-outline', 'Salas', '/(tabs)/salas'],
  ['notifications-outline', 'Notificacoes', '/(tabs)/notificacoes'],
  ['person-outline', 'Perfil', '/(tabs)/perfil'],
];

// pega largura da tela para aplicar responsividade
export default function PerfilScreen() {
  // hook pra navegação entre telas
  const router = useRouter();

  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  /// considera se é mobile quando a tela é menor que 900
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

      <View style={styles.screen}>
        {/* sidebar desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* logo da clínica */}
            <View style={styles.logoBox}>
              <Text style={styles.psiSidebar}>Ψ</Text>

              <View>
                <Text style={styles.logoTextSidebar}>SEP</Text>
                <Text style={styles.logoSubSidebar}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* área do menu lateral */}
            <View style={styles.menuArea}>
              {menuItems.map(([icon, label, path]) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.menuItem,
                    label === 'Perfil' && styles.menuActive,
                  ]}
                  onPress={() => router.push(path as any)}
                >
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={label === 'Perfil' ? '#0C706E' : '#70808A'}
                  />

                  <Text
                    style={[
                      styles.menuText,
                      label === 'Perfil' && styles.menuTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>       
          </View>
        )}

        {/* conteúdo principal */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* card principal do perfil */}
          <View style={[styles.card, isDesktop && styles.cardDesktop, !isDesktop && styles.cardMobile]}>

            {/* área da logo da clínica */}
            <View style={styles.logoArea}>
              <Text style={styles.psiCard}>Ψ</Text>

              {/* conteúdo da logo */}
              <View>
                <Text style={styles.logoTextCard}>SEP</Text>
                <Text style={styles.logoSubCard}>CLÍNICA DE PSICOLOGIA</Text>
              </View>
            </View>

            {/* título da página */}
            <Text style={styles.title}>Perfil do Usuário</Text>

            {/* subtítulo da página */}
            <Text style={styles.subtitle}>Informações da conta do estagiário</Text>

            {/* card de informações do usuário */}
            <View style={styles.infoCard}>

              {/* cabeçalho do card de informações */}
              <View style={styles.infoHeader}>
                <Text style={styles.infoHeaderText}>Dados do Usuário</Text>
              </View>

              {/* corpo do card de informações */}
              <View style={styles.infoBody}>

                {/* bloco do nome */}
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Nome</Text>
                  <Text style={styles.value}>Paulo Oliveira</Text>
                </View>

                {/* bloco do perfil de estagiario */}
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Perfil</Text>
                  <Text style={styles.value}>Estagiário</Text>
                </View>

                {/* bloco do e-mail */}
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>E-mail</Text>
                  <Text style={styles.value}>paulo@sep.com</Text>
                </View>

                {/* bloco da função */}
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Função</Text>
                  <Text style={styles.value}>
                    Acompanhamento clínico e registros
                  </Text>
                </View>
              </View>
            </View>

            {/* card de acesso */}
            <View style={styles.accessCard}>

              {/* cabeçalho do card de acesso */}
              <View style={styles.accessHeader}>
                <Text style={styles.accessHeaderText}>Acesso</Text>
              </View>

              {/* corpo do card de acesso */}
              <View style={styles.accessBody}>

                {/* botão para sair da conta */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  activeOpacity={0.85}
                  onPress={() => {
                    router.replace('/login');
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />

                  <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>      
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

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

    // círculo decorativo superior esquerdo
  blurCircleOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(12,112,110,0.08)',
    top: -120,
    left: -120,
  },

  // círculo decorativo inferior direito
  blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166,189,184,0.18)',
    right: -180,
    bottom: -160,
  },

  // círculo decorativo central
  blurCircleThree: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.7)',
    right: 100,
    top: 120,
  },

  // área principal da tela
  screen: {
    flex: 1,
    flexDirection: 'row',
  },

  // menu lateral
  sidebar: {
    width: 245,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E6ECEA',
  },

  // área da logo
  logoBox: {
    height: 118,
    backgroundColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
    borderBottomRightRadius: 18,
  },

  // símbolo da psicologia
  psiSidebar: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // texto principal da logo
  logoTextSidebar: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // subtítulo da logo
  logoSubSidebar: {
    fontSize: 12,
    color: '#EAF6F2',
    marginTop: 2,
  },

  // área do menu
  menuArea: {
    paddingTop: 18,
  },

  // item do menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },

  // item ativo do menu
  menuActive: {
    backgroundColor: '#EAF6F2',
  },

  // texto do menu
  menuText: {
    fontSize: 15,
    color: '#4B5F68',
    fontWeight: '400',
  },

  // texto do menu ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // conteúdo principal
  content: {
    flex: 1,
  },

  // área de conteúdo da rolagem
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  // card principal da tela
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: '#A6BDB8',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  // largura máxima do card no desktop
  cardDesktop: {
    maxWidth: 520,
    alignSelf: 'center',
  },

  // espaçamento reduzido do card no mobile
  cardMobile: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // área da logo
  logoArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  // símbolo psi da logo
  psiCard: { 
    fontSize: 60, 
    color: '#0C706E', 
    fontWeight: '700' 
  },

  // texto principal da logo
  logoTextCard: { 
    fontSize: 28, 
    fontWeight: '900',
    color: '#0C706E' 
  },

  // subtítulo da logo
  logoSubCard: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0C706E',
    letterSpacing: 0.4,
  },

  // ajuste do subtítulo da logo no desktop
  logoSubDesktop: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'left',
  },

  // título da página
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: '#171717',
    marginBottom: 8,
  },

  // subtítulo da página
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7A8583',
    marginBottom: 24,
  },

  // card de informação
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },

  // cabeçalho do card de informação
  infoHeader: {
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // texto do cabeçalho de informação
  infoHeaderText: {
    color: '#0C706E',
    fontSize: 16,
    fontWeight: '500',
  },

  // corpo do card de informação
  infoBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  // bloco de informação
  infoBlock: {
    marginBottom: 14,
  },

  // label da informação
  label: {
    fontSize: 11,
    fontWeight: '400',
    color: '#7B8986',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  // valor da informação
  value: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E3A38',
  },

  // card de acesso
  accessCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // cabeçalho do card de acesso
  accessHeader: {
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // texto do cabeçalho de acesso
  accessHeaderText: {
    color: '#0C706E',
    fontSize: 16,
    fontWeight: '500',
  },

  // corpo do card de acesso
  accessBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  // botão de sair da conta
  logoutButton: {
    height: 48,
    backgroundColor: '#0C706E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  // texto do botão de sair
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  });