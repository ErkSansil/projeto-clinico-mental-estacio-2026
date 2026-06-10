// arquivo app/(admin)salas-administrador.tsx
// tela de salas padronizada com o restante do sistema administrativo

import React from 'react';

// componentes nativos do React são usados nesta tela
import {
  // barra de rolagem na tela
  ScrollView,
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  // componente de botão deslizante usado para ativar ou desativar opções
  TextInput,
  Text,
  // botão com clique e efeito ao toque
  TouchableOpacity,
  // componente base de estrutura e layout
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  useWindowDimensions,

} from 'react-native';

// router pra navegação entre telas
import { router } from 'expo-router';

// importa imagens para adicionar ícones ao sidebar
import { Image } from 'react-native';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// mock de salas apenas para exemplos
const salas = [
  { nome: 'Sala 1', status: 'Livre', horario: '08:00 - 09:00' },
  { nome: 'Sala 2', status: 'Ocupada', horario: '09:00 - 10:00' },
  { nome: 'Sala 3', status: 'Livre', horario: '10:00 - 11:00' },
  { nome: 'Sala 4', status: 'Ocupada', horario: '11:00 - 12:00' },
  { nome: 'Sala Infantil', status: 'Ocupada', horario: '14:00 - 15:00' },
  { nome: 'Sala de Grupos', status: 'Livre', horario: '15:00 - 16:00' },
  { nome: 'Sala de Supervisão', status: 'Livre', horario: '16:00 - 17:00' },
];

// tela de salas para administrador
export default function SalasAdminScreen() {
  
  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar administrador */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* logo */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>
              <View>
                <Text style={styles.logoText}>SEP</Text>
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* menu */}
            <View style={styles.menuArea}>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                <Image
                  source={require('../../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Administrador</Text>
              </TouchableOpacity>

              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/calendario-administrador')}
              >
                <Image
                  source={require('../../assets/images/agendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Agendamentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-administrador')}
              >
                <Image
                  source={require('../../assets/images/paciente.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Pacientes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.menuActive,]}>

                <Image
                  source={require('../../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text
                  style={[ styles.menuText, styles.menuTextActive,]}>Salas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cancelamentos')}
              >
                <Image
                  source={require('../../assets/images/cancelamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Cancelamentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pedidos-reagendamentos')}
              >
                <Image
                  source={require('../../assets/images/reagendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Pedidos reagendamento</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cadastro-estagiario')}
              >
                <Image
                  source={require('../../assets/images/estagiario.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Cadastrar Estagiário</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                <Image
                  source={require('../../assets/images/relatorio2.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Relatório Atendimentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/perfil-administrador')}
              >
                <Image
                  source={require('../../assets/images/perfil.png')}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* área principal do conteúdo */}
        <ScrollView contentContainerStyle={styles.contentMobile}>

          {/* decoração */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />
          <View style={styles.decorDotOne} />
          <View style={styles.decorDotTwo} />
          <View style={styles.decorDotThree} />

          {/* header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Salas da Clínica</Text>

              <Text style={styles.subtitle}>Gerencie disponibilidade, ocupação e horários das salas.</Text>
            </View>
          </View>

          {/* pesquisa */}
          <View style={styles.searchCard}>
            <TextInput
              placeholder="Pesquisar sala..."
              placeholderTextColor="#8A98A3"
              style={styles.searchInput}
            />
          </View>

          {/* cards */}
          <View style={[styles.cardsWrap, isDesktop && styles.cardsWrapDesktop]}>
            {salas.map((sala, index) => (
              <View
                key={index}
                style={[styles.card, isDesktop && styles.cardDesktop]}
              >

                <View style={styles.cardTop}>
                  <View style={styles.roomIcon}>
                    <Text style={styles.roomIconText}>▥</Text>
                  </View>

                  <View style={styles.cardTopInfo}>
                    <Text style={styles.cardTitle}>
                      {sala.nome}
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      {sala.horario}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.badge,
                    sala.status === 'Livre'
                      ? styles.badgeFree
                      : styles.badgeBusy,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      sala.status === 'Livre'
                        ? styles.badgeTextFree
                        : styles.badgeTextBusy,
                    ]}
                  >
                    {sala.status}
                  </Text>
                </View>
              </View>
            ))}
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

  // estrutura geral da página
  page: {
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

  // logo da clinica
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  // simbolo da psicologia
  psi: {
    fontSize: 38,
    color: '#0C706E',
    fontWeight: '700',
  },

  // texto sep
  logoText: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '700',
  },

  // subtitulo
  logoSub: {
    fontSize: 12,
    color: '#70808A',
    marginTop: 2,
  },

  // área menu
  menuArea: {
    paddingHorizontal: 16,
  },

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

  // menu icone
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#0C706E',
  },

  // menu text
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

  // estrutura geral da tela
  content: {
    flex: 1,
  },

  // rolagem da tela
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  // círculo decorativo grande do lado esquerdo
  decorCircleOne: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: '#DCEFEB',
    opacity: 0.55,
    left: -110,
    top: 120,
  },

  // círculo decorativo do lado direito
  decorCircleTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#E3F3EF',
    opacity: 0.75,
    right: -90,
    top: 230,
  },

  // círculo decorativo inferior
  decorCircleThree: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#DDEFEA',
    opacity: 0.45,
    left: 40,
    bottom: 80,
  },

  // bolinha decorativa superior
  decorDotOne: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF6F2',
    top: 52,
    left: '58%',
  },

  // bolinha decorativa lateral esquerda
  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    top: 300,
    left: 40,
  },

  // bolinha decorativa superior direita
  decorDotThree: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  // cabeçalho principal da tela
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // título principal da página
  title: {
    fontSize: 30,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo explicativo da página
  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 4,
    lineHeight: 21,
  },

  // botão de criar nova sala/agendamento
  newButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#087A73',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão principal
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // card da área de pesquisa
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 16,
    marginBottom: 18,
  },

  // campo de pesquisa
  searchInput: {
    fontSize: 15,
    color: '#17262F',
  },

  // container dos cards
  cardsWrap: {
    gap: 12,
  },

  // organização dos cards no desktop
  cardsWrapDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // card principal das salas
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 18,
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // largura do card no desktop
  cardDesktop: {
    width: '48.8%',
  },

  // topo do card
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  // círculo do ícone da sala
  roomIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  // ícone/texto da sala
  roomIconText: {
    fontSize: 24,
    color: '#087A73',
  },

  // área de informações do topo do card
  cardTopInfo: {
    flex: 1,
  },

  // título do card
  cardTitle: {
    fontSize: 17,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo ou descrição do card
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
  },

  // badge de status do card
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },

  // cor da badge quando está disponível
  badgeFree: {
    backgroundColor: '#DDF5EB',
  },

  // cor da badge quando está ocupada
  badgeBusy: {
    backgroundColor: '#FFE1E5',
  },

  // texto padrão da badge
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // cor do texto da badge disponível
  badgeTextFree: {
    color: '#087A73',
  },

  // cor do texto da badge ocupada
  badgeTextBusy: {
    color: '#E03131',
  },

  // botão para visualizar detalhes
  detailsButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EAF6F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão de detalhes
  detailsText: {
    color: '#087A73',
    fontSize: 14,
    fontWeight: '600',
  },
});