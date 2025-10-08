import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function AccountSettingTab() {
  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    console.log("Password change requested:", { oldPassword, newPassword });
  };

  const handleValidateOldPassword = async (password: string) => {
 
    return true;
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="bg-white p-5 rounded-lg">
      <ChangePasswordForm
        onPasswordChange={handlePasswordChange}
        onValidateOldPassword={handleValidateOldPassword}
        onForgotPassword={handleForgotPassword}
        userType="candidate"
        showForgotPassword={true}
        className="max-w-md"
      />
    </div>
  );
}