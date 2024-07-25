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

function handleMessage(message, sender, sendResponse) {
  if (message.type === "click") {
    takeScreenshot((screenshot) => {
      sendEventData(message.type, message.event, screenshot);
    });
  } else if (message.type === "keystrokes") {
    takeScreenshot((screenshot) => {
      sendEventData(message.type, message.event, screenshot);
    });
  }
}

function takeScreenshot(callback) {
  chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
    callback(dataUrl);
  });
}

function sendEventData(type, event, screenshot) {
  console.log("Event type: ", type);
  console.log("Event: ", event);
  console.log("Screenshot: ", screenshot);

  fetch("http://localhost:3000/api/capture", {
    method: "POST",
    body: JSON.stringify({ type, event, screenshot }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const startCapturing = () => {
  chrome.runtime.onMessage.addListener(handleMessage);
  console.log("Starting capturing");
};

const stopCapturing = () => {
  chrome.runtime.onMessage.removeListener(handleMessage);
  console.log("Stopping capturing");
};
