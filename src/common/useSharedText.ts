import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, getAppBridge, type AppSettings, type AppState } from './appBridge';

type SharedTextState = {
  text: string;
  updatedAt: number;
  settings: AppSettings;
  setText: (next: string) => void;
  setSettings: (patch: Partial<AppSettings>) => void;
};

export const useSharedText = (): SharedTextState => {
  const bridge = useMemo(() => getAppBridge(), []);
  const [state, setState] = useState<AppState>({
    text: '',
    updatedAt: 0,
    settings: DEFAULT_SETTINGS,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    const unsubscribe = bridge.subscribe((nextState) => {
      setState(nextState);
    });
    bridge.request();
    return unsubscribe;
  }, [bridge]);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setText = (next: string) => {
    bridge.update({ text: next });
  };
  const setSettings = (patch: Partial<AppSettings>) => {
    const current = stateRef.current;
    bridge.update({ settings: { ...current.settings, ...patch } });
  };

  return {
    text: state.text,
    updatedAt: state.updatedAt,
    settings: state.settings,
    setText,
    setSettings,
  };
};
