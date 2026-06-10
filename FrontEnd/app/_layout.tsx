import { Stack } from 'expo-router';
// aqui eu importo a barra de status do celular
import { StatusBar } from 'expo-status-bar';

// importa o provider de autenticação para compartilhar token e dados entre telas
import { AuthProvider } from '../contexts/AuthContext';

// esse é o layout principal do app, onde eu organizo todas as rotas da pasta app
export default function RootLayout() {
  return (
    // envolve toda a aplicação com o contexto de autenticação
    <AuthProvider>
      {/* aqui eu deixo o index como primeira tela, porque o index é o meu login */}
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>

        {/* tela inicial do app: login */}
        <Stack.Screen name="login" />

        {/* tela de escolha do tipo de cadastro */}
        <Stack.Screen name="cadastro" />

        {/* tela de dados pessoais do cadastro */}
        <Stack.Screen name="dados-pessoais" />

        {/* tela de dados de acesso do cadastro */}
        <Stack.Screen name="dados-acesso" />

        {/* tela de cadastro realizado com sucesso */}
        <Stack.Screen name="cadastro-sucesso" />

        {/* tela para redefinir senha */}
        <Stack.Screen name="redefinir-senha" />

        {/* grupo de abas do usuário comum, onde ficam agenda, pacientes, salas, avisos e perfil */}
        <Stack.Screen name="(tabs)" />

        {/* tela principal do administrador */}
        <Stack.Screen name="acesso-administrador" />

        {/* calendário do administrador */}
        <Stack.Screen name="calendario-administrador" />

        {/* tela de criação de novo agendamento */}
        <Stack.Screen name="novo-agendamento" />

        {/* tela exibida depois que o agendamento é feito */}
        <Stack.Screen name="agendamento-sucesso" />

        {/* tela de detalhes do paciente */}
        <Stack.Screen name="paciente-detalhe" />

        {/* tela de cancelamentos */}
        <Stack.Screen name="cancelamentos" />

        {/* tela de faltas */}
        <Stack.Screen name="faltas" />

        {/* tela administrativa de salas */}
        <Stack.Screen name="salas-admin" />

        {/* tela administrativa de pacientes */}
        <Stack.Screen name="pacientes-admin" />

      </Stack>

      {/* aqui eu configuro a cor da barra de status do celular */}
      <StatusBar style="light" />
    </AuthProvider>
  );
}
