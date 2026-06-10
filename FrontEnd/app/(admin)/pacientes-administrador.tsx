// arquivo app/pacientes-administrador.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState, useEffect } from 'react';

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
  // pesquisa de pacientes
  TouchableOpacity,
  // componente base de estrutura e layout
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  useWindowDimensions,

} from 'react-native';

// router pra navegação entre telas
import { router } from 'expo-router';

// importando imagem para icones
import { Image } from 'react-native';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token e buscar pacientes reais
import { useAuth } from '../../contexts/AuthContext';

// função que lista os pacientes cadastrados no banco
import { listarPacientes } from '../../services/api';

// gera as iniciais do nome para o avatar
function gerarIniciais(nome: string): string {
  return nome
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// tela de pacientes
export default function PacientesAdminScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // define se é mobile ou desktop baseado na largura da tela
  const isDesktop = width >= 900;

  // contexto de autenticação para pegar o token
  const { token } = useAuth();

  // lista de pacientes carregada do banco
  const [pacientes, setPacientes] = useState<any[]>([]);

  // texto de busca para filtrar pacientes na tela
  const [busca, setBusca] = useState('');

  // lista filtrada pelo campo de pesquisa
  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.cpf && p.cpf.includes(busca))
  );

  // carrega os pacientes ao abrir a tela
  useEffect(() => {
    async function carregar() {
      if (!token) return;
      try {
        const resultado = await listarPacientes(token);
        if (resultado.status === 200 && Array.isArray(resultado.dados?.pacientes)) {
          setPacientes(resultado.dados.pacientes);
        }
      } catch (e) {
        // falha silenciosa
      }
    }
    carregar();
  }, [token]);

  return (
    // fundo principal da tela
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

            {/* área principal do menu lateral — ScrollView para não cortar itens */}
            <ScrollView style={styles.menuArea} showsVerticalScrollIndicator={false}>

              {/* item do menu: administrador */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/acesso-administrador')}
              >
                {/* ícone do administrador */}
                <Image
                  source={require('../../assets/images/administrador.png')}
                  style={styles.menuIcon}
                />

                {/* texto do menu */}
                <Text style={styles.menuText}>Administrador</Text>
              </TouchableOpacity>

        {/* título da seção de gerenciamento */}
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

          {/* texto do menu */}
          <Text style={styles.menuText}>Agendamentos</Text>
        </TouchableOpacity>

        {/* item do menu: pacientes (ativo) */}
        <TouchableOpacity style={[styles.menuItem, styles.menuActive,]}>
          {/* ícone de pacientes */}
          <Image
            source={require('../../assets/images/paciente.png')}
            style={styles.menuIcon}
          />

          {/* texto do menu ativo */}
          <Text style={[styles.menuText, styles.menuActive,]}>Pacientes</Text>
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

          {/* texto do menu */}
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

          {/* texto do menu */}
          <Text style={styles.menuText}>Cancelamentos</Text>
        </TouchableOpacity>

        {/* item do menu: pedidos de reagendamentos */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/pedidos-reagendamentos')}
        >
          {/* ícone de cancelamentos */}
          <Image
            source={require('../../assets/images/reagendamento.png')}
            style={styles.menuIcon}
          />

          {/* texto do menu */}
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

          {/* texto do menu */}
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

          {/* texto do menu */}
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )}

        {/* área principal do conteúdo */}
        <ScrollView contentContainerStyle={styles.contentMobile}>
        
          {/* círculos decorativos do fundo */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />
          <View style={styles.decorCircleThree} />

          {/* bolinhas decorativas */}
          <View style={styles.decorDotOne} />
          <View style={styles.decorDotTwo} />
          <View style={styles.decorDotThree} />

          {/* cabeçalho da página */}
          <View style={styles.header}>
            <View>

              {/* título principal */}
              <Text style={styles.title}>
                Pacientes da Clínica
              </Text>

              {/* subtítulo */}
              <Text style={styles.subtitle}>
                Visualize informações dos pacientes cadastrados e consultas agendadas.
              </Text>
            </View>
          </View>

          {/* barra de pesquisa — filtra por nome ou CPF */}
          <View style={styles.searchCard}>
            <TextInput
              placeholder="Pesquisar paciente..."
              placeholderTextColor="#8A98A3"
              style={styles.searchInput}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* área dos cards — usa lista filtrada do banco */}
          <View style={[styles.cardsWrap, isDesktop && styles.cardsWrapDesktop]}>
            {pacientesFiltrados.length === 0 ? (
              <Text style={{ color: '#6B7C86', textAlign: 'center', marginTop: 20 }}>
                Nenhum paciente encontrado.
              </Text>
            ) : pacientesFiltrados.map((paciente, index) => (

              /* card do paciente */
              <View
                key={paciente.id ?? index}
                style={[styles.card, isDesktop && styles.cardDesktop]}
              >

                {/* topo do card */}
                <View style={styles.cardTop}>

                  {/* avatar com iniciais do nome */}
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {gerarIniciais(paciente.nome)}
                    </Text>
                  </View>

                  {/* informações principais */}
                  <View style={styles.cardTopInfo}>

                    {/* nome do paciente */}
                    <Text style={styles.cardTitle}>
                      {paciente.nome}
                    </Text>

                    {/* situação do paciente */}
                    <Text style={styles.cardSubtitle}>
                      {paciente.ativo !== false ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>

                {/* cpf */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CPF</Text>

                  <Text style={styles.infoValue}>
                    {paciente.cpf}
                  </Text>
                </View>

                {/* e-mail */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>E-mail</Text>

                  <Text style={styles.infoValue}>
                    {paciente.email || '—'}
                  </Text>
                </View>

                {/* telefone */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Celular</Text>

                  <Text style={styles.infoValue}>
                    {paciente.celular || '—'}
                  </Text>
                </View>

                {/* botão de detalhes */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => router.push('/paciente-detalhe-admistrador')}
                >
                  <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
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

  // área principal do conteúdo da tela
  content: {
    flex: 1,
  },

  // conteúdo com espaçamento
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
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
    top: 120,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  // estilos do cabeçalho da página
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // título principal da tela
  title: {
    fontSize: 30,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo abaixo do título
  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 4,
    lineHeight: 21,
  },

  // botão de novo paciente
  newButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#087A73',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão de novo paciente
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // card da barra de pesquisa
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 16,
    marginBottom: 18,
  },

  // campo de texto da pesquisa
  searchInput: {
    fontSize: 15,
    color: '#17262F',
  },

  // área que agrupa todos os cards
  cardsWrap: {
    gap: 14,
  },

  // organização dos cards no desktop
  cardsWrapDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // card principal do paciente
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

  // largura do card no desktop
  cardDesktop: {
    width: '48.8%',
  },

  // topo do card com avatar e informações
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  // avatar do paciente
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  // texto das iniciais dentro do avatar
  avatarText: {
    fontSize: 18,
    color: '#087A73',
    fontWeight: '700',
  },

  // área das informações principais do paciente
  cardTopInfo: {
    flex: 1,
  },

  // nome do paciente
  cardTitle: {
    fontSize: 17,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo com tipo do paciente
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
  },

  // linha de informações do card
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // texto do título da informação
  infoLabel: {
    fontSize: 13,
    color: '#7E8D9B',
  },

  // valor da informação
  infoValue: {
    fontSize: 13,
    color: '#17262F',
    fontWeight: '500',
  },

  // botão de visualizar detalhes
  detailsButton: {
    marginTop: 10,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EAF6F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // texto do botão de detalhes
  detailsButtonText: {
    color: '#087A73',
    fontSize: 14,
    fontWeight: '600',
  },
});