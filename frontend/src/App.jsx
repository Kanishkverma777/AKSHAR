import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './router';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-glass-heavy)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(16px)',
          }
        }} 
      />
    </>
  );
}
