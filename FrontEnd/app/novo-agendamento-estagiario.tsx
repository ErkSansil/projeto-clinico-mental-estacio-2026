// arquivo app/novo-agendamento-estagiario.tsx

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState, useEffect } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // barra de rolagem na tela
  ScrollView,
  // usado para criar estilos na tela
  StyleSheet,
  // componente de texto
  // componente de botão deslizante usado para ativar ou desativar opções
  Switch,
  // botão com clique e efeito ao toque
  Text,
  // inserir nomes e dados
  TextInput,
  // componente base de estrutura e layout
  TouchableOpacity,
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  useWindowDimensions,
} from 'react-native';

// router pra navegação entre telas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// importa icones para adicionar ao sidebar
import { Ionicons } from '@expo/vector-icons';

// hook de autenticação para acessar o token JWT
import { useAuth } from '../contexts/AuthContext';

// serviço para criar consultas, cadastrar paciente e listar salas da API
import { criarConsulta, listarSalas, cadastrar } from '../services/api';

// componente personalizado de seleção usado para escolher opções
// como horário, sala, duração e tipo de atendimento
import SelectField from '@/components/ui/selectField';

// componente de calendário e seleção de data/hora
// utilizado para abrir o calendário nativo do dispositivo
import DateTimePicker from '@react-native-community/datetimepicker';

// componente para aparecer o calendario no dispositivo mobile
import { Platform } from 'react-native';

// verifica se a data dd/mm/aaaa indica menor de 18 anos
function menorDeIdade(dataNasc: string): boolean {
  const p = dataNasc.split('/');
  if (p.length !== 3 || p[2].length !== 4) return false;
  const nasc = new Date(`${p[2]}-${p[1]}-${p[0]}T00:00:00`);
  const hoje = new Date();
  const idade = hoje.getFullYear() - nasc.getFullYear()
    - (hoje < new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate()) ? 1 : 0);
  return idade < 18;
}

