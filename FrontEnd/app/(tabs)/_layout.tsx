// importação principal do React, pois é necessário para criar componentes React Native.
import React from 'react';
// importação das Tabs, que é a navegação de baixo no mobile.
import { Image } from 'react-native';
// importanto imagens de icones
import { Tabs } from 'expo-router';
// importação dos ícones usados nas abas
import { Ionicons } from '@expo/vector-icons';
// importação da largura da tela para saber se está no desktop ou mobile
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
        name="index"
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

      {/* segunda aba: pacientes */}
      <Tabs.Screen
        name="pacientes"
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
        name="salas"
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

      {/* quarta aba: notificações */}
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',

          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/notificacoes.png')}
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

      {/* quinta aba: perfil */}
      <Tabs.Screen
        name="perfil"
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
