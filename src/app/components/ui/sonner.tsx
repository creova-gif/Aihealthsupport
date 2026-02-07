import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: '#374151',
          border: '1px solid #E5E7EB',
        },
      }}
    />
  );
}
