import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function LoginSecurityTab({currentPassword}: {currentPassword: string}) {
  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
  };

  const handleValidateOldPassword = async (password: string) => {
    return password === currentPassword;
  };

  const handleForgotPassword = () => {
    alert("Forgot password flow - redirect to reset password page");
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
