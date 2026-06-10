// arquivo app/novo-agendamento.tsx

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
  // campo de digitação utilizado para entrada de textos,
  // números, datas, observações e outras informações digitadas pelo usuário
  TextInput,
  // inserir nomes e dados
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

// hook de autenticação para acessar o token JWT do usuário logado
import { useAuth } from '../contexts/AuthContext';

// serviços: criar consulta, carregar salas e cadastrar paciente
import { criarConsulta, listarSalas, cadastrar } from '../services/api';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

// importa icones para adicionar ao sidebar
import { Ionicons } from '@expo/vector-icons';

// componente personalizado de seleção usado para escolher opções
// como horário, sala, duração e tipo de atendimento
import SelectField from '@/components/ui/selectField';

// componente de calendário e seleção de data/hora
// utilizado para abrir o calendário nativo do dispositivo
import DateTimePicker from '@react-native-community/datetimepicker';

import { Platform } from 'react-native';

// verifica se a data de nascimento indica menor de 18 anos
function menorDeIdade(dataNascimento: string): boolean {
  const partes = dataNascimento.split('/');
  if (partes.length !== 3 || partes[2].length < 4) return false;
  const nascimento = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
  const hoje = new Date();
  const anos = hoje.getFullYear() - nascimento.getFullYear();
  const passou = hoje.getMonth() > nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
  return anos - (passou ? 0 : 1) < 18;
}

// formata o CPF no padrão xxx.xxx.xxx-xx conforme o usuário digita
function formatarCpf(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

// formata a data no padrão dd/mm/aaaa conforme o usuário digita
function formatarData(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 8);
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
}

