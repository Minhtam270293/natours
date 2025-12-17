const { parentPort } = require('worker_threads');

parentPort.on('message', () => {
  let count = 0;
  for (let i = 0; i < 100000000000; i++) {
    count++;
  }
  parentPort.postMessage(count);
});
