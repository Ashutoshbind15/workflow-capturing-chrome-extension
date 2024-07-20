import { createRoot } from "react-dom/client";
import Overlay from "../overlay/Overlay";

const div = document.createElement("div");
div.id = "overlay";
document.body.appendChild(div);
const root = createRoot(div);
root.render(<Overlay />);
