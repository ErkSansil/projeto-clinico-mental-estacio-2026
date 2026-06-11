// arquivo app/paciente-detalhe-estagiario.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState, useEffect } from 'react';

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
  // indicador de carregamento
  ActivityIndicator,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop
  useWindowDimensions,

} from 'react-native';

// biblioteca de ícones do Expo
// usado para exibir ícones visuais na interface da tela
import { Ionicons } from '@expo/vector-icons';

// router pra navegação entre telas
// useLocalSearchParams pega os parâmetros passados via router.push({ params: ... })
import { router, useLocalSearchParams } from 'expo-router';

// hook de autenticação para pegar o token JWT
import { useAuth } from '../contexts/AuthContext';

// funções de API para carregar o perfil do paciente e o histórico de consultas
import { buscarPerfilPaciente, buscarHistoricoPaciente } from '../services/api';

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

// calcula a idade em anos a partir de uma data no formato aaaa-mm-dd
function calcularIdade(dataNasc: string): number {
  const nasc = new Date(dataNasc + 'T00:00:00');
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje < new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())) idade -= 1;
  return idade;
}

// gera as iniciais de um nome (até 2 letras)
function gerarIniciais(nome: string): string {
  const partes = nome?.trim().split(' ') ?? [];
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return partes[0]?.[0]?.toUpperCase() ?? '?';
}

export default function PacienteDetalheScreen() {

  // pega a largura da tela para adaptar no mobile e desktop
  const { width } = useWindowDimensions();

  // se a tela for maior ou igual a 900, eu considero desktop
  const isDesktop = width >= 900;

  // CPF do paciente passado pela tela de listagem via router.push params
  const { cpf } = useLocalSearchParams<{ cpf: string }>();

  // token do usuário logado
  const { token } = useAuth();

  // dados do paciente carregados da API
  const [paciente, setPaciente] = useState<any>(null);

  // histórico de consultas do paciente
  const [historico, setHistorico] = useState<any[]>([]);

  // indica se os dados estão sendo carregados
  const [carregando, setCarregando] = useState(true);

  // carrega os dados do paciente e o histórico quando a tela abre
  useEffect(() => {
    async function carregarDados() {
      if (!cpf || !token) { setCarregando(false); return; }
      try {
        // busca perfil básico e histórico em paralelo
        const [resPerfil, resHistorico] = await Promise.all([
          buscarPerfilPaciente(cpf, token),
          buscarHistoricoPaciente(cpf, token),
        ]);
        if (resPerfil.status === 200 && resPerfil.dados?.paciente) {
          setPaciente(resPerfil.dados.paciente);
        }
        if (resHistorico.status === 200 && Array.isArray(resHistorico.dados?.historico)) {
          setHistorico(resHistorico.dados.historico);
        }
      } catch {
        // falha silenciosa — a tela ainda exibe o que conseguiu carregar
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [cpf, token]);

  // contadores calculados do histórico real
  const totalAtendimentos  = historico.length;
  const totalPresentes     = historico.filter((c: any) => c.status === 'concluida').length;
  const totalCancelamentos = historico.filter((c: any) => c.status === 'cancelada').length;
  const totalFaltas        = totalAtendimentos - totalPresentes - totalCancelamentos;

  // idade e categoria calculadas da data de nascimento real
  const idadeCalculada = paciente?.dataNascimento ? calcularIdade(paciente.dataNascimento) : null;
  const categoria = idadeCalculada !== null ? (idadeCalculada < 12 ? 'Criança' : idadeCalculada < 18 ? 'Adolescente' : 'Adulto') : '—';

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#0C706E" size="large" />
      </View>
    );
  }

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

            {/* avatar do paciente com iniciais reais */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{paciente ? gerarIniciais(paciente.nome) : '?'}</Text>
            </View>

            {/* área das informações principais do paciente */}
            <View style={styles.profileInfo}>

              {/* nome real do paciente carregado da API */}
              <Text style={styles.patientName}>{paciente?.nome ?? 'Paciente não encontrado'}</Text>

              {/* idade e categoria calculadas dinamicamente */}
              <Text style={styles.patientSub}>
                {idadeCalculada !== null ? `${idadeCalculada} anos • ${categoria}` : '—'}
              </Text>

              {/* badge de status baseado no campo ativo do banco */}
              <View style={styles.statusBadge}>
                <Ionicons
                  name="heart-outline"
                  size={14}
                  color="#0C706E"
                />
                <Text style={styles.statusText}>
                  {paciente?.ativo === false ? 'Inativo' : 'Em acompanhamento'}
                </Text>
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

              {/* informações básicas carregadas da API */}
              <InfoRow label="Nome" value={paciente?.nome ?? '—'} />
              <InfoRow label="Idade" value={idadeCalculada !== null ? `${idadeCalculada} anos` : '—'} />
              <InfoRow label="Tipo" value={categoria} />
              <InfoRow label="CPF" value={paciente?.cpf ?? '—'} />
              <InfoRow label="E-mail" value={paciente?.email ?? '—'} />

              {/* dados sensíveis bloqueados para estagiário */}
              <InfoRow
                label="Contato / Endereço"
                value="Disponível somente para administração"
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

              {/* contadores calculados do histórico real do paciente */}
              <InfoRow label="Atendimentos" value={String(totalAtendimentos)} />
              <InfoRow label="Concluídas" value={String(totalPresentes)} />
              <InfoRow label="Faltas" value={String(totalFaltas > 0 ? totalFaltas : 0)} />
              <InfoRow label="Cancelamentos" value={String(totalCancelamentos)} />

              {/* situação calculada do campo ativo no banco */}
              <InfoRow
                label="Situação"
                value={paciente?.ativo === false ? 'Inativo' : 'Em acompanhamento'}
              />
            </View>
          </View>

          {/* últimas consultas do paciente — carregadas do histórico real */}
          <View style={styles.sectionCard}>

            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={19} color="#0C706E" />
              <Text style={styles.sectionTitle}>Últimas consultas</Text>
            </View>

            {historico.length === 0 ? (
              <View style={styles.noteBox}>
                <Text style={styles.note}>Nenhuma consulta registrada.</Text>
              </View>
            ) : historico.slice(0, 5).map((c: any, i: number) => (
              <View key={c.id ?? i} style={styles.noteBox}>
                <Text style={styles.note}>
                  {c.data ? new Date(c.data).toLocaleDateString('pt-BR') : '—'}
                  {'  '}
                  {c.horario ? c.horario.slice(0, 5) : ''}
                  {'  '}
                  {c.sala ? `· ${c.sala}` : ''}
                </Text>
              </View>
            ))}
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