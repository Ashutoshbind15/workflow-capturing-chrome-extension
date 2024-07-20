import { useEffect } from "react";
import { createRoot } from "react-dom/client";

function Popup() {
  useEffect(() => {
    console.log("Content popup mounted");
    const helper = async () => {
      const res = await chrome.runtime.sendMessage({ action: "ping" });
      console.log(res);
    };

    helper();
  }, []);

  return (
    <div>
      <h1>Popup Content</h1>
      {/* Add more content here */}
      <button
        onClick={async () => {
          await chrome.runtime.sendMessage({
            action: "capture",
            data: { start: true },
          });
        }}
      >
        Start
      </button>
      <button
        onClick={async () => {
          await chrome.runtime.sendMessage({
            action: "capture",
            data: { start: false },
          });
        }}
      >
        Stop
      </button>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Popup />);
