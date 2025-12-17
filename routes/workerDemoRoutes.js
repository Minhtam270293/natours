const express = require('express');
const { Worker } = require('worker_threads');
const path = require('path');

const router = express.Router();

// Default route for worker demo
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Worker Demo API',
    availableRoutes: {
      '/': 'This info page',
      '/quick-test': 'Test route - responds immediately',
      '/count-blocking': 'Blocking route example',
      '/count-worker': 'Non-blocking worker thread example',
    },
  });
});

// Blocking route - will block the event loop
router.get('/count-blocking', (req, res) => {
  let count = 0;
  // This will block the event loop
  for (let i = 0; i < 100000000000; i++) {
    count++;
  }
  res.json({
    status: 'success',
    count,
    message: 'This route blocked the event loop while counting',
  });
});

// Non-blocking route using worker thread
router.get('/count-worker', (req, res) => {
  const workerPath = path.join(
    __dirname,
    '..',
    'utils',
    'workers',
    'counter.js',
  );
  const worker = new Worker(workerPath);

  worker.on('message', (count) => {
    res.json({
      status: 'success',
      count,
      message: 'This route remained non-blocking while counting',
    });
  });

  worker.on('error', (error) => {
    res.status(500).json({
      status: 'error',
      message: 'Worker thread error',
      error: error.message,
    });
  });

  worker.postMessage('start');
});

// Test route to verify server responsiveness
router.get('/quick-test', (req, res) => {
  res.json({
    status: 'success',
    message: 'This route should respond immediately',
  });
});

module.exports = router;
