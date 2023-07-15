import { useState } from "react";

export function debounce(ms: number, callable: CallableFunction) {
  let timer = NaN;
  return (...args: any[]) => {
    return new Promise((resolve) => {
      if (! Number.isNaN(timer)) {
        clearTimeout(timer);
      }
      timer = window.setTimeout(() => {
        resolve(callable(...args))
      }, ms);
    });
  }
}

export function useDebounce(ms: number, callable: CallableFunction) {
  const [timer, setTimer] = useState(NaN);
  return (...args: any[]) => {
    return new Promise((resolve) => {
      if (! Number.isNaN(timer)) {
        clearTimeout(timer);
      }
      setTimer(window.setTimeout(() => {
        resolve(callable(...args))
      }, ms))
    });
  }
}