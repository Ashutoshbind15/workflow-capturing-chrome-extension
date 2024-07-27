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

      startCapturing()
        .then((res) => {
          console.log("Capturing started");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      chrome.storage.local.set({ overlay: false }).then(() => {
        console.log("Overlay set to false");
      });

      stopCapturing()
        .then((res) => {
          console.log("Capturing ended");
        })
        .catch((e) => {
          console.log(e);
        });
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
    const response = await fetch("http://localhost:3000/api/me");

    const data = await response.json();
    return data.token;
  }
}

const startCapturing = async () => {
  await checkpointer("start");
  chrome.runtime.onMessage.addListener(handleMessage);
  console.log("Starting capturing");
};

const stopCapturing = async () => {
  const data = await checkpointer("stop");
  const redirectid = data.wid;

  // new tab with the redirect URL

  const redirectUrl = `http://localhost:3000/redirect/${redirectid}`;
  chrome.tabs.create({ url: redirectUrl });
  chrome.runtime.onMessage.removeListener(handleMessage);
  console.log("Stopping capturing");
};

const checkpointer = async (eventname) => {
  const tokenCookie = await getCurrentTokenCookie();
  const token = tokenCookie.value;
  if (!token) {
    throw new Error("No token found");
  } else {
    const response = await fetch(
      "http://localhost:3000/api/capture/checkpoint",
      {
        method: "POST",
        headers: {
          Cookie: `token=${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: eventname }),
      }
    );

    const data = await response.json();
    return data;
  }
};
