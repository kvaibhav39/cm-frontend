import { useEffect, useState } from "react";

const useTimer = (timer = 500) => {
  const [state, setState] = useState(true);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setState(false);
    }, timer);

    return () => clearTimeout(timeout);
  }, [timer]);

  return [state, setState];
};

export default useTimer;
