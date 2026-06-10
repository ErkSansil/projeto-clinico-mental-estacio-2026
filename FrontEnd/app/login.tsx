// arquivo app/login.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // evita que o teclado cubra os inputs no iOS 
  KeyboardAvoidingView,
  Platform,
  // botão principal de login
  Pressable,
  // componente de texto
  // componente de botão deslizante usado para ativar ou desativar opções
  StyleSheet,
  // botão com clique e efeito ao toque
  Text,
  // inserir nomes e dados
  TextInput,
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  TouchableOpacity,
  // componente base de estrutura e layout
  useWindowDimensions,
} from 'react-native';

// router pra navegação entre telas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// hook de autenticação para salvar o token e os dados do usuário
import { useAuth } from '../contexts/AuthContext';

// serviço de chamada à API do backend
import { login as loginApi } from '../services/api';

// biblioteca de ícones do Expo
// usado para exibir ícones visuais na interface da tela
import { Ionicons } from '@expo/vector-icons';

// essa é a tela inicial do app, então deixei o login aqui no index
export default function LoginScreen() {
  // pega a largura da tela para adaptar entre mobile e desktop
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  // guarda os valores digitados no formulário
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState < 'administrador' | 'estagiario' | null > (null);
  const [lembrar, setLembrar] = useState(false);

  // estado de carregamento enquanto a requisição está em andamento
  const [carregando, setCarregando] = useState(false);

  // estado de erro para exibir mensagens de falha ao usuário
  const [erro, setErro] = useState('');

  // controla se a senha está visível ou oculta no campo de texto
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // acessa o contexto para salvar o token e os dados do usuário após o login
  const { salvarLogin } = useAuth();

  // verifica o tipo de usuário e chama a API de login
  async function handleLogin() {

    // impede o envio se o tipo não estiver selecionado
    if (!tipoUsuario) {
      setErro('Selecione o tipo de acesso antes de entrar.');
      return;
    }

    // limpa erro anterior e ativa o estado de carregamento
    setErro('');
    setCarregando(true);

    try {
      // monta o payload para o backend:
      // administrador pode usar CPF (11 dígitos) ou matrícula (12 dígitos)
      // estagiário sempre usa matrícula (12 dígitos)
      const payload =
        tipoUsuario === 'administrador' && usuario.length === 11
          ? { cpf: usuario, senha }
          : { matriculaProfissional: usuario, senha };

      // chama a API de login do backend
      const resultado = await loginApi(payload);

      if (resultado.status !== 200) {
        // exibe a mensagem de erro retornada pelo backend
        setErro(resultado.dados.mensagem || 'Credenciais inválidas. Verifique e tente novamente.');
        return;
      }

      // salva o token JWT e os dados do usuário no contexto global
      salvarLogin(resultado.dados.token, resultado.dados.usuario);

      // navega para a tela correta baseado no tipo de usuário
      if (resultado.dados.usuario.tipo === 'admin') {
        router.replace('/acesso-administrador');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      // erro de rede ou inesperado
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      // sempre desativa o carregamento ao final
      setCarregando(false);
    }
  }

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >
      {/* cria uma imagem de fundo usando formas suaves, sem precisar de arquivo externo */}
        <View style={styles.backgroundDecor}>
          <View style={styles.blurCircleOne} />
          <View style={styles.blurCircleTwo} />
          <View style={styles.blurCircleThree} />
        </View>

      {/* evita que o teclado cubra os inputs no iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >

        {/* container principal da tela */}
       <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>

          {/* card central do login */}
          <View style={[styles.card, isDesktop && styles.cardDesktop]}>

            {/* área da logo */}
            <View style={[styles.logoArea, isDesktop && styles.logoAreaDesktop]}>

              {/* símbolo psi da clínica */}
              <Text style={[styles.psi, isDesktop && styles.psiDesktop]}>Ψ</Text>

              {/* textos da logo */}
              <View style={isDesktop && styles.logoTextsDesktop}>

                {/* nome principal */}
                <Text style={[styles.logoText, isDesktop && styles.logoTextDesktop]}>SEP</Text>

                {/* subtítulo da clínica */}
                <Text style={[styles.logoSubtitle, isDesktop && styles.logoSubtitleDesktop]}>CLÍNICA DE PSICOLOGIA</Text>
              </View>
            </View>

            {/* título da tela */}
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Bem-vindo!</Text>

            {/* subtítulo da tela */}
            <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>Faça login para acessar o sistema</Text>

            {/* card do formulário */}
            <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>

              {/* bloco do campo matrícula/cpf */}
              <View style={styles.fieldBlock}>

                {/* label do campo */}
                <Text style={styles.label}>Matrícula ou CPF</Text>

                {/* caixa do input */}
                <View style={styles.inputBox}>

                  {/* ícone do usuário */}
                  <Ionicons name="person-outline" size={18} color="#7A8D8A" />

                  {/* input matrícula/cpf */}
                  <TextInput
                    value={usuario}
                    onChangeText={(text) => setUsuario(text.replace(/[^0-9]/g, ""))}
                    placeholder="Digite sua matrícula ou CPF"
                    placeholderTextColor="#9AA7A5"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* bloco do tipo de acesso */}
              <View style={styles.fieldBlock}>

                {/* label do tipo de acesso */}
                <Text style={styles.label}>Tipo de acesso</Text>

                {/* container dos botões */}
                <View style={styles.tipoContainer}>

                  {/* botão administrador */}
                  <TouchableOpacity
                    style={[
                      styles.tipoButton,
                      tipoUsuario === 'administrador' && styles.tipoSelecionado,
                    ]}
                    onPress={() => setTipoUsuario('administrador')}
                  >

                    {/* texto do botão administrador */}
                    <Text
                      style={[
                        styles.tipoTexto,
                        tipoUsuario === 'administrador' && styles.tipoTextoSelecionado,
                      ]}
                    >
                      Administrador
                    </Text>
                  </TouchableOpacity>

                  {/* botão estagiário */}
                  <TouchableOpacity
                    style={[
                      styles.tipoButton,
                      tipoUsuario === 'estagiario' && styles.tipoSelecionado,
                    ]}
                    onPress={() => setTipoUsuario('estagiario')}
                  >

                    {/* texto do botão estagiário */}
                    <Text
                      style={[
                        styles.tipoTexto,
                        tipoUsuario === 'estagiario' && styles.tipoTextoSelecionado,
                      ]}
                    >
                      Estagiário
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* bloco da senha */}
              <View style={styles.fieldBlock}>

                {/* label da senha */}
                <Text style={styles.label}>Senha</Text>

                {/* caixa do input da senha */}
                <View style={styles.inputBox}>

                  {/* ícone de cadeado */}
                  <Ionicons name="lock-closed-outline" size={18} color="#7A8D8A" />

                  {/* input da senha */}
                  <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#9AA7A5"
                    secureTextEntry={!mostrarSenha}
                    style={styles.input}
                  />

                  {/* botão para mostrar ou esconder a senha */}
                  <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <Ionicons
                      name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#7A8D8A"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* linha de opções */}
              <View style={styles.optionsRow}>

                {/* botão lembrar de mim */}
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setLembrar(!lembrar)}
                >

                  {/* checkbox */}
                  <View style={[styles.checkbox, lembrar && styles.checkboxActive]}>

                    {/* ícone de check quando ativo */}
                    {lembrar && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>

                  {/* texto lembrar de mim */}
                  <Text style={styles.optionText}>Lembrar de mim</Text>
                </TouchableOpacity>

              </View>

              {/* mensagem de erro exibida quando o login falha */}
              {erro !== '' && (
                <Text style={styles.erroTexto}>{erro}</Text>
              )}

              {/* botão principal de login */}
              <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={carregando}>

                {/* texto do botão muda enquanto carrega */}
                <Text style={styles.primaryButtonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
              </Pressable>
              </View>
            </View>
          </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por sessão
const styles = StyleSheet.create({

  // fundo principal da tela
  background: {
    flex: 1,
  },

  // camada de elementos decorativos
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // círculo decorativo superior esquerdo
  blurCircleOne: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(12, 112, 110, 0.08)',
    top: -120,
    left: -120,
  },

  // círculo decorativo inferior direito
  blurCircleTwo: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(166, 189, 184, 0.18)',
    right: -180,
    bottom: -180,
  },

  // círculo decorativo central direito
  blurCircleThree: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    right: 220,
    top: 120,
  },

  // teclado adaptável da tela
  keyboard: {
    flex: 1,
  },

  // container principal da tela
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  
  // versão desktop do container principal
  wrapperDesktop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
    paddingVertical: 0,
  },

  // card principal do login/cadastro
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowColor: '#A6BDB8',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  // versão desktop do card principal
  cardDesktop: {
    width: '100%',
    maxWidth: 520,
    marginTop: -10,
    paddingHorizontal: 32,
    paddingVertical: 32,
  },

  // área da logo
  logoArea: {
    flexDirection: 'row', // lado a lado
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 22,
  },

  // alinhamento desktop da logo
  logoAreaDesktop: {
    justifyContent: 'flex-start',
  },

  // organização dos textos da logo no desktop
  logoTextsDesktop: {
    flexDirection: 'column', // SEP em cima e subtitulo embaixo
  },

  // símbolo psi da
  psi: {
    fontSize: 60,
    fontWeight: '700',
    color: '#0C706E',
    lineHeight: 68,
  },

  // tamanho do símbolo psi
  psiDesktop: {
    fontSize: 64,
  },

  // texto principal da logo
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0C706E',
  },

  // texto principal da logo
  logoTextDesktop: {
    fontSize: 30,
  },

  // Nome "Clínia de psicologia"
  logoSubtitle: {
    fontSize: 11,        // aumenta um pouco do nome
    fontWeight: '500',   //deixa mais visível 
    color: '#0C706E',
    letterSpacing: 0.5,  // melhora a leitura
  },

  // subtítulo da logo no desktop
  logoSubtitleDesktop: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'left',
  },

  // título principal da tela
  title: {
    fontSize: 23,
    fontWeight: '900',
    color: '#0C706E',
    marginBottom: 6,
    textAlign: 'center',
  },

  // título principal no desktop
  titleDesktop: {
    fontSize: 27,
  },

  // subtítulo da tela
  subtitle: {
    fontSize: 14,
    color: '#6F7D7A',
    marginBottom: 24,
    textAlign: 'center',
  },

  // subtítulo da tela no desktop
  subtitleDesktop: {
    fontSize: 15,
    marginBottom: 26,
  },

  // card do formulário
  formCard: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },

  // versão desktop do card do formulário
  formCardDesktop: {
    maxWidth: 520,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
  },

  // bloco individual de campo
  fieldBlock: {
    marginBottom: 16,
  },

  // label dos inputs
  label: {
    fontSize: 12,
    fontWeight: '600', // antes 800
    color: '#1E3A38',
    marginBottom: 8,
  },

  // caixa visual do input
  inputBox: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },

  // input de texto
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2F2D',
  },

  // container dos botões de tipo
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  // botão de seleção de tipo
  tipoButton: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // botão selecionado
  tipoSelecionado: {
    backgroundColor: '#0C706E',
    borderColor: '#0C706E',
  },

  // texto padrão do botão tipo
  tipoTexto: {
    fontSize: 13,
    fontWeight: '600', // antes 800
    color: '#17262F',
  },

  // texto do botão selecionado
  tipoTextoSelecionado: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // linha de opções extras
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  // linha do checkbox lembrar de mim
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  // checkbox padrão
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#0C706E',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // checkbox ativo
  checkboxActive: {
    backgroundColor: '#0C706E',
  },

  // Lembrar de mim
  optionText: {
    fontSize: 12,
    fontWeight: '400', // antes 700
    color: '#2D4A47',
  },

  // botão principal
  primaryButton: {
    height: 48,
    borderRadius: 6,
    backgroundColor: '#0C706E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  // Botão entrar
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400', // sem negrito
  },

  // texto de erro exibido abaixo dos campos quando o login falha
  erroTexto: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },

});