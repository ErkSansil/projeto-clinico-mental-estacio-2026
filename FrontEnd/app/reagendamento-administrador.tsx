// arquivo app/reagendamento.tsx

// tela de reagendamento seguindo o mesmo padrão visual das outras telas

// importação principal do React, pois é necessário para criar componentes React Native.
import React, { useState } from 'react';

// componentes nativos do React são usados nesta tela
import {
  // usado para criar estilos na tela
  ScrollView,
  // componente de texto
  StyleSheet,
  // botão com clique e efeito ao toque
  Text,
  // digitar as informações do paciente
  TextInput,
  // componente base de estrutura e layout
  TouchableOpacity,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  View,
  useWindowDimensions,
} from 'react-native';

// importa imagem para adicionar icones
import { Image } from 'react-native';

// biblioteca de ícones do Expo
// usado para exibir ícones visuais na interface da tela
import { Ionicons } from '@expo/vector-icons';

// router pra navegação entre telas
import { router } from 'expo-router';

// componente de fundo degradê
// usado para deixar o background mais moderno e suave
import { LinearGradient } from 'expo-linear-gradient';

import SelectField from '@/components/ui/selectField';

// componente de calendário e seleção de data/hora
// utilizado para abrir o calendário nativo do dispositivo
import DateTimePicker from '@react-native-community/datetimepicker';

// componente para aparecer o calendario no dispositivo mobile
import { Platform } from 'react-native';

