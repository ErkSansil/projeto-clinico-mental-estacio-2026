// arquivo app/(tabs)/perfil.tsx
// aqui eu organizei essa tela e deixei os comentários explicando minha parte do código

import React from 'react';

// importando componentes básicos
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';

// hook de navegação
import { router } from 'expo-router';

// importando o gradiente pra deixar no mesmo padrão das telas
import { LinearGradient } from 'expo-linear-gradient';

// importando ícones
import { Ionicons } from '@expo/vector-icons';

// componente da tela de perfil do usuário
export default function PerfilScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // verificando se está em desktop
  const isDesktop = width >= 900;

  return (

    // fundo com gradiente
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >

      {/* círculos decorativos */}
      <View style={styles.backgroundDecor}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />
        <View style={styles.blurCircleThree} />
      </View>

      {/* estrutura principal */}
      <View style={styles.screen}>

        {/* sidebar desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* logo */}
            <View style={styles.logoBox}>
              <Text style={styles.psiSidebar}>Ψ</Text>

              <View>
                <Text style={styles.logoTextSidebar}>SEP</Text>

                <Text style={styles.logoSubSidebar}>
                  Clínica de Psicologia
                </Text>
              </View>
            </View>

            {/* área do menu */}
            <View style={styles.menuArea}>

              {/* administrador */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                <Image
                  source={require('../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Administrador
                </Text>
              </TouchableOpacity>

              {/* label */}
              <Text style={styles.menuLabel}>
                GERENCIAMENTO
              </Text>

              {/* agendamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/calendario-administrador')}
              >
                <Image
                  source={require('../assets/images/agendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Agendamentos
                </Text>
              </TouchableOpacity>

              {/* pacientes */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-admin')}
              >
                <Image
                  source={require('../assets/images/paciente.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Pacientes
                </Text>
              </TouchableOpacity>

              {/* salas */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-admin')}
              >
                <Image
                  source={require('../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Salas
                </Text>
              </TouchableOpacity>

              {/* cancelamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cancelamentos')}
              >
                <Image
                  source={require('../assets/images/cancelamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Cancelamentos
                </Text>
              </TouchableOpacity>

              {/* pedidos de reagendamento */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pedidos-reagendamentos')}
              >
                <Image
                  source={require('../assets/images/reagendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Pedidos Reagendamento
                </Text>
              </TouchableOpacity>

              {/* cadastrar estagiário */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cadastro')}
              >
                <Image
                  source={require('../assets/images/estagiario.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Cadastrar Estagiário
                </Text>
              </TouchableOpacity>

              {/* relatório de atendimentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                <Image
                  source={require('../assets/images/relatorio2.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Relatório Atendimentos
                </Text>
              </TouchableOpacity>

              {/* perfil ativo */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  styles.menuActive,
                ]}
              >
                <Image
                  source={require('../assets/images/perfil.png')}
                  style={styles.menuIcon}
                />

                <Text
                  style={[
                    styles.menuText,
                    styles.menuTextActive,
                  ]}
                >
                  Perfil
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

        {/* conteúdo principal */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* card principal */}
          <View
            style={[
              styles.card,
              isDesktop && styles.cardDesktop,
              !isDesktop && styles.cardMobile
            ]}
          >

            {/* logo central */}
            <View style={styles.logoArea}>
              <Text style={styles.psi}>Ψ</Text>

              <View>
                <Text style={styles.logoText}>SEP</Text>

                <Text style={styles.logoSubtitle}>
                  CLÍNICA DE PSICOLOGIA
                </Text>
              </View>
            </View>

            {/* título */}
            <Text style={styles.title}>
              Perfil do Usuário
            </Text>

            {/* subtítulo */}
            <Text style={styles.subtitle}>
              Informações da conta do estagiário
            </Text>

            {/* card informações */}
            <View style={styles.infoCard}>

              {/* cabeçalho */}
              <View style={styles.infoHeader}>
                <Text style={styles.infoHeaderText}>
                  Dados do Usuário
                </Text>
              </View>

              {/* conteúdo */}
              <View style={styles.infoBody}>

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Nome</Text>

                  <Text style={styles.value}>
                    Paulo Oliveira
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Perfil</Text>

                  <Text style={styles.value}>
                    Administrador
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>E-mail</Text>

                  <Text style={styles.value}>
                    paulo@sep.com
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Função</Text>

                  <Text style={styles.value}>
                    Acompanhamento clínico e registros
                  </Text>
                </View>

              </View>
            </View>

            {/* card acesso */}
            <View style={styles.accessCard}>

              {/* cabeçalho */}
              <View style={styles.accessHeader}>
                <Text style={styles.accessHeaderText}>
                  Acesso
                </Text>
              </View>

              {/* conteúdo */}
              <View style={styles.accessBody}>

                {/* botão sair */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  activeOpacity={0.85}
                  onPress={() => {
                    router.replace('/login');
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.logoutText}>
                    Sair da Conta
                  </Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

// estilos da tela
const styles = StyleSheet.create({

  // fundo geral
  background: {
    flex: 1,
  },

  // decoração do fundo
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // círculo decorativo
  blurCircleOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(12,112,110,0.08)',
    top: -120,
    left: -120,
  },

  // círculo decorativo
  blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166,189,184,0.18)',
    right: -180,
    bottom: -160,
  },

  // círculo decorativo
  blurCircleThree: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.7)',
    right: 100,
    top: 120,
  },

  // estrutura principal
  screen: {
    flex: 1,
    flexDirection: 'row',
  },

  // sidebar
  sidebar: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#DCEBE7',
    paddingTop: 28,
  },

  // logo sidebar
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  // símbolo psi
  psiSidebar: {
    fontSize: 38,
    color: '#0C706E',
    fontWeight: '700',
  },

  // texto sep
  logoTextSidebar: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '700',
  },

  // subtítulo sidebar
  logoSubSidebar: {
    fontSize: 12,
    color: '#70808A',
    marginTop: 2,
  },

  // área menu
  menuArea: {
    paddingHorizontal: 16,
  },

  // label menu
  menuLabel: {
    fontSize: 11,
    color: '#8A98A3',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 1,
  },

  // item menu
  menuItem: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },

  // item ativo
  menuActive: {
    backgroundColor: '#E9F7F5',
  },

  // ícone menu
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#0C706E',
  },

  // texto menu
  menuText: {
    fontSize: 15,
    color: '#70808A',
    fontWeight: '500',
  },

  // texto ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // conteúdo
  content: {
    flex: 1,
  },

  // scroll
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  // card principal
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

  // card desktop
  cardDesktop: {
    maxWidth: 520,
    alignSelf: 'center',
  },

  // card mobile
  cardMobile: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // logo central
  logoArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  // símbolo psi
  psi: { 
    fontSize: 60, 
    color: '#0C706E', 
    fontWeight: '700' 
  },

  logoText: { 
    fontSize: 28, 
    fontWeight: '900',
    color: '#0C706E' 
  },

  logoSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0C706E',
    letterSpacing: 0.4,
  },

  // subtitulo no desktop
  logoSubtitleDesktop: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'left',
  },

  // título
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: '#171717',
    marginBottom: 8,
  },

  // subtítulo
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7A8583',
    marginBottom: 24,
  },

  // card informações
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },

  // cabeçalho informações
  infoHeader: {
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // texto cabeçalho
  infoHeaderText: {
    color: '#0C706E',
    fontSize: 16,
    fontWeight: '500',
  },

  // corpo informações
  infoBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  // bloco individual
  infoBlock: {
    marginBottom: 14,
  },

  // label
  label: {
    fontSize: 11,
    fontWeight: '400',
    color: '#7B8986',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  // valor
  value: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E3A38',
  },

  // card acesso
  accessCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // cabeçalho acesso
  accessHeader: {
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // texto cabeçalho
  accessHeaderText: {
    color: '#0C706E',
    fontSize: 16,
    fontWeight: '500',
  },

  // corpo acesso
  accessBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  // botão sair
  logoutButton: {
    height: 48,
    backgroundColor: '#0C706E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  // texto sair
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },

});