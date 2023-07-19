import { RefObject, useCallback, useEffect } from "react";

export function useFocusTrap<T extends HTMLElement>(elementRef: RefObject<T>, isActive: () => boolean) {
  
  const onFocusIn = useCallback(() => {
    if (isActive() && elementRef.current !== null) {
      const focusables: Element[] = Array.from(elementRef.current?.querySelectorAll('a, button, [tabindex="0"]')||[]);
      if (document.activeElement !== null && focusables.indexOf(document.activeElement) === -1) {
        (focusables[0] as HTMLElement).focus();
      }
    }
  }, [elementRef, isActive]);

  useEffect(() => {
    window.addEventListener('focusin', onFocusIn, false);
    return () => {
      window.removeEventListener('focusin', onFocusIn, false);
    }
  }, [onFocusIn]);
  
}