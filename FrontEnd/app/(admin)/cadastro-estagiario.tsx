// arquivo app/cadastr-estagiario.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState } from 'react';

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

// router pra navegação entre telas
import { router } from 'expo-router';

// hook de autenticação para salvar o tipo de conta no contexto do cadastro
import { useAuth } from '../../contexts/AuthContext';

// importando imagem para icones
import { Image } from 'react-native';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// tela principal de cadastro
export default function CadastroScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // define se é mobile ou desktop baseado na largura da tela
  const isDesktop = width >= 900;

  // estado do tipo de usuário
  const [tipoUsuario, setTipoUsuario] = useState<'admin' | 'estagiario'>('admin');

  // acessa o contexto para salvar o tipo de conta antes de seguir para os dados pessoais
  const { atualizarDadosCadastro } = useAuth();

  return (

    // fundo principal da tela
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >

      {/* decoração do fundo */}
      <View style={styles.backgroundDecor}>
        <View style={styles.decorCircleOne} />
        <View style={styles.decorCircleTwo} />
        <View style={styles.decorCircleThree} />
        <View style={styles.decorDotOne} />
        <View style={styles.decorDotTwo} />
        <View style={styles.decorDotThree} />
        <View style={styles.decorDotFour} />
        <View style={styles.decorDotFive} />
        <View style={styles.decorDotSix} />
        <View style={styles.decorDotSeven} />
      </View>

      {/* estrutura geral da página (container principal que envolve sidebar e conteúdo) */}
      <View style={styles.page}>

        {/* sidebar lateral exibida somente em telas desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* área do logo da aplicação (identidade visual da clínica) */}
            <View style={styles.logoBox}>

              {/* símbolo principal da marca */}
              <Text style={styles.psi}>Ψ</Text>

              {/* bloco de textos do logo */}
              <View>

                {/* nome da aplicação */}
                <Text style={styles.logoText}>SEP</Text>
                {/* subtítulo da clínica */}
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* área de navegação do menu lateral */}
            <View style={styles.menuArea}>

              {/* item de menu: acesso ao painel do administrador */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                {/* ícone do item de menu */}
                <Image
                  source={require('../../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item de menu */}
                <Text style={styles.menuText}>Administrador</Text>
              </TouchableOpacity>

              {/* separador de seção do menu */}
              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              {/* item de menu: agendamentos */}
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

              {/* item de menu: pacientes */}
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

              {/* item de menu: salas */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-administrador')}
              >
                <Image
                  source={require('../../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Salas</Text>
              </TouchableOpacity>

              {/* item de menu: cancelamentos */}
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

              {/* item de menu: pedidos de reagendamentos */}
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

              {/* item de menu ativo: cadastro de estagiário (estado selecionado) */}
              <TouchableOpacity style={[styles.menuItem, styles.menuActive,]}>

                <Image
                  source={require('../../assets/images/estagiario.png')}
                  style={styles.menuIcon}
                />

                <Text style={[styles.menuText,styles.menuTextActive,]}>Cadastrar Estagiário</Text>
              </TouchableOpacity>

              {/* item de menu: relatorio atendimentos */}
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

              {/* item de menu: perfil do administrador */}
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

        {/* conteúdo principal */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* container central */}
          <View style={styles.wrapper}>

            {/* card principal */}
            <View style={[styles.card, isDesktop && styles.cardDesktop]}>

              {/* topo */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Criar conta</Text>
                  <Text style={styles.subtitle}>Selecione o tipo de conta que deseja criar</Text>
                </View>
              </View>

              {/* etapas */}
              <View style={styles.stepsContainer}>

                {/* etapa ativa */}
                <View style={styles.stepItem}>
                  <View style={styles.stepActive}>
                    <Text style={styles.stepActiveText}>1</Text>
                  </View>
                  <Text style={styles.stepLabelActive}>Tipo de conta</Text>
                </View>
                <View style={styles.stepLine} />

                {/* etapa */}
                <View style={styles.stepItem}>
                  <View style={styles.stepInactive}>
                    <Text style={styles.stepInactiveText}>2</Text>
                  </View>
                  <Text style={styles.stepLabel}>Dados pessoais</Text>
                </View>
                <View style={styles.stepLine} />

                {/* etapa */}
                <View style={styles.stepItem}>
                  <View style={styles.stepInactive}>
                    <Text style={styles.stepInactiveText}>3</Text>
                  </View>
                  <Text style={styles.stepLabel}>Dados de acesso</Text>
                </View>
                <View style={styles.stepLine} />

                {/* etapa */}
                <View style={styles.stepItem}>
                  <View style={styles.stepInactive}>
                    <Text style={styles.stepInactiveText}>4</Text>
                  </View>
                  <Text style={styles.stepLabel}>Concluir</Text>
                </View>
              </View>

              {/* opção de estagiário */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.optionCard,
                  tipoUsuario === 'estagiario' &&
                  styles.optionCardSelected,
                ]}
                onPress={() => setTipoUsuario('estagiario')}
              >

                {/* círculo do ícone */}
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="school-outline"
                    size={36}
                    color="#087A73"
                  />
                </View>

                {/* textos */}
                <View style={styles.optionTextArea}>
                  <Text style={styles.optionTitle}>Estagiário</Text>

                  <Text style={styles.optionDescription}>
                    Acesso para gerenciar atendimentos e pacientes sob supervisão.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* botão continuar */}
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => {
                  // salva o tipo como estagiário no contexto antes de avançar
                  atualizarDadosCadastro({ tipo: 'estagiario' });
                  router.push('/dados-pessoais');
                }}
              >
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
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

  // estrutura geral
  page: {
    flex: 1,
    flexDirection: 'row',
  },

  // decoração absoluta
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // sidebar
  sidebar: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#DCEBE7',
    paddingTop: 28,
  },

  // logo do sidebar
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  // símbolo psi do sidebar
  psi: {
    fontSize: 38,
    color: '#0C706E',
    fontWeight: '700',
  },

  // texto sep do sidebar
  logoText: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '700',
  },

  // subtítulo do sidebar
  logoSub: {
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

  // scroll
  scrollContent: {
  flexGrow: 1,
  justifyContent: 'center',
  paddingHorizontal: 24,
  paddingVertical: 24,
},

  // wrapper
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },

// card
  card: {
  width: '100%',
  maxWidth: 600,
  minHeight: 430, // diminui bastante o espaço vazio
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 28,
  borderWidth: 1,
  borderColor: '#DCEBE7',
  shadowColor: '#6B8F86',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 6,
},

  // card desktop
  cardDesktop: {
    padding: 34,
  },

  // header
  header: {
    marginBottom: 26,
  },

  // título
  title: {
    fontSize: 28,
    color: '#17262F',
    fontWeight: '600',
    marginBottom: 6,
  },

  // subtítulo
  subtitle: {
    fontSize: 14,
    color: '#70808A',
  },

  // container das etapas
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    justifyContent: 'center',
  },

  stepsContainerMobile: {
  gap: 10,
  },

  // item etapa
  stepItem: {
    alignItems: 'center',
    width: 74,
  },

  // etapa ativa
  stepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#087A73',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // texto etapa ativa
  stepActiveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // etapa inativa
  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF3F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // texto etapa inativa
  stepInactiveText: {
    color: '#5F6F6C',
    fontSize: 12,
  },

  // label ativa
  stepLabelActive: {
    fontSize: 10,
    color: '#1B3431',
    textAlign: 'center',
  },

  // label
  stepLabel: {
    fontSize: 10,
    color: '#7B8986',
    textAlign: 'center',
  },

  // linha
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E3EBE8',
    marginTop: 13,
  },

  // card da opção
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 22,
  },

  // card selecionado
  optionCardSelected: {
    borderColor: '#087A73',
    backgroundColor: '#F4FBF8',
  },

  // círculo ícone
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAF6F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  // área dos textos
  optionTextArea: {
    flex: 1,
  },

  // título opção
  optionTitle: {
    fontSize: 17,
    color: '#17262F',
    fontWeight: '600',
    marginBottom: 6,
  },

  // descrição
  optionDescription: {
    fontSize: 13,
    color: '#61717B',
    lineHeight: 20,
  },

  // botão principal
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#087A73',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto botão
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // círculo decorativo
  decorCircleOne: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#DCEFEB',
    opacity: 0.5,
    left: -100,
    top: 120,
  },

  // círculo decorativo
  decorCircleTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#E3F3EF',
    opacity: 0.7,
    right: -80,
    bottom: 80,
  },

  // círculo decorativo
  decorCircleThree: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#DDEFEA',
    opacity: 0.4,
    right: 140,
    top: 100,
  },

  // bolinha decorativa
  decorDotOne: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DCEFEB',
    top: 90,
    left: '50%',
  },

  // bolinha decorativa
  decorDotTwo: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBE6DF',
    top: 280,
    left: 60,
  },

  // bolinha decorativa
  decorDotThree: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4ECE6',
    bottom: 120,
    right: 100,
  },

  // bolinha decorativa
decorDotFour: {
  position: 'absolute',
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#E3F3EF',
  top: 180,
  right: 220,
  opacity: 0.7,
},

// bolinha decorativa
decorDotFive: {
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#DCEFEB',
  bottom: 220,
  left: 180,
  opacity: 0.8,
},

// bolinha decorativa
decorDotSix: {
  position: 'absolute',
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: '#D4ECE6',
  top: 340,
  right: 120,
  opacity: 0.5,
},

// bolinha decorativa
decorDotSeven: {
  position: 'absolute',
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: '#CBE6DF',
  bottom: 140,
  right: 260,
  opacity: 0.7,
},

});