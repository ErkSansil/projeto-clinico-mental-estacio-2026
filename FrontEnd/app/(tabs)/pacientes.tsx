// arquivo app/(tabs)/pacientes.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useEffect, useState } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // permite rolagem vertical na tela
  ScrollView,
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  Text,
  // botão com clique e efeito ao toque
  TextInput,
  // para fazer pesquisa de pacientes
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

// controle de navegação entre telas
// usado para redirecionar o usuário para outras páginas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token
import { useAuth } from '../../contexts/AuthContext';

// função que busca os pacientes cadastrados no backend
import { listarPacientes } from '../../services/api';

// função utilitária para tirar as iniciais do nome do paciente
function gerarIniciais(nome: string): string {
  const partes = nome?.trim().split(' ') ?? [];
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return partes[0]?.[0]?.toUpperCase() ?? '?';
}

// menu lateral do desktop, apenas no desktop, no mobile a navegação é diferente.
// lista de navegação principal da aplicação
const menuItems = [
  ['calendar-outline', 'Agenda', '/(tabs)'],
  ['people-outline', 'Pacientes', '/(tabs)/pacientes'],
  ['business-outline', 'Salas', '/(tabs)/salas'],
  ['notifications-outline', 'Notificacoes', '/(tabs)/notificacoes'],
  ['person-outline', 'Perfil', '/(tabs)/perfil'],
];

