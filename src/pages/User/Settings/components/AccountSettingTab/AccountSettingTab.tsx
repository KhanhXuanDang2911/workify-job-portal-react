import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function AccountSettingTab() {
  return (
    <div className="bg-white p-5 rounded-lg">
      <ChangePasswordForm
        userType="seeker"
        className="max-w-md"
      />
    </div>
  );
}