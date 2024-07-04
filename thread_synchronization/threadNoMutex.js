let counter = 0;

self.onmessage = function (event) {
  if (event.data === 'start') {
    simulateThreadWithoutMutex('Thread without Mutex');
  }
};

function simulateThreadWithoutMutex(threadName) {
  for (let i = 0; i < 10; i++) {
    // Simulate some work
    const delay = Math.random() * 1000;
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < delay) {
      // Delay
    }

    const currentValue = counter;
    counter = currentValue + 1;
    self.postMessage(`${threadName} - Counter: ${counter}`);
  }
}
