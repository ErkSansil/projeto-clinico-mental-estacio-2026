// arquivo app/faltas.tsx

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
  TouchableOpacity,
  // componente base de estrutura e layout
  View,
  // hook que pega largura e altura da tela em tempo real
  // usado para responsividade entre mobile e desktop 
  useWindowDimensions,

} from 'react-native';

// navegação
import { useRouter } from 'expo-router';

// componentes do projeto
import { BrandHeader, Screen, SectionCard } from '@/components/clinic-ui';

// lista simulada de faltas (como se viesse do backend) :contentReference[oaicite:0]{index=0}
const faltas = [
  {
    paciente: 'Ana Silva',
    presencas: 6,
    faltas: 2,
    ultimaConsulta: '10/06/2026',
    observacao: 'Faltou sem aviso prévio.',
  },
  {
    paciente: 'Pedro Henrique',
    presencas: 4,
    faltas: 3,
    ultimaConsulta: '11/06/2026',
    observacao: 'Necessita acompanhamento mais próximo.',
  },
  {
    paciente: 'Julia Alves',
    presencas: 8,
    faltas: 1,
    ultimaConsulta: '12/06/2026',
    observacao: 'Boa frequência nas sessões.',
  },
];

// tela de controle de faltas
export default function FaltasScreen() {

  // pegando largura da tela pra responsividade
  const { width } = useWindowDimensions();

  // hook de navegação
  const router = useRouter();

  // verificando tipo de dispositivo
  const isSmallMobile = width <= 360;
  const isMobile = width <= 430;

  // ajustes dinâmicos de layout conforme tela
  const horizontalPadding = isSmallMobile ? 12 : isMobile ? 14 : 20;
  const cardPadding = isSmallMobile ? 12 : isMobile ? 14 : 16;
  const patientFont = isSmallMobile ? 16 : isMobile ? 17 : 18;
  const metaFont = isSmallMobile ? 13 : isMobile ? 14 : 14;
  const obsFont = isSmallMobile ? 13 : isMobile ? 14 : 14;

  // início da renderização da tela
  return (
    <Screen>
      {/* scroll para permitir rolagem */}
      <ScrollView
        contentContainerStyle={[
          styles.content,

          // padding dinâmico
          {
            paddingBottom: isMobile ? 18 : 24,
            paddingTop: isMobile ? 8 : 12,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔙 BOTÃO VOLTAR */}
        <TouchableOpacity
          style={styles.backButton}

          // aqui eu volto para o painel administrativo
          onPress={() => router.replace('/acesso-administrador')}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        {/* header da tela */}
        <BrandHeader title="Controle de Faltas" centered />

        {/* container principal */}
        <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>

          {/* card principal */}
          <SectionCard title="Histórico de Presença" tone="green">

            {/* percorrendo lista de faltas */}
            {faltas.map((item, index) => (

              // card individual
              <View
                key={index}
                style={[
                  styles.card,

                  // ajustes responsivos
                  {
                    padding: cardPadding,
                    borderRadius: isMobile ? 16 : 18,
                    marginBottom: isMobile ? 10 : 12,
                  },
                ]}
              >

                {/* nome do paciente */}
                <Text
                  style={[
                    styles.patient,
                    {
                      fontSize: patientFont,
                      marginBottom: isMobile ? 6 : 8,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.paciente}
                </Text>

                {/* grupo de informações */}
                <View style={styles.infoGroup}>

                  {/* quantidade de presenças */}
                  <Text
                    style={[
                      styles.meta,
                      {
                        fontSize: metaFont,
                        lineHeight: isMobile ? 20 : 22,
                      },
                    ]}
                  >
                    Presenças: {item.presencas}
                  </Text>

                  {/* quantidade de faltas */}
                  <Text
                    style={[
                      styles.meta,
                      {
                        fontSize: metaFont,
                        lineHeight: isMobile ? 20 : 22,
                      },
                    ]}
                  >
                    Faltas: {item.faltas}
                  </Text>

                  {/* última consulta */}
                  <Text
                    style={[
                      styles.meta,
                      {
                        fontSize: metaFont,
                        lineHeight: isMobile ? 20 : 22,
                      },
                    ]}
                  >
                    Última consulta: {item.ultimaConsulta}
                  </Text>
                </View>

                {/* caixa de observação */}
                <View style={styles.observationBox}>

                  <Text
                    style={[
                      styles.observation,
                      {
                        fontSize: obsFont,
                        lineHeight: isMobile ? 20 : 22,
                      },
                    ]}
                  >
                    {/* label da observação */}
                    <Text style={styles.observationLabel}>Obs.:</Text>{' '}

                    {/* texto da observação */}
                    {item.observacao}
                  </Text>
                </View>
              </View>
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </Screen>
  );
}

// criação centralizada dos estilos da tela
// aqui ficam todas as estilizações da interface organizadas por seção
const styles = StyleSheet.create({

  // espaçamento geral
  content: {
    paddingBottom: 24,
  },

  // botão voltar
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E8F3EF',
    borderRadius: 12
  },

  // texto do botão voltar
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#244043'
  },

  // container centralizado
  container: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },

  // card de cada paciente
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EBE8',
    alignSelf: 'center',
  },

  // nome do paciente
  patient: {
    fontWeight: '800',
    color: '#244043',
  },

  // grupo de informações
  infoGroup: {
    marginTop: 2,
  },

  // textos secundários
  meta: {
    color: '#6B7A7A',
    marginBottom: 4,
  },

  // caixa da observação
  observationBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF3F1',
  },

  // texto da observação
  observation: {
    color: '#244043',
  },

  // label "Obs."
  observationLabel: {
    fontWeight: '800',
    color: '#244043',
  },
});