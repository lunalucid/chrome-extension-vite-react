import './index.css';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Options } from './Options';
import { ErrorScreen } from '@common/errorScreen';

const root = ReactDOM.createRoot(document.getElementById('optionsRoot')!);

export const OptionsRoot = () => {
  return (
    <StrictMode>
      <Options />
    </StrictMode>
  );
};

root.render(
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <ErrorScreen error={error} resetErrorBoundary={resetErrorBoundary} />
    )}
  >
    <OptionsRoot />
  </ErrorBoundary>,
);
