import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";
import NotFound from "@/pages/NotFound";
import { employer_routes, routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [hasVerified, setHasVerified] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const rolePath = pathname.split("/")[1];
  const role = rolePath === "employer" ? "employers" : "users";

  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: (token: string) => {
      return authService.verifyEmail(token, role);
    },
    onSuccess: (data) => {
      toast(data.message || t("auth.verifyEmail.successToast"));

      setCount(3);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || t("auth.verifyEmail.errorToast");
      toast(errorMessage, { type: "error" });
    },
  });

  useEffect(() => {
    if (token && !hasVerified) {
      setHasVerified(true);
      verifyMutation.mutate(token);
    }
  }, [token, hasVerified, verifyMutation]);

  useEffect(() => {
    if (count === null) return;

    const timer = setInterval(() => {
      setCount((c) => {
        if (c === null) return c;
        if (c <= 1) {
          try {
            if (role === "employers") {
              navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`, {
                replace: true,
              });
            } else {
              navigate(`/${routes.SIGN_IN}`, { replace: true });
            }
          } catch {}

          return null;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [count, navigate, role]);

  if (!token) {
    return <NotFound />;
  }

  if (verifyMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {t("auth.verifyEmail.pendingTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("auth.verifyEmail.pendingDesc")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verifyMutation.isError) {
    const errorData = (verifyMutation.error as any)?.response?.data;
    const errorMessage = t("auth.verifyEmail.errorTitle");

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">
              {t("auth.verifyEmail.errorTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => {
                setHasVerified(false);
                verifyMutation.mutate(token);
              }}
              className="w-full"
              variant="outline"
              size="lg"
            >
              {t("auth.verifyEmail.retry")}
            </Button>
            <Button
              onClick={() => {
                if (role === "employers") {
                  return navigate(
                    `${employer_routes.BASE}/${employer_routes.SIGN_IN}`
                  );
                } else {
                  return navigate(`/${routes.SIGN_IN}`);
                }
              }}
              className="w-full"
              size="lg"
            >
              {t("auth.verifyEmail.backToSignIn")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              {t("auth.verifyEmail.successTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("auth.verifyEmail.successDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <Mail className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <p className="text-sm text-green-800">
                {t("auth.verifyEmail.autoRedirect", { count: count ?? 0 })}
              </p>
            </div>
            <Button
              onClick={() => {
                if (role === "employers") {
                  navigate(
                    `${employer_routes.BASE}/${employer_routes.SIGN_IN}`,
                    { replace: true }
                  );
                } else {
                  navigate(`/${routes.SIGN_IN}`, {
                    replace: true,
                  });
                }
              }}
              className="w-full"
              size="lg"
            >
              {t("auth.verifyEmail.signInNow")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
