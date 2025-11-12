import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  title?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode | ((onClose: () => void) => React.ReactNode);
  footer?: (onClose: () => void) => React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const BaseModal: React.FC<BaseModalProps> = ({
  title,
  children,
  trigger,
  footer,
  className,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled or uncontrolled mode
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const onClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(className, "!w-auto max-h-[80%]  !max-w-fit p-5")}
      >
        <DialogHeader>
          {title && (
            <DialogTitle className="text-[#1967d2] text-2xl font-semibold">
              {title}
            </DialogTitle>
          )}
        </DialogHeader>
        <>{typeof children === "function" ? children(onClose) : children}</>
        <DialogFooter> {footer && footer(onClose)}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