export default function PacientesScreen() {
  // pega largura da tela para aplicar responsividade
  const { width } = useWindowDimensions();

  // define se é mobile ou desktop baseado na largura da tela
  const isMobile = width < 900;

  // pega o token do usuário logado para autenticar a requisição
  const { token } = useAuth();

  // lista de pacientes carregada do banco
  const [pacientes, setPacientes] = useState<any[]>([]);

  // texto de busca no campo de pesquisa
  const [busca, setBusca] = useState('');

  // carrega os pacientes quando a tela abre
  useEffect(() => {
    async function carregarPacientes() {
      try {
        const resultado = await listarPacientes(token!);
        if (resultado.status === 200 && resultado.dados?.pacientes) {
          setPacientes(resultado.dados.pacientes);
        }
      } catch (e) {
        // se não conseguir carregar, fica lista vazia
      }
    }
    carregarPacientes();
  }, []);

  // filtra a lista pelo texto digitado no campo de busca
  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf?.includes(busca)
  );

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
        {!isMobile && (
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
        <ScrollView contentContainerStyle={styles.contentMobile}>

          {/* título da página com botão de novo paciente */}
          <View style={[styles.topRow, isMobile && styles.topRowMobile]}>

            {/* área do título */}
            <View style={styles.titleBox}>

              {/* título principal */}
              <Text style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}>
                Pacientes
              </Text>

              {/* subtítulo explicativo */}
              <Text style={[styles.pageSubtitle, isMobile && styles.pageSubtitleMobile]}>
                Visualize e cadastre pacientes da clínica.
              </Text>
            </View>

          </View>

          {/* campo de busca */}
          <View style={styles.searchLarge}>
            <Ionicons name="search-outline" size={20} color="#64748B" />

            <TextInput
              placeholder="Buscar entre meus pacientes..."
              style={styles.searchInput}
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* cards de estatísticas com valores reais do banco */}
          {isMobile ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsScroll}
            >

              {/* card de pacientes vinculados ao estagiário */}
              <StatCard
                icon="people-outline"
                title="Vinculados"
                value={String(pacientes.length)}
                sub="Pacientes do estagiário"
              />

              {/* card de pacientes que estão em acompanhamento */}
              <StatCard
                icon="heart-outline"
                title="Em acompanhamento"
                value={String(pacientes.filter(p => p.ativo !== false).length)}
                sub="Ativos no momento"
              />

              {/* card de pacientes que estão inativos */}
              <StatCard
                icon="alert-circle-outline"
                title="Inativos"
                value={String(pacientes.filter(p => p.ativo === false).length)}
                sub="Sem atendimento ativo"
              />
            </ScrollView>
          ) : (

            <View style={styles.statsRow}>

              {/* card de pacientes vinculados ao estagiário */}
              <StatCard
                icon="people-outline"
                title="Vinculados"
                value={String(pacientes.length)}
                sub="Pacientes do estagiário"
              />

              {/* card de pacientes que estão em acompanhamento */}
              <StatCard
                icon="heart-outline"
                title="Em acompanhamento"
                value={String(pacientes.filter(p => p.ativo !== false).length)}
                sub="Ativos no momento"
              />

              {/* card de pacientes que estão inativos */}
              <StatCard
                icon="alert-circle-outline"
                title="Inativos"
                value={String(pacientes.filter(p => p.ativo === false).length)}
                sub="Sem atendimento ativo"
              />
            </View>
          )}

          {/* card da lista de pacientes */}
          <View style={styles.listCard}>

            {/* cabeçalho da lista */}
            <View style={[styles.listHeader, isMobile && styles.listHeaderMobile]}>
              <View>
                <Text style={styles.listTitle}>Pacientes vinculados</Text>
                <Text style={styles.listSubtitle}>Visualização do estagiário</Text>
              </View>

              <View style={styles.listBadge}>
                <Ionicons name="lock-closed-outline" size={14} color="#0C706E" />
                <Text style={styles.listBadgeText}>Somente leitura</Text>
              </View>
            </View>

            {/* mensagem quando não há pacientes */}
            {pacientesFiltrados.length === 0 && (
              <View style={{ padding: 28, alignItems: 'center' }}>
                <Text style={{ color: '#6B7C83', fontSize: 14 }}>
                  {pacientes.length === 0 ? 'Nenhum paciente cadastrado.' : 'Nenhum paciente encontrado.'}
                </Text>
              </View>
            )}

            {/* é percorrida a lista de pacientes reais do banco */}
            {pacientesFiltrados.map((paciente, index) => (
              <View
                key={paciente.id ?? index}
                style={[
                  styles.patientRow,
                  isMobile && styles.patientRowMobile,
                ]}
              >

                {/* avatar com as iniciais geradas do nome */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{gerarIniciais(paciente.nome)}</Text>
                </View>

                {/* informações do paciente */}
                <View
                  style={[
                    styles.patientInfo,
                    isMobile && styles.patientInfoMobile,
                  ]}
                >
                  <Text style={styles.patientName}>{paciente.nome}</Text>

                  <Text style={styles.patientMeta}>CPF: {paciente.cpf}</Text>

                  {/* e-mail do paciente quando disponível */}
                  {!!paciente.email && (
                    <Text style={styles.patientMeta}>{paciente.email}</Text>
                  )}
                </View>

                {/* badge de status baseado no campo ativo do banco */}
                <View
                  style={[
                    styles.statusBadge,
                    paciente.ativo === false ? styles.inactiveBadge : styles.activeBadge,
                    isMobile && styles.statusBadgeMobile,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      paciente.ativo === false && styles.statusInactiveText,
                    ]}
                  >
                    {paciente.ativo === false ? 'Inativo' : 'Em acompanhamento'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.detailsButton, isMobile && styles.detailsButtonMobile]}
                  onPress={() => router.push({ pathname: '/paciente-detalhe-estagiario', params: { cpf: paciente.cpf } })}
                >
                  <Ionicons name="eye-outline" size={16} color="#0C706E" />
                  <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.footerInfo}>
              <Text style={styles.footerInfoText}>O estagiário não pode cadastrar, editar ou excluir pacientes.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

// componente reutilizável dos cards de estatísticas
// aqui o ícone recebe o nome, título, valor e subtítulo de cada card
function StatCard({ icon, title, value, sub }: any) {
  return (

    // card principal da estatística
    <View style={styles.statCard}>

      {/* caixa do ícone */}
      <View style={styles.statIconBox}>

        {/* ícone do card */}
        <Ionicons name={icon} size={21} color="#0C706E" />
      </View>

      {/* área dos textos */}
      <View style={styles.statTextBox}>

        {/* título da estatística */}
        <Text style={styles.statTitle}>{title}</Text>

        {/* valor principal */}
        <Text style={styles.statValue}>{value}</Text>

        {/* texto complementar */}
        <Text style={styles.statSub}>{sub}</Text>
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
    paddingHorizontal: 34,
    paddingTop: 30,
  },

  // espaçamento interno do conteúdo
  contentContainer: {
    paddingBottom: 34,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  
  // linha superior
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 18,
  },

  // linha superior no mobile
  topRowMobile: {
    flexDirection: 'column',
    gap: 10,
  },

  // área do título
  titleBox: {
    flex: 1,
  },

  // título principal
  pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#152322',
    marginBottom: 6,
  },

  // título principal no mobile
  pageTitleMobile: {
    fontSize: 28,
  },

  // subtítulo da página
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7C83',
    lineHeight: 21,
  },

  // subtítulo no mobile
  pageSubtitleMobile: {
    fontSize: 14,
    lineHeight: 20,
  },

  // botão de novo paciente
  newButton: {
    height: 42,
    paddingHorizontal: 16,
    backgroundColor: '#0C706E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão de novo paciente
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // card de permissão
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  // ícone de permissão
  permissionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // área do texto da permissão
  permissionTextBox: {
    flex: 1,
  },

  // título da permissão
  permissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C706E',
    marginBottom: 3,
  },

  // descrição da permissão
  permissionDescription: {
    fontSize: 13,
    color: '#6B7C83',
    lineHeight: 18,
  },

  // scroll de rolagem para informações dos pacientess
  statsScroll: {
  paddingRight: 16,
  gap: 12,
  marginBottom: 12
  },

  // barra de pesquisa
  searchLarge: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 16,
  },

  // campo de texto da pesquisa
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#152322',
  },

  // linha do card de estatística
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  // linha do card no mobile
  statsRowMobile: {
    flexDirection: 'column',
  },

  // card de estatística
  statCard: {
    flex: 1,
    minHeight: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0E9E6',
  },

  // área do ícone do card
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // área do texto do card
  statTextBox: {
    flex: 1,
  },

  // título do card
  statTitle: {
    fontSize: 12,
    color: '#6B7C83',
    fontWeight: '400',
  },

  // valor do card
  statValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#152322',
    marginTop: 1,
  },

  // subtítulo do card
  statSub: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // card principal da lista
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E9E6',
    marginBottom: 30,
  },

  // cabeçalho da lista
  listHeader: {
    minHeight: 70,
    backgroundColor: '#EAF6F2',
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },

  // cabeçalho da lista no mobile
  listHeaderMobile: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },

  // título da lista
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C706E',
  },

  // subtítulo da lista
  listSubtitle: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // badge da lista
  listBadge: {
    minHeight: 32,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8EAE5',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // texto da badge
  listBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0C706E',
  },

  // linha do paciente
  patientRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // linha do paciente no mobile
  patientRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  // avatar do paciente
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E1F2EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // texto do avatar
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C706E',
  },

    // área de informação do paciente
    patientInfo: {
      flex: 1,
      minWidth: 180,
    },

    // informação ocupando toda a largura no mobile
    patientInfoMobile: {
      width: '100%',
      minWidth: 0,
    },

    // nome do paciente
    patientName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#152322',
      marginBottom: 2,
    },

    // informação secundária do paciente
    patientMeta: {
      fontSize: 12,
      color: '#5B6D75',
      marginTop: 2,
      lineHeight: 18,
    },

    // organização da tag de informação em linha
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 9,
    },

    // estilização da tag de informação
    metaPill: {
      minHeight: 30,
      borderRadius: 15,
      backgroundColor: '#F8FCFA',
      borderWidth: 1,
      borderColor: '#E0E9E6',
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    // texto da tag
    metaPillText: {
      fontSize: 12,
      color: '#64748B',
    },

    // badge de status
    statusBadge: {
      alignSelf: 'center',
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 18,
    },

    // alinhamento do status no começo no mobile
    statusBadgeMobile: {
      alignSelf: 'flex-start',
      marginTop: 2,
    },

      // texto do status
    statusText: {
      fontSize: 12,
      color: '#0F766E',
      fontWeight: '500',
    },

    // cor do texto para status de atenção
    statusWarningText: {
      color: '#92400E',
    },

    // cor do texto para status inativo
    statusInactiveText: {
      color: '#991B1B',
    },

    // cor do badge ativo
    activeBadge: {
      backgroundColor: '#E3F7EE',
    },

    // cor do badge de atenção
    warningBadge: {
      backgroundColor: '#FFF3CC',
    },

    // cor do badge inativo
    inactiveBadge: {
      backgroundColor: '#FFE5E5',
    },

    // botão de detalhes
    detailsButton: {
      height: 40,
      paddingHorizontal: 13,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: '#0C706E',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: '#FFFFFF',
    },

    // botão ocupando toda a largura no mobile
    detailsButtonMobile: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 4,
    },

    // texto do botão de detalhes
    detailsButtonText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#0C706E',
    },

    // área de informação do rodapé
    footerInfo: {
      minHeight: 54,
      backgroundColor: '#F8FCFA',
      paddingHorizontal: 18,
      justifyContent: 'center',
    },

    // texto da informação do rodapé
    footerInfoText: {
      color: '#6B7C83',
      fontSize: 13,
    },
  });