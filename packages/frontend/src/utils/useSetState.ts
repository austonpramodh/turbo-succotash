import { useState } from 'react';

const useSetState = <T>(
  initialState: T,
): [T, (newState: Partial<T> | ((state: T) => T)) => void] => {
  const [state, regularSetState] = useState<T>(initialState);

  const setState = (newState: Partial<T> | ((state: T) => T)): void => {
    if (typeof newState === 'function') {
      regularSetState(newState);

      return;
    }
    regularSetState((prevState) => ({
      ...prevState,
      ...newState,
    }));

    return;
  };

  return [state, setState];
};

export default useSetState;
