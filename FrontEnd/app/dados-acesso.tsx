// arquivo app/dados-acesso.tsx

// importa componentes do React Native
import React, { useState } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // barra de rolagem na tela
  ScrollView,
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  Text,
  // botão com clique e efeito ao toque
  TextInput,
  // para realizar a inserção de dados do usuario
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

// aqui eu uso o router pra navegação entre telas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para ler os dados das etapas anteriores do cadastro
import { useAuth } from '../contexts/AuthContext';

// serviço de chamada à API para realizar o cadastro no backend
import { cadastrar } from '../services/api';

// componente da tela de cadastro realizado com sucesso
export default function DadosAcessoScreen() {
  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

// estados do formulário de acesso
const [usuario, setUsuario] = useState('');
const [senha, setSenha] = useState('');
const [confirmarSenha, setConfirmarSenha] = useState('');

// estado de carregamento enquanto a requisição está em andamento
const [carregando, setCarregando] = useState(false);

// estado de erro para exibir mensagens de falha ao usuário
const [erro, setErro] = useState('');

// acessa o contexto para ler os dados das etapas anteriores e limpar após conclusão
const { dadosCadastro, limparDadosCadastro } = useAuth();

// função que combina todos os dados e chama a API de cadastro
async function handleCadastrar() {
  // valida os campos obrigatórios antes de enviar
  if (!usuario || !senha || !confirmarSenha) {
    setErro('Preencha todos os campos obrigatórios.');
    return;
  }

  // verifica se as senhas coincidem
  if (senha !== confirmarSenha) {
    setErro('As senhas não coincidem. Verifique e tente novamente.');
    return;
  }

  // limpa erro anterior e ativa o estado de carregamento
  setErro('');
  setCarregando(true);

  try {
    // combina os dados das etapas anteriores com os dados de acesso
    // o campo "usuario" da tela mapeia para "matricula" no backend (12 dígitos)
    const payload = {
      nomeCompleto: dadosCadastro.nomeCompleto || '',
      cpf: dadosCadastro.cpf || '',
      dataNascimento: dadosCadastro.dataNascimento || '',
      email: dadosCadastro.email || '',
      celular: dadosCadastro.celular || '',
      tipo: dadosCadastro.tipo === 'estagiario' ? 'profissional' : (dadosCadastro.tipo || 'profissional'),
      matricula: usuario,
      senha,
      confirmacaoSenha: confirmarSenha,
      endereco: dadosCadastro.endereco,
      responsavelNome: dadosCadastro.responsavelNome,
      responsavelContato: dadosCadastro.responsavelContato,
    };

    // chama a API de cadastro do backend
    const resultado = await cadastrar(payload);

    if (resultado.status !== 201 && resultado.status !== 200) {
      // exibe a mensagem de erro retornada pelo backend
      setErro(resultado.dados.mensagem || 'Erro ao realizar cadastro. Verifique os dados.');
      return;
    }

    // limpa os dados do cadastro do contexto após a conclusão
    limparDadosCadastro();

    // navega para a tela de sucesso
    router.push('/cadastro-sucesso');
  } catch (e) {
    // erro de rede ou inesperado
    setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
  } finally {
    // sempre desativa o carregamento ao final
    setCarregando(false);
  }
}

// início da renderização da tela
  return (
  // Coloca um fundo com degradê suave pra dar um visual mais clean
  <LinearGradient colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']} style={styles.background}>

    {/* elementos decorativos de fundo */}
    {(
      <View style={styles.backgroundDecor}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />
        <View style={styles.blurCircleThree} />
      </View>
    )}

    {/* área de scroll principal da tela */}
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* wrapper central da tela */}
      <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>

        {/* card principal do formulário */}
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>

          {/* área do logo */}
          <View style={styles.logoArea}>
            <Text style={styles.psi}>Ψ</Text>
            <View>

              {/* nome do sistema */}
              <Text style={styles.logoText}>SEP</Text>

              {/* subtítulo da clínica */}
              <Text style={styles.logoSubtitle}>CLÍNICA DE PSICOLOGIA</Text>
            </View>
          </View>

          {/* indicador de etapas do cadastro */}
          <View style={styles.stepsContainer}>

            {/* etapa concluída: tipo de conta */}
            <View style={styles.stepItem}>
              <View style={styles.stepDone}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <Text style={styles.stepLabel}>Tipo de conta</Text>
            </View>

            {/* linha de conexão entre etapas */}
            <View style={styles.stepLine} />

            {/* etapa concluída: dados pessoais */}
            <View style={styles.stepItem}>
              <View style={styles.stepDone}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <Text style={styles.stepLabel}>Dados pessoais</Text>
            </View>

            {/* linha de conexão entre etapas */}
            <View style={styles.stepLine} />

            {/* etapa atual: dados de acesso */}
            <View style={styles.stepItem}>
              <View style={styles.stepActive}>
                <Text style={styles.stepActiveText}>3</Text>
              </View>
              <Text style={styles.stepLabelActive}>Dados acesso</Text>
            </View>

            {/* linha de conexão entre etapas */}
            <View style={styles.stepLine} />

            {/* etapa final: conclusão */}
            <View style={styles.stepItem}>
              <View style={styles.stepInactive}>
                <Text style={styles.stepInactiveText}>4</Text>
              </View>
              <Text style={styles.stepLabel}>Concluir</Text>
            </View>
          </View>

          {/* título da seção */}
          <Text style={styles.title}>Dados de acesso</Text>

          {/* subtítulo explicativo */}
          <Text style={styles.subtitle}>
            Crie seu usuário e senha para acessar o sistema
          </Text>

          {/* formulário de cadastro */}
          <View style={styles.form}>

            {/* campo matrícula — no sistema o estagiário se identifica pela matrícula, não por nome */}
            <Text style={styles.label}>Número de matrícula *</Text>
            <TextInput
              value={usuario}
              onChangeText={setUsuario}
              placeholder="Digite o número de matrícula"
              keyboardType="numeric"
              placeholderTextColor="#9AA7A5"
              style={styles.input}
            />

            {/* campo senha */}
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.inputIcon}>
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="Crie uma senha segura"
                placeholderTextColor="#9AA7A5"
                secureTextEntry
                style={styles.inputFlex}
              />
              <Ionicons name="eye-outline" size={18} color="#7A8D8A" />
            </View>

            {/* campo confirmação de senha */}
            <Text style={styles.label}>Confirmar senha *</Text>
            <View style={styles.inputIcon}>
              <TextInput
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Confirme sua senha"
                placeholderTextColor="#9AA7A5"
                secureTextEntry
                style={styles.inputFlex}
              />
              <Ionicons name="eye-outline" size={18} color="#7A8D8A" />
            </View>

            {/* regras de senha */}
            <View style={styles.rulesBox}>

              {/* título das regras */}
              <View style={styles.rulesTitleRow}>
                <Ionicons name="lock-closed-outline" size={17} color="#0C706E" />
                <Text style={styles.rulesTitle}>A senha deve conter:</Text>
              </View>

              {/* regra 1 */}
              <View style={styles.ruleRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#78A99C" />
                <Text style={styles.ruleText}>Mínimo de 8 caracteres</Text>
              </View>

              {/* regra 2 */}
              <View style={styles.ruleRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#78A99C" />
                <Text style={styles.ruleText}>Letras maiúsculas e minúsculas</Text>
              </View>

              {/* regra 3 */}
              <View style={styles.ruleRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#78A99C" />
                <Text style={styles.ruleText}>Números e caracteres especiais</Text>
              </View>

            </View>
          </View>

          {/* mensagem de erro exibida quando o cadastro falha */}
          {erro !== '' && (
            <Text style={styles.erroTexto}>{erro}</Text>
          )}

          {/* área de botões */}
          <View style={styles.buttonsRow}>

            {/* botão voltar */}
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryText}>Voltar</Text>
            </TouchableOpacity>

            {/* botão continuar: chama a API de cadastro ao pressionar */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCadastrar}
              disabled={carregando}
            >
              {/* texto muda enquanto aguarda a resposta do servidor */}
              <Text style={styles.primaryText}>{carregando ? 'Cadastrando...' : 'Continuar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
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

  // fundo decorativo da tela
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  blurCircleOne: {
  // círculo decorativo superior esquerdo (fundo suave)
  position: 'absolute',
  width: 520,
  height: 520,
  borderRadius: 260,
  backgroundColor: 'rgba(12, 112, 110, 0.08)',
  top: -120,
  left: -120,
},

  blurCircleTwo: {
    // círculo decorativo inferior direito (mais escuro)
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(166, 189, 184, 0.18)',
    right: -180,
    bottom: -180,
  },

  blurCircleThree: {
    // círculo decorativo central leve (branco translúcido)
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    right: 220,
    top: 120,
  },

  scrollContent: {
    // área principal com centralização e espaçamento interno
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
  },

  wrapper: {
    // container geral da tela
    width: '100%',
  },

  wrapperDesktop: {
    // centraliza conteúdo no desktop
    alignItems: 'center',
  },

  card: {
    // card principal branco com sombra
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    shadowColor: '#A6BDB8',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  // limita largura no desktop
  cardDesktop: {
    width: '100%',
    maxWidth: 520,
    padding: 28,
  },

  // área do logo centralizada
  logoArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },

  psi: {
    // símbolo principal da marca
    fontSize: 60,
    fontWeight: '700',
    color: '#0C706E',
    lineHeight: 68,
  },

  logoText: {
    // nome da marca
    fontSize: 28,
    fontWeight: '900',
    color: '#0C706E',
  },

  logoSubtitle: {
    // subtítulo da clínica
    fontSize: 11,
    fontWeight: '500',
    color: '#0C706E',
    letterSpacing: 0.4,
  },

  stepsContainer: {
    // barra de progresso das etapas
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  stepItem: {
    // item individual de etapa
    alignItems: 'center',
    width: 70,
  },

  stepDone: {
    // etapa concluída
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  stepActive: {
    // etapa atual ativa
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  stepInactive: {
    // etapa ainda não concluída
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEF3F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  stepActiveText: {
    // número da etapa ativa
    color: '#fff',
    fontWeight: '400',
    fontSize: 12,
  },

  stepInactiveText: {
    // número da etapa inativa
    color: '#777',
    fontWeight: '400',
    fontSize: 12,
  },

  stepLabel: {
    // label padrão da etapa
    fontSize: 10,
    color: '#7B8986',
    textAlign: 'center',
  },

  stepLabelActive: {
    // label da etapa ativa
    fontSize: 10,
    fontWeight: '400',
    color: '#1B3431',
    textAlign: 'center',
  },

  stepLine: {
    // linha entre etapas
    flex: 1,
    height: 2,
    backgroundColor: '#E3EBE8',
    marginBottom: 22,
  },

  title: {
    // título principal da tela
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    color: '#171717',
    marginBottom: 6,
  },

  subtitle: {
    // subtítulo explicativo
    textAlign: 'center',
    color: '#7A8583',
    fontSize: 13,
    marginBottom: 20,
  },

  form: {
    // container do formulário
    width: '100%',
  },

  label: {
    // label dos inputs
    fontSize: 12,
    fontWeight: '400',
    color: '#1E3A38',
    marginBottom: 6,
  },

  input: {
    // campo de texto padrão
    height: 46,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 14,
    color: '#1F2F2D',
  },

  inputIcon: {
    // input com ícone ao lado
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  inputFlex: {
    // input interno flexível
    flex: 1,
    fontSize: 14,
    color: '#1F2F2D',
  },

  rulesBox: {
    // caixa de regras da senha
    backgroundColor: '#F2FAF8',
    borderRadius: 6,
    padding: 12,
    marginTop: 6,
  },

  rulesTitleRow: {
    // linha do título das regras
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  rulesTitle: {
    // título das regras
    fontSize: 13,
    fontWeight: '400',
    color: '#0C706E',
  },

  ruleRow: {
    // linha de cada regra
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  ruleText: {
    // texto das regras
    fontSize: 12,
    color: '#566B67',
    fontWeight: '400',
  },

  buttonsRow: {
    // linha dos botões
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  secondaryButton: {
    // botão secundário (voltar)
    width: 100,
    height: 44,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryText: {
    // texto botão secundário
    fontWeight: '400',
    color: '#1B3431',
    fontSize: 13,
  },

  primaryButton: {
    // botão principal (continuar)
    width: 140,
    height: 44,
    backgroundColor: '#0C706E',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryText: {
    // texto botão principal
    color: '#fff',
    fontWeight: '400',
    fontSize: 13,
  },

  // texto de erro para falha de cadastro ou validação
  erroTexto: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  });