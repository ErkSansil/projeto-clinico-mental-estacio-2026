// arquivo app/cancelamentos.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState, useEffect } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // barra de rolagem na tela
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

// router pra navegação entre telas
import { router } from 'expo-router';

// importa imagens para adicionar ícones ao sidebar
import { Image } from 'react-native';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token do usuário logado
import { useAuth } from '../../contexts/AuthContext';

// função de busca de consultas da api
import { buscarConsultas } from '../../services/api';

// tela de cancelamentos e remarcações
export default function CancelamentosScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

  // contexto de autenticação para pegar o token
  const { token } = useAuth();

  // lista de consultas canceladas carregadas do banco
  const [cancelamentos, setCancelamentos] = useState<any[]>([]);

  // carrega as consultas com status cancelado ao abrir a tela
  useEffect(() => {
    async function carregar() {
      if (!token) return;
      try {
        // busca todas as consultas e filtra as canceladas localmente
        const resultado = await buscarConsultas({}, token);
        const lista = Array.isArray(resultado.dados) ? resultado.dados : [];
        setCancelamentos(lista.filter((c: any) => c.status === 'cancelado'));
      } catch (e) {
        // falha silenciosa, mantém lista vazia
      }
    }
    carregar();
  }, [token]);

  return (

    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >

      {/* estrutura principal da tela, responsável por organizar sidebar + conteúdo */}
      <View style={styles.page}>

        {/* sidebar exibida apenas em telas desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* área do logo da clínica */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              <View>
                {/* nome da clínica */}
                <Text style={styles.logoText}>SEP</Text>
                {/* subtítulo da clínica */}
                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* área de navegação lateral — ScrollView evita corte de itens em telas pequenas */}
            <ScrollView style={styles.menuArea} showsVerticalScrollIndicator={false}>

              {/* item de menu: administrador */}
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

              {/* separador de seção do menu */}
              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              {/* item: agendamentos */}
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

              {/* item: pacientes */}
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

              {/* item: salas */}
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

              {/* item ativo: cancelamentos e remarcações */}
              <TouchableOpacity style={[styles.menuItem, styles.menuActive,]}>

                <Image
                  source={require('../../assets/images/cancelamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={[styles.menuText, styles.menuTextActive,]}>Cancelamentos</Text>
              </TouchableOpacity>

              {/* item: pedidos de reagendamentos */}
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

              {/* item: cadastro de estagiário */}
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

              {/* item: perfil */}
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
            </ScrollView>
          </View>
        )}

        {/* área principal do conteúdo */}
        <ScrollView contentContainerStyle={styles.contentMobile}>

          {/* elementos decorativos de fundo (círculos) */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />

          {/* cabeçalho da página */}
          <View style={styles.header}>

            <View>
              {/* título da página */}
              <Text style={styles.title}>Cancelamentos e Remarcações</Text>

              {/* subtítulo explicativo */}
              <Text style={styles.subtitle}>Gerencie solicitações e acompanhe os status.</Text>
            </View>
          </View>

          {/* card principal de conteúdo */}
          <View style={styles.sectionCard}>

            {/* título da seção */}
            <Text style={styles.sectionTitle}>Solicitações</Text>

            {/* subtítulo da seção */}
            <Text style={styles.sectionSubtitle}>Lista de pedidos de cancelamento e remarcação</Text>

            {/* lista de consultas canceladas carregadas do banco */}
            {cancelamentos.length === 0 ? (
              <Text style={{ color: '#6B7C86', textAlign: 'center', marginTop: 16 }}>
                Nenhum cancelamento encontrado.
              </Text>
            ) : cancelamentos.map((item, index) => (

              /* card individual de cancelamento */
              <View key={index} style={styles.card}>

                {/* nome do paciente */}
                <Text style={styles.patient}>
                  {item.paciente || `Consulta #${item.id}`}
                </Text>

                {/* data e horário da consulta cancelada */}
                <Text style={styles.meta}>
                  Data: {item.data} às {item.horario}
                </Text>

                {/* motivo do cancelamento se existir */}
                {item.motivo ? (
                  <Text style={styles.meta}>
                    Motivo: {item.motivo}
                  </Text>
                ) : null}

                {/* badge de cancelado */}
                <View style={[styles.statusBadge, styles.badgeDanger]}>
                  <Text style={styles.statusText}>Cancelado</Text>
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

  // estrutura da página
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

  // texto menu ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // conteúdo scrollável
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

  // círculo decorativo
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

  // círculo decorativo
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

  // círculo decorativo
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

  // cabeçalho
  header: {
    marginBottom: 30,
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
  },

  // card principal
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  // título da seção
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
  },

  // card individual
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EBE8',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  // nome do paciente
  patient: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: '#17262F',
  },

  // textos secundários
  meta: {
    fontSize: 14,
    color: '#6B7C86',
    marginBottom: 5,
  },

  // badge
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  // badge amarelo
  badgePending: {
    backgroundColor: '#F7E8C4',
  },

  // badge vermelho
  badgeDanger: {
    backgroundColor: '#FFE1E5',
  },

  // texto badge
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#17262F',
  },
});