// converte dd/mm/aaaa para aaaa-mm-dd (formato do input type=date do HTML)
function dataParaInputHtml(data: string): string {
  const partes = data.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return '';
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// tela de novo agendamento
export default function NovoAgendamentoAdministradorScreen() {

  // pega a largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isDesktop = width >= 900;

  // controla se o calendário está aberto ou fechado
  const [showDatePicker, setShowDatePicker] = useState(false);

  // armazena a data selecionada no calendário
  const [selectedDate, setSelectedDate] = useState(new Date());

  // CPF do paciente — campo principal de identificação
  const [paciente, setPaciente] = useState('');

  // dados cadastrais do paciente — preenchidos na criação do agendamento
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

  // guarda a idade digitada
  const [idade, setIdade] = useState('');

  // guarda o responsável
  const [responsavel, setResponsavel] = useState('');

  // armazena o horário escolhido para o atendimento
  const [horario, setHorario] = useState('');

  // guarda a sala selecionada para a sessão
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

  // pega o token do usuário logado
  const { token } = useAuth();

  // carrega as salas do banco ao abrir a tela
  useEffect(() => {
    async function carregarSalas() {
      if (!token) return;
      try {
        const resultado = await listarSalas(token);
        if (resultado.status === 200 && resultado.dados.salas) {
          const opcoes = resultado.dados.salas.map((s: any) => ({
            label: s.descricao,
            value: s.descricao,
          }));
          setOpcoesSalas(opcoes);
        }
      } catch (e) {
        // fallback com as salas padrão caso a API não responda
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

  // valida os campos e envia o agendamento para a API
  async function handleSalvarAgendamento() {
    if (!paciente || !nomeCompleto || !email || !celular || !dataNascimento || !endereco || !sala || !horario || !data) {
      setErro('Preencha todos os campos obrigatórios do paciente e do agendamento.');
      return;
    }

    if (precisaResponsavel && (!responsavelNome || !responsavelContato)) {
      setErro('Paciente menor de 18 anos: preencha os dados do responsável.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      // gera senha interna para o paciente — o sistema cria automaticamente
      const cpfDigitos = paciente.replace(/\D/g, '');
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
      // 201 = criado com sucesso / 422 = paciente já existe — ambos permitem continuar
      if (resCadastro.status !== 201 && resCadastro.status !== 422) {
        setErro(resCadastro.dados?.mensagem ?? 'Erro ao registrar paciente. Verifique os dados.');
        return;
      }

      // converte a data do agendamento de dd/mm/aaaa para aaaa-mm-dd
      const partes = data.split('/');
      const dataISO = partes.length === 3
        ? `${partes[2]}-${partes[1]}-${partes[0]}`
        : data;

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
        setErro(resultado.dados?.mensagem || 'Erro ao criar agendamento. Verifique os dados.');
        return;
      }

      // redireciona para a tela de sucesso após criar o agendamento
      router.push('/agendamento-sucesso-administrador');
    } catch (e) {
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }

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
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      {/* sidebar aparece apenas no desktop */}
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

      {/* menu lateral */}
      <View style={styles.menuArea}>

        {/* administrador */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/acesso-administrador')}
        >
          <Image
            source={require('../assets/images/administrador.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Administrador</Text>
        </TouchableOpacity>

        {/* label */}
        <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

        {/* agendamentos */}
        <TouchableOpacity
          style={[ styles.menuItem, styles.menuActive,]}
          onPress={() => router.push('/calendario-administrador')}
        >
          <Image
            source={require('../assets/images/agendamento.png')}
            style={styles.menuIcon}
          />

          <Text
            style={[ styles.menuText, styles.menuTextActive,]}>Agendamentos</Text>
        </TouchableOpacity>

        {/* pacientes */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/pacientes-administrador')}
        >
          <Image
            source={require('../assets/images/paciente.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Pacientes</Text>
        </TouchableOpacity>

        {/* salas */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/salas-administrador')}
        >
          <Image
            source={require('../assets/images/salas.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Salas</Text>
        </TouchableOpacity>

        {/* cancelamentos */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/cancelamentos')}
        >
          <Image
            source={require('../assets/images/cancelamento.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Cancelamentos</Text>
        </TouchableOpacity>

        {/* solicitacoes de reagendamentos*/}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/solicitacao-reagendamento')}
        >
          <Image
            source={require('../assets/images/reagendamento.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Pedidos reagendamento</Text>
        </TouchableOpacity>

        {/* cadastrar estagiário */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/cadastro-estagiario')}
        >
          <Image
            source={require('../assets/images/estagiario.png')}
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
            source={require('../assets/images/relatorio2.png')}
            style={styles.menuIcon}
          />

          {/* texto do item relatório */}
          <Text style={styles.menuText}>Relatório Atendimentos</Text>
        </TouchableOpacity>
        
        {/* perfil */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/perfil-administrador')}
        >
          <Image
            source={require('../assets/images/perfil.png')}
            style={styles.menuIcon}
          />

          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}

    
    {/* área principal do conteúdo */}
    <ScrollView contentContainerStyle={styles.contentMobile}>
            
      {/* bolinhas do fundo */}
      <View style={styles.decorCircleOne} />
      <View style={styles.decorCircleTwo} />
      <View style={styles.decorCircleThree} />
      <View style={styles.decorDotOne} />
      <View style={styles.decorDotTwo} />
      <View style={styles.decorDotThree} />
      <View style={styles.decorDotFour} />

        {/* topo da tela */}
        <View style={styles.headerTextBox}>

          <Text style={styles.pageTitle}>Novo Agendamento</Text>

          <Text style={styles.pageSubtitle}>Preencha as informações para criar um novo atendimento.</Text>
        </View>

        {/* card principal */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="calendar-outline" size={22} color="#087A73" />
            </View>

            <View>
              <Text style={styles.cardTitle}>Dados do agendamento</Text>
              <Text style={styles.cardSubtitle}>Organize o atendimento do paciente</Text>
            </View>
          </View>

          {/* grid */}
          <View style={[ styles.grid, isDesktop && styles.gridDesktop,]}>

            {/* campo CPF do paciente */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>CPF do Paciente *</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#94A3B8"
                value={paciente}
                onChangeText={(v) => setPaciente(formatarCpf(v))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            {/* nome completo do paciente */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>Nome Completo do Paciente *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#94A3B8"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
              />
            </View>

            {/* e-mail do paciente */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>E-mail *</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* celular do paciente */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>Celular *</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#94A3B8"
                value={celular}
                onChangeText={setCelular}
                keyboardType="numeric"
              />
            </View>

            {/* data de nascimento — usada para detectar menores de 18 */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>Data de Nascimento *</Text>
              {Platform.OS === 'web' ? (
                <View style={[styles.input, { justifyContent: 'center' }]}>
                  {React.createElement('input', {
                    type: 'date',
                    value: dataParaInputHtml(dataNascimento),
                    onChange: (e: any) => {
                      const val = e.target.value;
                      if (val) {
                        const p = val.split('-');
                        setDataNascimento(`${p[2]}/${p[1]}/${p[0]}`);
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
                <TextInput
                  style={styles.input}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#94A3B8"
                  value={dataNascimento}
                  onChangeText={v => setDataNascimento(formatarData(v))}
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}
            </View>

            {/* endereço do paciente */}
            <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
              <Text style={styles.label}>Endereço *</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro, cidade"
                placeholderTextColor="#94A3B8"
                value={endereco}
                onChangeText={setEndereco}
              />
            </View>

            {/* campos de responsável — exibidos apenas para menores de 18 anos */}
            {precisaResponsavel && (
              <>
                <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
                  <Text style={[styles.label, { color: '#E03131' }]}>
                    Menor de 18 anos — Nome do Responsável *
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome completo do responsável"
                    placeholderTextColor="#94A3B8"
                    value={responsavelNome}
                    onChangeText={setResponsavelNome}
                  />
                </View>
                <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>
                  <Text style={styles.label}>Contato do Responsável *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor="#94A3B8"
                    value={responsavelContato}
                    onChangeText={setResponsavelContato}
                    keyboardType="numeric"
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

            {/* sala: opções carregadas dinamicamente do banco de dados */}
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
                      const val = e.target.value; // yyyy-mm-dd
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
                {showDatePicker && ( <DateTimePicker value={selectedDate} mode="date" 
                display="default" onChange={onChangeDate}/>
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

              {/* mensagem de erro quando o agendamento falha */}
              {erro !== '' && (
                <Text style={styles.erroTexto}>{erro}</Text>
              )}

              {/* botão salvar: chama a API ao pressionar */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSalvarAgendamento}
                disabled={carregando}
              >

                {/* ícone do botão salvar */}
                <Ionicons
                  name="checkmark-outline" size={20} color="#FFFFFF" />

                {/* texto muda enquanto aguarda a resposta */}
                <Text style={styles.saveText}>
                  {carregando ? 'Salvando...' : 'Salvar agendamento'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </LinearGradient>
  );
}

function MenuItem({ icon, label, path, active }: any) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, active && styles.menuActive]}
      onPress={() => router.push(path)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? '#0C706E' : '#70808A'}
      />

      <Text style={[styles.menuText, active && styles.menuTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por sessão
const styles = StyleSheet.create({
  screen: {
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

  // texto ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

 // área principal onde fica todo o conteúdo da tela
  content: {
    flex: 1,
  },

  // conteúdo scrollável
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 32,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },

  scrollContentDesktop: {
    paddingHorizontal: 28,
    paddingTop: 42,
    paddingBottom: 40,
  },

  // círculo decorativo
  decorCircleOne: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: '#DCEFEB',
    opacity: 0.55,
    left: -120,
    top: 130,
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
    top: 250,
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

  // ponto decorativo 1
  decorDotOne: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF6F2',
    top: 52,
    left: '58%',
  },

  // ponto decorativo 2
  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    top: 300,
    left: 40,
  },

  // ponto decorativo 3
  decorDotThree: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4ECE6',
    top: 350,
    left: 72,
  },

  // ponto decorativo 4
  decorDotFour: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  // cabeçalho da tela
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },

  // cabeçalho da tela no mobile
  headerMobile: {
    marginTop: 22,
    alignItems: 'flex-start',
  },

  // botão pequeno usado para ícones no cabeçalho
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // área que organiza os textos do cabeçalho
  headerTextBox: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 10
  },

  // título principal da página
  pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#17262F',
  },

  // subtítulo exibido abaixo do título principal
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7C86',
    marginTop: 10,
    lineHeight: 21,
    fontWeight: '400',
  },

  // card principal que contém o formulário
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    padding: 22,
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // cabeçalho interno do card
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },

  // círculo do ícone exibido no card
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // título do card
  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#087A73',
  },

  // subtítulo do card
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
  },

  // grid principal que organiza os campos
  grid: {
    gap: 14,
  },

  // organização dos campos no desktop
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 16,
  },

  // estrutura padrão de cada campo
  field: {
    width: '100%',
  },

  // largura dos campos no desktop
  fieldDesktop: {
    width: '48.8%',
  },

  // texto de identificação dos campos
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#17262F',
    marginBottom: 8,
  },

  // campo padrão de digitação
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#17262F',
    justifyContent: 'center',
  },

    inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },


  // texto exibido dentro do campo de data
  dateText: {
    fontSize: 14,
    color: '#17262F',
  },

  // área das observações
  obsBox: {
    marginTop: 16,
  },

  // campo de texto grande para observações
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    fontSize: 15,
    color: '#17262F',
    textAlignVertical: 'top',
    fontWeight: '400',
  },

  // contador de caracteres das observações
  counter: {
    fontSize: 12,
    color: '#7E8D9B',
    marginTop: 8,
  },

  // bloco do agendamento automático
  autoBlock: {
    marginTop: 20,
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: '#EEF8F4',
    borderWidth: 1,
    borderColor: '#D6EDE5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // área dos textos do agendamento automático
  autoTextBox: {
    flex: 1,
  },

  // título do bloco automático
  autoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#17262F',
  },

  // subtítulo do bloco automático
  autoSubtitle: {
    fontSize: 13,
    color: '#61717B',
    marginTop: 3,
  },

  // linha que organiza os botões
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

  // botão de cancelar
  cancelButton: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // texto do botão cancelar
  cancelText: {
    fontSize: 15,
    color: '#60768A',
    fontWeight: '500',
  },

  // botão principal de salvar
  saveButton: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 22,
    backgroundColor: '#087A73',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // texto do botão salvar
  saveText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  selectHighZ: {
    zIndex: 99999,
    elevation: 999,
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