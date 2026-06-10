// serviço responsável por gerenciar notificações internas do app

export type NotificationItem = {
  id: string; // id único da notificação
  title: string; // título da notificação
  message: string; // mensagem principal
  date: string; // data de criação
  read: boolean; // se foi lida ou não
};


// lista local temporária (depois vem do backend)
let notifications: NotificationItem[] = [];


// adiciona nova notificação
export function addNotification(title: string, message: string) {

  const newNotification: NotificationItem = {
    id: String(Date.now()), // gera id simples baseado no tempo
    title,
    message,
    date: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(newNotification); // coloca no topo

  return newNotification;
}


// retorna todas as notificações
export function getNotifications() {
  return notifications;
}


// marca como lida
export function markAsRead(id: string) {

  notifications = notifications.map(item =>
    item.id === id ? { ...item, read: true } : item
  );
}


// limpa todas
export function clearNotifications() {
  notifications = [];
}