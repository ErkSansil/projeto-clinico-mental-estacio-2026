// arquivo app/acesso-administrador.tsx

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

// importanto imagens de icones
import { Image } from 'react-native';

// importando navegação
import { router } from 'expo-router';

// hook de autenticação para pegar o token
import { useAuth } from '../../contexts/AuthContext';

// função que busca as estatísticas do sistema para o painel admin
import { buscarEstatisticasAdmin } from '../../services/api';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// tela principal do painel de administrador
export default function AdminDashboardScreen() {
  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // verifica se está em tela grande (desktop)
  const isDesktop = width >= 900;

  // pega o token para autenticar a busca de estatísticas
  const { token } = useAuth();

  // estatísticas vindas do backend
  const [stats, setStats] = useState<any>(null);

  // carrega as estatísticas quando a tela abre
  useEffect(() => {
    async function carregarStats() {
      if (!token) return;
      try {
        const resultado = await buscarEstatisticasAdmin(token);
        if (resultado.status === 200) {
          setStats(resultado.dados);
        }
      } catch (e) {
        // se não conseguir carregar, mantém os valores nulos
      }
    }
    carregarStats();
  }, []);

  // monta a data de hoje no formato "09 de abril de 2025"
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // dia da semana por extenso
  const diaSemana = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  return (
      // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar lateral do administrador (aparece somente no desktop) */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* área do logo da clínica */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              {/* textos do logo */}
              <View>
                <Text style={styles.logoText}>SEP</Text>
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* área principal do menu lateral — usa ScrollView para não cortar itens em telas pequenas */}
            <ScrollView style={styles.menuArea} showsVerticalScrollIndicator={false}>

              {/* item do menu: administrador (ativo por padrão) */}
              <TouchableOpacity style={[styles.menuItem, styles.menuActive,]}>

                {/* ícone do menu administrador */}
                <Image
                  source={require('../../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item administrador */}
                <Text style={[styles.menuText, styles.menuTextActive,]}>Administrador</Text>
              </TouchableOpacity>

              {/* separador/label da seção do menu */}
              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              {/* item do menu: agendamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/calendario-administrador')}
              >
                {/* ícone de agendamentos */}
                <Image
                  source={require('../../assets/images/agendamento.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item agendamentos */}
                <Text style={styles.menuText}>Agendamentos</Text>
              </TouchableOpacity>

              {/* item do menu: pacientes */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-administrador')}
              >
                {/* ícone de pacientes */}
                <Image
                  source={require('../../assets/images/paciente.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item pacientes */}
                <Text style={styles.menuText}>Pacientes</Text>
              </TouchableOpacity>

              {/* item do menu: salas */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-administrador')}
              >
                {/* ícone de salas */}
                <Image
                  source={require('../../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item salas */}
                <Text style={styles.menuText}>Salas</Text>
              </TouchableOpacity>

              {/* item do menu: cancelamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cancelamentos')}
              >
                {/* ícone de cancelamentos */}
                <Image
                  source={require('../../assets/images/cancelamento.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item cancelamentos */}
                <Text style={styles.menuText}>Cancelamentos</Text>
              </TouchableOpacity>

              {/* item do menu: pedidos de reagendamentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pedidos-reagendamentos')}
              >
                {/* ícone de reagendamento */}
                <Image
                  source={require('../../assets/images/reagendamento.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item cancelamentos */}
                <Text style={styles.menuText}>Pedidos reagendamento</Text>
              </TouchableOpacity>

              {/* item do menu: cadastro de estagiário */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cadastro-estagiario')}
              >
                {/* ícone de estagiário */}
                <Image
                  source={require('../../assets/images/estagiario.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item cadastrar estagiário */}
                <Text style={styles.menuText}>Cadastrar Estagiário</Text>
              </TouchableOpacity>

              {/* item do menu: relatório de atendimentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                {/* ícone de relatório */}
                <Image
                  source={require('../../assets/images/relatorio2.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item relatório */}
                <Text style={styles.menuText}>Relatório Atendimentos</Text>
              </TouchableOpacity>

              {/* item do menu: perfil */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/perfil-administrador')}
              >
                {/* ícone de perfil */}
                <Image
                  source={require('../../assets/images/perfil.png')}
                  style={styles.menuIcon}
                />

                {/* texto do item perfil */}
                <Text style={styles.menuText}>Perfil</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* conteúdo principal da tela, responsável por envolver todo o layout visível */}
        <ScrollView contentContainerStyle={styles.contentMobile}>

          {/* círculos decorativos de fundo (efeito visual apenas, não interativos) */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />

          {/* pontos decorativos de fundo (detalhes visuais para composição do layout) */}
          <View style={styles.decorDotOne} />
          <View style={styles.decorDotTwo} />
          <View style={styles.decorDotThree} />
          <View style={styles.decorDotFour} />
          <View style={styles.decorDotFive} />

          {/* cabeçalho principal da tela (área superior com título e informações do usuário) */}
          <View style={styles.header}>
            
            {/* bloco de título e subtítulo da página */}
            <View>
              <Text style={styles.title}>Painel do Administrador</Text>

              {/* descrição do propósito da tela */}
              <Text style={styles.subtitle}>
                Gerencie e acompanhe as informações principais da clínica.
              </Text>
            </View>

            {/* área de informações do usuário (exibida somente no desktop) */}
            {isDesktop && (
              <View style={styles.userArea}>

                {/* caixa de data atual — mostra o dia de hoje dinamicamente */}
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{dataHoje}</Text>
                  <Text style={styles.dateSubtext}>{diaSemanaFormatado}</Text>
                </View>

                {/* avatar do usuário (iniciais do administrador) */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AD</Text>
                </View>

                {/* informações textuais do usuário logado */}
                <View>
                  <Text style={styles.userName}>Administrador</Text>
                  <Text style={styles.userRole}>Admin</Text>
                </View>
              </View>
            )}
          </View>

          {/* seção de cards de acesso rápido (atalhos para ações principais do sistema) */}
          <View style={styles.sectionCard}>

            {/* título da seção de atalhos */}
            <Text style={styles.sectionTitle}>Acesso rápido</Text>

            {/* subtítulo explicando a função da seção */}
            <Text style={styles.sectionSubtitle}>
              Ações mais utilizadas no sistema
            </Text>

            {/* grid que organiza os cards de acesso rápido */}
            <View style={[styles.quickGrid, isDesktop && styles.quickGridDesktop]}>

              {/* card de atalho para criação de novo agendamento */}
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => router.push('/novo-agendamento-administrador')}
              >
                {/* ícone visual do atalho */}
                <View style={styles.quickIcon}>
                  <Text style={styles.quickIconText}>▣</Text>
                </View>

                {/* textos descritivos do atalho */}
                <View>
                  <Text style={styles.quickTitle}>Novo agendamento</Text>
                  <Text style={styles.quickText}>Agendar consulta</Text>
                </View>
              </TouchableOpacity>

              {/* card de atalho para realizar reagendamento de consulta */}
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => router.push('/reagendamento-administrador')}
              >
                {/* ícone visual do reagendamento */}
                <View style={styles.quickIcon}>
                  <Text style={styles.quickIconText}>＋</Text>
                </View>

                {/* textos descritivos do reagendamento */}
                <View>
                  <Text style={styles.quickTitle}>Realizar Reagendamento</Text>
                  <Text style={styles.quickText}>Reagendar consulta</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* card de visão geral (resumo geral dos principais indicadores do sistema) */}
          <View style={styles.sectionCard}>

            {/* título da seção de visão geral */}
            <Text style={styles.sectionTitle}>Visão geral</Text>

            {/* subtítulo explicando o conteúdo dos indicadores */}
            <Text style={styles.sectionSubtitle}>
              Resumo das informações principais
            </Text>

            {/* mobile com rolagem horizontal */}
            {!isDesktop ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsScroll}
              >

                {/* card de estatística: agendamentos */}
                <View style={[styles.statCard, styles.statCardMobile]}>

                  {/* ícone do indicador */}
                  <View style={styles.statIcon}>
                    <Text style={styles.statIconText}>▣</Text>
                  </View>

                  {/* informações numéricas do indicador — valores reais do banco */}
                  <View>
                    <Text style={styles.statNumber}>{stats?.agendamentos ?? '...'}</Text>
                    <Text style={styles.statLabel}>Agendamentos</Text>
                    <Text style={styles.statNeutral}>● Total cadastrado</Text>
                  </View>

                </View>

                {/* card de estatística: pacientes */}
                <View style={[styles.statCard, styles.statCardMobile]}>
                  <View style={styles.statIcon}>
                    <Text style={styles.statIconText}>☷</Text>
                  </View>

                  <View>
                    <Text style={styles.statNumber}>{stats?.pacientes ?? '...'}</Text>
                    <Text style={styles.statLabel}>Pacientes</Text>
                    <Text style={styles.statNeutral}>● Total cadastrado</Text>
                  </View>
                </View>

                {/* card de estatística: profissionais */}
                <View style={[styles.statCard, styles.statCardMobile]}>
                  <View style={styles.statIcon}>
                    <Text style={styles.statIconText}>♙</Text>
                  </View>

                  <View>
                    <Text style={styles.statNumber}>{stats?.profissionais ?? '...'}</Text>
                    <Text style={styles.statLabel}>Profissionais</Text>
                    <Text style={styles.statNeutral}>● Sem alterações</Text>
                  </View>
                </View>

                {/* card de estatística: salas */}
                <View style={[styles.statCard, styles.statCardMobile]}>
                  <View style={styles.statIcon}>
                    <Text style={styles.statIconText}>▥</Text>
                  </View>

                  <View>
                    <Text style={styles.statNumber}>{stats?.salas ?? '...'}</Text>
                    <Text style={styles.statLabel}>Salas</Text>
                    <Text style={styles.statNeutral}>● Total cadastrado</Text>
                  </View>
                </View>

                {/* card de estatística: cancelamentos */}
                <View style={[styles.statCard, styles.statCardMobile]}>

                  {/* ícone com destaque negativo (cancelamentos) */}
                  <View style={styles.statIconRed}>
                    <Text style={styles.statIconRedText}>×</Text>
                  </View>

                  <View>
                    <Text style={styles.statNumber}>{stats?.cancelamentos ?? '...'}</Text>
                    <Text style={styles.statLabel}>Cancelamentos</Text>
                    <Text style={styles.statNeutral}>● Total registrado</Text>
                  </View>
                </View>

              </ScrollView>
            ) : (

    /* desktop continua normal — mesmos valores reais */
    <View style={[styles.statsGrid, styles.statsGridDesktop]}>

      {/* card de estatística: agendamentos */}
      <View style={styles.statCard}>

        {/* ícone do indicador */}
        <View style={styles.statIcon}>
          <Text style={styles.statIconText}>▣</Text>
        </View>

        {/* informações numéricas do indicador */}
        <View>
          <Text style={styles.statNumber}>{stats?.agendamentos ?? '...'}</Text>
          <Text style={styles.statLabel}>Agendamentos</Text>
          <Text style={styles.statNeutral}>● Total cadastrado</Text>
        </View>

      </View>

      {/* card de estatística: pacientes */}
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statIconText}>☷</Text>
        </View>

        <View>
          <Text style={styles.statNumber}>{stats?.pacientes ?? '...'}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
          <Text style={styles.statNeutral}>● Total cadastrado</Text>
        </View>
      </View>

      {/* card de estatística: profissionais */}
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statIconText}>♙</Text>
        </View>

        <View>
          <Text style={styles.statNumber}>{stats?.profissionais ?? '...'}</Text>
          <Text style={styles.statLabel}>Profissionais</Text>
          <Text style={styles.statNeutral}>● Sem alterações</Text>
        </View>
      </View>

      {/* card de estatística: salas */}
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statIconText}>▥</Text>
        </View>

        <View>
          <Text style={styles.statNumber}>{stats?.salas ?? '...'}</Text>
          <Text style={styles.statLabel}>Salas</Text>
          <Text style={styles.statNeutral}>● Total cadastrado</Text>
        </View>
      </View>

      {/* card de estatística: cancelamentos */}
      <View style={styles.statCard}>

        {/* ícone com destaque negativo (cancelamentos) */}
        <View style={styles.statIconRed}>
          <Text style={styles.statIconRedText}>×</Text>
        </View>

        <View>
          <Text style={styles.statNumber}>{stats?.cancelamentos ?? '...'}</Text>
          <Text style={styles.statLabel}>Cancelamentos</Text>
          <Text style={styles.statNeutral}>● Total registrado</Text>
        </View>
      </View>

    </View>
  )}
</View>

          {/* card de atividades recentes (lista de ações mais recentes realizadas no sistema) */}
          <View style={styles.sectionCard}>

            {/* cabeçalho do card de atividades (título + ação de navegação) */}
            <View style={styles.sectionHeader}>

              {/* bloco de textos do cabeçalho */}
              <View>

                {/* título principal da seção */}
                <Text style={styles.sectionTitle}>Atividades recentes</Text>

                {/* subtítulo explicando o contexto da lista */}
                <Text style={styles.sectionSubtitle}>
                  Últimas ações realizadas no sistema
                </Text>

              </View>

              {/* botão de ação para visualizar todas as atividades */}
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Ver todas</Text>
              </TouchableOpacity>

            </View>

            {/* lista com as últimas consultas criadas — dados reais do banco */}
            <View style={styles.activityList}>

              {/* mensagem quando não há atividades ainda */}
              {(!stats?.atividadesRecentes || stats.atividadesRecentes.length === 0) && (
                <View style={{ padding: 20 }}>
                  <Text style={{ color: '#6B7C86', fontSize: 13 }}>Nenhuma atividade registrada ainda.</Text>
                </View>
              )}

              {/* renderiza cada consulta como uma linha de atividade */}
              {(stats?.atividadesRecentes ?? []).map((item: any, index: number) => {
                const isLast = index === (stats.atividadesRecentes.length - 1);
                const dataFormatada = item.data
                  ? new Date(item.data).toLocaleDateString('pt-BR')
                  : '';
                // cancelado → ícone vermelho, senão → ícone verde
                const isCancelado = item.status === 'cancelado';
                return (
                  <View key={item.id ?? index} style={isLast ? styles.activityItemLast : styles.activityItem}>

                    {/* ícone muda de cor conforme o status da consulta */}
                    {isCancelado ? (
                      <View style={styles.activityIconRed}>
                        <Text style={styles.activityIconRedText}>×</Text>
                      </View>
                    ) : (
                      <View style={styles.activityIcon}>
                        <Text style={styles.activityIconText}>▣</Text>
                      </View>
                    )}

                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>
                        {isCancelado ? 'Consulta cancelada' : 'Consulta agendada'}
                      </Text>
                      <Text style={styles.activityText}>
                        {item.paciente} — {dataFormatada} às {item.horario}
                      </Text>
                    </View>

                    {/* status da consulta no lugar do "Há X minutos" */}
                    <Text style={styles.activityTime}>{item.status}</Text>
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

  // área da logo
  logoArea: {
    backgroundColor: '#087A73',
    minHeight: 150,
    borderBottomRightRadius: 26,
    paddingHorizontal: 28,
    paddingTop: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // símbolo da logo
  logoSymbol: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // subtítulo da logo
  logoSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 2,
  },

  // item do menu lateral
  sidebarItem: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },

  // item ativo do menu
  sidebarItemActive: {
    backgroundColor: '#EAF6F2',
  },

  // ícone do menu
  sidebarIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},

  // texto do menu
  sidebarText: {
    fontSize: 15,
    color: '#60768A',
    fontWeight: '400',
  },

  // texto ativo do menu
  sidebarTextActive: {
    color: '#087A73',
    fontWeight: '500',
  },

  // conteúdo com espaçamento
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 44,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  // círculo decorativo grande da esquerda
  decorCircleOne: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: '#DCEFEB',
    opacity: 0.55,
    left: -110,
    top: 135,
  },

  // círculo decorativo grande da direita
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

  // círculo decorativo mais baixo
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

  // bolinha decorativa
  decorDotOne: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF6F2',
    top: 52,
    left: '58%',
  },

  // bolinha decorativa
  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    top: 300,
    left: 40,
  },

  // bolinha decorativa
  decorDotThree: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4ECE6',
    top: 350,
    left: 72,
  },

  // bolinha decorativa
  decorDotFour: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBE6DF',
    top: 390,
    left: 54,
  },

  // bolinha decorativa
  decorDotFive: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  // cabeçalho da tela
  header: {
    marginBottom: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // título
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#17262F',
    marginBottom: 6,
  },

  // subtítulo
  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    fontWeight: '400',
  },

  // área do usuário no topo
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // caixa da data
  dateBox: {
    width: 210,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCE5E4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto da data
  dateText: {
    fontSize: 13,
    color: '#17262F',
    fontWeight: '500',
  },

  // subtítulo da data
  dateSubtext: {
    fontSize: 12,
    color: '#7E8D9B',
    marginTop: 2,
  },

  // bolinha do usuário
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto da bolinha do usuário
  avatarText: {
    color: '#087A73',
    fontWeight: '500',
  },

  // nome do usuário
  userName: {
    fontSize: 14,
    color: '#17262F',
    fontWeight: '500',
  },

  // cargo do usuário
  userRole: {
    fontSize: 12,
    color: '#7E8D9B',
    marginTop: 2,
  },

  // card de seção
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // título da seção
  sectionTitle: {
    fontSize: 18,
    color: '#087A73',
    fontWeight: '600',
    marginBottom: 4,
  },

  // subtítulo da seção
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginBottom: 18,
    fontWeight: '400',
  },

  // cabeçalho dentro de seção
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // grid dos cards rápidos
  quickGrid: {
    gap: 14,
  },

  // grid dos cards rápidos no desktop
  quickGridDesktop: {
    flexDirection: 'row',
  },

  // card rápido
  quickCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 14,
    backgroundColor: '#EDF7F4',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // variação azul
  quickCardBlue: {
    backgroundColor: '#EEF6FC',
  },

  // ícone do card rápido
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ícone azul
  quickIconBlue: {
    backgroundColor: '#DDEFFC',
  },

  // texto do ícone
  quickIconText: {
    fontSize: 24,
    color: '#087A73',
  },

  // texto do ícone azul
  quickIconTextBlue: {
    fontSize: 24,
    color: '#1C7ED6',
  },

  // título do card rápido
  quickTitle: {
    fontSize: 14,
    color: '#087A73',
    fontWeight: '600',
    marginBottom: 4,
  },

  // título azul
  quickTitleBlue: {
    color: '#1C7ED6',
  },

  // texto do card rápido
  quickText: {
    fontSize: 13,
    color: '#61717B',
    fontWeight: '400',
  },

  // grid dos status
  statsGrid: {
    gap: 14,
  },

  // grid dos status no desktop
  statsGridDesktop: {
    flexDirection: 'row',
  },

  // card de status
  statCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // ícone do status
  statIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do ícone
  statIconText: {
    fontSize: 24,
    color: '#087A73',
  },

  // ícone vermelho
  statIconRed: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFE1E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do ícone vermelho
  statIconRedText: {
    fontSize: 28,
    color: '#E03131',
  },

  // número do status
  statNumber: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '600',
  },

  // legenda do status
  statLabel: {
    fontSize: 13,
    color: '#61717B',
    marginTop: 2,
    fontWeight: '400',
  },

  // texto positivo
  statPositive: {
    fontSize: 11,
    color: '#12B886',
    marginTop: 12,
    fontWeight: '400',
  },

  // texto neutro
  statNeutral: {
    fontSize: 11,
    color: '#9AA6AC',
    marginTop: 12,
    fontWeight: '400',
  },

  // botão pequeno
  smallButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão pequeno
  smallButtonText: {
    color: '#087A73',
    fontSize: 13,
    fontWeight: '500',
  },

  // lista de atividades
  activityList: {
    marginTop: 4,
  },

  // item da lista
  activityItem: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // último item da lista
  activityItemLast: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // rolagem horizontal dos cards no mobile
  statsScroll: {
    gap: 14,
    paddingRight: 10,
  },

  // largura dos cards no mobile
  statCardMobile: {
    width: 260,
  },
  
  // ícone da atividade
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#E6F5F1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do ícone da atividade
  activityIconText: {
    color: '#087A73',
    fontSize: 18,
  },

  // ícone vermelho
  activityIconRed: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#FFE1E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto vermelho
  activityIconRedText: {
    color: '#E03131',
    fontSize: 22,
  },

  // ícone laranja
  activityIconOrange: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#FFF1D6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto laranja
  activityIconOrangeText: {
    color: '#F08C00',
    fontSize: 18,
  },

  // ícone roxo
  activityIconPurple: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#F1E4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto roxo
  activityIconPurpleText: {
    color: '#845EF7',
    fontSize: 18,
  },

  // informações da atividade
  activityInfo: {
    flex: 1,
  },

  // título da atividade
  activityTitle: {
    fontSize: 14,
    color: '#17262F',
    fontWeight: '500',
  },

  // texto da atividade
  activityText: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
    fontWeight: '400',
  },

  // horário da atividade
  activityTime: {
    fontSize: 12,
    color: '#7E8D9B',
    fontWeight: '400',
  },

  // botão sair do mobile
  mobileLogout: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#087A73',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },

  // texto do botão sair do mobile
  mobileLogoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});