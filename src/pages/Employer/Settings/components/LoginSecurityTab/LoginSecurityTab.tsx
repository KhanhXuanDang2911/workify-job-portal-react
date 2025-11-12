import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function LoginSecurityTab() {
  return (
    <div className="max-w-md">
      <ChangePasswordForm userType="EMPLOYER" />
    </div>
  );
}
