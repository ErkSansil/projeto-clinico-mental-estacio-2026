// import principal das notificações do Expo
import * as Notifications from 'expo-notifications';

// import para verificar se está em dispositivo físico
import * as Device from 'expo-device';

// import de informações da plataforma (android / ios)
import { Platform } from 'react-native';


// configuração padrão das notificações recebidas
Notifications.setNotificationHandler({

  // define como a notificação será exibida
  handleNotification: async () => ({

    // mostra banner no celular
    shouldShowBanner: true,

    // mostra na central/lista de notificações
    shouldShowList: true,

    // toca som ao receber notificação
    shouldPlaySound: true,

    // não altera contador de notificações do app
    shouldSetBadge: false,
  }),
});


// função responsável por pedir permissão de notificação
export async function registerForPushNotificationsAsync() {

  // verifica se está em um celular físico
  if (!Device.isDevice) {

    // notificações push não funcionam corretamente em emuladores
    alert('Use um dispositivo físico para notificações');

    return;
  }

  // pega o status atual da permissão
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  // variável que vai armazenar o status final
  let finalStatus = existingStatus;

  // se ainda não tiver permissão
  if (existingStatus !== 'granted') {

    // solicita permissão ao usuário
    const { status } =
      await Notifications.requestPermissionsAsync();

    // salva o novo status
    finalStatus = status;
  }

  // se o usuário negar a permissão
  if (finalStatus !== 'granted') {

    // exibe alerta
    alert('Permissão de notificação negada');

    return;
  }

// gera token do dispositivo para push notifications
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'f48a621d-af6b-4b10-a77a-a1e17de91ef8',
});

  // mostra o token no console do terminal
  console.log('TOKEN EXPO:', token.data);

  // retorna o token
  return token.data;
}


// função para criar uma notificação local no celular
export async function sendLocalNotification(

  // título da notificação
  title: string,

  // mensagem da notificação
  body: string
) {

  // agenda/dispara a notificação
  await Notifications.scheduleNotificationAsync({

    // conteúdo da notificação
    content: {

      // título
      title,

      // mensagem
      body,

      // ativa som
      sound: true,
    },

    // null = envia imediatamente
    trigger: null,
  });
}