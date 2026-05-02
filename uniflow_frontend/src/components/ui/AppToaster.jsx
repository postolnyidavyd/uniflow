import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      duration={4000}
      gap={8}
      toastOptions={{
        classNames: {
          toast: 'uniflow-toast',
          title: 'uniflow-toast__title',
          description: 'uniflow-toast__desc',
          icon: 'uniflow-toast__icon',
        },
      }}
      richColors
    />
  );
}