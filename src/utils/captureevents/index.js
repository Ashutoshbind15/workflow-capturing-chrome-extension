function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// The actual function to execute once the user stops typing for a specified duration
function logInput(event) {
  console.log(
    "Input/Text change on element:",
    event.target,
    "Value:",
    event.target.value
  );

  chrome.runtime.sendMessage({ type: "keystrokes", event: event });
}

export const debouncedLogInput = debounce(logInput);
