import { useState } from "react";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { authService } from "@/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginSecurityTab() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    if (isChangingPassword) return;

    setIsChangingPassword(true);
    try {
      await authService.changePasswordEmployer({
        currentPassword: oldPassword,
        newPassword: newPassword,
      });

      toast.success("Cập nhật mật khẩu thành công");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              status?: number;
              message?: string;
            };
          };
        };

        const errorStatus = axiosError.response?.data?.status;
        const errorMessage = axiosError.response?.data?.message;

        if (errorStatus === 411) {
          toast.error("Mật khẩu hiện tại không khớp");
        } else if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại");
        }
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleValidateOldPassword = async (password: string) => {
    return password.length > 0;
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="max-w-md">
      <ChangePasswordForm
        onPasswordChange={handlePasswordChange}
        onValidateOldPassword={handleValidateOldPassword}
        onForgotPassword={handleForgotPassword}
        userType="employer"
        showForgotPassword={true}
      />
    </div>
  );
}
