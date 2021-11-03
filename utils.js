const debouncer = (cb, delay = 1000) => {
    let setTimeId;
    return (...args) => {
      if (setTimeId) {
        clearTimeout(setTimeId);
      }
      setTimeId = setTimeout(() => {
        cb.apply(null, args);
      }, delay);
    };
  };