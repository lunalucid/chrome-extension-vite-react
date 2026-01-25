import './index.css';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SidePanel } from './SidePanel';
import { ErrorScreen } from '@common/errorScreen';

const root = ReactDOM.createRoot(document.getElementById('sidePanelRoot')!);
if (!root) {
  throw new Error('Failed to find the root element for Side Panel');
}

export const SidePanelRoot = () => {
  return (
    <StrictMode>
      <SidePanel />
    </StrictMode>
  );
};

root.render(
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <ErrorScreen error={error} resetErrorBoundary={resetErrorBoundary} />
    )}
  >
    <SidePanelRoot />
  </ErrorBoundary>,
);
