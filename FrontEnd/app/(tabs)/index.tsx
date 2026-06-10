// arquivo app/(tabs)/index.tsx
// essa tela mostra os atendimentos do dia e permite ações do estagiário

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

// hook de autenticação para acessar o token JWT do usuário logado
import { useAuth } from '../../contexts/AuthContext';

// serviço para buscar os atendimentos do dia no backend
import { buscarConsultas } from '../../services/api';

// menu lateral do desktop, apenas no desktop, no mobile a navegação é diferente.
// lista de navegação principal da aplicação
const menuItems = [
  ['calendar-outline', 'Agenda', '/(tabs)'],
  ['people-outline', 'Pacientes', '/(tabs)/pacientes'],
  ['business-outline', 'Salas', '/(tabs)/salas'],
  ['notifications-outline', 'Notificacoes', '/(tabs)/notificacoes'],
  ['person-outline', 'Perfil', '/(tabs)/perfil'],
];

export default function AgendaScreen() {
  // pega largura da tela para aplicar responsividade
  const { width } = useWindowDimensions();

  // define se é mobile ou desktop baseado na largura da tela
  const isMobile = width < 900;

  // acessa o token JWT e os dados do usuário logado
  const { token, usuario } = useAuth();

  // estado que guarda os atendimentos carregados da API
  const [atendimentos, setAtendimentos] = useState<any[]>([]);

  // estado de carregamento enquanto busca os atendimentos
  const [carregando, setCarregando] = useState(false);

  // estado da data selecionada para filtrar os atendimentos
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // formata a data no padrão ISO (AAAA-MM-DD) para enviar à API
  function formatarDataISO(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // formata a data no padrão brasileiro para exibição
  function formatarDataBrasileiro(data: Date) {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  // nome do dia da semana em português
  function nomeDiaSemana(data: Date) {
    return data.toLocaleDateString('pt-BR', { weekday: 'long' });
  }

  // busca os atendimentos do profissional logado para a data selecionada
  async function carregarAtendimentos(data: Date) {
    if (!token) return;

    setCarregando(true);

    try {
      // busca consultas filtrando pelo profissional logado e pela data selecionada
      const resultado = await buscarConsultas(
        { matriculaProfissional: 'sim', data: formatarDataISO(data) },
        token
      );

      if (resultado.status === 200 && Array.isArray(resultado.dados)) {
        // mapeia os dados da API para o formato esperado pela lista
        const consultasMapeadas = resultado.dados.map((c: any) => ({
          id: c.id,
          horario: c.horario ? c.horario.substring(0, 5) : '',
          iniciais: c.pacienteNome
            ? c.pacienteNome.split(' ').map((p: string) => p[0]).join('').substring(0, 2).toUpperCase()
            : '?',
          paciente: c.pacienteNome || 'Paciente',
          profissional: c.profissionalNome || '',
          sala: c.sala || '',
          status: c.status === 'agendada' ? 'Confirmada'
            : c.status === 'cancelada' ? 'Cancelada'
            : c.status === 'concluida' ? 'Confirmada'
            : 'Pendente',
          statusOriginal: c.status,
          observacao: c.observacao || '',
        }));

        setAtendimentos(consultasMapeadas);
      } else {
        // nenhuma consulta encontrada para o dia
        setAtendimentos([]);
      }
    } catch (e) {
      // erro de rede: exibe lista vazia
      setAtendimentos([]);
    } finally {
      setCarregando(false);
    }
  }

  // carrega os atendimentos ao montar a tela e quando a data muda
  useEffect(() => {
    carregarAtendimentos(dataSelecionada);
  }, [dataSelecionada, token]);

  return (
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >

      {/* fundo decorativo com círculos suaves */}
      {/* esses elementos são apenas visuais e não interagem com o usuário */}
      <View style={styles.backgroundDecor}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />
        <View style={styles.blurCircleThree} />
      </View>

      <View style={styles.screen}>

        {/* sidebar só aparece no desktop */}
        {/* no mobile ela é removida para simplificar a interface e ajudar para que os elementos fiquem bem alinhados. */}
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

            {/* menu lateral de navegação */}
            <View style={styles.menuArea}>
              {menuItems.map(([icon, label, path]) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.menuItem,
                    label === 'Agenda' && styles.menuActive,
                  ]}
                  onPress={() => router.push(path as any)}
                >
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={label === 'Agenda' ? '#0C706E' : '#70808A'}
                  />

                  <Text
                    style={[
                      styles.menuText,
                      label === 'Agenda' && styles.menuTextActive,
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
                
          {/* topo da agenda */}
          <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
            <View style={styles.titleBox}>
              <Text style={styles.pageTitle}>Agenda</Text>
              <Text style={styles.pageSubtitle}>
                Acompanhe seus atendimentos e registre informações permitidas.
              </Text>
            </View>

            {/* informações extras só no desktop */}
            {!isMobile && (
              <View style={styles.topRight}>

                {/* navegação de datas: avança e volta entre os dias */}
                <View style={styles.dateNavigation}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      // volta um dia na data selecionada
                      const nova = new Date(dataSelecionada);
                      nova.setDate(nova.getDate() - 1);
                      setDataSelecionada(nova);
                    }}
                  >
                    <Ionicons name="chevron-back-outline" size={18} color="#0F3F3D" />
                  </TouchableOpacity>

                  <View style={styles.dateBox}>
                    {/* exibe a data selecionada formatada em português */}
                    <Text style={styles.dateText}>{formatarDataBrasileiro(dataSelecionada)}</Text>
                    <Text style={styles.dateSub}>{nomeDiaSemana(dataSelecionada)}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      // avança um dia na data selecionada
                      const nova = new Date(dataSelecionada);
                      nova.setDate(nova.getDate() + 1);
                      setDataSelecionada(nova);
                    }}
                  >
                    <Ionicons name="chevron-forward-outline" size={18} color="#0F3F3D" />
                  </TouchableOpacity>
                </View>

                {/* usuário logado: exibe iniciais e nome do contexto */}
                <View style={styles.userBox}>
                  <View style={styles.avatarUser}>
                    <Text style={styles.avatarUserText}>
                      {usuario?.nome
                        ? usuario.nome.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase()
                        : '?'}
                    </Text>
                  </View>
                  <View>
                    {/* nome e tipo do usuário vindos do contexto de autenticação */}
                    <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
                    <Text style={styles.userRole}>
                      {usuario?.tipo === 'admin' ? 'Administrador' : 'Estagiário'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* navegação de data no mobile */}
          {isMobile && (
            <View style={styles.mobileDateBox}>
              <TouchableOpacity
                style={styles.mobileDateArrow}
                onPress={() => {
                  // volta um dia na data selecionada
                  const nova = new Date(dataSelecionada);
                  nova.setDate(nova.getDate() - 1);
                  setDataSelecionada(nova);
                }}
              >
                <Ionicons name="chevron-back-outline" size={20} color="#0C706E" />
              </TouchableOpacity>

              <View style={styles.mobileDateCenter}>
                {/* exibe a data selecionada real */}
                <Text style={styles.mobileDateText}>{formatarDataBrasileiro(dataSelecionada)}</Text>
                <Text style={styles.mobileDateSub}>{nomeDiaSemana(dataSelecionada)}</Text>
              </View>

              <TouchableOpacity
                style={styles.mobileDateArrow}
                onPress={() => {
                  // avança um dia na data selecionada
                  const nova = new Date(dataSelecionada);
                  nova.setDate(nova.getDate() + 1);
                  setDataSelecionada(nova);
                }}
              >
                <Ionicons name="chevron-forward-outline" size={20} color="#0C706E" />
              </TouchableOpacity>
            </View>
          )}

          {/* botões principais da tela */}
          <View style={[styles.buttonsContainer, isMobile && styles.buttonsContainerMobile]}>

            {/* botão novo agendamento */}
            <TouchableOpacity
              style={[styles.newButton, isMobile && styles.newButtonMobile]}
              onPress={() => router.push('/novo-agendamento-estagiario')}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.newButtonText}>Novo agendamento</Text>
            </TouchableOpacity>

            {/* botão de reagendamento */}
            <TouchableOpacity
              style={[styles.reagendamentoButton, isMobile && styles.newButtonMobile]}
              onPress={() => router.push('/solicitacao-reagendamento')}
            >
              <Ionicons name="refresh-outline" size={20} color="#0C706E" />
              <Text style={styles.reagendamentoButtonText}>Solicitar Reagendamento</Text>
            </TouchableOpacity>
          </View>

          {isMobile ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            <View style={styles.statsRow}>
              {/* contadores calculados a partir dos atendimentos carregados da API */}
              <StatCard icon="calendar-outline" value={String(atendimentos.length)} label="Atendimentos" color="#EAF6F2" />
              <StatCard icon="checkmark-done-outline" value={String(atendimentos.filter(a => a.status === 'Confirmada').length)} label="Confirmados" color="#E7F7EF" />
              <StatCard icon="time-outline" value={String(atendimentos.filter(a => a.status === 'Pendente').length)} label="Pendentes" color="#FFF5D6" />
              <StatCard icon="alert-circle-outline" value={String(atendimentos.filter(a => a.status === 'Cancelada').length)} label="Faltas" color="#FFE8E8" />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.statsRow}>
            {/* contadores calculados a partir dos atendimentos carregados da API */}
            <StatCard icon="calendar-outline" value={String(atendimentos.length)} label="Atendimentos" color="#EAF6F2" />
            <StatCard icon="checkmark-done-outline" value={String(atendimentos.filter(a => a.status === 'Confirmada').length)} label="Confirmados" color="#E7F7EF" />
            <StatCard icon="time-outline" value={String(atendimentos.filter(a => a.status === 'Pendente').length)} label="Pendentes" color="#FFF5D6" />
            <StatCard icon="alert-circle-outline" value={String(atendimentos.filter(a => a.status === 'Cancelada').length)} label="Faltas" color="#FFE8E8" />
          </View>
        )}

          {/* card principal da lista de atendimentos */}
          <View style={styles.listCard}>

            {/* header do card */}
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.listTitle}>Atendimentos do dia</Text>
                <Text style={styles.listSubtitle}>Visualização do estagiário</Text>
              </View>

              <View style={styles.permissionBadge}>
                <Ionicons name="shield-checkmark-outline" size={15} color="#0C706E" />
                <Text style={styles.permissionText}>Acesso limitado</Text>
              </View>
            </View>

            {/* lista dinâmica de atendimentos */}
            {atendimentos.map((item, index) => (
              <View key={index} style={[styles.appointmentRow, isMobile && styles.appointmentRowMobile]}>

                {/* barra lateral indicando status */}
                <View style={[styles.leftBar, getBarStyle(item.status)]} />

                {/* horário do atendimento */}
                <View style={[styles.timeBox, isMobile && styles.timeBoxMobile]}>
                  <Text style={styles.time}>{item.horario}</Text>
                  <Text style={styles.timeSub}>1h de sessão</Text>
                </View>

                {/* iniciais do paciente */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.iniciais}</Text>
                </View>

                {/* dados do paciente */}
                <View style={[styles.patientBox, isMobile && styles.patientBoxMobile]}>
                  <Text style={styles.patientName}>{item.paciente}</Text>
                  <Text style={styles.patientMeta}>
                    {item.idade} • {item.tipo}
                  </Text>
                  <Text style={styles.patientMeta}>
                    Responsável: {item.responsavel}
                  </Text>
                </View>

                {/* profissional e sala */}
                <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
                  <View style={styles.infoLine}>
                    <Ionicons name="person-outline" size={15} color="#64748B" />
                    <Text style={styles.infoText}>{item.profissional}</Text>
                  </View>

                  <View style={styles.infoLine}>
                    <Ionicons name="business-outline" size={15} color="#64748B" />
                    <Text style={styles.infoText}>{item.sala}</Text>
                  </View>
                </View>

                {/* status do atendimento */}
                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Ionicons name={getStatusIcon(item.status) as any} size={13} color={getStatusColor(item.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>

                {/* ações disponíveis apenas no desktop */}
                {/* no mobile os botões são simplificados para melhorar a usabilidade */}
                  {!isMobile && (

                  // container que agrupa os botões de ação do atendimento
                    <View style={styles.actions}>

                      {/* botão de registro do atendimento */}
                      {/* muda aparência caso o status seja falta */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          item.status === 'Falta' && styles.actionDangerButton
                        ]}
                      >

                        {/* ícone muda dependendo do status */}
                        <Ionicons
                          name={
                            item.status === 'Falta'
                              ? 'close-circle-outline'
                              : 'checkmark-circle-outline'
                          }
                          size={17}

                          // cor vermelha para falta e verde para registro normal
                          color={item.status === 'Falta' ? '#B91C1C' : '#0C706E'}
                        />

                          {/* texto do botão muda conforme o status */}
                          <Text
                            style={[
                              styles.actionText,

                              // aplica estilo de alerta quando for falta
                              item.status === 'Falta' && styles.actionDangerText,
                            ]}
                          >

                          {/* altera texto exibido dependendo do status */}
                          {item.status === 'Falta'
                            ? 'Registrar falta'
                            : 'Registrar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                {/* ações no mobile */}
                {isMobile && (
                  <View style={styles.mobileActions}>
                    <TouchableOpacity style={styles.mobileDetailsButton}>
                      <Text style={styles.mobileDetailsText}>Ver detalhes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.mobileDetailsButton,
                        item.status === 'Falta' && styles.mobileDangerButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.mobileDetailsText,
                          item.status === 'Falta' && styles.mobileDangerText,
                        ]}
                      >
                        {item.status === 'Falta' ? 'Registrar falta' : 'Registrar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {/* rodapé da lista, essa mensagem aparece no final dos agendamentos do dia */}
            <View style={styles.footerInfo}>
              <Text style={styles.footerInfoText}>Exibe somente atendimentos vinculados ao estagiário.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

// função que define estilo do status
function getStatusStyle(status: string) {
  if (status === 'Confirmada') return styles.confirmedBadge;
  if (status === 'Pendente') return styles.pendingBadge;
  if (status === 'Remarcada') return styles.rescheduledBadge;
  if (status === 'Falta') return styles.missedBadge;
  return styles.canceledBadge;
}

// função que define cor da barra lateral
function getBarStyle(status: string) {
  if (status === 'Confirmada') return styles.confirmedBar;
  if (status === 'Pendente') return styles.pendingBar;
  if (status === 'Remarcada') return styles.rescheduledBar;
  if (status === 'Falta') return styles.missedBar;
  return styles.canceledBar;
}

// função que define cor do texto do status
function getStatusColor(status: string) {
  if (status === 'Confirmada') return '#0C706E';
  if (status === 'Pendente') return '#A66B00';
  if (status === 'Remarcada') return '#2C7DA0';
  if (status === 'Falta') return '#B91C1C';
  return '#64748B';
}

// função que define ícone do status
function getStatusIcon(status: string) {
  if (status === 'Confirmada') return 'checkmark-circle-outline';
  if (status === 'Pendente') return 'time-outline';
  if (status === 'Remarcada') return 'sync-outline';
  if (status === 'Falta') return 'close-circle-outline';
  return 'remove-circle-outline';
}

// componente reutilizável de estatísticas
function StatCard({ icon, value, label, color }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={21} color="#0C706E" />
      </View>

      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
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

  // camada decorativa absoluta usada para os círculos do fundo
    backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // primeiro círculo decorativo do fundo
    blurCircleOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(12,112,110,0.08)',
    top: -120,
    left: -120,
  },

  // segundo círculo decorativo do fundo
    blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166,189,184,0.18)',
    right: -180,
    bottom: -160,
  },

  // terceiro círculo decorativo do fundo
    blurCircleThree: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.7)',
    right: 100,
    top: 120,
  },

  // estrutura principal da página
  // divide sidebar e conteúdo
    screen: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },

  // menu lateral do desktop
    sidebar: {
    width: 245,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E6ECEA',
  },

  // área da logo da clínica
    logoBox: {
    height: 118,
    backgroundColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
    borderBottomRightRadius: 18,
  },

  // símbolo psi da logo
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

  // container dos itens do menu
    menuArea: {
    paddingTop: 18,
  },

  // botão padrão do menu lateral
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

  // estilo do item ativo do menu
    menuActive: {
    backgroundColor: '#EAF6F2',
  },

  // texto padrão do menu
    menuText: {
    fontSize: 15,
    color: '#4B5F68',
    fontWeight: '400',
  },

  // texto do item ativo
    menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // conteúdo principal da tela
    content: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 30,
  },

  // espaçamento inferior do scroll
    contentContainer: {
    paddingBottom: 34,
  },

  // ajustes específicos do mobile
    contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  // linha superior da página
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 18,
  },

  // scroll com as informações no mobile
  statsScroll: {
  paddingRight: 20,
  },

  // versão mobile do topo
  topRowMobile: {
    flexDirection: 'column',
    gap: 10,
  },

  // área do título principal
  titleBox: {
    flex: 1,
  },

  // título principal da página
    pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#152322',
    marginBottom: 6,
    marginTop: 2
  },

  // subtítulo explicativo da página
    pageSubtitle: {
    fontSize: 15,
    color: '#6B7C83',
    lineHeight: 21,
  },

  // lado direito do header desktop
    topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // navegação de datas
    dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // botão das setas da data
    dateButton: {
    width: 42,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE8E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // linha dos botões superiores
    buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  // caixa central da data
    dateBox: {
    width: 185,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DDE8E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto principal da data
    dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#152322',
  },

  // subtítulo da data
    dateSub: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // botão "Hoje"
    todayButton: {
    height: 46,
    paddingHorizontal: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE8E5',
    borderRadius: 12,
    justifyContent: 'center',
  },

  // texto do botão hoje
    todayText: {
    fontWeight: '500',
    color: '#152322',
  },

  // botão de notificações
    notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE8E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // área de dados do usuário
    userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  // avatar circular do usuário
    avatarUser: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#DDEDEA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // texto das iniciais do avatar
    avatarUserText: {
    fontWeight: '600',
    color: '#0C706E',
  },

  // nome do usuário
    userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#152322',
  },

  // cargo do usuário
    userRole: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // caixa de data no mobile
    mobileDateBox: {
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  // botão lateral da data no mobile
    mobileDateArrow: {
    width: 48,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // área central da data no mobile
    mobileDateCenter: {
    flex: 1,
    alignItems: 'center',
  },

  // texto principal da data mobile
    mobileDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#152322',
  },

  // subtítulo da data mobile
    mobileDateSub: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // botão ocupa largura total no mobile
    newButtonMobile: {
    width: '100%',
  },

  // texto do botão novo agendamento
    newButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // linha dos cards de estatísticas
    statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  // estatísticas em coluna no mobile
    statsRowMobile: {
    flexDirection: 'column',
  },

  // card individual de estatística
    statCard: {
    flex: 1,
    minHeight: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // círculo do ícone da estatística
    statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // valor numérico da estatística
    statValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#152322',
  },

  // descrição da estatística
    statLabel: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

    // linha dos filtros da agenda
    filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  // filtros organizados em coluna no mobile
    filtersRowMobile: {
    flexDirection: 'column',
    gap: 10,
  },

  // caixa individual de filtro
    filterBox: {
    width: 215,
    height: 46,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // filtro ocupa largura total no mobile
    filterBoxMobile: {
    width: '100%',
  },

  // texto do filtro
    filterText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#4B5F68',
  },

  // card principal da agenda
    listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E9E6',
  },

  // cabeçalho do card da agenda
    listHeader: {
    minHeight: 70,
    backgroundColor: '#EAF6F2',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 12,
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

  // badge de permissão do usuário
    permissionBadge: {
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

  // texto da permissão
    permissionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0C706E',
  },

  // linha individual do atendimento
    appointmentRow: {
    minHeight: 112,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
    paddingHorizontal: 22,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
    position: 'relative',
  },

  // versão mobile do atendimento
    appointmentRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    paddingLeft: 18,
    paddingRight: 16,
  },

  // barra lateral colorida do status
    leftBar: {
    position: 'absolute',
    left: 0,
    top: 18,
    bottom: 18,
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  // caixa do horário
    timeBox: {
    width: 82,
  },

  // horário ocupa largura total no mobile
    timeBoxMobile: {
    width: '100%',
  },

  // horário principal
    time: {
    fontSize: 23,
    fontWeight: '600',
    color: '#0C706E',
  },

  // subtítulo do horário
    timeSub: {
    fontSize: 12,
    color: '#6B7C83',
    marginTop: 2,
  },

  // avatar do paciente
    avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E1F2EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do avatar
    avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C706E',
  },

  // caixa de dados do paciente
    patientBox: {
    width: 225,
  },

  // dados do paciente no mobile
    patientBoxMobile: {
    width: '100%',
  },

  // nome do paciente
    patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#152322',
  },

  // informações secundárias do paciente
    patientMeta: {
    fontSize: 12,
    color: '#5B6D75',
    marginTop: 3,
    lineHeight: 18,
  },

  // área de profissional e sala
    infoBox: {
    width: 175,
    gap: 7,
  },

  // informações ocupam largura total no mobile
    infoBoxMobile: {
    width: '100%',
    marginTop: 2,
  },

  // linha individual de informação
    infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // texto das informações
    infoText: {
    fontSize: 13,
    color: '#4B5F68',
  },

  // badge de status do atendimento
    statusBadge: {
    minHeight: 32,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },

  // cor do status confirmado
    confirmedBadge: {
    backgroundColor: '#E3F7EE',
  },

  // cor do status pendente
    pendingBadge: {
    backgroundColor: '#FFF3CC',
  },

  // cor do status remarcado
    rescheduledBadge: {
    backgroundColor: '#E0F2F8',
  },

  // cor do status falta
    missedBadge: {
    backgroundColor: '#FFE5E5',
  },

  // cor do status cancelado
    canceledBadge: {
    backgroundColor: '#EEF2F3',
  },

  // texto do status
    statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // área dos botões de ação desktop
  actions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  // botão padrão de ação
  actionButton: {
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

  // texto do botão de ação
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0C706E',
  },

  // estilo de alerta do botão
  actionDangerButton: {
    borderColor: '#E8A3A3',
  },

  // texto de alerta
  actionDangerText: {
    color: '#B91C1C',
  },

  // ações do mobile
  mobileActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  // botão de ação no mobile
  mobileDetailsButton: {
    flex: 1,
    minHeight: 41,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // texto do botão mobile
  mobileDetailsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0C706E',
  },

  // borda de alerta no mobile
  mobileDangerButton: {
    borderColor: '#E8A3A3',
  },

  // texto de alerta mobile
  mobileDangerText: {
    color: '#B91C1C',
  },

  // rodapé informativo da agenda
  footerInfo: {
    minHeight: 54,
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 18,
    justifyContent: 'center',
     flexShrink: 1,
    flexWrap: 'wrap',
  },

  // texto do rodapé
  footerInfoText: {
    color: '#6B7C83',
    fontSize: 13,
  },

  // barra verde de confirmado
  confirmedBar: {
    backgroundColor: '#10B981',
  },

  // barra amarela de pendente
  pendingBar: {
    backgroundColor: '#F59E0B',
  },

  // barra azul de remarcado
  rescheduledBar: {
    backgroundColor: '#2C7DA0',
  },

  // barra vermelha de falta
  missedBar: {
    backgroundColor: '#EF4444',
  },

  // barra cinza de cancelado
  canceledBar: {
    backgroundColor: '#94A3B8',
  },

  // container dos botões principais
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },

  // botões empilhados no mobile
  buttonsContainerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  // botão principal de novo agendamento
  newButton: {
    height: 58,
    backgroundColor: '#0C706E',
    borderRadius: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  // botão secundário de reagendamento
  reagendamentoButton: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0C706E',
    borderRadius: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  // texto do botão de reagendamento
  reagendamentoButtonText: {
    color: '#0C706E',
    fontSize: 15,
    fontWeight: '600',
  },
  });
