import { Icon } from '@lib';
import { useEffect } from 'react';
import { useSharedText } from '@common/useSharedText';
import { watchAppSettings } from '@common/appSettings';

export const SidePanel = () => {
  const { text, setText, updatedAt, settings } = useSharedText();

  useEffect(() => {
    return watchAppSettings(settings);
  }, [settings]);

  const logoSize = 32;
  const lastUpdated = new Date(updatedAt).toLocaleTimeString();

  return (
    <section>
      <div>
        <div className='text-center mb-20'>
          <h2 className='prettyLabel text-4xl'>
            <span style={{ fontSize: logoSize }}>
              <Icon
                name='icon-[simple-icons--googlechrome]'
                size='3xl'
                className='spinningLogo scale-100'
              />{' '}
              Chrome Extension Starter
            </span>
          </h2>

          <div className='flex flex-row justify-center items-center space-x-2 mt-4 align-middle content-center place-items-center'>
            <span style={{ fontSize: logoSize }}>
              <Icon name='icon-[lineicons--vite]' size='3xl' className='logoIcon scale-125' />
            </span>

            <span style={{ fontSize: logoSize }}>
              <Icon
                name='icon-[grommet-icons--reactjs]'
                size='3xl'
                className='logoIcon scale-115'
              />
            </span>

            <span style={{ fontSize: logoSize }}>
              <Icon
                name='icon-[simple-icons--typescript]'
                size='3xl'
                className='logoIcon scale-95'
              />
            </span>

            <span style={{ fontSize: logoSize }}>
              <Icon name='icon-[file-icons--tailwind]' size='3xl' className='logoIcon scale-115' />
            </span>

            <span style={{ fontSize: logoSize }}>
              <Icon name='icon-[simple-icons--iconify]' size='3xl' className='logoIcon' />
            </span>
          </div>
        </div>

        <div className=''>
          <div className='group prettyBox'>
            <div className='glow'></div>
            <textarea
              className='text-4xl'
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='Type things...'
            />
          </div>
        </div>

        <div className='mt-3 text-xs text-react-blue-dark-sub-content'>
          Synced with popup · last updated {lastUpdated}
        </div>
      </div>
    </section>
  );
};
