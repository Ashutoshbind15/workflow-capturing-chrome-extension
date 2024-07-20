chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    sendResponse("pong");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const data = message.data;
  const start = data?.start;

  if (message.action === "capture") {
    if (start) {
      chrome.storage.local.set({ overlay: true }).then(() => {
        console.log("Overlay set to true");
      });
      startCapturing();
    } else {
      chrome.storage.local.set({ overlay: false }).then(() => {
        console.log("Overlay set to false");
      });
      stopCapturing();
    }
  }

  return true;
});

const startCapturing = () => {
  console.log("Starting capturing");
};

const stopCapturing = () => {
  console.log("Stopping capturing");
};
