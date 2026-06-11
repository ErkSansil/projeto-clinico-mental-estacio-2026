// arquivo app/(admin)/relatorio-atendimentos.tsx
// tela de relatórios — gera Excel com agendamentos, cancelamentos e reagendamentos

import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';

import { useRouter } from 'expo-router';

// fundo gradiente
import { LinearGradient } from 'expo-linear-gradient';

// biblioteca para gerar arquivos Excel no navegador
import * as XLSX from 'xlsx';

// hook de autenticação para pegar o token JWT
import { useAuth } from '../../contexts/AuthContext';

// badge global de reagendamentos pendentes
import { useBadge } from '../../contexts/BadgeContext';

// serviço que busca os dados do relatório na API
import { exportarRelatorio } from '../../services/api';

export default function RelatorioAtendimentos() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const router = useRouter();
  const { token } = useAuth();

  // badge global de reagendamentos pendentes
  const { pendentesReagendamento } = useBadge();

  // controla o estado de carregamento enquanto o relatório é gerado
  const [gerando, setGerando] = useState(false);

  // tela para mobile — relatório só funciona no desktop pelo XLSX
  if (!isDesktop) {
    return (
      <View style={styles.mobileContainer}>
        <Text style={styles.mobileIcon}>💻</Text>
        <Text style={styles.mobileTitle}>Disponível apenas no desktop</Text>
        <Text style={styles.mobileText}>Os relatórios só podem ser gerados na versão desktop do sistema.</Text>
      </View>
    );
  }

  // gera o arquivo Excel com 3 abas: Agendamentos, Cancelamentos, Reagendamentos
  async function baixarRelatorio() {
    setGerando(true);
    try {
      const resultado = await exportarRelatorio(token!);

      if (resultado.status !== 200) {
        Alert.alert('Erro', 'Não foi possível buscar os dados. Tente novamente.');
        return;
      }

      const { atendimentos = [], cancelamentos = [], reagendamentos = [] } = resultado.dados;

      // aba 1 — todos os agendamentos com presença
      const linhasAgendamentos = atendimentos.map((item: any) => ({
        'ID Consulta':               item.consulta_id,
        'Paciente':                  item.paciente,
        'CPF Paciente':              item.cpf_paciente,
        'Profissional':              item.profissional,
        'Matrícula Profissional':    item.matricula_profissional,
        'Sala':                      item.sala,
        'Data':                      item.data,
        'Horário':                   item.horario,
        'Status':                    item.status,
        'Presença':                  item.presenca,
        'Observação':                item.observacao || '',
      }));

      // aba 2 — consultas canceladas
      const linhasCancelamentos = cancelamentos.map((item: any) => ({
        'ID Consulta':               item.consulta_id,
        'Paciente':                  item.paciente,
        'CPF Paciente':              item.cpf_paciente,
        'Profissional':              item.profissional,
        'Matrícula Profissional':    item.matricula_profissional,
        'Sala':                      item.sala,
        'Data':                      item.data,
        'Horário':                   item.horario,
        'Motivo Cancelamento':       item.motivo_cancelamento || '',
      }));

      // aba 3 — solicitações de reagendamento
      const linhasReagendamentos = reagendamentos.map((item: any) => ({
        'ID Solicitação':            item.solicitacao_id,
        'ID Consulta Original':      item.consulta_id,
        'Paciente':                  item.paciente,
        'CPF Paciente':              item.cpf_paciente,
        'Profissional':              item.profissional,
        'Matrícula Profissional':    item.matricula_profissional,
        'Sala':                      item.sala,
        'Data Original':             item.data_original,
        'Horário Original':          item.horario_original,
        'Nova Data':                 item.nova_data,
        'Novo Horário':              item.novo_horario,
        'Motivo':                    item.motivo || '',
        'Status Solicitação':        item.status_solicitacao,
      }));

      // cria o arquivo Excel com as 3 abas
      const arquivo = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(arquivo, XLSX.utils.json_to_sheet(linhasAgendamentos), 'Agendamentos');
      XLSX.utils.book_append_sheet(arquivo, XLSX.utils.json_to_sheet(linhasCancelamentos), 'Cancelamentos');
      XLSX.utils.book_append_sheet(arquivo, XLSX.utils.json_to_sheet(linhasReagendamentos), 'Reagendamentos');

      // faz o download direto no navegador
      XLSX.writeFile(arquivo, `relatorio-clinica-${new Date().toISOString().slice(0, 10)}.xlsx`);

    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <LinearGradient
      colors={['#F7FCFA', '#EEF8F5', '#F9FCFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.page}>

        {/* sidebar completa igual às demais telas admin */}
        <View style={styles.sidebar}>

          {/* logo */}
          <View style={styles.logoBox}>
            <Text style={styles.psi}>Ψ</Text>
            <View>
              <Text style={styles.logoText}>SEP</Text>
              <Text style={styles.logoSub}>Clínica de Psicologia</Text>
            </View>
          </View>

          {/* menu */}
          <View style={styles.menuArea}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/acesso-administrador')}
            >
              <Image source={require('../../assets/images/administrador.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Administrador</Text>
            </TouchableOpacity>

            <Text style={styles.menuLabel}>GERENCIAMENTO</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/calendario-administrador')}
            >
              <Image source={require('../../assets/images/agendamento.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Agendamentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/pacientes-admin')}
            >
              <Image source={require('../../assets/images/paciente.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Pacientes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/salas-admin')}
            >
              <Image source={require('../../assets/images/salas.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Salas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/cancelamentos')}
            >
              <Image source={require('../../assets/images/cancelamento.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Cancelamentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/pedidos-reagendamentos')}
            >
              <Image source={require('../../assets/images/reagendamento.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Pedidos Reagendamento</Text>

              {/* badge vermelho com contagem de reagendamentos pendentes */}
              {pendentesReagendamento > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{pendentesReagendamento}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/cadastro')}
            >
              <Image source={require('../../assets/images/estagiario.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Cadastrar Estagiário</Text>
            </TouchableOpacity>

            {/* item ativo */}
            <TouchableOpacity style={[styles.menuItem, styles.menuActive]}>
              <Image source={require('../../assets/images/relatorio2.png')} style={styles.menuIcon} />
              <Text style={[styles.menuText, styles.menuTextActive]}>Relatório Atendimentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/perfil-administrador')}
            >
              <Image source={require('../../assets/images/perfil.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* conteúdo principal */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* título */}
          <Text style={styles.title}>Relatório de Atendimentos</Text>
          <Text style={styles.subtitle}>
            Gere um arquivo Excel com todas as informações da clínica:{'\n'}
            agendamentos, cancelamentos e reagendamentos.
          </Text>

          {/* card de download */}
          <View style={styles.card}>

            <Image
              source={require('../../assets/images/excel.png')}
              style={styles.reportImage}
            />

            <Text style={styles.cardTitle}>Relatório Completo da Clínica</Text>

            <Text style={styles.cardDescription}>
              O arquivo Excel gerado contém 3 abas:{'\n'}
              • <Text style={{ fontWeight: '600' }}>Agendamentos</Text> — todas as consultas com presença{'\n'}
              • <Text style={{ fontWeight: '600' }}>Cancelamentos</Text> — consultas canceladas com motivo{'\n'}
              • <Text style={{ fontWeight: '600' }}>Reagendamentos</Text> — solicitações de reagendamento
            </Text>

            <TouchableOpacity
              style={[styles.downloadButton, gerando && { opacity: 0.6 }]}
              onPress={baixarRelatorio}
              disabled={gerando}
            >
              <Text style={styles.downloadButtonText}>
                {gerando ? 'Gerando arquivo...' : 'Baixar Relatório (.xlsx)'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
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

  sidebar: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#DCEBE7',
    paddingTop: 28,
  },

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

  // badge de notificação no item de menu
  menuBadge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto' as any,
    paddingHorizontal: 5,
  },

  // texto do badge de notificação
  menuBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#17262F',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7C86',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 520,
    lineHeight: 24,
  },

  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCEBE7',
    shadowColor: '#6B8F86',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  reportImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17262F',
    marginBottom: 14,
    textAlign: 'center',
  },

  cardDescription: {
    fontSize: 14,
    color: '#6B7C86',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },

  downloadButton: {
    backgroundColor: '#0C706E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  mobileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F7FB',
  },

  mobileIcon: {
    fontSize: 70,
    marginBottom: 20,
  },

  mobileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#17262F',
    textAlign: 'center',
    marginBottom: 12,
  },

  mobileText: {
    fontSize: 15,
    color: '#6B7C86',
    textAlign: 'center',
    lineHeight: 22,
  },
});
