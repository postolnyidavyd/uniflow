import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (title, description) =>
    sonnerToast.success(title, { description }),

  error: (title, description = 'Спробуйте ще раз') =>
    sonnerToast.error(title, { description }),

  warning: (title, description) =>
    sonnerToast.warning(title, { description }),

  info: (title, description) =>
    sonnerToast.info(title, { description }),
};