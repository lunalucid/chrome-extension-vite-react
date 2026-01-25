import './index.css';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Popup } from './Popup';
import { ErrorScreen } from '@common/errorScreen';

const root = ReactDOM.createRoot(document.getElementById('popupRoot')!);

export const PopupRoot = () => {
  return (
    <StrictMode>
      <Popup />
    </StrictMode>
  );
};

root.render(
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <ErrorScreen error={error} resetErrorBoundary={resetErrorBoundary} />
    )}
  >
    <PopupRoot />
  </ErrorBoundary>,
);
