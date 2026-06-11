// arquivo app/(tabs)/salas.tsx
// versão estagiário baseada no layout administrativo (somente visualização)

import React, { useEffect, useState } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // barra de rolagem na tela
  ScrollView,
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  // componente de botão deslizante usado para ativar ou desativar opções
  Text,
  TextInput,
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

// importa icones para adicionar ao sidebar
import { Ionicons } from '@expo/vector-icons';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token
import { useAuth } from '../../contexts/AuthContext';

// função que busca as salas e as consultas do dia para mostrar ocupação real
import { listarSalas, buscarConsultas } from '../../services/api';

// menu limitado (estagiário)
const menuItems = [
  ['calendar-outline', 'Agenda', '/(tabs)'],
  ['people-outline', 'Pacientes', '/(tabs)/pacientes'],
  ['business-outline', 'Salas', '/(tabs)/salas'],
  ['notifications-outline', 'Notificacoes', '/(tabs)/notificacoes'],
  ['person-outline', 'Perfil', '/(tabs)/perfil'],
];

// tela de salas para estagiario
export default function SalasScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isMobile = width < 900;

  // pega o token do usuário logado para autenticar a requisição
  const { token } = useAuth();

  // lista de salas carregada do banco
  const [salas, setSalas] = useState<any[]>([]);

  // texto que o usuário digita na busca
  const [busca, setBusca] = useState('');

  // salas com pelo menos uma consulta agendada hoje (pela descrição da sala)
  const [salasOcupadasHoje, setSalasOcupadasHoje] = useState<string[]>([]);

  // carrega as salas e os agendamentos de hoje ao abrir a tela
  useEffect(() => {
    async function carregarDados() {
      try {
        const resultado = await listarSalas(token!);
        if (resultado.status === 200 && resultado.dados?.salas) {
          setSalas(resultado.dados.salas);
        }
      } catch (e) {
        // sem salas — fica vazio
      }

      try {
        // data de hoje no formato dd/mm/aaaa que a API aceita
        const hoje = new Date();
        const dataHoje = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
        const resConsultas = await buscarConsultas({ data: dataHoje }, token!);
        // a API pode retornar um array direto ou dentro de dados
        const lista = Array.isArray(resConsultas.dados)
          ? resConsultas.dados
          : Array.isArray(resConsultas.dados?.consultas)
            ? resConsultas.dados.consultas
            : [];
        // coleta os nomes das salas ocupadas hoje com status 'agendada'
        const ocupadas = lista
          .filter((c: any) => c.status === 'agendada' && c.sala)
          .map((c: any) => String(c.sala).toLowerCase().trim());
        setSalasOcupadasHoje([...new Set<string>(ocupadas)]);
      } catch (e) {
        // se não conseguir verificar ocupação, mostra tudo como disponível
      }
    }
    carregarDados();
  }, []);

  // filtra as salas pelo texto da busca
  const salasFiltradas = salas.filter((s) =>
    s.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar estagiario */}
        {!isMobile && (
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
              {menuItems.map(([icon, label, path]) => (
                <TouchableOpacity
                  key={label}style={[styles.menuItem, label === 'Salas' && styles.menuActive,]} 
                  onPress={() => router.push(path as any)}
                >
                  <Ionicons
                    name={icon as any} size={20} color={label === 'Salas' ? '#0C706E' : '#70808A'}
                  />

                  <Text
                    style={[ styles.menuText, label === 'Salas' && styles.menuTextActive,]}
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

          {/* header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Salas da clínica</Text> 
              <Text style={styles.subtitle}> Visualização das salas (acesso de estagiário)
              </Text>
            </View>
          </View>

          {/* pesquisa */}
          <View style={styles.searchCard}>
            <TextInput
              placeholder="Pesquisar sala..."
              placeholderTextColor="#8A98A3"
              style={styles.searchInput}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* mensagem quando não tem salas cadastradas */}
          {salasFiltradas.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#6B7C83', marginTop: 32 }}>
              {salas.length === 0 ? 'Nenhuma sala cadastrada.' : 'Nenhuma sala encontrada.'}
            </Text>
          )}

          {/* cards gerados a partir das salas reais do banco */}
          <View style={[styles.cardsWrap, !isMobile && styles.cardsWrapDesktop]}>
            {salasFiltradas.map((sala, index) => (
              <View
                key={sala.id ?? index}
                style={[styles.card, !isMobile && styles.cardDesktop]}
              >

                <View style={styles.cardTop}>
                  <View style={styles.roomIcon}>
                    <Text style={styles.roomIconText}>▥</Text>
                  </View>

                  <View style={styles.cardTopInfo}>
                    {/* usa o campo descricao que vem do banco */}
                    <Text style={styles.cardTitle}>{sala.descricao || 'Sala'}</Text>
                    <Text style={styles.cardSubtitle}>Sala de atendimento</Text>
                  </View>
                </View>

                {/* badge de ocupação baseado nos agendamentos de hoje */}
                {salasOcupadasHoje.includes(String(sala.descricao).toLowerCase().trim()) ? (
                  <View style={[styles.badge, styles.badgeBusy]}>
                    <Text style={[styles.badgeText, styles.badgeTextBusy]}>Ocupada hoje</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, styles.badgeFree]}>
                    <Text style={[styles.badgeText, styles.badgeTextFree]}>Disponível</Text>
                  </View>
                )}
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
    width: 245,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E6ECEA',
  },

  // logo da clinica
  logoBox: {
    height: 118,
    backgroundColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
    borderBottomRightRadius: 18,
  },

  // simbolo da pscologia
  psi: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // texto sep
  logoText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // subtitulo
  logoSub: {
    fontSize: 12,
    color: '#EAF6F2',
    marginTop: 2,
  },

  // área menu
  menuArea: {
    paddingTop: 18,
  },

  // item menu
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

  // item ativo
  menuActive: {
    backgroundColor: '#EAF6F2',
  },

  // texto menu
  menuText: {
    fontSize: 15,
    color: '#4B5F68',
    fontWeight: '400',
  },

  // texto ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // rolagem da tela
  scroll: {
    flex: 1,
  },

  // área principal onde fica todo o conteúdo da tela
  scrollContent: {
    paddingHorizontal: 34,
    paddingTop: 48,
    paddingBottom: 28,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  // cabecalho da tela
  header: {
    marginBottom: 24,
  },

  // título principal da página
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#152322',
  },

  // subtítulo exibido abaixo do título principal
  subtitle: {
    fontSize: 14,
    color: '#6B7C83',
    marginTop: 4,
  },

  // área que organiza todos os cards
  cardsWrap: {
    gap: 12,
  },

  // organização dos cards no desktop
  cardsWrapDesktop: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  },
  
  // card principal de informações
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E9E6',
  },

  // área de informações do topo do card
  cardTopInfo: {
    flex: 1,
  },

  // largura dos cards no desktop
  cardDesktop: {
    width: '48.5%',
  },

  // título exibido dentro do card
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  // subtítulo ou descrição do card
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },

  // badge de status do card
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },

  // cor da badge quando está disponível
  badgeFree: {
    backgroundColor: '#E3F7EE',
  },

  // cor da badge quando está ocupada
  badgeBusy: {
    backgroundColor: '#FFE5E5',
  },

  // texto padrão da badge
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // cor do texto da badge disponível
  badgeTextFree: {
    color: '#0C706E',
  },

  // cor do texto da badge ocupada
  badgeTextBusy: {
    color: '#B91C1C',
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
});