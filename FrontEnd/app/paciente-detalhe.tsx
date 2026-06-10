// arquivo app/paciente-detalhe.tsx
// aqui eu organizei essa tela e deixei os comentários explicando minha parte do código

import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
 TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// importando imagem
import { Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function PacienteDetalheScreen() {

  // aqui eu pego a largura da tela para adaptar no mobile e desktop
  const { width } = useWindowDimensions();

  // se a tela for maior ou igual a 900, eu considero desktop
  const isDesktop = width >= 900;

  return (
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >

      {/* sidebar desktop */}
      {isDesktop && (
        <View style={styles.sidebar}>

          {/* logo */}
          <View style={styles.sidebarTop}>

            <View style={styles.logoRow}>
              <Text style={styles.psiSidebar}>Ψ</Text>

              <View>
                <Text style={styles.logoTextSidebar}>
                  SEP
                </Text>

                <Text style={styles.logoSubSidebar}>
                  Clínica de Psicologia
                </Text>
              </View>
            </View>
          </View>

          {/* menu lateral */}
          <View style={styles.menuContainer}>

            {/* administrador */}
            <TouchableOpacity
              style={styles.menuActive}
              onPress={() => router.push('/acesso-administrador')}
            >
              <Image
                source={require('../assets/images/administrador.png')}
                style={styles.menuIcon}
              />

              <Text style={styles.menuTextActive}>
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

            {/* perfil */}
            <TouchableOpacity
              style={styles.menuItem}
            >
              <Image
                source={require('../assets/images/perfil.png')}
                style={styles.menuIcon}
              />

              <Text style={styles.menuText}>
                Perfil
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

      {/* aqui eu coloquei as bolinhas de fundo seguindo a identidade do app */}
      <View style={styles.backgroundDecor}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />
        <View style={styles.blurCircleThree} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.wrapper}>

          {/* topo da tela */}
          <View style={styles.headerTextBox}>

            <Text style={styles.pageTitle}>
              Detalhes do Paciente
            </Text>

            <Text style={styles.pageSubtitle}>
              Visualize as informações e acompanhamentos permitidos do paciente.
            </Text>
          </View>

          {/* card principal */}
          <View style={styles.profileCard}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>

            <View style={styles.profileInfo}>

              <Text style={styles.patientName}>
                Ana Silva
              </Text>

              <Text style={styles.patientSub}>
                14 anos • Criança
              </Text>

              <View style={styles.statusBadge}>

                <Ionicons
                  name="heart-outline"
                  size={14}
                  color="#0C706E"
                />

                <Text style={styles.statusText}>
                  Em acompanhamento
                </Text>
              </View>
            </View>
          </View>

          {/* acesso limitado */}
          <View style={styles.permissionCard}>

            <View style={styles.permissionIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#0C706E"
              />
            </View>

            <View style={styles.permissionTextBox}>

              <Text style={styles.permissionTitle}>
                Acesso limitado
              </Text>

              <Text style={styles.permissionDescription}>
                Esta tela é apenas para consulta do estagiário.
                Dados sensíveis, edições e exclusões ficam
                disponíveis somente para a administração.
              </Text>
            </View>
          </View>

          {/* conteúdo */}
          <View style={[
            styles.grid,
            isDesktop && styles.gridDesktop,
          ]}>

            {/* dados básicos */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#0C706E"
                />

                <Text style={styles.sectionTitle}>
                  Dados básicos
                </Text>
              </View>

              <InfoRow label="Nome" value="Ana Silva" />
              <InfoRow label="Idade" value="14 anos" />
              <InfoRow label="Tipo" value="Criança" />
              <InfoRow label="Responsável" value="Mariana Silva" />

              <InfoRow
                label="Contato"
                value="Disponível para administração"
                locked
              />
            </View>

            {/* resumo */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <Ionicons
                  name="document-text-outline"
                  size={19}
                  color="#0C706E"
                />

                <Text style={styles.sectionTitle}>
                  Resumo do acompanhamento
                </Text>
              </View>

              <InfoRow label="Atendimentos" value="8" />
              <InfoRow label="Presenças" value="6" />
              <InfoRow label="Faltas" value="2" />
              <InfoRow label="Cancelamentos" value="2" />

              <InfoRow
                label="Situação atual"
                value="Em acompanhamento"
              />
            </View>
          </View>

          {/* observações */}
          <View style={styles.sectionCard}>

            <View style={styles.sectionHeader}>

              <Ionicons
                name="chatbox-ellipses-outline"
                size={19}
                color="#0C706E"
              />

              <Text style={styles.sectionTitle}>
                Observações permitidas
              </Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.note}>
                Paciente apresenta boa adaptação às sessões.
              </Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.note}>
                Necessita acompanhamento contínuo com responsável.
              </Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.note}>
                Última sessão realizada sem intercorrências.
              </Text>
            </View>
          </View>

          {/* ações */}
          <View style={styles.actionsCard}>

            <TouchableOpacity style={styles.primaryButton}>

              <Ionicons
                name="eye-outline"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.primaryButtonText}>
                Visualizar histórico permitido
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>

              <Ionicons
                name="calendar-outline"
                size={17}
                color="#0C706E"
              />

              <Text style={styles.secondaryButtonText}>
                Ver agenda do paciente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

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

const styles = StyleSheet.create({

  background: {
    flex: 1,
    flexDirection: 'row',
  },

  /* sidebar */

  sidebar: {
    width: 265,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5ECE9',
  },

  sidebarTop: {
    paddingTop: 34,
    paddingHorizontal: 28,
    paddingBottom: 22,
    backgroundColor: '#FFFFFF',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  psiSidebar: {
    fontSize: 52,
    color: '#0C706E',
    fontWeight: '700',
  },

  logoTextSidebar: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10232D',
  },

  logoSubSidebar: {
    fontSize: 14,
    color: '#70808A',
    marginTop: 2,
  },

  menuContainer: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },

  menuLabel: {
    fontSize: 11,
    color: '#8B99A3',
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 12,
    marginLeft: 10,
  },

  menuItem: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },

  menuActive: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#EAF6F2',
  },

  menuText: {
    fontSize: 15,
    color: '#5B6D75',
    marginLeft: 14,
    fontWeight: '500',
  },

  menuTextActive: {
    fontSize: 15,
    color: '#0C706E',
    marginLeft: 14,
    fontWeight: '600',
  },

  /* icones verdes */

  menuIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#0C706E',
  },

  /* fundo */

  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  blurCircleOne: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: 'rgba(12, 112, 110, 0.08)',
    top: -120,
    left: -120,
  },

  blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166, 189, 184, 0.18)',
    right: -180,
    bottom: -160,
  },

  blurCircleThree: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
    right: 120,
    top: 150,
  },

  /* conteúdo */

  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 30,
  },

  contentDesktop: {
    paddingHorizontal: 28,
    paddingTop: 42,
  },

  wrapper: {
    width: '100%',
  },

  headerTextBox: {
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#17262F',
  },

  pageSubtitle: {
    fontSize: 15,
    color: '#70808A',
    marginTop: 8,
    lineHeight: 22,
  },

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

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E3F2EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0C706E',
  },

  profileInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#152322',
  },

  patientSub: {
    fontSize: 14,
    color: '#70808A',
    marginTop: 4,
  },

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

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0C706E',
  },

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

  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  permissionTextBox: {
    flex: 1,
  },

  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C706E',
    marginBottom: 4,
  },

  permissionDescription: {
    fontSize: 13,
    color: '#6B7C83',
    lineHeight: 20,
  },

  grid: {
    gap: 16,
  },

  gridDesktop: {
    flexDirection: 'row',
  },

  sectionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 18,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#152322',
  },

  infoRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  infoLabel: {
    fontSize: 13,
    color: '#70808A',
  },

  infoValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#152322',
    textAlign: 'right',
  },

  infoValueLocked: {
    color: '#94A3B8',
  },

  noteBox: {
    backgroundColor: '#F8FCFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 12,
    marginBottom: 10,
  },

  note: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5B6D75',
  },

  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 14,
    gap: 10,
  },

  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C706E',
  },

});