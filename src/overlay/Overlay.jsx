import React, { useEffect, useState } from "react";

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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      ></div>
    );
  } else {
    return null;
  }
};

export default Overlay;
