// arquivo app/paciente-detalhe.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React from 'react';

// componentes nativos do React são usados nesta tela
import {
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

export default function PacienteDetalheScreen() {

  // pega a largura da tela para adaptar no mobile e desktop
  const { width } = useWindowDimensions();

  // se a tela for maior ou igual a 900, eu considero desktop
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
        {/* sidebar aparece só no desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* logo da clínica */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              <View>
                <Text style={styles.logoText}>SEP</Text>
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* menu lateral */}
            <View style={styles.menuArea}>
              {menuItems.map(([icon, label, path]) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.menuItem,
                    label === 'Pacientes' && styles.menuActive,
                  ]}
                  onPress={() => router.push(path as any)}
                >
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={label === 'Pacientes' ? '#0C706E' : '#70808A'}
                  />

                  <Text
                    style={[
                      styles.menuText,
                      label === 'Pacientes' && styles.menuTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* área principal do conteúdo */}
        <View style={styles.contentArea}>

        {/* scroll da tela */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.contentDesktop,
          ]}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.wrapper}>

          {/* topo da tela */}
          <View style={styles.headerTextBox}>

            <Text style={styles.pageTitle}>Detalhes do Paciente</Text>

            <Text style={styles.pageSubtitle}>Visualize as informações e acompanhamentos permitidos do paciente.</Text>
          </View>

          {/* card principal */}
          <View style={styles.profileCard}>

            {/* avatar do paciente */}
            <View style={styles.avatar}>

              {/* iniciais exibidas dentro do avatar */}
              <Text style={styles.avatarText}>AS</Text>
            </View>

            {/* área das informações principais do paciente */}
            <View style={styles.profileInfo}>

              {/* nome do paciente */}
              <Text style={styles.patientName}>Ana Silva</Text>

              {/* idade e categoria do paciente */}
              <Text style={styles.patientSub}>14 anos • Criança</Text>

              {/* badge de status do paciente */}
              <View style={styles.statusBadge}>

                {/* ícone do status */}
                <Ionicons
                  name="heart-outline"
                  size={14}
                  color="#0C706E"
                />

                {/* texto do status */}
                <Text style={styles.statusText}>Em acompanhamento</Text>
              </View>
            </View>
          </View>

          {/* acesso limitado */}
          <View style={styles.permissionCard}>

            {/* ícone do aviso de permissão */}
            <View style={styles.permissionIcon}>

              {/* ícone de cadeado */}
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#0C706E"
              />
            </View>

            {/* textos explicativos sobre as permissões */}
            <View style={styles.permissionTextBox}>

              {/* título do aviso */}
              <Text style={styles.permissionTitle}>Acesso limitado</Text>

              {/* descrição do acesso limitado */}
              <Text style={styles.permissionDescription}>
                Esta tela é apenas para consulta do estagiário.
                Dados sensíveis, edições e exclusões ficam
                disponíveis somente para a administração.
              </Text>
            </View>
          </View>

          {/* conteúdo */}
          <View style={[styles.grid, isDesktop && styles.gridDesktop,]}>

            {/* dados básicos */}
            <View style={styles.sectionCard}>

              {/* cabeçalho da seção */}
              <View style={styles.sectionHeader}>

                {/* ícone da seção */}
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#0C706E"
                />

                {/* título da seção */}
                <Text style={styles.sectionTitle}>Dados básicos</Text>
              </View>

              {/* informações básicas do paciente */}
              <InfoRow label="Nome" value="Ana Silva" />
              <InfoRow label="Idade" value="14 anos" />
              <InfoRow label="Tipo" value="Criança" />
              <InfoRow label="Responsável" value="Mariana Silva" />

              {/* informação bloqueada para estagiário */}
              <InfoRow
                label="Contato"
                value="Disponível para administração"
                locked
              />
            </View>

            {/* resumo */}
            <View style={styles.sectionCard}>

              {/* cabeçalho da seção de resumo */}
              <View style={styles.sectionHeader}>

                {/* ícone da seção */}
                <Ionicons
                  name="document-text-outline"
                  size={19}
                  color="#0C706E"
                />

                {/* título da seção */}
                <Text style={styles.sectionTitle}>Resumo do acompanhamento</Text>
              </View>

              {/* informações resumidas do acompanhamento */}
              <InfoRow label="Atendimentos" value="8" />
              <InfoRow label="Presenças" value="6" />
              <InfoRow label="Faltas" value="2" />
              <InfoRow label="Cancelamentos" value="2" />

              {/* situação atual do paciente */}
              <InfoRow
                label="Situação atual"
                value="Em acompanhamento"
              />
            </View>
          </View>

          {/* observações */}
          <View style={styles.sectionCard}>

            {/* cabeçalho da seção de observações */}
            <View style={styles.sectionHeader}>

              {/* ícone da seção */}
              <Ionicons
                name="chatbox-ellipses-outline"
                size={19}
                color="#0C706E"
              />

              {/* título da seção */}
              <Text style={styles.sectionTitle}>Observações permitidas</Text>
            </View>

            {/* observação 1 */}
            <View style={styles.noteBox}>

              {/* texto da observação */}
              <Text style={styles.note}> Paciente apresenta boa adaptação às sessões.</Text>
            </View>

            {/* observação 2 */}
            <View style={styles.noteBox}>

              {/* texto da observação */}
              <Text style={styles.note}> Necessita acompanhamento contínuo com responsável.</Text>
            </View>

            {/* observação 3 */}
            <View style={styles.noteBox}>

              {/* texto da observação */}
              <Text style={styles.note}> Última sessão realizada sem intercorrências.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  </View>
</LinearGradient>
)};

