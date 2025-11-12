import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, Lock } from "lucide-react";
import { routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export default function LoginRequiredModal({
  open,
  onOpenChange,
  title,
  description,
  actionText,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const handleSignIn = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-[#1967d2]" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            {title || t("loginRequired.title")}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 pt-2">
            {description || t("loginRequired.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t("loginRequired.cancel")}
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-gradient-to-r from-[#1967d2] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1445a0] text-white"
            onClick={handleSignIn}
          >
            <Link
              to={`/${routes.SIGN_IN}`}
              state={{ from: location }}
              className="flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {actionText || t("loginRequired.actionText")}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
