// arquivo app/solicitacao-reagendamento.tsx

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

// componente da tela de cadastro realizado com sucesso
export default function SolicitacaoReagendamentoScreen() {
  // define se é mobile ou desktop baseado na largura da tela
  const { width } = useWindowDimensions();

  // considera se é mobile quando a tela é menor que 900
  const isMobile = width < 900;

  const [motivo, setMotivo] = useState(''); // motivo do reagendamento
  const [estagiario, setEstagiario] = useState(''); // estagiario que solicitou reagendamento
  const [dataAtual, setDataAtual] = useState(''); // data atual da consulta
  const [novaData, setNovaData] = useState(''); // nova data desejada
  const [horario, setHorario] = useState(''); // novo horário escolhido
  const [enviado, setEnviado] = useState(false); // controla se a solicitação foi enviada

function enviarSolicitacao() {
  // marca a solicitação como enviada (muda a tela)
  setEnviado(true);
}

return (
  <LinearGradient
    colors={['#F4FBF8', '#EAF6F1', '#F8FCFA']} // fundo em degradê suave
    style={styles.background}
  >
    {/* círculos decorativos do fundo */}
    <View style={styles.circleOne} />
    <View style={styles.circleTwo} />
    <View style={styles.circleThree} />

    <ScrollView
      contentContainerStyle={styles.scroll} // centraliza e adiciona padding geral
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, isMobile && styles.containerMobile]}>

        <View style={styles.headerText}>

          {/* card principal */}
          <View
            style={[
              styles.card,
              enviado && styles.successCard, // muda estilo quando enviado
            ]}
          >

            {!enviado ? (
              <>
                {/* título do card */}
                <Text style={styles.cardTitle}>
                  Solicitar alteração de agendamento
                </Text>

                {/* subtítulo explicativo */}
                <Text style={styles.cardSubtitle}>
                  Preencha os dados abaixo para enviar a solicitação ao administrador.
                </Text>

                {/* campo estagiario */}
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Estagiário
                  </Text>

                  <TextInput
                    value={dataAtual}
                    onChangeText={setEstagiario}
                    placeholder="Nome do estagiário"
                    placeholderTextColor="#8B9A97"
                    style={styles.input}
                  />
                </View>

                {/* campo data atual */}
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Data atual
                  </Text>

                  <TextInput
                    value={dataAtual}
                    onChangeText={setDataAtual}
                    placeholder="12/06/2026"
                    placeholderTextColor="#8B9A97"
                    style={styles.input}
                  />
                </View>

                {/* campo nova data */}
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Nova data desejada
                  </Text>

                  <TextInput
                    value={novaData}
                    onChangeText={setNovaData}
                    placeholder="15/06/2026"
                    placeholderTextColor="#8B9A97"
                    style={styles.input}
                  />
                </View>

                {/* campo horário */}
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Novo horário
                  </Text>

                  <TextInput
                    value={horario}
                    onChangeText={setHorario}
                    placeholder="14:00"
                    placeholderTextColor="#8B9A97"
                    style={styles.input}
                  />
                </View>

                {/* campo motivo */}
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Motivo da solicitação
                  </Text>

                  <TextInput
                    value={motivo}
                    onChangeText={setMotivo}
                    placeholder="Explique o motivo do reagendamento..."
                    placeholderTextColor="#8B9A97"
                    multiline
                    style={styles.textArea}
                  />
                </View>

                {/* botão enviar */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={enviarSolicitacao}
                >
                  <Ionicons
                    name="send-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.buttonText}>Enviar solicitação</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* ícone de sucesso */}
                <View style={styles.successIcon}>
                  <Ionicons
                    name="checkmark-circle"
                    size={78}
                    color="#10B981"
                  />
                </View>

                {/* mensagem de sucesso */}
                <Text style={styles.successTitle}>
                  Solicitação enviada!</Text>

                <Text style={styles.successText}>
                  O administrador irá analisar o pedido de reagendamento.</Text>

                {/* botão voltar */}
                <TouchableOpacity
                  style={styles.backHomeButton}
                  onPress={() => router.push('/(tabs)')}
                >
                  <Text style={styles.backHomeText}>Voltar para agenda</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  </LinearGradient>
)};

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por seção
const styles = StyleSheet.create({

  // fundo principal da tela
  // ocupa toda a altura disponível
  background: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center', // centraliza conteúdo
    padding: 20,
  },

  circleOne: {
    // círculo decorativo superior esquerdo
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(12,112,110,0.08)',
    top: -120,
    left: -120,
  },

  circleTwo: {
    // círculo decorativo superior direito
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.7)',
    right: 40,
    top: 120,
  },

  circleThree: {
    // círculo decorativo inferior direito
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(166,189,184,0.16)',
    bottom: -180,
    right: -160,
  },

  container: {
    width: '100%',
    alignItems: 'center', // centraliza card
  },

  containerMobile: {
  // ajusta alinhamento quando está no mobile
  justifyContent: 'flex-start',
  },

  headerText: {
    // área do título no topo do card
    width: '100%',
    maxWidth: 520,
    marginBottom: 18,
  },

  title: {
    // título principal da tela
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    color: '#152322',
  },

  card: {
    // card principal do formulário
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 24,
    marginTop: 14,
  },

  successCard: {
    // mesmo card no estado de sucesso
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E9E6',
    padding: 24,
    marginTop: 14,
  },

  iconBox: {
  // círculo do ícone no topo do card de sucesso
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: '#EAF6F2',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 16,
},

cardTitle: {
  // título principal do card
  fontSize: 22,
  fontWeight: '600',
  color: '#152322',
},

cardSubtitle: {
  // texto explicativo abaixo do título
  fontSize: 14,
  color: '#6B7C83',
  marginTop: 6,
  marginBottom: 22,
  lineHeight: 21,
},

field: {
  // bloco de cada campo do formulário
  marginBottom: 16,
},

label: {
  // label dos inputs
  fontSize: 13,
  color: '#152322',
  marginBottom: 8,
  fontWeight: '500',
},

input: {
  // campo de texto padrão
  height: 48,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#DDE8E5',
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
  fontSize: 14,
  color: '#152322',
},

textArea: {
  // campo de texto grande (motivo)
  minHeight: 100,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#DDE8E5',
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
  paddingTop: 16,
  fontSize: 14,
  color: '#152322',
  textAlignVertical: 'top',
},

button: {
  // botão de enviar solicitação
  height: 54,
  borderRadius: 16,
  backgroundColor: '#0C706E',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 8,
  marginTop: 8,
},

buttonText: {
  // texto do botão principal
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '600',
},

successIcon: {
  // ícone de sucesso (check)
  alignItems: 'center',
  marginBottom: 18,
},

successTitle: {
  // título da tela de sucesso
  fontSize: 26,
  fontWeight: '600',
  color: '#152322',
  textAlign: 'center',
},

successText: {
  // texto explicando o sucesso do envio
  fontSize: 15,
  color: '#6B7C83',
  textAlign: 'center',
  marginTop: 10,
  lineHeight: 23,
  marginBottom: 32,
},

backHomeButton: {
  // botão para voltar para agenda
  height: 54,
  borderRadius: 16,
  backgroundColor: '#0C706E',
  justifyContent: 'center',
  alignItems: 'center',
},

backHomeText: {
  // texto do botão de voltar
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '600',
},
});