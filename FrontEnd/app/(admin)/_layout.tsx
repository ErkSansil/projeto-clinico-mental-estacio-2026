// importação principal do React, pois é necessário para criar componentes React Native.
import React from 'react';
// importação das Tabs, que é a navegação de baixo no mobile.
import { Tabs } from 'expo-router';
// importação dos ícones usados nas abas

// importanto imagens de icones
import { Image } from 'react-native';

import { useWindowDimensions } from 'react-native';

// esse layout controla somente as telas que estão dentro da pasta tabs
export default function TabLayout() {
  // aqui pega a largura da tela
  const { width } = useWindowDimensions();

 // define se é mobile ou desktop baseado na largura da tela
  const isDesktop = width >= 900;

  return (
    <Tabs
      screenOptions={{
        // aqui esconde o cabeçalho padrão, porque as telas já têm o próprio layout
        headerShown: false,
        tabBarActiveTintColor: '#0C706E',
        tabBarInactiveTintColor: '#819392',

        // no desktop é escondido a barra de baixo, porque uso a sidebar lateral, 
        // portanto só é mostrado no mobile
        tabBarStyle: isDesktop
          ? { display: 'none' }
          : { height: 68, paddingBottom: 8, paddingTop: 8 },

        // aqui o texto da aba fica mais organizado
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      {/* primeira aba: agenda */}
      <Tabs.Screen
        name="acesso-administrador"
        options={{
          title: 'Agenda',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/agendamento.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* segunda aba: pacientes*/}
      <Tabs.Screen
        name="pacientes-administrador"
        options={{
          title: 'Pacientes',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/paciente.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* terceira aba: salas */}
      <Tabs.Screen
        name="salas-administrador"
        options={{
          title: 'Salas',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/salas.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* quarta aba: cancelamentos */}
      <Tabs.Screen
        name="cancelamentos"
        options={{
          title: 'Cancelamentos',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/cancelamento.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* quarta aba: cadastro de estagiários */}
      <Tabs.Screen
        name="cadastro-estagiario"
        options={{
          title: 'Estagiário',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/profissional.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* quinta aba: relatorio */}
      <Tabs.Screen
        name="relatorio-atendimentos"
        options={{
          title: 'Relatório',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/relatorio2.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />

      {/* sexta aba: perfil */}
      <Tabs.Screen
        name="perfil-administrador"
        options={{
          title: 'Perfil',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/perfil.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