// tela de reagendamento
export default function ReagendamentoScreen() {

  // pega a largura da tela para adaptar no mobile e desktop
  const { width } = useWindowDimensions();

  // se a tela for maior ou igual a 900, eu considero desktop
  const isDesktop = width >= 900;

  // guarda o nome do paciente digitado
  const [paciente, setPaciente] = useState('');

  // guarda a nova data digitada
  const [novaData, setNovaData] = useState('');

  // novo horário da consulta
  const [novoHorario, setNovoHorario] = useState('');

  // sala do paciente
  const [sala, setSala] = useState('');

  // motivo do reagendamento
  const [motivo, setMotivo] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    const onChangeDate = (event: any, selected?: Date) => {
    setShowDatePicker(false);
  
    if (selected) {
      setSelectedDate(selected);
  
      const formatted =
        selected.toLocaleDateString('pt-BR');
  
      setNovaData(formatted);
    }
  };

  return (
    // Coloca um fundo com degradê suave pra dar um visual mais clean
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >

      {/* decoração */}
      <View style={styles.decorCircleOne} />
      <View style={styles.decorCircleTwo} />
      <View style={styles.decorCircleThree} />
      <View style={styles.decorDotOne} />
      <View style={styles.decorDotTwo} />
      <View style={styles.decorDotThree} />

      <View style={styles.page}>

        {/* sidebar desktop */}
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
                style={styles.menuItem}
                onPress={() => router.push('/calendario-administrador')}
              >
                <Image
                  source={require('../assets/images/agendamento.png')}
                  style={styles.menuIcon}
                />

                <Text style={styles.menuText}>Agendamentos</Text>
              </TouchableOpacity>

              {/* pacientes */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/pacientes-admin')}
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
            onPress={() => router.push('/salas-admin')}
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

          {/* pedidos de reagendamentos*/}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pedidos-reagendamentos')}
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
            onPress={() => router.push('/cadastro')}
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
            {/* ícone de perfil */}
            <Image
              source={require('../assets/images/perfil.png')}
              style={styles.menuIcon}
            />

            {/* texto do menu perfil */}
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}

        {/* conteúdo */}
        <ScrollView contentContainerStyle={styles.contentMobile}>

          {/* topo */}
          <View style={styles.header}>

            {/* título principal da tela */}
            <Text style={styles.title}>Reagendamento</Text>

            {/* subtítulo explicativo */}
            <Text style={styles.subtitle}>Atualize a data e horário do atendimento.</Text>
          </View>

          {/* card */}
          <View style={styles.card}>

            {/* header card */}
            <View style={styles.cardHeader}>

              {/* ícone do card */}
              <View style={styles.cardIcon}>
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color="#087A73"
                />
              </View>

              {/* textos do cabeçalho */}
              <View>

                {/* título do card */}
                <Text style={styles.cardTitle}>Dados do reagendamento</Text>

                {/* subtítulo do card */}
                <Text style={styles.cardSubtitle}>Escolha as informações da consulta</Text>
              </View>
            </View>

            {/* grid */}
            <View style={[
              styles.grid,
              isDesktop && styles.gridDesktop,
            ]}>

              {/* campo do nome do paciente */}
              <View style={[styles.field, isDesktop && styles.fieldDesktop]}>

                {/* label do campo */}
                <Text style={styles.label}>Paciente</Text>

                {/* input para digitar o nome */}
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do paciente"
                  placeholderTextColor="#94A3B8"
                  value={paciente}
                  onChangeText={setPaciente}
                />
              </View>

              {/* campo de data do agendamento */}
              <View style={[ styles.field, isDesktop && styles.fieldDesktop,]}>

                {/* texto do label do campo */}
                <Text style={styles.label}>Nova Data</Text>

              {/* verifica se está rodando na versão web */}
              {Platform.OS === 'web' ? (

                /* campo simples para digitar a data manualmente no navegador */
                <TextInput
                  style={styles.input}
                  value={novaData}
                  onChangeText={setNovaData}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#94A3B8"
                />

              ) : (

                <>
                  {/* botão que abre o calendário nativo do celular */}
                  <TouchableOpacity
                    style={styles.inputBox}
                    onPress={() => setShowDatePicker(true)}
                  >

                    {/* ícone ilustrativo de calendário */}
                    <Ionicons name="calendar-outline" size={18} color="#7E8D9B" />

                    {/* exibe a data selecionada ou uma mensagem padrão */}
                    <Text style={styles.dateText}>
                      {novaData || 'Selecione uma data'}
                    </Text>

                  </TouchableOpacity>

                  {/* exibe o calendário apenas quando o usuário clicar no campo */}
                  {showDatePicker && (

                    <DateTimePicker
                      value={selectedDate} // data atualmente selecionada
                      mode="date" // exibe somente seleção de data
                      display="default" // utiliza o estilo padrão do sistema
                      onChange={onChangeDate} // atualiza a data após seleção
                    />
                  )}
                </>
              )}
              </View>

              {/* horário */}
              <View style={[
                styles.field,
                isDesktop && styles.fieldDesktop,
              ]}>

                {/* componente de seleção de horário */}
                <SelectField
                  label="Novo horário "
                  value={novoHorario}
                  onChange={setNovoHorario}
                  placeholder="Selecione um novo horário"
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

              {/* sala */}
              <View style={[
                styles.field,
                isDesktop && styles.fieldDesktop,
              ]}>

                {/* componente de seleção de sala */}
                <SelectField
                  label="Sala "
                  value={sala}
                  onChange={setSala}
                  placeholder="Selecione uma nova sala"
                  options={[
                    { label: 'Sala 1', value: '1' },
                    { label: 'Sala 2', value: '2' },
                    { label: 'Sala 3', value: 'sala-3' },
                    { label: 'Sala infantil', value: 'sala-infantil' },
                    { label: 'Sala de grupos', value: 'sala-de-grupos' },
                    { label: 'Sala de supervisão', value: 'sala-de-supervisao' },
                  ]}
                />
              </View>
            </View>

            {/* motivo */}
            <View style={styles.obsBox}>

              {/* label do campo de motivo */}
              <Text style={styles.label}>Motivo do reagendamento</Text>
     
              {/* campo de texto para observações do reagendamento */}
              <TextInput
                style={styles.textArea}
                value={motivo}
                onChangeText={setMotivo}
                placeholder="Digite o motivo do reagendamento..."
                placeholderTextColor="#94A3B8"
                multiline
              />

            </View>

            {/* botões */}
            <View style={[
              styles.buttonsRow,
              !isDesktop && styles.buttonsMobile,
            ]}>

              {/* botão cancelar */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >

                {/* ícone do botão cancelar */}
                <Ionicons
                  name="close-outline"
                  size={20}
                  color="#60768A"
                />

                {/* texto do botão cancelar */}
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              {/* botão principal que salva o reagendamento */}
              <TouchableOpacity

                // estilo do botão
                style={styles.saveButton}

                // navega para a tela de sucesso
                onPress={() => router.push('/reagendamento-sucesso')}
              >

                {/* ícone de confirmação */}
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color="#FFFFFF"
                />

                {/* texto do botão */}
                <Text style={styles.saveText}>Salvar reagendamento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>   
      </View>
    </LinearGradient>
  );
}

function MenuItem({ icon, label, path, active }: any) {

  return (

    <TouchableOpacity
      style={[
        styles.menuItem,
        active && styles.menuActive,
      ]}
      onPress={() => router.push(path)}
    >

      <Ionicons
        name={icon}
        size={20}
        color={active ? '#0C706E' : '#70808A'}
      />

      <Text
        style={[
          styles.menuText,
          active && styles.menuTextActive,
        ]}
      >
        {label}
      </Text>

    </TouchableOpacity>
  );
}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por sessão
const styles = StyleSheet.create({

    // fundo principal da tela
  background: {
    flex: 1,
  },

  // estrutura principal da página
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

  // área da logo
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 36,
  },

  // símbolo psi da logo
  psi: {
    fontSize: 38,
    color: '#0C706E',
    fontWeight: '700',
  },

  // texto principal da logo
  logoText: {
    fontSize: 24,
    color: '#17262F',
    fontWeight: '700',
  },

  // subtítulo da logo
  logoSub: {
    fontSize: 12,
    color: '#70808A',
    marginTop: 2,
  },

  // área do menu lateral
  menuArea: {
    paddingHorizontal: 16,
  },

  // texto separador do menu
  menuLabel: {
    fontSize: 11,
    color: '#8A98A3',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 1,
  },

  // item do menu lateral
  menuItem: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },

  // estilo do item ativo do menu
  menuActive: {
    backgroundColor: '#E9F7F5',
  },

  // texto do menu
  menuText: {
    fontSize: 15,
    color: '#70808A',
    fontWeight: '500',
  },

  // texto do menu ativo
  menuTextActive: {
    color: '#0C706E',
    fontWeight: '600',
  },

  // conteúdo rolável da tela
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 42,
  },

  // conteúdo no mobile
  contentMobile: {
    paddingHorizontal: 16,
    paddingTop: 35,
  },

  // cabeçalho da página
  header: {
    marginBottom: 24,
  },

  // título principal da página
  title: {
    fontSize: 32,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo da página
  subtitle: {
    fontSize: 15,
    color: '#70808A',
    marginTop: 6,
  },

  // texto da data
  dateText: {
    fontSize: 14,
    color: '#17262F',
  },

  // card principal
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DCEBE7',
  },

  // cabeçalho do card
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },

  // ícone do card
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF6F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // título do card
  cardTitle: {
    fontSize: 18,
    color: '#17262F',
    fontWeight: '600',
  },

  // subtítulo do card
  cardSubtitle: {
    fontSize: 13,
    color: '#70808A',
    marginTop: 3,
  },

  // grid principal
  grid: {
    gap: 14,
  },

  // campo de digitação
  input: {
  height: 52,
  borderWidth: 1,
  borderColor: '#DCEBE7',
  borderRadius: 14,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 14,
  fontSize: 14,
  color: '#17262F',
  },

  // grid no desktop
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // campo padrão
  field: {
    width: '100%',
  },

  // campo no desktop
  fieldDesktop: {
    width: '48.5%',
  },

  // label dos campos
  label: {
    fontSize: 14,
    color: '#17262F',
    fontWeight: '500',
    marginBottom: 8,
  },

  // caixa do input com ícone
  inputBox: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },

  // área de observações
  obsBox: {
    marginTop: 18,
  },

  // textarea de observações
  textArea: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#17262F',
  },

  // linha dos botões
  buttonsRow: {
    marginTop: 26,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
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

  // botão salvar
  saveButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#087A73',
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

  // círculo decorativo esquerdo
  decorCircleOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#DCEFEB',
    opacity: 0.5,
    left: -90,
    top: 100,
  },

  // círculo decorativo inferior direito
  decorCircleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E3F3EF',
    opacity: 0.6,
    right: -70,
    bottom: 90,
  },

  // círculo decorativo superior direito
  decorCircleThree: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#DDEFEA',
    opacity: 0.4,
    right: 160,
    top: 80,
  },

  // bolinha decorativa superior
  decorDotOne: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DCEFEB',
    top: 70,
    left: '52%',
  },

  // bolinha decorativa inferior esquerda
  decorDotTwo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBE6DF',
    bottom: 120,
    left: 80,
  },

  // bolinha decorativa direita
  decorDotThree: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4ECE6',
    top: 220,
    right: 100,
  },

  // ícone do menu lateral
  menuIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
  tintColor: '#0C706E',
  },
});