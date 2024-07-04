let mutex = false;
let counter = 0;

self.onmessage = function (event) {
  if (event.data === 'start') {
    simulateThreadWithMutex('Thread with Mutex');
  }
};

function simulateThreadWithMutex(threadName) {
  for (let i = 0; i < 10; i++) {
    acquireMutex();
    // Simulate some work
    const delay = Math.random() * 1000;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < delay) {
      // Delay
    }

    counter++;
    self.postMessage(`${threadName} - Counter: ${counter}`);
    releaseMutex();
  }
}

function acquireMutex() {
  while (mutex) {
    // Wait until mutex is released
  }
  mutex = true;
}

function releaseMutex() {
  mutex = false;
}
