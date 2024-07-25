import { getCurrentTokenCookie, getDomainCookies } from "../utils/auth";

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
  } else if (message.action === "fetchClientData") {
    clientDataFetcher()
      .then((data) => {
        console.log("Client data fetched: ", data);
        sendResponse({ data });
      })
      .catch((error) => {
        console.log("Error fetching client data: ", error);
        sendResponse({ error });
      });
    return true;
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

async function clientDataFetcher() {
  const tokenCookie = await getCurrentTokenCookie();

  if (tokenCookie) {
    const token = tokenCookie.value;

    // send token to the backend as a cookie to /api/me endpoint to get user info

    const response = await fetch("http://localhost:3000/api/me", {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    const data = await response.json();
    return data.token;
  }
}

const startCapturing = () => {
  chrome.runtime.onMessage.addListener(handleMessage);
  console.log("Starting capturing");
};

const stopCapturing = () => {
  chrome.runtime.onMessage.removeListener(handleMessage);
  console.log("Stopping capturing");
};
