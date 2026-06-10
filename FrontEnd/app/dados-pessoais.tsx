// arquivo app/dados-pessoais.tsx

// importa componentes do React Native
import React, { useState } from 'react';

// usado para verificar se estamos no web e mostrar o date picker nativo do browser
import { Platform } from 'react-native';

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

// hook de autenticação para salvar os dados pessoais no contexto
import { useAuth } from '../contexts/AuthContext';

// formata CPF no padrão xxx.xxx.xxx-xx enquanto o usuário digita
function formatarCpf(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

// formata data no padrão dd/mm/aaaa enquanto o usuário digita
function formatarData(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 8);
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
}

// componente da tela de cadastro realizado com sucesso
export default function DadosPessoaisScreen() {
  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

  // estados dos campos
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // estado de erro para exibir mensagens de validação ao usuário
  const [erro, setErro] = useState('');

  // acessa o contexto para salvar os dados pessoais antes de avançar
  const { atualizarDadosCadastro } = useAuth();

  // início da renderização da tela
  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >
      {/* elementos decorativos de fundo */}
      {(
        <View style={styles.backgroundDecor}>
          <View style={styles.blurCircleOne} />
          <View style={styles.blurCircleTwo} />
          <View style={styles.blurCircleThree} />
        </View>
      )}

      {/* área de scroll principal da tela */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* wrapper central da tela */}
        <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
          <View style={[styles.card, isDesktop && styles.cardDesktop]}>

            {/* Logo da clínica */}
            <View style={styles.logoArea}>
              <Text style={styles.psi}>Ψ</Text>
              <View>
                <Text style={styles.logoText}>SEP</Text>
                <Text style={styles.logoSubtitle}>CLÍNICA DE PSICOLOGIA</Text>
              </View>
            </View>

            {/* ETAPAS - indicador de progresso do cadastro */}
            <View style={styles.stepsContainer}>

              {/* passo 1 já concluído */}
              <View style={styles.stepItem}>
                <View style={styles.stepDone}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
                <Text style={styles.stepLabel}>Tipo de conta</Text>
              </View>

              {/* linha entre etapas */}
              <View style={styles.stepLine} />

              {/* passo 2 (etapa atual) */}
              <View style={styles.stepItem}>
                <View style={styles.stepActive}>
                  <Text style={styles.stepActiveText}>2</Text>
                </View>
                <Text style={styles.stepLabelActive}>Dados pessoais</Text>
              </View>

              {/* linha entre etapas */}
              <View style={styles.stepLine} />

              {/* passo 3 ainda não concluído */}
              <View style={styles.stepItem}>
                <View style={styles.stepInactive}>
                  <Text style={styles.stepInactiveText}>3</Text>
                </View>
                <Text style={styles.stepLabel}>Dados acesso</Text>
              </View>

              {/* linha entre etapas */}
              <View style={styles.stepLine} />

              {/* passo 4 final */}
              <View style={styles.stepItem}>
                <View style={styles.stepInactive}>
                  <Text style={styles.stepInactiveText}>4</Text>
                </View>
                <Text style={styles.stepLabel}>Concluir</Text>
              </View>

            </View>

            {/* TÍTULO DA SEÇÃO */}
            <Text style={styles.title}>Dados pessoais</Text>
            <Text style={styles.subtitle}>
              Preencha seus dados pessoais
            </Text>

            {/* FORMULÁRIO PRINCIPAL */}
            <View style={styles.form}>

              {/* campo nome completo */}
              <Text style={styles.label}>Nome completo *</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome completo"
                style={styles.input}
              />

              {/* linha com CPF e data de nascimento */}
              <View style={styles.row}>

                {/* CPF — com máscara automática xxx.xxx.xxx-xx */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CPF *</Text>
                  <TextInput
                    value={cpf}
                    onChangeText={(v) => setCpf(formatarCpf(v))}
                    placeholder="000.000.000-00"
                    keyboardType="numeric"
                    maxLength={14}
                    style={styles.input}
                  />
                </View>

                {/* data de nascimento — com máscara automática dd/mm/aaaa */}
                {/* no web, o ícone de calendário abre o date picker nativo do browser */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Data de nascimento *</Text>
                  <View style={styles.inputIcon}>
                    <TextInput
                      value={dataNascimento}
                      onChangeText={(v) => setDataNascimento(formatarData(v))}
                      placeholder="dd/mm/aaaa"
                      keyboardType="numeric"
                      maxLength={10}
                      style={styles.inputFlex}
                    />
                    {/* no web, renderiza um input date invisível por cima do ícone */}
                    {Platform.OS === 'web' ? (
                      <View style={{ position: 'relative', width: 24, height: 24 }}>
                        <Ionicons name="calendar-outline" size={18} color="#7A8D8A" style={{ position: 'absolute', top: 3, left: 3 }} />
                        {React.createElement('input', {
                          type: 'date',
                          style: {
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                          },
                          onChange: (e: any) => {
                            // converte yyyy-mm-dd para dd/mm/aaaa
                            const p = e.target.value.split('-');
                            if (p.length === 3) setDataNascimento(`${p[2]}/${p[1]}/${p[0]}`);
                          },
                        })}
                      </View>
                    ) : (
                      <Ionicons name="calendar-outline" size={18} color="#7A8D8A" />
                    )}
                  </View>
                </View>

              </View>

              {/* e-mail */}
              <Text style={styles.label}>E-mail *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                style={styles.input}
              />

              {/* telefone */}
              <Text style={styles.label}>Telefone *</Text>
              <View style={styles.inputIcon}>
                <TextInput
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="(11) 99999-9999"
                  keyboardType="numeric"
                  style={styles.inputFlex}
                />
                <Ionicons name="logo-whatsapp" size={18} color="#0C706E" />
              </View>

            </View>

            {/* mensagem de erro exibida quando campos obrigatórios não estão preenchidos */}
            {erro !== '' && (
              <Text style={styles.erroTexto}>{erro}</Text>
            )}

            {/* BOTÕES DE NAVEGAÇÃO */}
            <View style={styles.buttonsRow}>

              {/* voltar etapa anterior */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.back()}
              >
                <Text style={styles.secondaryText}>Voltar</Text>
              </TouchableOpacity>

              {/* avançar para próxima etapa */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  // valida os campos obrigatórios antes de avançar
                  if (!nome || !cpf || !dataNascimento || !email || !telefone) {
                    setErro('Preencha todos os campos obrigatórios.');
                    return;
                  }

                  // salva os dados pessoais no contexto antes de avançar para dados de acesso
                  atualizarDadosCadastro({
                    nomeCompleto: nome,
                    cpf: cpf.replace(/\D/g, ''),
                    dataNascimento,
                    email,
                    celular: telefone,
                  });

                  // limpa o erro e avança para a próxima etapa
                  setErro('');
                  router.push('/dados-acesso');
                }}
              >
                <Text style={styles.primaryText}>Continuar</Text>
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

  // card principal branco com sombra
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    elevation: 8,
  },

  // limita largura no desktop
  cardDesktop: {
  width: '100%',
  maxWidth: 520, // igual da tela de criar conta
  padding: 24,   // reduz um pouco também
  },

  // área do logo centralizada
  logoArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
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
  // etapa concluída (círculo preenchido)
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
  },

  stepInactiveText: {
    // número da etapa inativa
    color: '#777',
    fontWeight: '400',
  },

  stepLabel: {
    // texto padrão da etapa
    fontSize: 10,
    color: '#7B8986',
    fontWeight: '400',
  },

  stepLabelActive: {
    // texto da etapa ativa
    fontSize: 10,
    fontWeight: '400',
    color: '#1B3431',
  },

  stepLine: {
    // linha entre etapas
    flex: 1,
    height: 2,
    backgroundColor: '#E3EBE8',
  },

  title: {
    // título principal
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    // subtítulo
    textAlign: 'center',
    color: '#7A8583',
    marginBottom: 20,
  },

  form: {
    // container do formulário
    gap: 10,
  },

  label: {
    // label dos inputs
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
  },

  input: {
    // campo de texto padrão
    height: 48,
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  inputIcon: {
    // input com ícone
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5E2',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  inputFlex: {
    // input flexível dentro do input com ícone
    flex: 1,
  },

  row: {
    // linha de inputs lado a lado
    flexDirection: 'row',
    gap: 10,
  },

  buttonsRow: {
    // linha dos botões
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
    fontSize: 13,
    color: '#1B3431',
  },

  // texto de erro para campos obrigatórios não preenchidos
  erroTexto: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  });