import { WebSocket } from 'ws';

const krakenPublicWebSocketURL = 'wss://ws.kraken.com';
const krakenPublicWebSocketSubscriptionMsg = {
  event: 'subscribe',
  pair: ['XBT/USD', 'XBT/EUR', 'ADA/USD'],
  subscription: { name: 'ticker' },
};

try {
  const webSocketClient = new WebSocket(krakenPublicWebSocketURL);

  webSocketClient.on('open', function open() {
    webSocketClient.send(JSON.stringify(krakenPublicWebSocketSubscriptionMsg));
  });

  webSocketClient.on('message', function incoming(wsMsg: string) {
    const wsMsgObject = JSON.parse(wsMsg.toString());

    if (wsMsgObject[2] === 'ticker') {
      const symbol = wsMsgObject[3];
      const ask = wsMsgObject[1].a[0];

      console.log('Symbol: ', symbol, ', ask: ', ask);
    }
  });

  webSocketClient.on('close', function close() {
    console.log('close');
  });
} catch (e) {
  console.log(e);
}
