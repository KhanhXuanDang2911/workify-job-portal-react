import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";
import NotFound from "@/pages/NotFound";
import { employer_routes, routes } from "@/routes/routes.const";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [hasVerified, setHasVerified] = useState(false);
  const rolePath = pathname.split("/")[1];
  const role = rolePath === "employer" ? "employers" : "users";

  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: (token: string) => {
      console.log(role);
      return authService.verifyEmail(token, role);
    },
    onSuccess: (data) => {
      console.log("Email verification successful:", data);
      toast(data.message || "Email của bạn đã được xác thực thành công");

      setTimeout(() => {
        if (role === "employers") {
          navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`, { replace: true });
        } else {
          navigate(`${routes.BASE}/${routes.SIGN_IN}`, { replace: true });
        }
      }, 3000);
    },
    onError: (error: any) => {
      console.error("[Email verification failed:", error);
      const errorMessage = error.response?.data?.message || "Xác thực email thất bại. Vui lòng thử lại.";
      toast(errorMessage, { type: "error" });
    },
  });

  useEffect(() => {
    if (token && !hasVerified) {
      setHasVerified(true);
      verifyMutation.mutate(token);
    }
  }, [token, hasVerified, verifyMutation]);

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
            <CardTitle className="text-2xl">Đang xác thực email</CardTitle>
            <CardDescription className="text-base">Vui lòng đợi trong giây lát, chúng tôi đang xác thực tài khoản của bạn...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verifyMutation.isError) {
    const errorData = (verifyMutation.error as any)?.response?.data;
    const errorMessage =  "Đã có lỗi xảy ra khi xác thực email";

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Xác thực thất bại</CardTitle>
            <CardDescription className="text-base">{errorMessage}</CardDescription>
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
              Thử lại
            </Button>
            <Button
              onClick={() => {
                if (role === "employers") {
                  return navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`);
                } else {
                  return navigate(`${routes.BASE}/${routes.SIGN_IN}`);
                }
              }}
              className="w-full"
              size="lg"
            >
              Quay lại đăng nhập
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
            <CardTitle className="text-2xl text-green-700">Xác thực thành công!</CardTitle>
            <CardDescription className="text-base">Email của bạn đã được xác thực thành công. Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <Mail className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <p className="text-sm text-green-800">Bạn sẽ được tự động chuyển đến trang đăng nhập trong giây lát...</p>
            </div>
            <Button
              onClick={() => {
                if (role === "employers") {
                  navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`, { replace: true });
                } else {
                  navigate(`${routes.BASE}/${routes.SIGN_IN}`, { replace: true });
                }
              }}
              className="w-full"
              size="lg"
            >
              Đăng nhập ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