// formata o CPF no padrão xxx.xxx.xxx-xx conforme o usuário digita
function formatarCpf(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

// converte dd/mm/aaaa para aaaa-mm-dd (formato do input type=date do HTML)
function dataParaInputHtml(data: string): string {
  const partes = data.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return '';
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// opcoes do sidebar do estagiario
const menuItems = [
  ['calendar-outline', 'Agenda', '/(tabs)'],
  ['people-outline', 'Pacientes', '/(tabs)/pacientes'],
  ['business-outline', 'Salas', '/(tabs)/salas'],
  ['notifications-outline', 'Notificacoes', '/(tabs)/notificacoes'],
  ['person-outline', 'Perfil', '/(tabs)/perfil'],
];

// tela de novo agendamento de estagiario
export default function NovoAgendamentoEstagiarioScreen() {

  // pega a largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;
  
  // CPF do paciente — identificador principal
  const [paciente, setPaciente] = useState('');

  // dados cadastrais do paciente — preenchidos junto com o agendamento
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [responsavelNome, setResponsavelNome] = useState('');
  const [responsavelContato, setResponsavelContato] = useState('');

  // detecta menor de 18 com base na data de nascimento digitada
  const precisaResponsavel = dataNascimento.length === 10 && menorDeIdade(dataNascimento);

  // guarda o nome do estagiário digitado
  const [estagiario, setEstagiario] = useState('');

  // guarda a idade digitada (campo visual, não usado no cadastro)
  const [idade, setIdade] = useState('');

  // guarda o responsável (campo visual legado, mantido por compatibilidade)
  const [responsavel, setResponsavel] = useState('');

  // armazena o horário escolhido para o atendimento
  const [horario, setHorario] = useState('');

  // armazena a sala escolhida para o atendimento
  const [sala, setSala] = useState('');

  // guarda a data formatada exibida no campo (começa vazia)
  const [data, setData] = useState('');

  // armazena as observações digitadas pelo usuário
  const [observacoes, setObservacoes] = useState('');

  // controla se o agendamento automático está ativado
  const [automatico, setAutomatico] = useState(true);

  // estado de carregamento enquanto a requisição está em andamento
  const [carregando, setCarregando] = useState(false);

  // estado de erro para exibir mensagens de falha ao usuário
  const [erro, setErro] = useState('');

  // lista de salas carregadas da API para popular o dropdown
  const [opcoesSalas, setOpcoesSalas] = useState<{ label: string; value: string }[]>([]);

  // acessa o token JWT do usuário logado
  const { token } = useAuth();

  // carrega a lista de salas do backend ao montar a tela
  useEffect(() => {
    async function carregarSalas() {
      if (!token) return;

      try {
        const resultado = await listarSalas(token);

        if (resultado.status === 200 && resultado.dados.salas) {
          // converte o formato da API para o formato esperado pelo SelectField
          const opcoes = resultado.dados.salas.map((s: any) => ({
            label: s.descricao,
            value: s.descricao,
          }));
          setOpcoesSalas(opcoes);
        }
      } catch (e) {
        // em caso de erro usa opções padrão de fallback
        setOpcoesSalas([
          { label: 'geral 1', value: 'geral 1' },
          { label: 'geral 2', value: 'geral 2' },
          { label: 'geral 3', value: 'geral 3' },
          { label: 'infantil', value: 'infantil' },
          { label: 'grupo', value: 'grupo' },
          { label: 'supervisao', value: 'supervisao' },
        ]);
      }
    }

    carregarSalas();
  }, [token]);

  // função chamada ao pressionar "Salvar agendamento"
  // cadastra o paciente (se não existir) e cria as 10 consultas recorrentes
  async function handleSalvarAgendamento() {
    // valida os campos obrigatórios do paciente e do agendamento
    if (!paciente || !nomeCompleto || !email || !celular || !dataNascimento || !endereco || !sala || !horario || !data) {
      setErro('Preencha todos os campos obrigatórios: dados do paciente, sala, horário e data.');
      return;
    }

    if (precisaResponsavel && (!responsavelNome || !responsavelContato)) {
      setErro('Paciente menor de 18 anos: informe nome e contato do responsável.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const cpfDigitos = paciente.replace(/\D/g, '');
      // senha gerada internamente — estagiário não vê, satisfaz o regex do backend
      const senhaGerada = cpfDigitos.slice(0, 6) + 'Aa1';

      // tenta cadastrar o paciente — se já existir (422) ignora e segue
      const payloadPaciente: any = {
        tipo: 'paciente',
        nomeCompleto,
        cpf: cpfDigitos,
        email,
        celular,
        dataNascimento,
        endereco,
        senha: senhaGerada,
        confirmacaoSenha: senhaGerada,
      };
      if (precisaResponsavel) {
        payloadPaciente.responsavelNome = responsavelNome;
        payloadPaciente.responsavelContato = responsavelContato;
      }
      const resCadastro = await cadastrar(payloadPaciente);
      // 201 = criado / 422 = já existe — ambos permitem criar o agendamento
      if (resCadastro.status !== 201 && resCadastro.status !== 422) {
        setErro(resCadastro.dados?.mensagem ?? 'Erro ao registrar paciente. Verifique os dados.');
        return;
      }

      // converte a data do agendamento de dd/mm/aaaa para aaaa-mm-dd
      const partesData = data.split('/');
      const dataISO = partesData.length === 3
        ? `${partesData[2]}-${partesData[1]}-${partesData[0]}`
        : data;

      // cria as 10 consultas recorrentes já com status 'agendada'
      const resultado = await criarConsulta(
        {
          cpfPaciente: cpfDigitos,
          sala,
          data: dataISO,
          horario,
          observacao: observacoes || undefined,
        },
        token || ''
      );

      if (resultado.status !== 201) {
        setErro(resultado.dados.mensagem || 'Erro ao criar agendamento. Verifique os dados.');
        return;
      }

      // navega para a tela de sucesso após criar as consultas
      router.push('/agendamento-sucesso-estagiario');
    } catch (e) {
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChangeDate = (event: any, selected?: Date) => {
  setShowDatePicker(false);

  if (selected) {
    setSelectedDate(selected);

    const formatted =
      selected.toLocaleDateString('pt-BR');

    setData(formatted);
  }
};

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']}
      style={styles.background}
    >

      {/* sidebar aparece apenas no desktop */}
      <View style={styles.backgroundDecor}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />
        <View style={styles.blurCircleThree} />
      </View>

      {/* container principal da pagina */}
      <View style={styles.screen}>

        {/* sidebar desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>

            {/* área da logo */}
            <View style={styles.logoBox}>
              <Text style={styles.psi}>Ψ</Text>

              <View>
                <Text style={styles.logoText}>SEP</Text>

                <Text style={styles.logoSub}>Clínica de Psicologia</Text>
              </View>
            </View>

            {/* menu lateral */}
            <View style={styles.menuArea}>
              {menuItems.map(([icon, label, path]) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.menuItem,
                    label === 'Agenda' && styles.menuActive,
                  ]}
                  onPress={() => router.push(path as any)}
                >

                  <Ionicons name={icon as any} size={20} color={ label === 'Agenda' ? '#0C706E' : '#70808A'}/>

                  <Text
                    style={[ styles.menuText, label === 'Agenda' && styles.menuTextActive, ]} > {label} </Text>

                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* área principal do conteúdo */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* topo da tela */}
          <View style={styles.headerTextBox}>

            <Text style={styles.pageTitle}>Novo Agendamento</Text>

            <Text style={styles.pageSubtitle}>Preencha as informações para criar um novo atendimento.</Text>
          </View>

          {/* card principal */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="calendar-outline" size={22} color="#0C706E" />
              </View>

              <View>
                <Text style={styles.cardTitle}>Dados do agendamento</Text>
                <Text style={styles.cardSubtitle}>Organize o atendimento do paciente</Text>
              </View>
            </View>

            {/* grid */}
            <View style={[ styles.grid, isDesktop && styles.gridDesktop,]}>

              {/* paciente: campo CPF com máscara automática xxx.xxx.xxx-xx */}
              <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>

                <Text style={styles.label}>Paciente (CPF)</Text>

                {/* aplica a máscara de CPF conforme o usuário digita */}
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={14}
                  value={paciente}
                  onChangeText={(v) => setPaciente(formatarCpf(v))} />
              </View>

              {/* nome completo do paciente */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                <Text style={styles.label}>Nome completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo do paciente"
                  placeholderTextColor="#94A3B8"
                  value={nomeCompleto}
                  onChangeText={setNomeCompleto}
                />
              </View>

              {/* e-mail do paciente */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                <Text style={styles.label}>E-mail *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* celular do paciente */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                <Text style={styles.label}>Celular *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={celular}
                  onChangeText={setCelular}
                />
              </View>

              {/* data de nascimento — HTML input para funcionar no browser */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                <Text style={styles.label}>Data de nascimento *</Text>
                <View style={[styles.input, { justifyContent: 'center' }]}>
                  {React.createElement('input', {
                    type: 'date',
                    value: dataNascimento
                      ? `${dataNascimento.split('/')[2]}-${dataNascimento.split('/')[1]}-${dataNascimento.split('/')[0]}`
                      : '',
                    onChange: (e: any) => {
                      const val = e.target.value;
                      if (val) {
                        const p = val.split('-');
                        setDataNascimento(`${p[2]}/${p[1]}/${p[0]}`);
                      } else {
                        setDataNascimento('');
                      }
                    },
                    style: {
                      border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 15, color: '#17262F', width: '100%', cursor: 'pointer',
                      fontFamily: 'inherit',
                    },
                  })}
                </View>
              </View>

              {/* endereço do paciente */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                <Text style={styles.label}>Endereço *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rua, número, bairro..."
                  placeholderTextColor="#94A3B8"
                  value={endereco}
                  onChangeText={setEndereco}
                />
              </View>

              {/* responsável — aparece automaticamente quando o paciente for menor de 18 */}
              {precisaResponsavel && (
                <>
                  <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.label}>Nome do responsável *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nome completo do responsável"
                      placeholderTextColor="#94A3B8"
                      value={responsavelNome}
                      onChangeText={setResponsavelNome}
                    />
                  </View>

                  <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.label}>Contato do responsável *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="(00) 00000-0000"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      value={responsavelContato}
                      onChangeText={setResponsavelContato}
                    />
                  </View>
                </>
              )}

              {/* estagiário */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop,]}>

                <Text style={styles.label}>Estagiário</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do estagiário"
                  placeholderTextColor="#94A3B8" value={estagiario} onChangeText={setEstagiario} />
              </View>

              {/* idade do paciente */}
              <View
                style={[
                  styles.field,
                  isDesktop && styles.fieldDesktop,
                ]}
              >
  
                {/* label */}
                <Text style={styles.label}>
                  Idade
                </Text>
  
                {/* campo idade */}
                <TextInput
                  style={styles.input}
                  placeholder="Digite a idade"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={idade}
                  onChangeText={setIdade}
                />
              </View>
  
              {/* responsavel */}
              {Number(idade) < 16 && idade !== '' && (
  
                <View
                  style={[
                    styles.field,
                    isDesktop && styles.fieldDesktop,
                  ]}
                >
  
                  {/* label */}
                  <Text style={styles.label}>Responsável</Text>
  
                  {/* campo responsável */}
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do responsável"
                    placeholderTextColor="#94A3B8"
                    value={responsavel}
                    onChangeText={setResponsavel}
                  />
                </View>
              )}

              {/* sala: opções carregadas dinamicamente da API */}
              <View
                style={[ styles.field, isDesktop && styles.fieldDesktop, styles.selectHighZ,]}
              >
                <SelectField
                  label="Sala"
                  value={sala}
                  onChange={setSala}
                  placeholder="Selecione uma sala"
                  options={opcoesSalas}
                />
              </View>

              {/* horário */}
              <View
                style={[styles.field, isDesktop && styles.fieldDesktop, styles.selectHighZ,]}>
                <SelectField
                  label="Horário"
                  value={horario}
                  onChange={setHorario}
                  placeholder="Selecione um horário"
                  options={[
                    { label: '08:00', value: '08:00' },
                    { label: '09:00', value: '09:00' },
                    { label: '14:00', value: '14:00' },
                    { label: '15:00', value: '15:00' },
                    { label: '16:00', value: '16:00' },
                    { label: '17:00', value: '17:00' },
                    { label: '18:00', value: '18:00' },
                    { label: '19:00', value: '19:00' },
                    { label: '20:00', value: '20:00' },
                    { label: '21:00', value: '21:00' },
                  ]}
                />
              </View>

              {/* campo de data do agendamento */}
              <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>

                {/* texto do label do campo */}
                <Text style={styles.label}>Data</Text>

                {/* verifica se está rodando na web */}
                {Platform.OS === 'web' ? (
                  /* na web usa um input HTML nativo para abrir o calendário do browser */
                  <View style={[styles.input, { justifyContent: 'center' }]}>
                    {React.createElement('input', {
                      type: 'date',
                      value: dataParaInputHtml(data),
                      onChange: (e: any) => {
                        const val = e.target.value;
                        if (val) {
                          const p = val.split('-');
                          setData(`${p[2]}/${p[1]}/${p[0]}`);
                        }
                      },
                      style: {
                        border: 'none', outline: 'none', background: 'transparent',
                        fontSize: 15, color: '#17262F', width: '100%', cursor: 'pointer',
                        fontFamily: 'inherit',
                      },
                    })}
                  </View>

                ) : (
                  <>

                    {/* botão que abre o calendário */}
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowDatePicker(true)}
                    >

                      {/* conteúdo interno do botão */}
                      <View style={styles.inputContent}>

                        {/* ícone de calendário */}
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#7E8D9B"
                        />

                        {/* texto exibindo a data selecionada */}
                        <Text style={styles.dateText}>
                          {data}
                        </Text>

                      </View>
                    </TouchableOpacity>

                    {/* exibe o calendário somente se showDatePicker for true */}
                    {showDatePicker && ( <DateTimePicker value={selectedDate}
                    mode="date" display="default"
                    onChange={onChangeDate}/>
                    )}
                  </>
                )}
              </View>

              {/* campo de observações */}
              <View
                style={[styles.field, isDesktop && styles.fieldDesktop,]}>

                {/* label do campo */}
                <Text style={styles.label}>Observações</Text>

                {/* campo de texto multilinha */}
                <TextInput

                  // estilo do textarea
                  style={styles.textArea}

                  // valor atual das observações
                  value={observacoes}

                  // atualiza o estado das observações
                  onChangeText={setObservacoes}

                  // texto placeholder
                  placeholder="Digite observações..."

                  // cor do placeholder
                  placeholderTextColor="#94A3B8"

                  // permite múltiplas linhas
                  multiline
                />
              </View>
              </View>

              {/* bloco do agendamento automático */}
              <View style={styles.autoBlock}>

                {/* área de textos do bloco automático */}
                <View style={styles.autoTextBox}>

                  {/* título principal */}
                  <Text style={styles.autoTitle}>Agendamento automático</Text>

                  {/* subtítulo explicativo */}
                  <Text style={styles.autoSubtitle}>Criar pacote automático de sessões</Text>
                </View>

                {/* switch de ativar/desativar automático */}
                <Switch

                  // valor atual do switch
                  value={automatico} onValueChange={setAutomatico}

                  // cores da trilha do switch
                  trackColor={{
                    false: '#CBD5E1',
                    true: '#BFE7DA',
                  }}

                  // cor da bolinha do switch
                  thumbColor={ automatico ? '#0C706E' : '#FFFFFF' }/>
              </View>

              {/* área dos botões */}
              <View
                style={[ styles.buttonsRow, !isDesktop && styles.buttonsMobile,]}>

                {/* botão cancelar */}
                <TouchableOpacity
                  style={styles.cancelButton}

                  // volta para tela anterior
                  onPress={() => router.back()}
                >

                  {/* ícone do botão cancelar */}
                  <Ionicons name="close-outline" size={20} color="#60768A" />

                  {/* texto do botão cancelar */}
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                {/* mensagem de erro exibida quando o agendamento falha */}
                {erro !== '' && (
                  <Text style={styles.erroTexto}>{erro}</Text>
                )}

                {/* botão salvar: chama a API de criação de consulta ao pressionar */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSalvarAgendamento}
                  disabled={carregando}
                >

                  {/* ícone do botão salvar */}
                  <Ionicons
                    name="checkmark-outline" size={20} color="#FFFFFF" />

                  {/* texto do botão muda enquanto aguarda a resposta do servidor */}
                  <Text style={styles.saveText}>{carregando ? 'Salvando...' : 'Salvar agendamento'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    )}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por sessão
const styles = StyleSheet.create({

  // fundo principal da tela
  // ocupa toda a altura disponível
  background: {
    flex: 1,
  },

  // estrutura principal da tela
  // define layout horizontal entre sidebar e conteúdo
  screen: {
    flex: 1,
    flexDirection: 'row',
  },

  // camada de fundo decorativa
  // usada para elementos visuais absolutos
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // círculo decorativo superior esquerdo
  blurCircleOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(12,112,110,0.08)',
    top: -120,
    left: -120,
  },

  // círculo decorativo inferior direito
  blurCircleTwo: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: 'rgba(166,189,184,0.18)',
    right: -180,
    bottom: -160,
  },

  // círculo decorativo superior direito
  blurCircleThree: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.7)',
    right: 100,
    top: 120,
  },

  // menu lateral da aplicação
  sidebar: {
    width: 245,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E6ECEA',
  },

  // área da logo no topo da sidebar
  logoBox: {
    height: 118,
    backgroundColor: '#0C706E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
    borderBottomRightRadius: 18,
  },

  // símbolo psi da clínica
  psi: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // texto principal da logo
  logoText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // subtítulo da logo
  logoSub: {
    fontSize: 12,
    color: '#EAF6F2',
    marginTop: 2,
  },

  // área dos itens do menu lateral
  menuArea: {
    paddingTop: 18,
  },

  // item individual do menu
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

  // estilo do item ativo do menu
  menuActive: {
    backgroundColor: '#EAF6F2',
  },

  // texto padrão do menu
  menuText: {
    fontSize: 15,
    color: '#4B5F68',
    fontWeight: '400',
  },

  // texto do item ativo do menu
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // área principal de conteúdo
  content: {
    flex: 1,
  },

  // espaçamento interno do ScrollView
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 80,
  },

  // espaçamento do conteúdo no desktop
  scrollContentDesktop: {
    paddingHorizontal: 32,
    paddingTop: 42,
  },

  // bloco de texto do cabeçalho
  headerTextBox: {
    marginBottom: 24,
    marginTop: 10
  },

  // título principal da página
  pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#17262F',
  },

  // subtítulo da página
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 8,
    lineHeight: 22,
  },

  // card principal do formulário
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 22,
    overflow: 'visible',
  },

  // cabeçalho do card
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },

  // ícone circular do card
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // título do card
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#17262F',
  },

  // subtítulo do card
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 3,
  },

  // grid principal dos campos
  grid: {
    gap: 14,
    overflow: 'visible',
  },

  // grid adaptado para desktop
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'visible',
  },

  // container padrão de campo
  field: {
    width: '100%',
  },

  // largura do campo em desktop
  fieldDesktop: {
    width: '48.5%',
    position: 'relative',
  },

  // prioridade de camada para selects
  selectHighZ: {
    zIndex: 99999,
    elevation: 999,
  },

  // texto label dos campos
  label: {
    fontSize: 14,
    color: '#17262F',
    marginBottom: 8,
    fontWeight: '500',
  },

  // input padrão
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#17262F',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // conteúdo interno do input
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // texto da data
  dateText: {
    fontSize: 14,
    color: '#17262F',
  },

  // campo de texto multilinha
  textArea: {
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    paddingHorizontal: 14,
    paddingTop: 14,
    fontSize: 15,
    color: '#17262F',
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },

  // bloco do switch automático
  autoBlock: {
    zIndex: 1,
    elevation: 1,

    marginTop: 24,
    backgroundColor: '#EEF8F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EDE5',
    padding: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // área textual do automático
  autoTextBox: {
    flex: 1,
  },

  // título do automático
  autoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#17262F',
  },

  // subtítulo do automático
  autoSubtitle: {
    fontSize: 13,
    color: '#61717B',
    marginTop: 3,
  },

  // linha de botões
  buttonsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  // organização dos botões no mobile
  buttonsMobile: {
    flexDirection: 'column-reverse',
  },

  // botão cancelar
  cancelButton: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    paddingHorizontal: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    backgroundColor: '#FFFFFF',
  },

  // texto do botão cancelar
  cancelText: {
    fontSize: 15,
    color: '#60768A',
    fontWeight: '500',
  },

  // botão salvar
  saveButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#0C706E',
    paddingHorizontal: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // texto do botão salvar
  saveText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // texto de erro exibido quando o agendamento falha
  erroTexto: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
});