import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function addToast(message) {
    setToasts([...toasts, { id: Date.now(), message }]);
  }

  function removeToast(id) {
    setToasts(toasts.filter(toast => toast.id !== id));
  }

  return { toasts, addToast, removeToast };
}
