import { createRoot } from "react-dom/client";
import Overlay from "../overlay/Overlay";
import { debouncedLogInput } from "../utils/captureevents";

document.addEventListener("click", (event) => {
  console.log("click");
  chrome.runtime.sendMessage({ type: "click", event: event });
});

// Attach the debounced function to all input[type="text"] and textarea elements on the page
document.querySelectorAll('input[type="text"], textarea').forEach((element) => {
  element.addEventListener("input", debouncedLogInput);
});

const div = document.createElement("div");
div.id = "overlay";
document.body.appendChild(div);
const root = createRoot(div);
root.render(<Overlay />);
