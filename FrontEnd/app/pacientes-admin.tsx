// arquivo app/pacientes-admin.tsx
// tela de pacientes padronizada com o restante do sistema administrativo da clínica

import React, { useState, useEffect } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

// importando imagens dos ícones
import { Image } from 'react-native';

// gradiente de fundo
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para pegar o token
import { useAuth } from '../contexts/AuthContext';

// funções de API para listar, buscar detalhe, editar e cadastrar pacientes
import { listarPacientes, buscarDetalhePaciente, editarPaciente, cadastrar } from '../services/api';

// gera iniciais do nome para o avatar
function gerarIniciais(nome: string): string {
  return nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function PacientesAdminScreen() {
  // responsividade
  const { width } = useWindowDimensions();

  // verifica se é desktop
  const isDesktop = width >= 900;

  // token do usuário logado
  const { token } = useAuth();

  // lista de pacientes carregada do banco
  const [pacientes, setPacientes] = useState<any[]>([]);

  // texto digitado na busca
  const [busca, setBusca] = useState('');

  // lista filtrada pelo campo de pesquisa
  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.cpf && p.cpf.includes(busca))
  );

  // controla a visibilidade do modal de edição
  const [modalAberto, setModalAberto] = useState(false);

  // indica que o modal está salvando os dados
  const [salvando, setSalvando] = useState(false);

  // cpf do paciente sendo editado — usado para enviar ao backend
  const [cpfEditando, setCpfEditando] = useState('');

  // campos editáveis do paciente
  const [editNome,     setEditNome]     = useState('');
  const [editEmail,    setEditEmail]    = useState('');
  const [editCelular,  setEditCelular]  = useState('');
  const [editEndereco, setEditEndereco] = useState('');

  // abre o modal e carrega os dados atuais do paciente pelo CPF
  async function abrirEdicao(cpf: string) {
    if (!token) return;
    try {
      const resultado = await buscarDetalhePaciente(cpf, token);
      if (resultado.status === 200 && resultado.dados?.paciente) {
        const p = resultado.dados.paciente;
        setCpfEditando(cpf);
        setEditNome(p.nome     || '');
        setEditEmail(p.email   || '');
        setEditCelular(p.celular  || '');
        setEditEndereco(p.endereco || '');
        setModalAberto(true);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  // salva as alterações e atualiza a lista local sem recarregar tudo
  async function salvarEdicao() {
    if (!token || !cpfEditando) return;
    setSalvando(true);
    try {
      const resultado = await editarPaciente(
        { cpf: cpfEditando, nome: editNome, email: editEmail, celular: editCelular, endereco: editEndereco },
        token
      );
      if (resultado.status === 200) {
        // atualiza o paciente na lista local para refletir as mudanças imediatamente
        setPacientes(anterior =>
          anterior.map(p =>
            p.cpf === cpfEditando
              ? { ...p, nome: editNome, email: editEmail, celular: editCelular }
              : p
          )
        );
        setModalAberto(false);
        Alert.alert('Sucesso', 'Dados do paciente atualizados com sucesso.');
      } else {
        Alert.alert('Erro', resultado.dados?.mensagem || 'Não foi possível salvar as alterações.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setSalvando(false);
    }
  }

  // controla a visibilidade do modal de criação de novo paciente
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  // indica que o modal de criação está salvando
  const [criando, setCriando] = useState(false);

  // mensagem de erro exibida dentro do modal — mais confiável que Alert no web
  const [erroCriacao, setErroCriacao] = useState('');

  // campos do novo paciente
  const [novoNome,              setNovoNome]              = useState('');
  const [novoCpf,               setNovoCpf]               = useState('');
  const [novoEmail,             setNovoEmail]             = useState('');
  const [novoCelular,           setNovoCelular]           = useState('');
  const [novaDataNascimento,    setNovaDataNascimento]    = useState('');
  const [novoEndereco,          setNovoEndereco]          = useState('');
  const [novoResponsavelNome,   setNovoResponsavelNome]   = useState('');
  const [novoResponsavelContato,setNovoResponsavelContato] = useState('');

  // verifica se a data de nascimento indica menor de 18 anos
  function menorDeIdade(dataNasc: string): boolean {
    const p = dataNasc.split('/');
    if (p.length !== 3 || p[2].length !== 4) return false;
    const nasc = new Date(`${p[2]}-${p[1]}-${p[0]}T00:00:00`);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nasc.getFullYear()
      - (hoje < new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate()) ? 1 : 0);
    return idade < 18;
  }

  // true quando a data indica menor de 18
  const novoPrecisaResponsavel = novaDataNascimento.length === 10 && menorDeIdade(novaDataNascimento);

  // formata CPF no padrão xxx.xxx.xxx-xx
  function formatarCpf(valor: string): string {
    const n = valor.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
  }

  // limpa os campos e o erro do modal de criação
  function limparModalCriacao() {
    setNovoNome(''); setNovoCpf(''); setNovoEmail(''); setNovoCelular('');
    setNovaDataNascimento(''); setNovoEndereco('');
    setNovoResponsavelNome(''); setNovoResponsavelContato('');
    setErroCriacao('');
  }

  // envia o cadastro do novo paciente para o backend
  async function salvarNovoPaciente() {
    // limpa erro anterior antes de validar
    setErroCriacao('');

    if (!novoNome || !novoCpf || !novoEmail || !novoCelular || !novaDataNascimento || !novoEndereco) {
      setErroCriacao('Preencha todos os campos obrigatórios.');
      return;
    }
    if (novoPrecisaResponsavel && (!novoResponsavelNome || !novoResponsavelContato)) {
      setErroCriacao('Paciente menor de idade: informe nome e contato do responsável.');
      return;
    }
    if (!token) return;
    setCriando(true);
    try {
      const cpfDigitos = novoCpf.replace(/\D/g, '');

      // CPF precisa ter 11 dígitos para gerar uma senha válida
      if (cpfDigitos.length !== 11) {
        setErroCriacao('CPF inválido. Digite os 11 dígitos completos.');
        return;
      }

      // senha gerada automaticamente — invisível para o admin, satisfaz o regex do backend
      const senhaAuto = cpfDigitos.slice(0, 6) + 'Aa1';

      const resultado = await cadastrar({
        tipo: 'paciente',
        nomeCompleto: novoNome,
        email: novoEmail,
        senha: senhaAuto,
        confirmacaoSenha: senhaAuto,
        cpf: cpfDigitos,
        celular: novoCelular,
        endereco: novoEndereco,
        dataNascimento: novaDataNascimento,
        ...(novoPrecisaResponsavel
          ? { responsavelNome: novoResponsavelNome, responsavelContato: novoResponsavelContato }
          : {}),
      });

      if (resultado.status === 201) {
        // recarrega a lista para incluir o novo paciente imediatamente
        const lista = await listarPacientes(token);
        if (lista.status === 200 && Array.isArray(lista.dados?.pacientes)) {
          setPacientes(lista.dados.pacientes);
        }
        setModalCriarAberto(false);
        limparModalCriacao();
      } else {
        // exibe o erro do backend diretamente no modal
        setErroCriacao(resultado.dados?.mensagem || 'Não foi possível cadastrar o paciente.');
      }
    } catch {
      setErroCriacao('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setCriando(false);
    }
  }

  // carrega pacientes ao abrir a tela
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
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar lateral do administrador */}
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
                style={[
                  styles.menuItem,
                  styles.menuActive,
                ]}
              >
                <Image
                  source={require('../assets/images/paciente.png')}
                  style={styles.menuIcon}
                />

                <Text
                  style={[
                    styles.menuText,
                    styles.menuTextActive,
                  ]}
                >
                  Pacientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/salas-admin')}
              >
                <Image
                  source={require('../assets/images/salas.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>
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

          {/* elementos decorativos */}
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
                Pacientes da Clínica
              </Text>

              <Text style={styles.subtitle}>
                Visualize informações dos pacientes cadastrados e consultas agendadas.
              </Text>
            </View>

            {/* botão para abrir o modal de criação de paciente */}
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => { limparModalCriacao(); setModalCriarAberto(true); }}
            >
              <Text style={styles.newButtonText}>+ Novo Paciente</Text>
            </TouchableOpacity>

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

          {/* cards dos pacientes carregados do banco */}
          <View style={[styles.cardsWrap, isDesktop && styles.cardsWrapDesktop]}>
            {pacientesFiltrados.length === 0 ? (
              <Text style={{ color: '#6B7C86', textAlign: 'center', marginTop: 20 }}>
                Nenhum paciente encontrado.
              </Text>
            ) : pacientesFiltrados.map((paciente, index) => (
              <View
                key={paciente.id ?? index}
                style={[styles.card, isDesktop && styles.cardDesktop]}
              >
                <View style={styles.cardTop}>
                  {/* avatar com iniciais do nome */}
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {gerarIniciais(paciente.nome)}
                    </Text>
                  </View>

                  <View style={styles.cardTopInfo}>
                    <Text style={styles.cardTitle}>
                      {paciente.nome}
                    </Text>

                    {/* status ativo/inativo do paciente */}
                    <Text style={styles.cardSubtitle}>
                      {paciente.ativo !== false ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>

                {/* CPF do paciente */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CPF</Text>
                  <Text style={styles.infoValue}>{paciente.cpf}</Text>
                </View>

                {/* e-mail */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  <Text style={styles.infoValue}>{paciente.email || '—'}</Text>
                </View>

                {/* celular */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Celular</Text>
                  <Text style={styles.infoValue}>{paciente.celular || '—'}</Text>
                </View>

                {/* botão de edição — visível apenas para admin */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => abrirEdicao(paciente.cpf)}
                >
                  <Text style={styles.editButtonText}>
                    Editar dados
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* modal de criação de novo paciente */}
      <Modal
        visible={modalCriarAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCriarAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalBox}>

              <Text style={styles.modalTitle}>Novo Paciente</Text>
              <Text style={styles.modalSubtitle}>Preencha os dados para cadastrar</Text>

              <Text style={styles.modalLabel}>Nome Completo *</Text>
              <TextInput
                style={styles.modalInput}
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Nome completo"
                placeholderTextColor="#8A98A3"
              />

              <Text style={styles.modalLabel}>CPF *</Text>
              <TextInput
                style={styles.modalInput}
                value={novoCpf}
                onChangeText={(v) => setNovoCpf(formatarCpf(v))}
                placeholder="000.000.000-00"
                placeholderTextColor="#8A98A3"
                keyboardType="numeric"
                maxLength={14}
              />

              <Text style={styles.modalLabel}>E-mail *</Text>
              <TextInput
                style={styles.modalInput}
                value={novoEmail}
                onChangeText={setNovoEmail}
                placeholder="email@exemplo.com"
                placeholderTextColor="#8A98A3"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.modalLabel}>Celular *</Text>
              <TextInput
                style={styles.modalInput}
                value={novoCelular}
                onChangeText={setNovoCelular}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#8A98A3"
                keyboardType="phone-pad"
              />

              <Text style={styles.modalLabel}>Data de Nascimento *</Text>
              {/* input HTML nativo para garantir o seletor de data no browser */}
              <View style={[styles.modalInput, { justifyContent: 'center' }]}>
                {React.createElement('input', {
                  type: 'date',
                  value: novaDataNascimento
                    ? `${novaDataNascimento.split('/')[2]}-${novaDataNascimento.split('/')[1]}-${novaDataNascimento.split('/')[0]}`
                    : '',
                  onChange: (e: any) => {
                    const val = e.target.value;
                    if (val) {
                      // converte aaaa-mm-dd para dd/mm/aaaa
                      const p = val.split('-');
                      setNovaDataNascimento(`${p[2]}/${p[1]}/${p[0]}`);
                    } else {
                      setNovaDataNascimento('');
                    }
                  },
                  style: {
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14, color: '#17262F', width: '100%', cursor: 'pointer',
                    fontFamily: 'inherit',
                  },
                })}
              </View>

              <Text style={styles.modalLabel}>Endereço *</Text>
              <TextInput
                style={styles.modalInput}
                value={novoEndereco}
                onChangeText={setNovoEndereco}
                placeholder="Rua, número, bairro..."
                placeholderTextColor="#8A98A3"
              />

              {/* campos de responsável aparecem somente para menores de 18 */}
              {novoPrecisaResponsavel && (
                <>
                  <Text style={styles.modalLabel}>Nome do Responsável *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={novoResponsavelNome}
                    onChangeText={setNovoResponsavelNome}
                    placeholder="Nome completo do responsável"
                    placeholderTextColor="#8A98A3"
                  />

                  <Text style={styles.modalLabel}>Contato do Responsável *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={novoResponsavelContato}
                    onChangeText={setNovoResponsavelContato}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#8A98A3"
                    keyboardType="phone-pad"
                  />
                </>
              )}

              {/* erro de validação ou de API exibido diretamente no modal */}
              {erroCriacao !== '' && (
                <Text style={styles.erroInline}>{erroCriacao}</Text>
              )}

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.modalBotaoCancelar}
                  onPress={() => setModalCriarAberto(false)}
                  disabled={criando}
                >
                  <Text style={styles.modalBotaoCancelarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBotaoSalvar, criando && { opacity: 0.6 }]}
                  onPress={salvarNovoPaciente}
                  disabled={criando}
                >
                  {criando
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.modalBotaoSalvarText}>Cadastrar</Text>
                  }
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* modal de edição de paciente */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Editar Paciente</Text>
            <Text style={styles.modalSubtitle}>CPF: {cpfEditando}</Text>

            <Text style={styles.modalLabel}>Nome Completo</Text>
            <TextInput
              style={styles.modalInput}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Nome do paciente"
              placeholderTextColor="#8A98A3"
            />

            <Text style={styles.modalLabel}>E-mail</Text>
            <TextInput
              style={styles.modalInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="email@exemplo.com"
              placeholderTextColor="#8A98A3"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.modalLabel}>Celular</Text>
            <TextInput
              style={styles.modalInput}
              value={editCelular}
              onChangeText={setEditCelular}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#8A98A3"
              keyboardType="phone-pad"
            />

            <Text style={styles.modalLabel}>Endereço</Text>
            <TextInput
              style={styles.modalInput}
              value={editEndereco}
              onChangeText={setEditEndereco}
              placeholder="Rua, número, bairro..."
              placeholderTextColor="#8A98A3"
            />

            {/* botões de ação */}
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.modalBotaoCancelar}
                onPress={() => setModalAberto(false)}
                disabled={salvando}
              >
                <Text style={styles.modalBotaoCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBotaoSalvar, salvando && { opacity: 0.6 }]}
                onPress={salvarEdicao}
                disabled={salvando}
              >
                {salvando
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalBotaoSalvarText}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

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

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DCEFEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 18,
    color: '#087A73',
    fontWeight: '700',
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

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 13,
    color: '#7E8D9B',
  },

  infoValue: {
    fontSize: 13,
    color: '#17262F',
    fontWeight: '500',
  },

  detailsButton: {
    marginTop: 10,
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

  // botão de edição do paciente — aparece no card
  editButton: {
    marginTop: 8,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // overlay escuro atrás do modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // caixa branca do modal
  modalBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#17262F',
    marginBottom: 4,
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 13,
    color: '#7E8D9B',
    marginBottom: 4,
    marginTop: 8,
  },

  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#17262F',
    backgroundColor: '#F7FCFA',
  },

  // linha de botões no rodapé do modal
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  modalBotaoCancelar: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBotaoCancelarText: {
    color: '#6B7C86',
    fontSize: 15,
    fontWeight: '600',
  },

  modalBotaoSalvar: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBotaoSalvarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // mensagem de erro exibida dentro do modal — mais visível que Alert no web
  erroInline: {
    color: '#B91C1C',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});