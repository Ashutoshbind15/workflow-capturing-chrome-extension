import React, { useEffect, useState } from "react";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    color: #ff5f5f;
  }
`;

const CapturingText = styled.span`
  font-size: 16px;
  margin-right: 10px;
`;

const Overlay = () => {
  const [isOverlay, setIsOverlay] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["overlay"]).then((result) => {
      console.log("Value is " + JSON.stringify(result));
      setIsOverlay(result.overlay);
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );

        if (key === "overlay") {
          setIsOverlay(newValue);
        }
      }
    });
  }, []);

  if (isOverlay) {
    return (
      <OverlayContainer>
        <CapturingText>Capturing...</CapturingText>
        <CloseButton
          onClick={async () => {
            await chrome.runtime.sendMessage({
              action: "capture",
              data: { start: false },
            });
          }}
        >
          &times;
        </CloseButton>
      </OverlayContainer>
    );
  } else {
    return null;
  }
};

export default Overlay;
