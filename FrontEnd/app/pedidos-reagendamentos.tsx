// arquivo app/pedidos-reagendamentos.tsx
// tela do admin que centraliza dois tipos de pedidos:
// 1. agendamentos criados por estagiários que aguardam aprovação (status 'pendente')
// 2. solicitações de reagendamento enviadas pelos estagiários

import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';

// router para navegação entre telas
import { router } from 'expo-router';

// fundo degradê igual às demais telas admin
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token JWT
import { useAuth } from '../contexts/AuthContext';

// hook do badge global — atualiza o contador no sidebar de todas as telas
import { useBadge } from '../contexts/BadgeContext';

// funções de API para buscar e responder pedidos
import {
  listarPendenciasReagendamento,
  responderReagendamento,
  buscarConsultas,
} from '../services/api';

export default function PedidosReagendamentosScreen() {

  // responsividade
  const { width } = useWindowDimensions();
  const isDesktop  = width >= 900;

  // token do admin logado
  const { token } = useAuth();

  // badge global de pendências — recarregarBadge atualiza o número em todas as telas
  const { recarregarBadge } = useBadge();

  // controla qual aba está ativa: 'agendamentos' ou 'reagendamentos'
  const [abaAtiva, setAbaAtiva] = useState<'agendamentos' | 'reagendamentos'>('agendamentos');

  // ─── AGENDAMENTOS ───────────────────────────────────────────────────────────

  // lista de consultas agendadas para hoje
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  // indica se os agendamentos estão sendo carregados
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);

  // busca os agendamentos de hoje para visão geral do admin
  const carregarAgendamentos = useCallback(async () => {
    if (!token) return;
    setCarregandoAgendamentos(true);
    try {
      const hoje = new Date();
      const dataHoje = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
      const resultado = await buscarConsultas({ data: dataHoje }, token);
      const lista = Array.isArray(resultado.dados) ? resultado.dados : [];
      setAgendamentos(lista);
    } catch {
      // falha silenciosa
    } finally {
      setCarregandoAgendamentos(false);
    }
  }, [token]);

  // ─── REAGENDAMENTOS PENDENTES ────────────────────────────────────────────────

  // lista de solicitações de reagendamento enviadas pelos estagiários
  const [reagendamentos, setReagendamentos] = useState<any[]>([]);

  // indica se os reagendamentos estão sendo carregados
  const [carregandoReagendamentos, setCarregandoReagendamentos] = useState(false);

  // id da solicitação sendo respondida no momento
  const [respondendoReagendamento, setRespondendoReagendamento] = useState<string | null>(null);

  // busca solicitações de reagendamento com status 'pendente'
  const carregarReagendamentos = useCallback(async () => {
    if (!token) return;
    setCarregandoReagendamentos(true);
    try {
      const resultado = await listarPendenciasReagendamento(token, 'pendente');
      const lista = resultado.dados?.pendencias ?? resultado.dados ?? [];
      setReagendamentos(Array.isArray(lista) ? lista : []);
    } catch {
      // falha silenciosa
    } finally {
      setCarregandoReagendamentos(false);
    }
  }, [token]);

  // aprova ou rejeita uma solicitação de reagendamento
  async function responderPedidoReagendamento(id: string, acao: 'aprovado' | 'rejeitado') {
    if (!token) return;
    setRespondendoReagendamento(id);
    try {
      const resultado = await responderReagendamento(id, acao, token);
      if (resultado.status === 200) {
        setReagendamentos(anterior => anterior.filter(r => String(r.id) !== id));
        // atualiza o badge global para refletir a nova contagem em todas as telas
        recarregarBadge();
        Alert.alert('Sucesso', acao === 'aprovado' ? 'Reagendamento aprovado.' : 'Reagendamento rejeitado.');
      } else {
        Alert.alert('Erro', resultado.dados?.mensagem || 'Não foi possível processar a ação.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setRespondendoReagendamento(null);
    }
  }

  // carrega ambas as listas ao abrir a tela
  useEffect(() => {
    carregarAgendamentos();
    carregarReagendamentos();
  }, [carregarAgendamentos, carregarReagendamentos]);

  // total de pedidos pendentes somando os dois tipos — usado no badge do menu
  const totalPendentes = agendamentos.length + reagendamentos.length;

  return (
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar completa do admin */}
        {isDesktop && (
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

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                <Image source={require('../assets/images/administrador.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Administrador</Text>
              </TouchableOpacity>

              <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/calendario-administrador')}
              >
                <Image source={require('../assets/images/agendamento.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Agendamentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-admin')}
              >
                <Image source={require('../assets/images/paciente.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Pacientes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-admin')}
              >
                <Image source={require('../assets/images/salas.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Salas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cancelamentos')}
              >
                <Image source={require('../assets/images/cancelamento.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Cancelamentos</Text>
              </TouchableOpacity>

              {/* item ativo — esta tela */}
              <TouchableOpacity style={[styles.menuItem, styles.menuActive]}>
                <Image source={require('../assets/images/reagendamento.png')} style={styles.menuIcon} />
                <Text style={[styles.menuText, styles.menuTextActive]}>Pedidos Reagendamento</Text>
                {/* badge vermelho mostra a quantidade total de pedidos pendentes */}
                {totalPendentes > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{totalPendentes}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/cadastro')}
              >
                <Image source={require('../assets/images/estagiario.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Cadastrar Estagiário</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                <Image source={require('../assets/images/relatorio2.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Relatório Atendimentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/perfil-administrador')}
              >
                <Image source={require('../assets/images/perfil.png')} style={styles.menuIcon} />
                <Text style={styles.menuText}>Perfil</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

        {/* conteúdo principal */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* título da tela */}
          <Text style={styles.pageTitle}>Pedidos Pendentes</Text>
          <Text style={styles.pageSubtitle}>
            Acompanhe os agendamentos do dia e aprove ou rejeite solicitações de reagendamento.
          </Text>

          {/* abas para alternar entre os dois tipos */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'agendamentos' && styles.tabAtiva]}
              onPress={() => setAbaAtiva('agendamentos')}
            >
              <Text style={[styles.tabText, abaAtiva === 'agendamentos' && styles.tabTextAtiva]}>
                Agendamentos
              </Text>
              {agendamentos.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{agendamentos.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'reagendamentos' && styles.tabAtiva]}
              onPress={() => setAbaAtiva('reagendamentos')}
            >
              <Text style={[styles.tabText, abaAtiva === 'reagendamentos' && styles.tabTextAtiva]}>
                Reagendamentos
              </Text>
              {reagendamentos.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{reagendamentos.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ─── ABA: AGENDAMENTOS DO DIA ──────────────────────────────── */}
          {abaAtiva === 'agendamentos' && (
            <>
              {carregandoAgendamentos ? (
                <ActivityIndicator color="#0C706E" style={{ marginTop: 30 }} />
              ) : agendamentos.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>Nenhum agendamento para hoje.</Text>
                </View>
              ) : agendamentos.map((item) => (
                <View key={item.id} style={styles.card}>

                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{item.pacienteNome ?? '—'}</Text>
                    <View style={styles.badgePendente}>
                      <Text style={styles.badgePendenteText}>{item.status ?? 'agendada'}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardInfo}>Estagiário: {item.profissionalNome ?? '—'}</Text>
                  <Text style={styles.cardInfo}>Sala: {item.sala ?? '—'}</Text>
                  <Text style={styles.cardInfo}>
                    Data: {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '—'}
                    {'   '}Horário: {item.horario ? item.horario.slice(0, 5) : '—'}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* ─── ABA: REAGENDAMENTOS PENDENTES ────────────────────────────── */}
          {abaAtiva === 'reagendamentos' && (
            <>
              {carregandoReagendamentos ? (
                <ActivityIndicator color="#0C706E" style={{ marginTop: 30 }} />
              ) : reagendamentos.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>Nenhuma solicitação de reagendamento pendente.</Text>
                </View>
              ) : reagendamentos.map((item) => (
                <View key={item.id} style={styles.card}>

                  <View style={styles.cardHeader}>
                    <Text style={styles.cardNome}>{item.paciente ?? `Consulta #${item.consulta_id}`}</Text>
                    <View style={styles.badgePendente}>
                      <Text style={styles.badgePendenteText}>Pendente</Text>
                    </View>
                  </View>

                  <Text style={styles.cardInfo}>Nova data: {item.novaData ?? '—'}</Text>
                  <Text style={styles.cardInfo}>Novo horário: {item.novoHorario ?? '—'}</Text>
                  {item.motivo ? (
                    <Text style={styles.cardInfo}>Motivo: {item.motivo}</Text>
                  ) : null}

                  <View style={styles.botoesRow}>

                    <TouchableOpacity
                      style={[styles.botaoRejeitar, respondendoReagendamento === String(item.id) && { opacity: 0.6 }]}
                      onPress={() => responderPedidoReagendamento(String(item.id), 'rejeitado')}
                      disabled={respondendoReagendamento === String(item.id)}
                    >
                      {respondendoReagendamento === String(item.id)
                        ? <ActivityIndicator color="#B91C1C" size="small" />
                        : <Text style={styles.botaoRejeitarText}>Rejeitar</Text>
                      }
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoAprovar, respondendoReagendamento === String(item.id) && { opacity: 0.6 }]}
                      onPress={() => responderPedidoReagendamento(String(item.id), 'aprovado')}
                      disabled={respondendoReagendamento === String(item.id)}
                    >
                      {respondendoReagendamento === String(item.id)
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Text style={styles.botaoAprovarText}>Aprovar</Text>
                      }
                    </TouchableOpacity>

                  </View>
                </View>
              ))}
            </>
          )}

        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  page: {
    flex: 1,
    flexDirection: 'row',
  },

  // sidebar lateral
  sidebar: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#DCEBE7',
    paddingTop: 28,
  },

  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  psi: {
    fontSize: 38,
    color: '#0C706E',
    fontWeight: '700',
  },

  logoText: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '700',
  },

  logoSub: {
    fontSize: 12,
    color: '#70808A',
    marginTop: 2,
  },

  menuArea: {
    paddingHorizontal: 16,
  },

  menuLabel: {
    fontSize: 11,
    color: '#8A98A3',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 1,
  },

  menuItem: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },

  menuActive: {
    backgroundColor: '#E9F7F5',
  },

  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#0C706E',
  },

  menuText: {
    fontSize: 15,
    color: '#70808A',
    fontWeight: '500',
    flex: 1,
  },

  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // badge vermelho no item do menu lateral
  menuBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#17262F',
    marginBottom: 6,
  },

  pageSubtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginBottom: 28,
    lineHeight: 22,
  },

  // linha das abas
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
  },

  tabAtiva: {
    backgroundColor: '#0C706E',
    borderColor: '#0C706E',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7C86',
  },

  tabTextAtiva: {
    color: '#FFFFFF',
  },

  // badge de quantidade na aba
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // estado vazio — nenhum pedido encontrado
  emptyBox: {
    marginTop: 30,
    alignItems: 'center',
  },

  emptyText: {
    color: '#6B7C86',
    fontSize: 15,
  },

  // card de cada pedido
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardNome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#17262F',
    flex: 1,
    marginRight: 10,
  },

  cardInfo: {
    fontSize: 14,
    color: '#6B7C86',
    marginBottom: 5,
  },

  // badge amarelo de status pendente
  badgePendente: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  badgePendenteText: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 12,
  },

  // linha dos botões de ação
  botoesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  botaoRejeitar: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoRejeitarText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 14,
  },

  botaoAprovar: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoAprovarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
