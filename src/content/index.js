import { createRoot } from "react-dom/client";
import Overlay from "../overlay/Overlay";
import { debouncedLogInput } from "../utils/captureevents";

document.addEventListener("click", (event) => {
  console.log("click");
  console.log(event.clientX, event.clientY);

  const docwidth = document.documentElement.clientWidth;
  const docheight = document.documentElement.clientHeight;

  console.log(docwidth, docheight);

  chrome.runtime.sendMessage({
    type: "click",
    event: event,
    data: { x: event.clientX, y: event.clientY, sx: docwidth, sy: docheight },
  });
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
