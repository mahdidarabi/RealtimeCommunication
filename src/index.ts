import { WebSocket } from 'ws';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const krakenPublicWebSocketURL = 'wss://ws.kraken.com';
const krakenPublicWebSocketSubscriptionMsg = {
  event: 'subscribe',
  pair: ['XBT/USD', 'XBT/EUR', 'ADA/USD'],
  subscription: { name: 'ticker' },
};
const appPort = 8080;

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
      io.emit('updateAsk', { symbol, ask });
    }
  });

  webSocketClient.on('close', function close() {
    console.log('close');
  });
} catch (e) {
  console.log(e);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/client/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(appPort, () => {
  console.log('API is running\n', `PORT: ${appPort}\n`, `TIME: ${new Date()}`);
});
