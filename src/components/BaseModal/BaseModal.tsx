import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  title?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  footer?: (onClose: () => void) => React.ReactNode;
  className?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ title, children, trigger, footer, className }) => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(className, "!w-auto max-h-[80%]  !max-w-fit p-5")}>
        <DialogHeader>{title && <DialogTitle className="text-[#1967d2] text-2xl font-semibold">{title}</DialogTitle>}</DialogHeader>
        <>{children}</>
        <DialogFooter> {footer && footer(onClose)}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
