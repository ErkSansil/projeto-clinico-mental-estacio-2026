// arquivo app/calendario-administrador.tsx

// importa os componentes do React Native
import React, { useMemo, useState, useEffect, useCallback } from 'react';

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

// importando imagem para icones
import { Image } from 'react-native';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token
import { useAuth } from '../contexts/AuthContext';

// badge global de reagendamentos pendentes
import { useBadge } from '../contexts/BadgeContext';

// função que busca consultas por data no banco
import { buscarConsultas } from '../services/api';

// tipos de status possíveis para uma consulta
type ConsultaStatus = 
'Confirmada' | 
'Pendente' | 
'Remarcada' | 
'Falta' | 
'Cancelamento';

// estrutura de uma consulta
type Consulta = {
  id: number;
  horario: string;
  paciente: string;
  idade: number;
  tipo: 'Criança' | 'Adulto';
  responsavel?: string; // opcional (usado quando for criança)
  profissional: string;
  sala: string;
  status: ConsultaStatus;
  faltas: number;
  cancelamentos: number;
  precisaAprovacao?: boolean; // indica se precisa de aprovação do admin
};

// horários fixos definidos pela clínica
const horariosFixos = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

// sem mock — dados carregados da API conforme a data selecionada

// dias da semana abreviados
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// função para transformar data em chave (yyyy-mm-dd)
function formatDateKey(date: Date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

// formata data para exibição amigável
function formatDateLabel(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// gera matriz do calendário (incluindo espaços vazios)
function getMonthMatrix(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix: (Date | null)[] = [];

  // adiciona espaços vazios antes do primeiro dia
  for (let i = 0; i < startDayOfWeek; i += 1) {
    matrix.push(null);
  }

  // adiciona os dias do mês
  for (let day = 1; day <= daysInMonth; day += 1) {
    matrix.push(new Date(year, month, day));
  }

  // completa a grade para múltiplos de 7
  while (matrix.length % 7 !== 0) {
    matrix.push(null);
  }

  return matrix;
}

export default function AdminCalendarScreen() {
  // largura da tela (para responsividade)
  const { width } = useWindowDimensions();

  // verifica se está em desktop
  const isDesktop = width >= 900;

  // token do usuário logado
  const { token } = useAuth();

  // badge global de reagendamentos pendentes
  const { pendentesReagendamento } = useBadge();

  // estado do mês atual exibido — inicia no mês atual
  const [currentMonth, setCurrentMonth] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  // estado da data selecionada — inicia em hoje
  const [selectedDate, setSelectedDate] = useState(new Date());

  // consultas do dia selecionado carregadas do banco
  const [consultasDoDia, setConsultasDoDia] = useState<any[]>([]);

  // memo para evitar recalcular o calendário sem necessidade
  const calendarDays = useMemo(() => getMonthMatrix(currentMonth), [currentMonth]);

  // formata data para o padrão que o backend espera (dd/mm/aaaa)
  function formatarDataParaApi(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // carrega as consultas do dia selecionado e mapeia os campos do banco para o formato do template
  const carregarConsultasDoDia = useCallback(async (data: Date) => {
    if (!token) return;
    try {
      const dataFormatada = formatarDataParaApi(data);
      const resultado = await buscarConsultas({ data: dataFormatada }, token);
      // buscarConsultas retorna array diretamente em resultado.dados
      const lista = Array.isArray(resultado.dados) ? resultado.dados : [];
      // mapeia campos do banco (pacienteNome, profissionalNome) para os usados no template
      const mapeado = lista.map((c: any) => ({
        ...c,
        paciente: c.pacienteNome ?? c.paciente ?? '—',
        profissional: c.profissionalNome ?? c.profissional ?? '—',
        // normaliza horário removendo segundos caso venha HH:MM:SS do MySQL
        horario: c.horario ? String(c.horario).slice(0, 5) : '—',
        // status traduzido para o padrão do template
        status: c.status === 'confirmado' ? 'Confirmada'
          : c.status === 'pendente' ? 'Pendente'
          : c.status === 'cancelado' ? 'Cancelamento'
          : c.status === 'falta' ? 'Falta'
          : c.status,
        // aprovação pendente quando status é pendente
        precisaAprovacao: c.status === 'pendente',
        // faltas e cancelamentos não vêm da API básica
        faltas: 0,
        cancelamentos: 0,
        idade: c.idade ?? null,
        tipo: c.tipo ?? null,
        responsavel: c.responsavel ?? null,
      }));
      setConsultasDoDia(mapeado);
    } catch (e) {
      setConsultasDoDia([]);
    }
  }, [token]);

  // recarrega sempre que a data selecionada muda
  useEffect(() => {
    carregarConsultasDoDia(selectedDate);
  }, [selectedDate, carregarConsultasDoDia]);

  // chave da data selecionada no formato yyyy-mm-dd — usada para marcar o dia no calendário
  const selectedKey = formatDateKey(selectedDate);

  // métricas do dia calculadas da lista real
  const totalConfirmadas = consultasDoDia.filter(c => c.status === 'confirmado').length;
  const totalPendentes = consultasDoDia.filter(c => c.status === 'pendente').length;
  const totalFaltas = consultasDoDia.filter(c => c.status === 'falta').length;
  const totalCancelamentos = consultasDoDia.filter(c => c.status === 'cancelado').length;

  // navega para o mês anterior
  function handlePreviousMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  // navega para o próximo mês
  function handleNextMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  // retorna o estilo do status
  function getStatusColor(status: ConsultaStatus) {
    switch (status) {
      case 'Confirmada':
        return styles.badgeConfirmada;
      case 'Pendente':
        return styles.badgePendente;
      case 'Remarcada':
        return styles.badgeRemarcada;
      case 'Falta':
        return styles.badgeFalta;
      case 'Cancelamento':
        return styles.badgeCancelamento;
      default:
        return styles.badgePendente;
    }
  }

  // retorna consulta por horário
  function getConsultaPorHorario(horario: string) {
    return consultasDoDia.find((consulta) => consulta.horario === horario);
  }

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar lateral do administrador */}
        {/* bloco responsável pela navegação lateral visível apenas em desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* área da logo da clínica */}
            {/* contém símbolo e nome institucional da aplicação */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              {/* bloco de textos da logo */}
              {/* nome e subtítulo da clínica */}
              <View>
                <Text style={styles.logoText}>SEP</Text>
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* área de navegação do menu lateral */}
            {/* concentra todas as rotas administrativas */}
            <View style={styles.menuArea}>

              {/* item de menu: administrador */}
              {/* acesso principal do perfil administrativo */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                <Image
                  source={require('../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Administrador</Text>
              </TouchableOpacity>

              {/* separador visual de seção do menu */}
              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              {/* item de menu: agendamentos */}
              {/* rota para gerenciamento de consultas */}
              <TouchableOpacity style={[ styles.menuItem, styles.menuActive,]}>
                <Image
                  source={require('../assets/images/agendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={[styles.menuText, styles.menuTextActive,]}>Agendamentos</Text>
              </TouchableOpacity>

              {/* item de menu: pacientes */}
              {/* acesso à lista de pacientes cadastrados */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-admin')}
              >
                <Image
                  source={require('../assets/images/paciente.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Pacientes</Text>
              </TouchableOpacity>

              {/* item de menu: salas */}
              {/* gerenciamento das salas disponíveis */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-admin')}
              >
                <Image
                  source={require('../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Salas</Text>
              </TouchableOpacity>

              {/* item de menu: cancelamentos */}
              {/* histórico e gestão de cancelamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cancelamentos')}
              >
                <Image
                  source={require('../assets/images/cancelamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Cancelamentos</Text>
              </TouchableOpacity>

              {/* item de menu: pedidos reagendamentos */}
              {/* solicitacoes de estagiario ao administrador de reagendamentos de pacientes */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pedidos-reagendamentos')}
              >
                <Image
                  source={require('../assets/images/reagendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Pedidos reagendamento</Text>

                {/* badge vermelho com contagem de reagendamentos pendentes */}
                {pendentesReagendamento > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{pendentesReagendamento}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* item de menu: cadastro de estagiário */}
              {/* rota para criação de novos estagiários */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cadastro')}
              >
                <Image
                  source={require('../assets/images/estagiario.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Cadastrar Estagiário</Text>
              </TouchableOpacity>


              {/* item do menu: relatório de atendimentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                {/* ícone de relatório */}
                <Image
                  source={require('../assets/images/relatorio2.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item relatório */}
                <Text style={styles.menuText}>Relatório Atendimentos</Text>
              </TouchableOpacity>

              {/* item de menu: perfil */}
              {/* acesso às informações do usuário logado */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/perfil-administrador')}
              >
                <Image
                  source={require('../assets/images/perfil.png')}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* conteúdo principal da página */}
        {/* área central com calendário, cards e informações */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* elementos decorativos do fundo */}
          {/* círculos e pontos usados apenas para estética visual */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />
          <View style={styles.decorDotOne} />
          <View style={styles.decorDotTwo} />
          <View style={styles.decorDotThree} />

          {/* cabeçalho da tela */}
          {/* contém título e descrição do módulo atual */}
          <View style={[styles.header, !isDesktop && styles.headerMobile]}>
            <View style={styles.headerTextBox}>
              <Text style={styles.title}>Calendário Administrador</Text>

              <Text style={styles.subtitle}>
                Acompanhe horários fixos, faltas, cancelamentos e remarcações da clínica.
              </Text>
            </View>
          </View>

          {/* cards de resumo estatístico */}
          {/* exibe indicadores principais do sistema */}
          <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#087A73" />
              </View>
              <View>
                <Text style={styles.statNumber}>{totalConfirmadas}</Text>
                <Text style={styles.statLabel}>Confirmadas</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconYellow}>
                <Ionicons name="alert-circle-outline" size={24} color="#C47F00" />
              </View>
              <View>
                <Text style={styles.statNumber}>{totalPendentes}</Text>
                <Text style={styles.statLabel}>Aprovação do admin</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconRed}>
                <Ionicons name="close-circle-outline" size={24} color="#E03131" />
              </View>
              <View>
                <Text style={styles.statNumber}>{totalFaltas}</Text>
                <Text style={styles.statLabel}>Faltas</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconBlue}>
                <Ionicons name="refresh-outline" size={24} color="#1C7ED6" />
              </View>
              <View>
                <Text style={styles.statNumber}>{totalCancelamentos}</Text>
                <Text style={styles.statLabel}>Cancelamentos</Text>
              </View>
            </View>
          </View>

          {/* grid principal da tela */}
          {/* divide calendário e solicitações pendentes */}
          <View style={[styles.mainGrid, isDesktop && styles.mainGridDesktop]}>

            {/* card do calendário mensal */}
            <View style={styles.sectionCard}>

              {/* cabeçalho do calendário com navegação de mês */}
              <View style={styles.monthHeader}>
                <TouchableOpacity style={styles.monthButton} onPress={handlePreviousMonth}>
                  <Ionicons name="chevron-back" size={20} color="#087A73" />
                </TouchableOpacity>

                {/* exibição do mês atual formatado */}
                <Text style={styles.monthTitle}>
                  {currentMonth.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>

                <TouchableOpacity style={styles.monthButton} onPress={handleNextMonth}>
                  <Ionicons name="chevron-forward" size={20} color="#087A73" />
                </TouchableOpacity>
              </View>

              {/* linha com dias da semana */}
              <View style={styles.weekDaysRow}>
                {diasSemana.map((dia) => (
                  <Text key={dia} style={styles.weekDayText}>
                    {dia}
                  </Text>
                ))}
              </View>

              {/* grid dos dias do mês */}
              <View style={styles.daysGrid}>
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <View key={`empty-${index}`} style={styles.emptyDay} />;
                  }

                  const dateKey = formatDateKey(date);
                  // ponto indicador: mostra no dia selecionado se houver consultas carregadas
                  const hasAgenda = dateKey === selectedKey && consultasDoDia.length > 0;
                  const isSelected = dateKey === selectedKey;

                  return (
                    <TouchableOpacity
                      key={dateKey}
                      style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          isSelected && styles.dayButtonTextSelected,
                        ]}
                      >
                        {date.getDate()}
                      </Text>

                      {/* indicador de agenda no dia */}
                      {hasAgenda && (
                        <View style={[styles.dayDot, isSelected && styles.dayDotSelected]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* regra informativa de horários */}
              <View style={styles.ruleBox}>
                <Ionicons name="time-outline" size={20} color="#087A73" />
                <Text style={styles.ruleText}>
                  Horários fixos: segunda a sexta, das 08h às 21h. Não usar 08:30 ou 09:30.
                </Text>
              </View>
            </View>

            {/* card de solicitações pendentes */}
            <View style={styles.sectionCard}>

              {/* título da seção de alertas */}
              <Text style={styles.sectionTitle}>Avisos para aprovação</Text>

              {/* descrição da seção */}
              <Text style={styles.sectionSubtitle}>
                Cancelamentos e remarcações precisam ser confirmados pelo administrador.
              </Text>

              {/* condição: nenhuma solicitação pendente */}
              {consultasDoDia.filter((item) => item.precisaAprovacao).length === 0 ? (
                <View style={styles.emptyApproval}>
                  <Ionicons name="checkmark-circle-outline" size={28} color="#087A73" />
                  <Text style={styles.emptyApprovalText}>Nenhuma solicitação pendente.</Text>
                </View>
              ) : (
                /* lista de solicitações pendentes */
                consultasDoDia
                  .filter((item) => item.precisaAprovacao)
                  .map((item) => (
                    <View key={item.id} style={styles.approvalCard}>

                      {/* ícone de alerta da solicitação */}
                      <View style={styles.approvalIcon}>
                        <Ionicons name="notifications-outline" size={20} color="#C47F00" />
                      </View>

                      {/* informações da solicitação */}
                      <View style={styles.approvalInfo}>
                        <Text style={styles.approvalTitle}>Pendente de aprovação</Text>
                        <Text style={styles.approvalText}>
                          {item.paciente} — {item.horario}
                        </Text>
                        <Text style={styles.approvalText}>
                          Consulta #{item.id}
                        </Text>
                      </View>

                      {/* botão de ação para aprovação */}
                      <TouchableOpacity style={styles.approveButton}>
                        <Text style={styles.approveButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  ))
              )}
            </View>
          </View>

          {/* agenda do dia */}
          {/* seção responsável por exibir a agenda detalhada do dia selecionado no calendário */}
          <View style={styles.sectionCard}>

            {/* cabeçalho da seção da agenda */}
            {/* contém título e subtítulo com a data formatada */}
            <View style={styles.sectionHeader}>
              <View>

                {/* título principal da agenda */}
                <Text style={styles.sectionTitle}>Agenda do dia</Text>

                {/* subtítulo exibindo a data selecionada */}
                <Text style={styles.sectionSubtitle}>{formatDateLabel(selectedDate)}</Text>
              </View>

              {/* botão de novo agendamento (visível apenas no mobile) */}
              {!isDesktop && (
                <TouchableOpacity
                  style={styles.newButtonMobile}
                  onPress={() => router.push('/novo-agendamento-administrador')}
                >
                  <Ionicons name="add-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {/* linha do tempo da agenda */}
            {/* lista todos os horários fixos do dia */}
            <View style={styles.timeline}>
              {horariosFixos.map((horario) => {

                // busca se existe consulta naquele horário específico
                const consulta = getConsultaPorHorario(horario);

                return (
                  <View key={horario} style={styles.timelineRow}>

                    {/* coluna do horário */}
                    <View style={styles.timeColumn}>
                      <Text style={styles.timeText}>{horario}</Text>
                    </View>

                    {/* condição: existe consulta no horário */}
                    {consulta ? (
                      <View style={styles.appointmentCard}>

                        {/* topo do card de consulta */}
                        <View style={styles.appointmentTop}>

                          {/* avatar com iniciais do paciente */}
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                              {consulta.paciente
                                .split(' ')
                                .map((nome) => nome[0])
                                .slice(0, 2)
                                .join('')}
                            </Text>
                          </View>

                          {/* informações principais da consulta */}
                          <View style={styles.appointmentInfo}>

                            {/* nome do paciente vindo do banco */}
                            <Text style={styles.patientName}>{consulta.paciente}</Text>

                            {/* observação da consulta se houver */}
                            {consulta.observacao ? (
                              <Text style={styles.patientMeta}>{consulta.observacao}</Text>
                            ) : null}
                          </View>

                          {/* badge de status da consulta */}
                          <View style={[styles.statusBadge, getStatusColor(consulta.status)]}>
                            <Text style={styles.statusText}>{consulta.status}</Text>
                          </View>
                        </View>

                        {/* linha de detalhes adicionais da consulta */}
                        <View style={styles.detailsRow}>

                          {/* profissional responsável */}
                          <View style={styles.detailItem}>
                            <Ionicons name="person-outline" size={16} color="#7E8D9B" />
                            <Text style={styles.detailText}>{consulta.profissional}</Text>
                          </View>

                          {/* sala utilizada */}
                          <View style={styles.detailItem}>
                            <Ionicons name="business-outline" size={16} color="#7E8D9B" />
                            <Text style={styles.detailText}>{consulta.sala}</Text>
                          </View>

                          {/* número de cancelamentos */}
                          <View style={styles.detailItem}>
                            <Ionicons name="close-circle-outline" size={16} color="#7E8D9B" />
                            <Text style={styles.detailText}>
                              {consulta.cancelamentos}/2 cancelamentos
                            </Text>
                          </View>

                          {/* número de faltas */}
                          <View style={styles.detailItem}>
                            <Ionicons name="alert-outline" size={16} color="#7E8D9B" />
                            <Text style={styles.detailText}>{consulta.faltas} faltas</Text>
                          </View>
                        </View>

                        {/* alerta de limite de cancelamentos */}
                        {consulta.cancelamentos >= 2 && (
                          <View style={styles.warningBox}>
                            <Ionicons name="warning-outline" size={17} color="#E03131" />
                            <Text style={styles.warningText}>
                              Atenção: na próxima ocorrência o paciente pode perder a vaga.
                            </Text>
                          </View>
                        )}
                      </View>

                    ) : (
                      /* caso não exista consulta no horário */
                      <View style={styles.emptySlot}>
                        <Text style={styles.emptySlotText}>Horário livre</Text>
                      </View>
                    )}
                  </View>
                );
              })}
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

  // estrutura principal (sidebar + conteúdo)
  page: {
  flex: 1,
  flexDirection: 'row',
},

  // área central da tela
  content: {
    flex: 1,
  },

  // Scroll com espaçamento geral
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },

  // círculo decorativo esquerdo
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

  // círculo decorativo direito
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

  // ponto decorativo 1
  decorDotOne: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF6F2',
    top: 52,
    left: '58%',
  },

  // ponto decorativo 2
  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    top: 300,
    left: 40,
  },

  // ponto decorativo 3
  decorDotThree: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  // cabeça~ho da tela
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // cabeçalho da tela no mobile
  headerMobile: {
    marginTop: 18,
    alignItems: 'flex-start',
  },

  // botão voltar
  backIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // texto do cabeçalho
  headerTextBox: {
    flex: 1,
  },

  // título
  title: {
    fontSize: 30,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo
  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 4,
    lineHeight: 21,
  },

  // botão novo
  newButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#087A73',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // texto botão
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // grid stats
  statsGrid: {
    gap: 14,
    marginBottom: 18,
  },

  // grid desktop
  statsGridDesktop: {
    flexDirection: 'row',
  },

  // card stat
  statCard: {
    flex: 1,
    minHeight: 102,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 3,
  },

  // ícone stat
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ícone amarelo
  statIconYellow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ícone vermelho
  statIconRed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE1E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ícone azul
  statIconBlue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDEFFC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // número
  statNumber: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '600',
  },

  // label
  statLabel: {
    fontSize: 13,
    color: '#61717B',
    marginTop: 2,
  },

  // grid principal
  mainGrid: {
    gap: 18,
    marginBottom: 18,
  },

  // grid desktop
  mainGridDesktop: {
    flexDirection: 'row',
  },

  // card seção
  sectionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    elevation: 4,
  },

  // header seção
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // título seção
  sectionTitle: {
    fontSize: 18,
    color: '#087A73',
    fontWeight: '600',
    marginBottom: 4,
  },

  // subtítulo seção
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginBottom: 18,
    lineHeight: 19,
  },

  // header mês
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
  },

  // botão mês
  monthButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // título mês
  monthTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#17262F',
    fontSize: 18,
    fontWeight: '600',
  },

  // dias semana
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  // texto dia semana
  weekDayText: {
    width: '14.2%',
    textAlign: 'center',
    fontSize: 12,
    color: '#7E8D9B',
  },

  // grid dias
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },

  // dia vazio
  emptyDay: {
    width: '14.2%',
    height: 44,
  },

  // botão dia
  dayButton: {
    width: '14.2%',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // dia selecionado
  dayButtonSelected: {
    backgroundColor: '#087A73',
  },

  // texto dia
  dayButtonText: {
    fontSize: 14,
    color: '#61717B',
    fontWeight: '500',
  },

  // texto dia selecionado
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },

  // ponto dia
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#12B886',
    marginTop: 3,
  },

  // ponto selecionado
  dayDotSelected: {
    backgroundColor: '#FFFFFF',
  },

  // caixa informativa de regras do calendário
  // usada para exibir orientações importantes sobre horários fixos
  ruleBox: {
    marginTop: 18,
    backgroundColor: '#EEF8F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EDE5',
    padding: 14,
    flexDirection: 'row',
    gap: 10,
  },

  // texto explicativo dentro da caixa de regras
  // ocupa o espaço restante e mantém boa leitura
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: '#61717B',
    lineHeight: 19,
  },

  // estado vazio quando não há solicitações pendentes
  // exibe mensagem centralizada informando ausência de ações
  emptyApproval: {
    minHeight: 90,
    borderRadius: 14,
    backgroundColor: '#EEF8F4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  // texto exibido no estado vazio de aprovações
  emptyApprovalText: {
    fontSize: 13,
    color: '#61717B',
  },

  // card de solicitação pendente de aprovação
  // representa ações que precisam de validação do administrador
  approvalCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1E0BF',
    backgroundColor: '#FFF9EC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },

  // ícone circular dentro do card de aprovação
  // indica visualmente o tipo de notificação
  approvalIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // área de texto do card de aprovação
  // organiza informações principais da solicitação
  approvalInfo: {
    flex: 1,
  },

  // título da solicitação pendente
  approvalTitle: {
    fontSize: 14,
    color: '#17262F',
    fontWeight: '500',
  },

  // texto complementar da solicitação
  approvalText: {
    fontSize: 12,
    color: '#61717B',
    marginTop: 2,
  },

  // botão de aprovação da solicitação
  // ação principal para confirmar o pedido
  approveButton: {
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: '#087A73',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  // texto do botão de aprovação
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // botão de novo agendamento no mobile
  // aparece apenas em telas menores
  newButtonMobile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#087A73',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // container da linha do tempo da agenda
  // organiza os horários do dia verticalmente
  timeline: {
    gap: 12,
  },

  // linha individual da timeline (horário + consulta)
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },

  // coluna do horário fixo
  timeColumn: {
    width: 58,
    paddingTop: 16,
  },

  // texto do horário exibido na timeline
  timeText: {
    fontSize: 16,
    color: '#087A73',
    fontWeight: '600',
  },

  // card principal de consulta/agendamento
  appointmentCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 14,
  },

  // parte superior do card de consulta
  // contém avatar, nome e status
  appointmentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // avatar circular com iniciais do paciente
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DCEFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // texto dentro do avatar (iniciais)
  avatarText: {
    color: '#087A73',
    fontWeight: '600',
  },

  // bloco de informações do paciente
  appointmentInfo: {
    flex: 1,
  },

  // nome do paciente na consulta
  patientName: {
    fontSize: 15,
    color: '#17262F',
    fontWeight: '500',
  },

  // informações complementares do paciente
  patientMeta: {
    fontSize: 12,
    color: '#61717B',
    marginTop: 2,
  },

  // badge de status da consulta
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  // status: consulta confirmada
  badgeConfirmada: {
    backgroundColor: '#DDF5EB',
  },

  // status: consulta pendente
  badgePendente: {
    backgroundColor: '#FFF1D6',
  },

  // status: consulta remarcada
  badgeRemarcada: {
    backgroundColor: '#DDEFFC',
  },

  // status: falta registrada
  badgeFalta: {
    backgroundColor: '#FFE1E5',
  },

  // status: cancelamento
  badgeCancelamento: {
    backgroundColor: '#FFE1E5',
  },

  // texto do status da consulta
  statusText: {
    fontSize: 12,
    color: '#17262F',
    fontWeight: '500',
  },

  // linha de detalhes adicionais da consulta
  // exibe profissional, sala, faltas e cancelamentos
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },

  // item individual de detalhe com ícone
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  // texto de cada detalhe da consulta
  detailText: {
    fontSize: 12,
    color: '#61717B',
  },

  // caixa de alerta para limite de cancelamentos
  warningBox: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD3D3',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // texto do alerta de aviso
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#E03131',
    lineHeight: 17,
  },

  // estado vazio para horários sem consulta
  emptySlot: {
    flex: 1,
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    borderStyle: 'dashed',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FAFDFC',
  },

  // texto exibido quando o horário está livre
  emptySlotText: {
    fontSize: 13,
    color: '#9AA6AC',
  },

    // sidebar
    sidebar: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#DCEBE7',
    paddingTop: 28,
  },

  // logo
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  // símbolo psi
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

  // subtítulo
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

  // ícone png
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

  // badge de notificação no item de menu
  menuBadge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto' as any,
    paddingHorizontal: 5,
  },

  // texto do badge de notificação
  menuBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  });