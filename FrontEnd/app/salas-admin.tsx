// arquivo app/salas-admin.tsx
// tela de salas padronizada com o restante do sistema administrativo

import React, { useState, useEffect } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from 'react-native';

import { router } from 'expo-router';

// imagens dos ícones
import { Image } from 'react-native';

// gradiente
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token
import { useAuth } from '../contexts/AuthContext';

// badge global de reagendamentos pendentes
import { useBadge } from '../contexts/BadgeContext';

// função que lista as salas cadastradas no banco
import { listarSalas } from '../services/api';

export default function SalasAdminScreen() {
  // responsividade
  const { width } = useWindowDimensions();

  // verifica se é desktop
  const isDesktop = width >= 900;

  // token do usuário logado
  const { token } = useAuth();

  // badge global de reagendamentos pendentes
  const { pendentesReagendamento } = useBadge();

  // lista de salas carregada do banco
  const [salas, setSalas] = useState<any[]>([]);

  // texto de busca
  const [busca, setBusca] = useState('');

  // lista filtrada pelo campo de pesquisa
  const salasFiltradas = salas.filter(s =>
    s.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // carrega salas ao abrir a tela
  useEffect(() => {
    async function carregar() {
      if (!token) return;
      try {
        const resultado = await listarSalas(token);
        if (resultado.status === 200 && resultado.dados?.salas) {
          setSalas(resultado.dados.salas);
        }
      } catch (e) {
        // falha silenciosa
      }
    }
    carregar();
  }, [token]);

  return (
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* logo */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              <View>
                <Text style={styles.logoText}>SEP</Text>

                <Text style={styles.logoSub}>
                  Clínica de Psicologia
                </Text>
              </View>
            </View>

            {/* menu */}
            <View style={styles.menuArea}>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                <Image
                  source={require('../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
                  Administrador
                </Text>
              </TouchableOpacity>

              <Text style={styles.menuLabel}>
                GERENCIAMENTO
              </Text>

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

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  styles.menuActive,
                ]}
              >
                <Image
                  source={require('../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text
                  style={[
                    styles.menuText,
                    styles.menuTextActive,
                  ]}
                >
                  Salas
                </Text>
              </TouchableOpacity>

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

              {/* item do menu: pedidos de reagendamento */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pedidos-reagendamentos')}
              >
                <Image
                  source={require('../assets/images/reagendamento.png')}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Pedidos Reagendamento</Text>

                {/* badge vermelho com contagem de reagendamentos pendentes */}
                {pendentesReagendamento > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{pendentesReagendamento}</Text>
                  </View>
                )}
              </TouchableOpacity>

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

              {/* item do menu: relatório de atendimentos */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/relatorio-atendimentos')}
              >
                <Image
                  source={require('../assets/images/relatorio2.png')}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Relatório Atendimentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/perfil-administrador')}
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

        {/* conteúdo */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* decoração */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />
          <View style={styles.decorDotOne} />
          <View style={styles.decorDotTwo} />
          <View style={styles.decorDotThree} />

          {/* header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                Salas da Clínica
              </Text>

              <Text style={styles.subtitle}>
                Gerencie disponibilidade, ocupação e horários das salas.
              </Text>
            </View>
          </View>

          {/* pesquisa por nome da sala */}
          <View style={styles.searchCard}>
            <TextInput
              placeholder="Pesquisar sala..."
              placeholderTextColor="#8A98A3"
              style={styles.searchInput}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* cards das salas carregadas do banco */}
          <View style={[styles.cardsWrap, isDesktop && styles.cardsWrapDesktop]}>
            {salasFiltradas.length === 0 ? (
              <Text style={{ color: '#6B7C86', textAlign: 'center', marginTop: 20 }}>
                Nenhuma sala encontrada.
              </Text>
            ) : salasFiltradas.map((sala, index) => (
              <View
                key={sala.id ?? index}
                style={[styles.card, isDesktop && styles.cardDesktop]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.roomIcon}>
                    <Text style={styles.roomIconText}>▥</Text>
                  </View>

                  <View style={styles.cardTopInfo}>
                    {/* nome/descrição da sala vindo do banco */}
                    <Text style={styles.cardTitle}>
                      {sala.descricao}
                    </Text>
                  </View>
                </View>

                {/* badge de disponibilidade — sempre ativa pois não há campo status no banco */}
                <View style={[styles.badge, styles.badgeFree]}>
                  <Text style={[styles.badgeText, styles.badgeTextFree]}>
                    Disponível
                  </Text>
                </View>

              </View>
            ))}
          </View>

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
  },

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

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },

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

  decorDotOne: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF6F2',
    top: 52,
    left: '58%',
  },

  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    top: 300,
    left: 40,
  },

  decorDotThree: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    color: '#17262F',
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 4,
    lineHeight: 21,
  },

  newButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#087A73',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 16,
    marginBottom: 18,
  },

  searchInput: {
    fontSize: 15,
    color: '#17262F',
  },

  cardsWrap: {
    gap: 14,
  },

  cardsWrapDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 18,
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardDesktop: {
    width: '48.8%',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  roomIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  roomIconText: {
    fontSize: 24,
    color: '#087A73',
  },

  cardTopInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    color: '#17262F',
    fontWeight: '600',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },

  badgeFree: {
    backgroundColor: '#DDF5EB',
  },

  badgeBusy: {
    backgroundColor: '#FFE1E5',
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  badgeTextFree: {
    color: '#087A73',
  },

  badgeTextBusy: {
    color: '#E03131',
  },

  detailsButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EAF6F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailsButtonText: {
    color: '#087A73',
    fontSize: 14,
    fontWeight: '600',
  },
});