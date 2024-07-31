import { useEffect, useState } from "react";

const useDebounce = <T>(val: T, delayMs = 500) => {
  const [debounceVal, setDebounceVal] = useState(val);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceVal(val);
    }, delayMs);
    return () => clearTimeout(timeOut);
  }, [delayMs, val]);
  return debounceVal;
};

export default useDebounce;