// componente das linhas de informação
function InfoRow({ label, value, locked }: any) {
  return (
    <View style={styles.infoRow}>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <View style={styles.infoValueBox}>

        {locked && (
          <Ionicons
            name="lock-closed-outline"
            size={13}
            color="#94A3B8"
          />
        )}

        <Text
          style={[
            styles.infoValue,
            locked && styles.infoValueLocked,
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
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

  // fundo
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // área principal da tela
  screen: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
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
    psi: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // texto principal da logo
    logoText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // subtítulo da logo
    logoSub: {
    fontSize: 12,
    color: '#EAF6F2',
    marginTop: 2,
  },

  // área menu
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

  // bolinha decorativa 1
  blurCircleOne: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: 'rgba(12, 112, 110, 0.08)',
    top: -120,
    left: -120,
  },

  // bolinha decorativa 2
  blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166, 189, 184, 0.18)',
    right: -180,
    bottom: -160,
  },

  // bolinha decorativa 3
  blurCircleThree: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
    right: 120,
    top: 150,
  },

  // conteúdo com espaçamento
    scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },

  // conteúdo principal
    contentArea: {
    flex: 1,
  },

  // espaçamento do conteúdo no desktop
  contentDesktop: {
    paddingHorizontal: 28,
    paddingTop: 42,
  },

  // container principal do conteúdo
  wrapper: {
    width: '100%',
  },

  // área de textos do cabeçalho
  headerTextBox: {
    marginBottom: 24,
  },

  // título principal
  pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#152322',
    marginBottom: 6,
  },

    // subtítulo da página
  pageSubtitle: {
    fontSize: 15,
    color: '#70808A',
    marginTop: 8,
    lineHeight: 22,
  },

  // card principal do perfil do paciente
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },

  // avatar do paciente
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E3F2EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // texto dentro do avatar
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0C706E',
  },

  // área das informações do perfil
  profileInfo: {
    flex: 1,
  },

  // nome do paciente
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#152322',
  },

  // subtítulo/informações secundárias do paciente
  patientSub: {
    fontSize: 14,
    color: '#70808A',
    marginTop: 4,
  },

  // badge de status do paciente
  statusBadge: {
    alignSelf: 'flex-start',
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // texto do status
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0C706E',
  },

  // card de permissões/informações extras
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  // ícone do card de permissão
  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // área de textos da permissão
  permissionTextBox: {
    flex: 1,
  },

  // título da permissão
  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C706E',
    marginBottom: 4,
  },

  // descrição da permissão
  permissionDescription: {
    fontSize: 13,
    color: '#6B7C83',
    lineHeight: 20,
  },

  // grid principal dos cards
  grid: {
    gap: 16,
  },

  // grid no desktop
  gridDesktop: {
    flexDirection: 'row',
  },

  // card de seção
  sectionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 18,
    marginBottom: 16,
  },

  // cabeçalho da seção
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  // título da seção
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#152322',
  },

  // linha de informação
  infoRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // label da informação
  infoLabel: {
    fontSize: 13,
    color: '#70808A',
  },

  // container do valor da informação
  infoValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },

  // valor da informação
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#152322',
    textAlign: 'right',
  },

  // valor bloqueado/desabilitado
  infoValueLocked: {
    color: '#94A3B8',
  },

  // caixa de observações/anotações
  noteBox: {
    backgroundColor: '#F8FCFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 12,
    marginBottom: 10,
  },

  // texto da anotação
  note: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5B6D75',
  },
});