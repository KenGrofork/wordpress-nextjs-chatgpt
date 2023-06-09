// Wait for Crisp to load
window.CRISP_READY_TRIGGER = function () {
  // Change the chat position
  window.$crisp.push(["do", "chat:position", ["right", "bottom"]]);

  // Change the chat offset
  window.$crisp.push(["do", "chat:offset", [20, 20]]);

  // Change the chat button color
  window.$isp.push(["do", "chat:set-color", "#FF0000"]);

  // Change the chat button text
  window.$crisp.push(["do", "chat:set-text", "Need help?"]);
};
