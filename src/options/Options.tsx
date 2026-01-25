import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type AppSettings } from '@common/appBridge';
import { useSharedText } from '@common/useSharedText';
import { watchAppSettings } from '@common/appSettings';

export const Options = () => {
  const { settings, setSettings } = useSharedText();
  const [options, setOptions] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setOptions(settings);
  }, [settings]);
  useEffect(() => watchAppSettings(settings), [settings]);
  useEffect(() => {
    const optionsKey = JSON.stringify(options);
    const settingsKey = JSON.stringify(settings);
    if (optionsKey === settingsKey) return;

    setSaveState('saving');
    const timeout = window.setTimeout(() => {
      setSettings(options);
      setLastSaved(new Date());
      setSaveState('saved');
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [options, settings, setSettings]);

  const resetOptions = () => {
    setOptions(DEFAULT_SETTINGS);
    setLastSaved(null);
    setSaveState('idle');
  };

  return (
    <section className='min-h-screen p-6 font-sans'>
      <div className='max-w-3xl mx-auto py-10'>
        <header className='mb-8'>
          <h1 className='text-3xl prettyLabel'>Options</h1>
          <p className='text-gray-400 mt-2'>
            Basic settings for your extension UI. These are saved in extension storage.
          </p>
        </header>

        <div className='space-y-6'>
          <div className='settingsSection'>
            <label className='text-sm font-semibold block'>Theme</label>
            <select
              className='dropDown mt-2 w-full'
              value={options.theme}
              onChange={(event) =>
                setOptions((prev) => ({
                  ...prev,
                  theme: event.target.value as AppSettings['theme'],
                }))
              }
            >
              <option value='system'>System</option>
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
            <p className='text-xs text-gray-400 mt-2'>Follows your OS theme when set to system.</p>
          </div>

          <div className='settingsSection'>
            <label className='text-sm font-semibold block'>UI scale</label>
            <div className='flex items-center gap-4 mt-3'>
              <input
                type='range'
                min={0.85}
                max={1.2}
                step={0.05}
                value={options.scale}
                onChange={(event) =>
                  setOptions((prev) => ({
                    ...prev,
                    scale: Number(event.target.value),
                  }))
                }
                className='w-full accent-custom-pink'
              />
              <span className='text-sm text-gray-300 w-16 text-right'>
                {Math.round(options.scale * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className='mt-8 flex items-center gap-4'>
          <button type='button' onClick={resetOptions} className=''>
            Reset
          </button>
          {saveState === 'saving' && <span className='text-xs text-gray-400'>Saving…</span>}
          {saveState === 'saved' && lastSaved && (
            <span className='text-xs text-gray-400'>Saved at {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </section>
  );
};
