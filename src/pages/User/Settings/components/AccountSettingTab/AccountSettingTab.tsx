import ChangePasswordForm from "@/components/ChangePasswordForm";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountSettingTab() {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t("settings.changePassword")}
      </h2>
      <ChangePasswordForm userType="JOB_SEEKER" className="max-w-md" />
    </div>
  );
}
