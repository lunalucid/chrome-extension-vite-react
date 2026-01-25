import { useEffect } from 'react';
import { useSharedText } from '@common/useSharedText';
import { watchAppSettings } from '@common/appSettings';

export const Popup = () => {
  const { text, setText, updatedAt, settings } = useSharedText();
  const lastUpdated = new Date(updatedAt).toLocaleTimeString();
  const canOpenSidePanel = typeof chrome !== 'undefined' && !!chrome.sidePanel?.open;
  useEffect(() => {
    return watchAppSettings(settings);
  }, [settings]);

  const handleOpenSidePanel = async () => {
    if (!chrome?.sidePanel?.open || !chrome?.windows?.getCurrent) return;
    const currentWindow = await chrome.windows.getCurrent();
    if (!currentWindow?.id) return;
    await chrome.sidePanel.open({ windowId: currentWindow.id });
  };

  return (
    <section className=''>
      <header className='mb-2'>
        <div className='prettyLabel text-2xl'>Popup Workspace</div>
        <p className='text-xs text-react-blue-dark-content'>
          This text syncs instantly with the side panel.
        </p>
      </header>

      <div className='group prettyBox'>
        <div className='glow'></div>
        <textarea
          className='text-2xl'
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder='Type things...'
        />
      </div>

      <div className='flex gap-2 mt-3'>
        <button
          type='button'
          className=''
          disabled={!canOpenSidePanel}
          onClick={handleOpenSidePanel}
        >
          Open Side Panel
        </button>
        <button type='button' className='' onClick={() => setText('Quick note from the popup.')}>
          Insert Sample
        </button>
      </div>

      <button type='button' className='w-full' onClick={() => setText('')}>
        Clear
      </button>

      <div className='mt-1 text-[10px] text-react-blue-dark-sub-content'>
        Last updated {lastUpdated}
      </div>

      <div>
        <button
          type='button'
          className='mt-4 p-2 text-[10px] underline'
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          Open Options
        </button>
      </div>
    </section>
  );
};
