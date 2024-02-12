import makeWASocket, { AnyMessageContent, DisconnectReason, useMultiFileAuthState} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

const establishWhatsAppConnection = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('../Tabeeb');
  const client = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['Tabeeb', 'Chrome', 'Firefox'],
    
  });
  client.ev.on('creds.update', saveCreds);
  return client
}

export const login = async () => {
  const client = await establishWhatsAppConnection();

  client.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr} = update
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      if(shouldReconnect) {
        login();
      }
    }
  });
}

const logout = async () => {

}

const sendMessage = async (phone: string, content: AnyMessageContent) => {
  const client = await establishWhatsAppConnection();
  client.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr} = update
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      if(shouldReconnect) {
        sendMessage(phone, content);
      }
    }
    else if(connection === 'open') {
      await client.sendMessage(`2${phone}@s.whatsapp.net`, content);
    }
  });
}

export const sendTextMessage = async (phone: string, message: string) => {
  await sendMessage(phone, {text: message});
}

export const sendImageMessage = async (phone: string, image: string, caption: string) => {
  await sendMessage(phone, {
    image: {
      url: image
    },
    caption
  });
}