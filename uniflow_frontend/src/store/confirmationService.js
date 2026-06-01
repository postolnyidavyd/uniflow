let confirmCallback = null;

export const setConfirmCallback = (callback) => {
  confirmCallback = callback;
};

export const executeConfirmCallback = () => {
  if (confirmCallback) {
    confirmCallback();
  }
};
