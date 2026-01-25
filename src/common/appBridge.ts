export type AppSettings = {
  theme: 'light' | 'dark' | 'system';
  scale: number;
};

export type AppState = {
  text: string;
  updatedAt: number;
  settings: AppSettings;
};

type AppMessage =
  | { type: 'state:request' }
  | { type: 'state:response'; payload: AppState }
  | { type: 'state:update'; payload: AppState };

type Listener = (state: AppState) => void;

type AppBridge = {
  request: () => void;
  update: (patch: Partial<AppState>) => void;
  subscribe: (listener: Listener) => () => void;
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  scale: 1,
};

const DEFAULT_STATE: AppState = {
  text: 'Notes...',
  updatedAt: Date.now(),
  settings: DEFAULT_SETTINGS,
};

const applyDefaults = (state: Partial<AppState>): AppState => ({
  ...DEFAULT_STATE,
  ...state,
  settings: { ...DEFAULT_SETTINGS, ...(state.settings ?? {}) },
});

const hasChromeRuntime = typeof chrome !== 'undefined' && !!chrome.runtime?.connect;

const createLocalBridge = (): AppBridge => {
  const storageKey = 'appState';
  const canUseStorage = typeof window !== 'undefined' && !!window.localStorage;
  const canUseChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window;
  const channel = canUseChannel ? new BroadcastChannel('app-state') : null;

  const loadState = () => {
    if (!canUseStorage) return DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return DEFAULT_STATE;
      return applyDefaults(JSON.parse(raw) as Partial<AppState>);
    } catch {
      return DEFAULT_STATE;
    }
  };

  let state = loadState();
  const listeners = new Set<Listener>();

  const notify = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const persist = () => {
    if (!canUseStorage) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage write failures (quota, privacy mode, etc).
    }
  };

  if (channel) {
    channel.addEventListener('message', (event) => {
      const message = event.data as AppMessage;
      if (message.type === 'state:request') {
        channel.postMessage({ type: 'state:response', payload: state });
        return;
      }
      if (message.type === 'state:response' || message.type === 'state:update') {
        state = applyDefaults(message.payload);
        persist();
        notify();
      }
    });
  }

  return {
    request: () => {
      if (channel) {
        channel.postMessage({ type: 'state:request' });
      }
      notify();
    },
    update: (patch) => {
      const nextSettings = patch.settings
        ? { ...state.settings, ...patch.settings }
        : state.settings;
      const nextState = {
        ...state,
        ...patch,
        settings: nextSettings,
        updatedAt: Date.now(),
      };
      state = nextState;
      persist();
      notify();
      if (channel) {
        channel.postMessage({ type: 'state:update', payload: state });
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
};

const createChromeBridge = (): AppBridge => {
  let port: chrome.runtime.Port | null = null;
  let reconnectTimer: number | null = null;
  let state = DEFAULT_STATE;
  const listeners = new Set<Listener>();

  const notify = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const handleMessage = (message: AppMessage) => {
    if (message.type === 'state:response' || message.type === 'state:update') {
      state = applyDefaults(message.payload);
      notify();
    }
  };

  const connectPort = () => {
    if (port) return port;
    const nextPort = chrome.runtime.connect({ name: 'app' });
    nextPort.onMessage.addListener(handleMessage);
    nextPort.onDisconnect.addListener(() => {
      port = null;
      if (reconnectTimer !== null) return;
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        safePostMessage({ type: 'state:request' } satisfies AppMessage);
      }, 250);
    });
    port = nextPort;
    return nextPort;
  };

  const safePostMessage = (message: AppMessage) => {
    const activePort = connectPort();
    try {
      activePort.postMessage(message);
    } catch {
      port = null;
      const retryPort = connectPort();
      retryPort.postMessage(message);
    }
  };

  return {
    request: () => {
      safePostMessage({ type: 'state:request' } satisfies AppMessage);
    },
    update: (patch) => {
      const nextSettings = patch.settings
        ? { ...state.settings, ...patch.settings }
        : state.settings;
      const nextState = {
        ...state,
        ...patch,
        settings: nextSettings,
        updatedAt: Date.now(),
      };
      state = nextState;
      notify();
      safePostMessage({
        type: 'state:update',
        payload: state,
      } satisfies AppMessage);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
};

let bridge: AppBridge | null = null;

export const getAppBridge = (): AppBridge => {
  if (bridge) return bridge;
  bridge = hasChromeRuntime ? createChromeBridge() : createLocalBridge();
  return bridge;
};
