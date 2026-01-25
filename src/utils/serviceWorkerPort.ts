import { useEffect, useRef, useCallback } from 'react';

export const useServiceWorkerPort = (portName: string, onMessage: (msg: unknown) => void) => {
  const portRef = useRef<chrome.runtime.Port | null>(null);
  const onMessageRef = useRef(onMessage);

  const handleMessage = useCallback(
    (msg: unknown) => {
      console.log(portName + ' onMessage', msg);
      onMessageRef.current?.(msg);
    },
    [portName],
  );

  useEffect(() => {
    if (import.meta.env.DEV) return;
    if (!chrome?.runtime?.connect) return;
    const port = chrome.runtime.connect({ name: portName });
    portRef.current = port;

    port.onMessage.addListener(handleMessage);
    const handleDisconnect = () => {
      console.log(portName + ' disconnected');
      portRef.current = null;
    };
    port.onDisconnect.addListener(handleDisconnect);

    console.log(portName + ' Connected to SW port:', portName);

    return () => {
      try {
        port.onMessage.removeListener(handleMessage);
        port.onDisconnect.removeListener(handleDisconnect);
        portRef.current?.disconnect();
        portRef.current = null;
      } catch (error) {
        console.warn(portName + ' disconnect cleanup failed', error);
      }
    };
  }, [portName, handleMessage]);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
};
