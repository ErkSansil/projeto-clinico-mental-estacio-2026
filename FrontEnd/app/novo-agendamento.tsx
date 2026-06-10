// arquivo app/novo-agendamento.tsx
// aqui eu organizei a tela de novo agendamento e deixei responsiva para celular e desktop

import React, { useState } from 'react';
import { router } from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// importando imagem
import { Image } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SelectField from '@/components/ui/selectField';

export default function NovoAgendamentoScreen() {
  // aqui eu pego a largura da tela pra saber se está no mobile ou desktop
  const { width } = useWindowDimensions();

  // se for maior ou igual a 900, eu considero desktop
  const isDesktop = width >= 900;

  const [paciente, setPaciente] = useState('');
  const [estagiario, setEstagiario] = useState('');
  const [horario, setHorario] = useState('');
  const [sala, setSala] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('');
  const [duracao, setDuracao] = useState('');
  const [sessao, setSessao] = useState('');
  const [data, setData] = useState('12/06/2026');
  const [observacoes, setObservacoes] = useState('');
  const [automatico, setAutomatico] = useState(true);

  return (
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

        <Text style={styles.logoSub}>
          Clínica de Psicologia
        </Text>
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

        <Text style={styles.menuText}>
          Administrador
        </Text>
      </TouchableOpacity>

      {/* label */}
      <Text style={styles.menuLabel}>
        GERENCIAMENTO
      </Text>

      {/* agendamentos */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          styles.menuActive,
        ]}
        onPress={() => router.push('/calendario-administrador')}
      >
        <Image
          source={require('../assets/images/agendamento.png')}
          style={styles.menuIcon}
        />

        <Text
          style={[
            styles.menuText,
            styles.menuTextActive,
          ]}
        >
          Agendamentos
        </Text>
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

        <Text style={styles.menuText}>
          Pacientes
        </Text>
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

        <Text style={styles.menuText}>
          Salas
        </Text>
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

        <Text style={styles.menuText}>
          Cancelamentos
        </Text>
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

        <Text style={styles.menuText}>
          Cadastrar Estagiário
        </Text>
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

        <Text style={styles.menuText}>
          Perfil
        </Text>
      </TouchableOpacity>

    </View>
  </View>
)}

      {/* conteúdo principal */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.pageSubtitle}>
              Preencha as informações para criar um novo atendimento.
            </Text>
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

          {/* campos principais */}
          <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Paciente *"
                value={paciente}
                onChange={setPaciente}
                placeholder="Ana Silva"
                options={[
                  { label: 'Ana Silva', value: 'ana-silva' },
                  { label: 'Lucas Mendes', value: 'lucas-mendes' },
                  { label: 'Maria Clara Souza', value: 'maria-clara' },
                  { label: 'Pedro Henrique', value: 'pedro-henrique' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Estagiário *"
                value={estagiario}
                onChange={setEstagiario}
                placeholder="Paulo Oliveira"
                options={[
                  { label: 'Paulo Oliveira', value: 'paulo-oliveira' },
                  { label: 'Renato Alves', value: 'renato-alves' },
                  { label: 'Patrícia Melo', value: 'patricia-melo' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <Text style={styles.label}>Data *</Text>

              <View style={styles.inputIconBox}>
                <Ionicons name="calendar-outline" size={20} color="#7E8D9B" />

                <TextInput
                  style={styles.input}
                  value={data}
                  onChangeText={setData}
                  placeholder="12/06/2026"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Horário *"
                value={horario}
                onChange={setHorario}
                placeholder="14:00"
                options={[
                  { label: '08:00', value: '08:00' },
                  { label: '09:00', value: '09:00' },
                  { label: '10:00', value: '10:00' },
                  { label: '14:00', value: '14:00' },
                  { label: '15:00', value: '15:00' },
                  { label: '16:00', value: '16:00' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Sala *"
                value={sala}
                onChange={setSala}
                placeholder="Sala 2"
                options={[
                  { label: 'Sala 1', value: 'sala-1' },
                  { label: 'Sala 2', value: 'sala-2' },
                  { label: 'Sala 3', value: 'sala-3' },
                  { label: 'Sala infantil', value: 'sala-infantil' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Tipo de Atendimento *"
                value={tipoAtendimento}
                onChange={setTipoAtendimento}
                placeholder="Psicoterapia individual"
                options={[
                  { label: 'Psicoterapia individual', value: 'individual' },
                  { label: 'Psicoterapia em grupo', value: 'grupo' },
                  { label: 'Avaliação', value: 'avaliacao' },
                  { label: 'Retorno', value: 'retorno' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Sessão (Pacote)"
                value={sessao}
                onChange={setSessao}
                placeholder="1ª sessão de 10"
                options={[
                  { label: '1ª sessão de 10', value: '1' },
                  { label: '2ª sessão de 10', value: '2' },
                  { label: '3ª sessão de 10', value: '3' },
                ]}
              />
            </View>

            <View style={[styles.field, isDesktop && styles.fieldDesktop]}>
              <SelectField
                label="Duração"
                value={duracao}
                onChange={setDuracao}
                placeholder="60 minutos"
                options={[
                  { label: '30 minutos', value: '30' },
                  { label: '45 minutos', value: '45' },
                  { label: '60 minutos', value: '60' },
                ]}
              />
            </View>
          </View>

          {/* observações */}
          <View style={styles.obsBox}>
            <Text style={styles.label}>Observações iniciais</Text>

            <TextInput
              style={styles.textArea}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Digite as observações iniciais (opcional)..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={500}
            />

            <Text style={styles.counter}>
              {observacoes.length}/500 caracteres
            </Text>
          </View>

          {/* agendamento automático */}
          <View style={styles.autoBlock}>
            <View style={styles.autoTextBox}>
              <Text style={styles.autoTitle}>Agendamento automático</Text>

              <Text style={styles.autoSubtitle}>
                Criar pacote de 10 sessões para o paciente
              </Text>
            </View>

            <Switch
              value={automatico}
              onValueChange={setAutomatico}
              trackColor={{ false: '#CBD5E1', true: '#BFE7DA' }}
              thumbColor={automatico ? '#087A73' : '#F8FAFC'}
            />
          </View>

          {/* botões */}
          <View style={[styles.buttonsRow, !isDesktop && styles.buttonsMobile]}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Ionicons name="close-outline" size={22} color="#60768A" />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => router.push('/agendamento-sucesso')}
            >
              <Ionicons name="checkmark-outline" size={22} color="#FFFFFF" />
              <Text style={styles.saveText}>Salvar agendamento</Text>
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

  logoutSidebar: {
    position: 'absolute',
    bottom: 28,
    left: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 32,
  },

  scrollContentDesktop: {
    paddingHorizontal: 28,
    paddingTop: 42,
    paddingBottom: 40,
  },

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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4ECE6',
    top: 350,
    left: 72,
  },

  decorDotFour: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F2EE',
    top: 120,
    right: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },

  headerMobile: {
    marginTop: 22,
    alignItems: 'flex-start',
  },

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

  headerTextBox: {
  flex: 1,
  marginLeft: 10,
  marginBottom: 20, // espaçamento do subtitulo
},
  pageTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#17262F',
  },

  pageSubtitle: {
  fontSize: 15,
  color: '#6B7C86',
  marginTop: 10, // aumenta esse valor para dar espaçamento
  lineHeight: 21,
  fontWeight: '400',
},

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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#087A73',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#6B7C86',
    marginTop: 2,
  },

  grid: {
    gap: 14,
  },

  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 16,
  },

  field: {
    width: '100%',
  },

  fieldDesktop: {
    width: '48.8%',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#17262F',
    marginBottom: 8,
  },

  inputIconBox: {
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#17262F',
    fontWeight: '400',
  },

  obsBox: {
    marginTop: 16,
  },

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

  counter: {
    fontSize: 12,
    color: '#7E8D9B',
    marginTop: 8,
  },

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

  autoTextBox: {
    flex: 1,
  },

  autoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#17262F',
  },

  autoSubtitle: {
    fontSize: 13,
    color: '#61717B',
    marginTop: 3,
  },

  buttonsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  buttonsMobile: {
    flexDirection: 'column-reverse',
  },

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

  cancelText: {
    fontSize: 15,
    color: '#60768A',
    fontWeight: '500',
  },

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

  saveText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});