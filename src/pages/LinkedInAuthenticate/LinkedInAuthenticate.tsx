import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserAuth } from "@/context/UserAuth";
import { userTokenUtils } from "@/lib/token";
import NotFound from "@/pages/NotFound";
import { routes } from "@/routes/routes.const";
import { authService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function LinkedInAuthenticate() {
  const { dispatch } = useUserAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hasVerified, setHasVerified] = useState(false);

  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const linkedInLoginMutation = useMutation({
    mutationFn: authService.linkedInLogin,
    onSuccess: (response) => {
      if (
        response.data.accessToken &&
        response.data.refreshToken &&
        response.data.data
      ) {
        userTokenUtils.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );

        dispatch({
          type: "SET_USER",
          payload: {
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          },
        });

        toast.success(`Welcome ${response.data.data.fullName}!`);
        navigate("/", { replace: true });
      } else if (response.data.createPasswordToken) {
        toast.info("Vui lòng tạo mật khẩu để hoàn tất đăng ký");
        navigate(
          `/${routes.CREATE_PASSWORD}?token=${response.data.createPasswordToken}`,
          { replace: true }
        );
      }
    },
    onError: () => {
      toast.error("Đăng nhập LinkedIn thất bại. Vui lòng thử lại.");
      navigate(`/${routes.SIGN_IN}`, { replace: true });
    },
  });

  useEffect(() => {
    if (code && !hasVerified) {
      setHasVerified(true);
      linkedInLoginMutation.mutate(code);
    }
  }, [linkedInLoginMutation, code, hasVerified]);

  if (!code || !state) {
    return <NotFound />;
  }

  if (linkedInLoginMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {t("auth.linkedInAuthenticate.pendingTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("auth.linkedInAuthenticate.pendingDesc")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (linkedInLoginMutation.isError) {
    const errorMessage = t("auth.linkedInAuthenticate.errorDesc");

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">
              {t("auth.linkedInAuthenticate.errorTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => {
                setHasVerified(false);
                linkedInLoginMutation.mutate(code);
              }}
              className="w-full"
              variant="outline"
              size="lg"
            >
              {t("auth.linkedInAuthenticate.retry")}
            </Button>
            <Button
              onClick={() => navigate(`${routes.BASE}/${routes.SIGN_IN}`)}
              className="w-full"
              size="lg"
            >
              {t("auth.linkedInAuthenticate.backToSignIn")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (linkedInLoginMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              {t("auth.linkedInAuthenticate.successTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("auth.linkedInAuthenticate.successDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <Mail className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <p className="text-sm text-green-800">
                {t("auth.linkedInAuthenticate.autoRedirect")}
              </p>
            </div>
            <Button
              onClick={() => {
                navigate(`${routes.BASE}`);
              }}
              className="w-full"
              size="lg"
            >
              {t("auth.linkedInAuthenticate.goHome")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default LinkedInAuthenticate;
