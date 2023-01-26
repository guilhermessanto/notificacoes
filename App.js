import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  StatusBar,
} from "react-native";

import * as Notifications from "expo-notifications";
import { useEffect } from "react";

/* Manipulador de eventos e notificação */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    /* Necessário para IOS */
    async function permissoesIos() {
      return await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
          allowAnnouncements: true,
        },
      });
    }
    permissoesIos();
    /* Ouvinte de evento para as notificações recebidas, ou seja, quando a notificação aparece no topo da tela do dispositivo  */
    Notifications.addNotificationReceivedListener((notificacao) => {
      console.log(notificacao);
    });
    /* Ouvinte de evento para as respostas dads ás notificações,ou seja, quando o usuario interage(toca) na notificação */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      console.log(resposta);
    });
  }, []);

  const enviarMensagem = async () => {
    const mensagem = {
      title: "Lembrete!",
      body: "Não esqueça de tomar água",
    };
    /* Função de agendamento de notificações */
    await Notifications.scheduleNotificationAsync({
      content: mensagem,
      trigger: { seconds: 2 },
      sound: "default",
    });
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text>Exemplo de sistema de notificação local</Text>
        <Button title="Disparar notificação" onPress={enviarMensagem} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
