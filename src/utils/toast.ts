import { toast } from "react-toastify";
import i18n from "@/i18n/config";

/**
 * Helper function to show toast messages with i18n support
 */
export const showToast = {
  success: (key: string, options?: Parameters<typeof toast.success>[1]) => {
    const message = i18n.t(key);
    toast.success(message, options);
  },
  error: (key: string, options?: Parameters<typeof toast.error>[1]) => {
    const message = i18n.t(key);
    toast.error(message, options);
  },
  info: (key: string, options?: Parameters<typeof toast.info>[1]) => {
    const message = i18n.t(key);
    toast.info(message, options);
  },
  warning: (key: string, options?: Parameters<typeof toast.warning>[1]) => {
    const message = i18n.t(key);
    toast.warning(message, options);
  },
};
