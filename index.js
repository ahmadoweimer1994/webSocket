const WebSocket = require('ws');

// Function to create a WebSocket connection for a given symbol
async function createWebSocket(symbol) {
  const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_4h`;
 

  const ws = new WebSocket(socketUrl);

  ws.on('open', () => {
    console.log(`Connected to ${symbol} 4-Hour Kline WebSocket`);
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.k) {
      const kline = message.k;
      console.log(`Symbol: ${symbol}`);
      console.log(`Open Time: ${new Date(kline.t)}`);
      console.log(`Open Price: ${kline.o}`);
      console.log(`High Price: ${kline.h}`);
      console.log(`Low Price: ${kline.l}`);
      console.log(`Close Price: ${kline.c}`);
      console.log(`Volume: ${kline.v}`);
      console.log(`Close Time: ${new Date(kline.T)}`);
      console.log(`Is Final Candle: ${kline.x}`);
      console.log('---------------------------');
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket Error for ${symbol}: ${error}`);
  });

  ws.on('close', (code, reason) => {
    console.log(`WebSocket Closed for ${symbol}. Code: ${code}, Reason: ${reason}`);
  });
}


async function fetchTradingPairs() {
  const { default: fetch } = await import('node-fetch'); // Dynamic import
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    const tradingPairs = data.symbols.map(symbolData => symbolData.symbol);
    return tradingPairs;
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    return [];
  }
}


async function main() {
  const tradingPairs = await fetchTradingPairs();
  tradingPairs.forEach(createWebSocket);
}

// Start the main function
main();

// Your list of currency pairs
