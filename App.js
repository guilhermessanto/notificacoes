import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

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
  const [dados, setDados] = useState(null);
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

    /* Obter permissões atuais do dispositivo */
    Notifications.getPermissionsAsync().then((status) => {
      if (status.granted) {
        /* Permissões OK? então vamos obter o token expo do aparelho */
        Notifications.getExpoPushTokenAsync().then((token) => {
          console.log(token);
        });
      }
    });

    /* Ouvinte de evento para as notificações recebidas, ou seja, quando a notificação aparece no topo da tela do dispositivo  */
    Notifications.addNotificationReceivedListener((notificacao) => {
      console.log(notificacao);
    });
    /* Ouvinte de evento para as respostas dads ás notificações,ou seja, quando o usuario interage(toca) na notificação */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      console.log(resposta.notification.request.content.data);
      setDados(resposta.notification.request.content.data);
    });
  }, []);

  const enviarMensagem = async () => {
    const mensagem = {
      title: "Lembrete!  🤬 ",
      body: "Não esqueça de tomar água",
      data: { usuario: "Jorge", cidade: "São gonçalo" },
      sound: Platform.OS === "ios" ? "default" : "",
    };
    /* Função de agendamento de notificações */
    await Notifications.scheduleNotificationAsync({
      content: mensagem,
      trigger: { seconds: 2 },
    });
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text>Exemplo de sistema de notificação Push</Text>
        <Button title="Disparar notificação" onPress={enviarMensagem} />
        {dados && (
          <View style={styles.conteudo}>
            <Text>{dados.usuario}</Text>
            <Text>{dados.cidade}</Text>
          </View>
        )}
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
  conteudo: {
    marginVertical: 8,
    backgroundColor: "yellow",
  },
});
