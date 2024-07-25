import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

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
      <Button
        onClick={async () => {
          await chrome.runtime.sendMessage({
            action: "capture",
            data: { start: true },
          });
        }}
      >
        Start
      </Button>
      <Button
        onClick={async () => {
          await chrome.runtime.sendMessage({
            action: "capture",
            data: { start: false },
          });
        }}
      >
        Stop
      </Button>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Popup />);
