import React, { useEffect, useCallback, useRef } from 'react';

const TOAST_TIMEOUT = 3000;

export function sendToast(message: string): string {
  const guid = Math.random().toString(16).slice(2);
  const toastEvent = new CustomEvent('toast', {detail: JSON.stringify({guid, message})});
  window.dispatchEvent(toastEvent);
  return guid;
}

export function deleteToast(guid: string) {
  const deleteToastEvent = new CustomEvent('delete_toast', {detail: guid});
  window.dispatchEvent(deleteToastEvent);
}

type ToastItem = {
  guid: string;
  message: string;
}

export const Toaster : React.FC = () => {
  const toastRef = useRef<HTMLUListElement|null>(null)
  const toastHandler = useCallback((e: CustomEvent)  => {
    const toast : ToastItem = JSON.parse(e.detail)
    if (toastRef.current) {
      const li = document.createElement('li');
      li.setAttribute('id', 'toast_' + toast.guid);
      li.setAttribute('class', 'toasts__item');
      li.textContent = toast.message;
      toastRef.current.appendChild(li);
    }
    setTimeout(() => {
      deleteToast(toast.guid)
    }, TOAST_TIMEOUT);
  }, [toastRef]);

  const deleteToastHandler = useCallback((e: CustomEvent) => {
    const guid = e.detail;
    if (toastRef.current) {
      const toastElement = toastRef.current.querySelector('#toast_' + guid);
      if (toastElement) {
        toastRef.current.removeChild(toastElement);
      }
    }
  }, [toastRef]);

  useEffect(() => {
    window.addEventListener('toast', toastHandler as EventListener);
    window.addEventListener('delete_toast', deleteToastHandler as EventListener);
    return () => {
      window.removeEventListener('toast', toastHandler as EventListener);
      window.removeEventListener('delete_toast', deleteToastHandler as EventListener);
    };
  }, [toastHandler, deleteToastHandler]);

  return (<ul className="toasts" ref={toastRef}></ul>);
}